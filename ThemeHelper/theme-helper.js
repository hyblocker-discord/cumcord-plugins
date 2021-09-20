import { log } from '@cumcord/utils/logger';
import { findInReactTree } from '@cumcord/utils';
import { after } from "@cumcord/patcher";
import { webpack } from "@cumcord/modules";
import { React } from "@cumcord/modules/common";

// list of elements which we whitelist giving the mouse position to
// TODO: imagine hardcoding :trolley:
const rippleElements = [
	'message-2qnXI6',
	'container-2Pjhx-',
	'containerDefault--pIXnN',
	'labelContainer-1BLJti',
	'item-PXvHYJ',
	'channel-2QD9_O',
	'content-1x5b-n',
	'listRow-hutiT_',
	'resultFocused-3aIoYe',
	'item-2J2GlB',
	'actionButton-VzECiy',
	'autocompleteRowVertical-q1K4ky',
];

let _this = {};

let injections = [];

export default (data) => {
	return {

		onLoad() {
			this.mouseEventBind = this.mouseEventBind.bind(this);
			_this = this;
			_this.userCache = {};
			_this.store = data.persist.store;

			document.body.addEventListener("mousemove", this.mouseEventBind("mouse"));
			document.body.addEventListener("mousedown", this.mouseEventBind("click"));

			const friendRow = webpack.findByDisplayName("PeopleListItem");
			_this.getPrimaryColorForAvatar = webpack.findByProps("getPrimaryColorForAvatar");
			_this.UserPopoutAvatar = webpack.findByProps("UserPopoutAvatar");
	 
	 		injections.push(
	 			after("render", friendRow.prototype, this.friendRowPatch)
			);
		},

		onUnload() {


			document.body.removeEventListener("mousemove", this.mouseEventBind("mouse"));
			document.body.removeEventListener("mousedown", this.mouseEventBind("click"));

			for (let i = 0; i < injections.length; i++) {
				injections[i]();
			}
			injections.length = 0;
		},

		mouseEventBind(param) {
			return function (e) {
				// Get the element
				e = e || window.event;
				let target = e.target || e.srcElement;
				let foundTarget = false;

				for (let j = 0; j < rippleElements.length; j++)
				{
					if (target.classList.contains(rippleElements[j])) {
						foundTarget = true;
						break;
					}
				}

				// Check up to 5 parents up if the element has an after
				for (let i = 0; i < 4 && !foundTarget; i++) {
					if (target.parentElement != null) {
						target = target.parentElement;
						for (let j = 0; j < rippleElements.length && !foundTarget; j++) {
							if (target.classList.contains(rippleElements[j]))
								foundTarget = true;
						}
					}
				}

				if (foundTarget) {
					// Get the mouse position relative to the element
					const rect = target.getBoundingClientRect();
					let x = e.clientX - rect.left; //x position within the element.
					let y = e.clientY - rect.top;  //y position within the element.
					x -= rect.width / 2;
					y -= rect.height / 2;

					// Tell the CSS
					target.style.setProperty(`--${param}X`, `${x}px`);
					target.style.setProperty(`--${param}Y`, `${y}px`);
				}
			}
		},

		getCssVar(name) {
			const cssRules = getComputedStyle(document.documentElement);
			const value = cssRules.getPropertyValue(`--${name}`).trim().toLowerCase();
			return value == '1' || value == 'true';
		},

		friendRowPatch(_, res) {
			try {
			const items = res.props.children();
			const userObj = findInReactTree(items, e=> e && e.user)?.user;
			const userData = _this.fetchUser(userObj.id);

			const shouldInjectClickableAvatar = _this.getCssVar("open-profile-via-pfp-friends");
			if (shouldInjectClickableAvatar) {

				const thing = findInReactTree(items, e=> e && e.type && e.type.displayName && e.type.displayName === "UserInfo");

				// console.log(items);
				// console.log(thing);
				// console.log("====================");
			}

			let accentColor = null;
			if (userObj.accentColor)  {
				accentColor = userObj.accentColor;
				_this.cacheUser(userObj);
			} else if (userData.accentColor) {
				// fallback to accent if possible
				accentColor = userData.accentColor;
			}
			else {
				// fallback to autogen
				_this.getPrimaryColorForAvatar.getPrimaryColorForAvatar(userObj.getAvatarURL())
					.then(args => _this.cacheUser(userObj, { accentColorGenerated: args }));
				
				accentColor = userData.autoAccent;
			}
			
			accentColor = _this._numberToRgba(accentColor);
			
			// Add the attributes
			const modified = React.cloneElement(items.props.children, {
				// return discord props which get lost during injection
				'role': "listitem",
				'data-list-item-id': `people-list___${userObj.id}`,
				'tabindex': -1,

				// inject additional props
				'data-user-id': userObj.id,
				'data-banner-url': userData.bannerURL,
				'data-accent-color': accentColor,

				// style
				style: {
					"--user-banner": userData.bannerURL ? `url("${userData.bannerURL}")` : null,
					"--user-accent-color": accentColor,
					...items.props.children.props.style
				}
			});

			res.props.children = function() { return modified };

			return res;
			}catch(ex){log(`[FATAL]: ${ex.stack}`);return res;}
		},

		// Stolen from https://github.com/powercord-community/rolecolor-everywhere/blob/master/index.js#L388-L394
		_numberToRgba (color, alpha = 1) {
			const { r, g, b } = _this._numberToRgb(color);
			if (alpha === 1) {
			  return `rgb(${r}, ${g}, ${b})`;
			}
			return `rgba(${r}, ${g}, ${b}, ${alpha})`;
		},

		_numberToRgb (color) {
			console.log(color); // i hate js i want c++ back
			const r = (color & 0xFF0000) >>> 16;
			const g = (color & 0xFF00) >>> 8;
			const b = color & 0xFF;
			return {
				r,
				g,
				b
			};
		},

		_rgbToNumber (rgb) {
			return (((rgb[0] << 8) + rgb[1]) << 8) + rgb[2];
		},

		cacheUser(user, props) {
			let savedUser = null;
			let shouldSave = false;
			let intEncodedColor = null;

			// Fill props
			if (props?.accentColorGenerated) intEncodedColor = _this._rgbToNumber(props.accentColorGenerated);

			// Fetch user, so that we update it (and not overwrite)
			if (_this.userCache[user.id]) {
				savedUser = _this.userCache[user.id];
			} else {
				savedUser = _this.store[userId];
				if (Object.keys(savedUser).length == 0) {
					savedUser = {
						bannerURL: null,
						accentColor: null,
						autoAccent: null,
					}
				}
			}

			// Check for a diff if the user was saved
			if (!(user.bannerURL == null && user.accentColor == null) && user.bannerURL != savedUser.bannerURL) {
				savedUser.bannerURL = user.bannerURL;
				shouldSave = true;
			}
			if (user.accentColor && user.accentColor != savedUser.accentColor) {
				savedUser.accentColor = user.accentColor;
				shouldSave = true;
			}
			if (props?.accentColorGenerated && intEncodedColor != savedUser.autoAccent) {
				savedUser.autoAccent = intEncodedColor;
				shouldSave = true;
			}

			if (shouldSave) {
				// _this.settings.set(user.id, savedUser);
				_this.store[user.id] = savedUser;
				_this.userCache[user.id] = savedUser;
				console.log("[Hyblocker's Theme Helper]", `Cached user "${user.username}#${user.discriminator}"!`);
			}
		},
		
		fetchUser(userId) {
			if (_this.userCache[userId]) {
				return _this.userCache[userId];
			} else {
				_this.userCache[userId] = _this.store[userId];
				
				if (Object.keys(_this.userCache[userId]).length == 0) {
					_this.userCache[userId] = {
						bannerURL: null,
						accentColor: null,
						autoAccent: null,
					};
				}
				return _this.userCache[userId];
			}
		}
	}
}
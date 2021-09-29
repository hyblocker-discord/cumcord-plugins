import { log } from "@cumcord/utils/logger";
import { findInReactTree } from "@cumcord/utils";
import { after } from "@cumcord/patcher";
import { webpack } from "@cumcord/modules";
import { React } from "@cumcord/modules/common";
import { numberToRgba, rgbToNumber } from "./colorHelpers";

// list of elements which we whitelist giving the mouse position to
// TODO: imagine hardcoding :trolley:
const rippleElements = [
  "message-2qnXI6",
  "container-2Pjhx-",
  "containerDefault--pIXnN",
  "labelContainer-1BLJti",
  "item-PXvHYJ",
  "channel-2QD9_O",
  "content-1x5b-n",
  "listRow-hutiT_",
  "resultFocused-3aIoYe",
  "item-2J2GlB",
  "actionButton-VzECiy",
  "autocompleteRowVertical-q1K4ky",
  'button-38aScr',
];

let injections = [];

export default (data) => {
  const userCache = {};
  const store = data.persist.store;
  const ghostStore = data.persist.ghost;

  const friendRow = webpack.findByDisplayName("PeopleListItem");
  const getPrimaryColorForAvatar = webpack.findByProps(
    "getPrimaryColorForAvatar"
  );

  function mouseEventBind(param) {
    return function (e) {
      // Get the element
      e = e || window.event;
      let target = e.target || e.srcElement;
      let foundTarget = false;

      for (let j = 0; j < rippleElements.length; j++) {
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
        let y = e.clientY - rect.top; //y position within the element.
        x -= rect.width / 2;
        y -= rect.height / 2;

        // Tell the CSS
        target.style.setProperty(`--${param}X`, `${x}px`);
        target.style.setProperty(`--${param}Y`, `${y}px`);
      }
    };
  }

  function cacheUser(user, props) {
    let savedUser = null;
    let shouldSave = false;
    let intEncodedColor = null;

    // Fill props
    if (props?.accentColorGenerated)
      intEncodedColor = rgbToNumber(props.accentColorGenerated);

    // Fetch user, so that we update it (and not overwrite)
    if (userCache[user.id]) {
      savedUser = userCache[user.id];
    } else {
      savedUser = ghostStore[userId];
      if (!savedUser) {
        savedUser = {
          bannerURL: null,
          accentColor: null,
          autoAccent: null,
        };
      }
    }

    // Check for a diff if the user was saved
    if (
      !(user.bannerURL == null && user.accentColor == null) &&
      user.bannerURL != savedUser.bannerURL
    ) {
      savedUser.bannerURL = user.bannerURL;
      shouldSave = true;
    }
    if (user.accentColor && user.accentColor != savedUser.accentColor) {
      savedUser.accentColor = user.accentColor;
      shouldSave = true;
    }
    if (
      props?.accentColorGenerated &&
      intEncodedColor != savedUser.autoAccent
    ) {
      savedUser.autoAccent = intEncodedColor;
      shouldSave = true;
    }

    if (shouldSave) {
      store[user.id] = savedUser;
      userCache[user.id] = savedUser;
      console.log(
        "[Hyblocker's Theme Helper]",
        `Cached user "${user.username}#${user.discriminator}"!`
      );
    }
  }

  function fetchUser(userId) {
    if (!userCache[userId]) {
      userCache[userId] = ghostStore[userId];

      if (!userCache[userId]) {
        userCache[userId] = {
          bannerURL: null,
          accentColor: null,
          autoAccent: null,
        };
      }
    }
    return userCache[userId];
  }

  return {
    onLoad() {
      document.body.addEventListener("mousemove", mouseEventBind("mouse"));
      document.body.addEventListener("mousedown", mouseEventBind("click"));

      injections.push(
        after("render", friendRow.prototype, (_, res) => {
          try {
            const items = res.props.children();
            const userObj = findInReactTree(items, (e) => e && e.user)?.user;
            const userData = fetchUser(userObj.id);

            let accentColor = null;
            if (userObj.accentColor) {
              accentColor = userObj.accentColor;
              cacheUser(userObj);
            } else if (userData.accentColor) {
              // fallback to accent if possible
              accentColor = userData.accentColor;
            } else {
              // fallback to autogen
              getPrimaryColorForAvatar
                .getPrimaryColorForAvatar(userObj.getAvatarURL())
                .then((args) =>
                  cacheUser(userObj, { accentColorGenerated: args })
                );

              accentColor = userData.autoAccent;
            }

            accentColor = numberToRgba(accentColor);

            // Add the attributes
            const modified = React.cloneElement(items.props.children, {
              // return discord props which get lost during injection
              role: "listitem",
              "data-list-item-id": `people-list___${userObj.id}`,
              tabindex: -1,

              // inject additional props
              "data-user-id": userObj.id,
              "data-banner-url": userData.bannerURL,
              "data-accent-color": accentColor,

              // style
              style: {
                "--user-banner": userData.bannerURL
                  ? `url("${userData.bannerURL}")`
                  : null,
                "--user-accent-color": accentColor,
                ...items.props.children.props.style,
              },
            });

            res.props.children = () => {
              return modified;
            };

            return res;
          } catch (ex) {
            log(`[FATAL]: ${ex}`);
            return res;
          }
        })
      );
    },

    onUnload() {
      document.body.removeEventListener("mousemove", mouseEventBind("mouse"));
      document.body.removeEventListener("mousedown", mouseEventBind("click"));

      for (let i = 0; i < injections.length; i++) {
        injections[i]();
      }
      injections.length = 0;
    },
  };
};

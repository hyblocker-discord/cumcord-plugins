/**
 * @name ThemeHelper
 * @author Hyblocker
 * @version 0.6.9
 * @description Cords your theme
 * @website https://github.com/hyblocker-discord/cumcord-plugins/tree/main/ThemeHelper
 */

// Track if cumcord was injected before
let hasCummed = false;

module.exports = class CumcordLoader {

	async start() {
		// cum on your cord :)
		if (!window.cumcord) {
			const response = await fetch("https://cdn.jsdelivr.net/gh/Cumcord/Cumcord@stable/dist/build.js");
			const text = await response.text();
			eval(`${text}
//# sourceURL=https://cdn.jsdelivr.net/gh/Cumcord/Cumcord@stable/dist/build.js`);
			hasCummed = true;
		}
		
		// Import Theme Helper!!!!!!!!
		window.cumcord.plugins.importPlugin("https://hyblocker-discord.github.io/cumcord-plugins/ThemeHelper/dist/");

		console.log("Loaded!");
	}

	stop() {
		console.log("Unloaded!")
		if (hasCummed) {
			cumcord.uninject();
		}
	}
}
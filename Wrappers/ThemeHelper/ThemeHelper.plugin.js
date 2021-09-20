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
			const response = await fetch("https://cors.bridged.cc/https://hg.sr.ht/~creatable/Cumcord/raw/dist/build.js?rev=stable");
			const text = await response.text();
			eval(text);
			hasCummed = true;
		}
		
		// Import Theme Helper!!!!!!!!
		await window.cumcord.plugins.importPlugin("https://hyblocker-discord.github.io/cumcord-plugins/ThemeHelper/dist/");

		console.log("Loaded!");
	}

	stop() {
		console.log("Unloaded!")
		if (hasCummed) {
			cumcord.uninject();
		}
	}
}
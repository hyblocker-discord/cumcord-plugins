import { log } from "@cumcord/utils/logger";
import { findInReactTree } from "@cumcord/utils";
import { after } from "@cumcord/patcher";
import { webpack } from "@cumcord/modules";
import { React } from "@cumcord/modules/common";
import Settings from "./Settings";

let injections = [];

export default ({ persist }) => {
  const TabBar = webpack.findByDisplayName("TabBar");

  async function waitFor (selector) {
    const item = document.querySelectorAll(selector)[0];
    if (!item)
      return new Promise(window.requestAnimationFrame(waitFor(selector)));
    return new Promise(item);
  }

  return {
    onLoad() {
      injections.push(
        after("render", TabBar.prototype, (_, res) => {
          
          let defaultTab = 'ONLINE';
          defaultTab = persist.ghost.tab === undefined ? defaultTab : persist.ghost.tab ;

          (async () => {
            // Wait for selected online element
            await waitFor(`.tabBar-ZmDY9v.topPill-30KHOu > .item-3HknzM.selected-3s45Ha[data-item-id="ONLINE"]`);

            // Select our tab instead
            res._owner.memoizedProps.onItemSelect(defaultTab);
          })();

          return res;
        })
      );
    },

    onUnload() {
      for (let i = 0; i < injections.length; i++) {
        injections[i]();
      }
      injections.length = 0;
    },

    settings: React.createElement(Settings, { persist }),
  };
};

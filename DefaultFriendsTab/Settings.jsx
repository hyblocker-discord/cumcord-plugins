import { useNest } from "@cumcord/utils";
import { webpack } from "@cumcord/modules";
import { i18n } from "@cumcord/modules/common";

const RadioGroup = webpack.findByDisplayName("RadioGroup");
const Messages = i18n.Messages;

export default ({ persist }) => {
  console.log("persist");
  console.log(persist);
  useNest(persist);
  const store = persist.store;
  const ghost = persist.ghost;

  return (
    <RadioGroup
        options={[
          { name: "Online", value: 'ONLINE' },
          { name: Messages.FRIENDS_SECTION_ALL, value: 'ALL' },
          { name: Messages.FRIENDS_SECTION_PENDING, value: 'PENDING' },
          { name: Messages.BLOCKED, value: 'BLOCKED' }
        ]}
        value={
          ghost.tab === undefined ? 'ONLINE' : ghost.tab }
        onChange={e => {
          store.tab = e;
        }}
      >
        {Messages.DEFAULT_TAB}
      </RadioGroup>
  );
};

import { useNest } from "@cumcord/utils";
import { webpack } from "@cumcord/modules";
import { i18n } from "@cumcord/modules/common";

const RadioGroup = webpack.findByDisplayName("RadioGroup");
const Messages = i18n.Messages;

export default ({ persist }) => {
  useNest(persist);

  return (
    <RadioGroup
        options={[
          { name: "Online", value: 'ONLINE' },
          { name: Messages.FRIENDS_SECTION_ALL, value: 'ALL' },
          { name: Messages.FRIENDS_SECTION_PENDING, value: 'PENDING' },
          { name: Messages.BLOCKED, value: 'BLOCKED' }
        ]}
        value={
          persist.ghost.tab === undefined ? 'ONLINE' : persist.ghost.tab }
        onChange={e => {
          persist.store.tab = e.value;
        }}
      >
        {Messages.DEFAULT_TAB}
      </RadioGroup>
  );
};

import { THIcon } from "./components/THIcon";
import { TPIcon } from "./components/TPIcon";

const TH_ICON = {
  width: 48,
  height: 48,
  scale: 3,
  component:  (props: any) => <THIcon {...props} />,
};
const TP_ICON = {
  width: 25,
  height: 24,
  scale: 6,
  component: (props: any) => <TPIcon {...props} />,
};
export { TH_ICON, TP_ICON };

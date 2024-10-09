import PowerMenu from "./power/index.js";
import Verification from "./power/verification.js";
import AudioMenu from "./audio/index.js";
import NetworkMenu from "./network/index.js";
import BluetoothMenu from "./bluetooth/index.js";
import MediaMenu from "./media/index.js";
import CalendarMenu from "./calendar/index.js";
import EnergyMenu from "./energy/index.js";
import DashboardMenu from "./dashboard/index.js";
import PowerDropdown from "./powerDropdown/index.js";

export default [
    PowerMenu(),
    Verification(),
    AudioMenu(),
    NetworkMenu(),
    BluetoothMenu(),
    MediaMenu(),
    CalendarMenu(),
    EnergyMenu(),
    DashboardMenu(),
    PowerDropdown(),
];

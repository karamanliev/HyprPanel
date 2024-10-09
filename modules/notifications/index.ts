import { getPosition } from "lib/utils.js";
import options from "options";
const hyprland = await Service.import("hyprland");

const { position, monitor, active_monitor } = options.notifications;


const curMonitor = Variable(monitor.value);

hyprland.active.connect("changed", () => {
    curMonitor.value = hyprland.active.monitor.id;
})

export default () => {

    return Widget.Window({
        name: "notifications-window",
        class_name: "notifications-window",
        monitor: Utils.merge([
            curMonitor.bind("value"),
            monitor.bind("value"),
            active_monitor.bind("value")], (curMon, mon, activeMonitor) => {
                if (activeMonitor === true) {
                    return curMon;
                }

                return mon;
            }
        ),
        layer: options.tear.bind("value").as(tear => tear ? "top" : "overlay"),
        anchor: position.bind("value").as(v => getPosition(v)),
        exclusivity: "normal",
        child: Widget.Box({
            class_name: "notification-card-container",
            vertical: true,
            hexpand: true,
        }),
    });
};

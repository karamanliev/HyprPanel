import Gdk from "gi://Gdk?version=3.0";
import { openMenu } from "../utils.js";
import options from "options";

const { show_total } = options.bar.notifications;

const swaync = Variable(
    { count: 0, dnd: false, visible: false, inhibited: false },
    {
        listen: [
            ["bash", "-c", "pkill -x swaync-client; swaync-client -s"],
            (out) => {
                const parsedMsg = JSON.parse(out);
                return {
                    count: parsedMsg.count,
                    dnd: parsedMsg.dnd,
                    visible: parsedMsg.visible,
                    inhibited: parsedMsg.inhibited,
                };
            },
        ],
    },
);

export const Notifications = () => {
    return {
        component: Widget.Box({
        hpack: "start",
        className: Utils.merge(
                [
                    options.theme.bar.buttons.style.bind("value"),
                    show_total.bind("value"),
                ],
                (style, showTotal) => {
                    const styleMap = {
                        default: "style1",
                        split: "style2",
                        wave: "style3",
                        wave2: "style3",
                    };
                    return `notifications ${styleMap[style]} ${!showTotal ? "no-label" : ""}`;
                },
            ),
            child: Widget.Box({
                hpack: "start",
                class_name: "bar-notifications",
                children: Utils.merge(
                    [swaync.bind("value"), show_total.bind("value")],
                    (notif, showTotal) => {
                        const notifIcon = Widget.Label({
                            hpack: "center",
                            class_name: "bar-button-icon notifications txt-icon bar",
                            label: notif.dnd ? "󰂛" : notif.inhibited ? "󱅫" : "󰂚",
                        });

                        const notifLabel = Widget.Label({
                            hpack: "center",
                            class_name: "bar-button-label notifications",
                            label: notif.count.toString(),
                        });

                        if (showTotal && notif.count > 0) {
                            return [notifIcon, notifLabel];
                        }
                        return [notifIcon];
                    },
                ),
            }),
        }),
        isVisible: true,
        boxClass: "notifications",
        props: {
            on_primary_click: (clicked: any, event: Gdk.Event) => {
                openMenu(clicked, event, "swaync-client -t -sw", true);
            },
        },
    };
};

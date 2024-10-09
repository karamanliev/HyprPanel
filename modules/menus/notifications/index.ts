import DropdownMenu from "../DropdownMenu.js";

export default () => {
    return DropdownMenu({
        name: "notificationsmenu",
        transition: "crossfade",
        child: Widget.Box({
            class_name: "notification-menu-content",
            css: "padding: 1px; margin: -1px;",
            hexpand: true,
            vexpand: false,
            children: [
                Widget.Box({
                    class_name: "notification-card-container menu",
                    vertical: true,
                    hexpand: false,
                    vexpand: false,
                }),
            ],
        }),
    });
};

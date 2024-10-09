import options from "options";
import { Variable } from "types/variable";

const { show: showPager } = options.theme.bar.menus.menu.notifications.pager;

export const NotificationPager = (curPage: Variable<number>) => {
    return Widget.Box({
        class_name: "notification-menu-pager",
        hexpand: true,
        vexpand: false,
        children: Utils.merge(
            [
                curPage.bind("value"),
                showPager.bind("value")
            ],
            (
                currentPage: number,
                showPgr: boolean
            ) => {
                if (showPgr === false) {
                    return [];
                }
                return [
                    Widget.Button({
                        hexpand: true,
                        hpack: "start",
                        class_name: `pager-button left ${currentPage <= 1 ? "disabled" : ""}`,
                        onPrimaryClick: () => {
                            curPage.value = 1;
                        },
                        child: Widget.Label({
                            className: "pager-button-label",
                            label: ""
                        }),
                    }),
                    Widget.Button({
                        hexpand: true,
                        hpack: "start",
                        class_name: `pager-button left ${currentPage <= 1 ? "disabled" : ""}`,
                        onPrimaryClick: () => {
                            curPage.value = currentPage <= 1 ? 1 : currentPage - 1;
                        },
                        child: Widget.Label({
                            className: "pager-button-label",
                            label: ""
                        }),
                    }),
                    Widget.Label({
                        hexpand: true,
                        hpack: "center",
                        class_name: "pager-label",
                        label: `1`
                    }),
                ]
            })
    })
}

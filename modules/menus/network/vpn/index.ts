const network = await Service.import("network");

const Vpn = () => {
  return Widget.Box({
    class_name: "menu-section-container ethernet",
    vertical: true,
    children: [
      Widget.Box({
        class_name: "menu-label-container",
        hpack: "fill",
        child: Widget.Label({
          class_name: "menu-label",
          hexpand: true,
          hpack: "start",
          label: "VPN",
        }),
      }),
      Widget.Box({
        class_name: "menu-items-section",
        vertical: true,
        child: Widget.Box({
          class_name: "menu-content",
          vertical: true,
          setup: (self) => {
            self.hook(network, () => {
              return (self.child = Widget.Button({
                class_name: "network-element-item",
                child: Widget.Box({
                  hpack: "start",
                  children: [
                    Widget.Icon({
                      class_name: `network-icon ethernet ${network.vpn.activated_connections.length > 0 ? "active" : ""} ${network.vpn.connections[0].state === "connecting" ? "spinning" : ""}`,
                      icon:
                        network.vpn.connections[0].state === "connecting"
                          ? "view-refresh-symbolic"
                          : network.vpn.connections[0].icon_name,
                    }),
                    Widget.Box({
                      class_name: "connection-container",
                      vertical: true,
                      children: [
                        Widget.Label({
                          class_name: "active-connection",
                          hpack: "start",
                          label: network.vpn.connections[0].id,
                        }),
                        Widget.Label({
                          hpack: "start",
                          class_name: "connection-status dim",
                          label:
                            network.vpn.connections[0].state
                              .charAt(0)
                              .toUpperCase() +
                            network.vpn.connections[0].state.slice(1),
                        }),
                      ],
                    }),
                  ],
                }),

                on_primary_click(self, event) {
                  network.vpn.connections[0].setConnection(
                    network.vpn.connections[0].state !== "connected",
                  );
                },
              }));
            });
          },
        }),
      }),
    ],
  });
};

export { Vpn };

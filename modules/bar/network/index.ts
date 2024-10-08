import Gdk from "gi://Gdk?version=3.0";
const network = await Service.import("network");
import options from "options";
import { openMenu } from "../utils.js";

const {
  label: networkLabel,
  truncation,
  truncation_size,
} = options.bar.network;

const Network = () => {
  return {
    component: Widget.Box({
      vpack: "fill",
      vexpand: true,
      className: Utils.merge(
        [
          options.theme.bar.buttons.style.bind("value"),
          networkLabel.bind("value"),
        ],
        (style, showLabel) => {
          const styleMap = {
            default: "style1",
            split: "style2",
            wave: "style3",
          };
          return `network ${styleMap[style]}${!showLabel ? " no-label" : ""}`;
        },
      ),
      children: [
        Widget.Icon({
          class_name: "bar-button-icon network",
          css: "margin-top: 2px;",
          icon: Utils.merge(
            [
              network.bind("primary"),
              network.bind("vpn"),
              network.bind("wired"),
            ],
            (pmry, vpn, wrd) => {
              if (pmry === "wired") {
                return wrd.icon_name;
              }
              return vpn.connections[0].icon_name;
            },
          ),
        }),
        Widget.Box({
          vpack: "center",
          child: Utils.merge(
            [
              network.bind("primary"),
              network.bind("vpn"),
              networkLabel.bind("value"),
              truncation.bind("value"),
              truncation_size.bind("value"),
            ],
            (pmry, vpn, showLbl, trunc, tSize) => {
              if (!showLbl) {
                return Widget.Box();
              }
              // if (pmry === "wired") {
              //     return Widget.Label({
              //         class_name: "bar-button-label network",
              //         label: "Wired".substring(0, tSize),
              //     })
              // }

              if (vpn.connections[0].state === "connected") {
                return Widget.Label({
                  class_name: "bar-button-label network",
                  // label: vpn.connections[0].id.substring(0, tSize),
                  label: "VPN On",
                });
              }

              return Widget.Label({});
            },
          ),
        }),
      ],
    }),
    isVisible: true,
    boxClass: "network",
    props: {
      on_primary_click: (clicked: any, event: Gdk.Event) => {
        openMenu(clicked, event, "networkmenu");
      },
    },
  };
};

export { Network };

import { Stats as StatsMenu } from "../../menus/dashboard/stats/index";
const Stats = () => {
  const { cpu, ram } = StatsMenu(true);

  const temp = Variable(0, {
    poll: [
      2000,
      "sensors -j",
      (out) => {
        if (typeof out !== "string") {
          return 0;
        }

        const sensors = JSON.parse(out);

        if (sensors === undefined) {
          return 0;
        }

        const coreTemp = sensors["k10temp-pci-00c3"];

        if (coreTemp === undefined) {
          return 0;
        }

        return coreTemp["Tctl"]["temp1_input"];
      },
    ],
  });

  return {
    component: Widget.Box({
      class_name: "language",
      children: [
        Widget.Icon({
          class_name: "bar-button-icon network",
          icon: "/usr/share/icons/Papirus/16x16/panel/indicator-sensors-cpu.svg",
        }),
        Widget.Label({
          class_name: "bar-button-label language",
          css: "margin-right: 16px;",
          label: cpu.bind("value").as((v) => `${Math.floor(v * 100)}%`),
        }),

        Widget.Icon({
          css: "margin-right: -3px; margin-top: 2px;",
          class_name: "bar-button-icon network",
          icon: "temp-symbolic",
        }),
        Widget.Label({
          class_name: "bar-button-label language",
          css: "margin-right: 16px;",
          label: temp.bind("value").as((v) => `${Math.floor(v)}°C`),
        }),

        // Widget.Label({
        //   class_name: "bar-button-label language",
        //   label: "    ",
        // }),

        Widget.Icon({
          class_name: "bar-button-icon network",
          icon: "/usr/share/icons/Papirus/16x16/panel/indicator-sensors-memory.svg",
        }),
        Widget.Label({
          class_name: "bar-button-label language",
          label: ram
            .bind("value")
            .as((v) => `${Math.floor(v.percentage * 100)}%`),
        }),
      ],
    }),
    isVisible: true,
    boxClass: "language",
    props: {
      on_primary_click: async () => {
        const isRunning = Utils.exec("pgrep -f system_monitor_btop");

        if (isRunning !== "") {
          Utils.execAsync("pkill -f system_monitor_btop");
          return;
        }

        Utils.execAsync(
          `bash -c "kitty -e --class='system_monitor_btop' btop"`,
        ).catch((err) => `Failed to open btop: ${err}`);
      },
    },
  };
};

export { Stats };

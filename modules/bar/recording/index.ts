const Recording = () => {
  const mode = Variable("");

  const isVis = Variable(false, {
    poll: [
      3000,
      `${App.configDir}/services/screen_record.sh status`,
      (out) => {
        if (out !== "disabled") {
          mode.value = out;
          return true;
        }

        mode.value = "";
        return false;
      },
    ],
  });

  const recordingLabel = Widget.Box({
    children: Utils.merge([mode.bind("value")], () => {
      const recordMode = mode.value.split(" ")[0];
      const display = mode.value.split(" ")[1];

      return [
        Widget.Label({
          label: "󰑊",
          class_name: `bar-button-icon recording txt-icon bar ${recordMode}`,
        }),

        Widget.Label({
          label: `${display} ${recordMode.toUpperCase()}`,
          class_name: `bar-button-label recording ${recordMode}`,
        }),
      ];
    }),
  });

  return {
    component: Widget.Box({
      class_name: "recording",
      child: recordingLabel,
    }),
    isVisible: true,
    boxClass: "recording",
    isVis,
    props: {
      on_primary_click: async () => {
        const recordMode = mode.value.split(" ")[0];

        if (recordMode === "pause") {
          return;
        }

        Utils.execAsync(
          `${App.configDir}/services/screen_record.sh ${recordMode === "record" ? "stop" : "save"}`,
        ).catch((err) => console.error(err));
      },
      on_secondary_click: async () => {
        const recordMode = mode.value.split(" ")[0];

        if (recordMode === "replay") {
          Utils.execAsync(
            `${App.configDir}/services/screen_record.sh stop`,
          ).catch((err) => console.error(err));
        }

        if (recordMode === "record" || recordMode === "pause") {
          Utils.execAsync(
            `${App.configDir}/services/screen_record.sh pause`,
          ).catch((err) => console.error(err));
        }
      },
    },
  };
};

export { Recording };

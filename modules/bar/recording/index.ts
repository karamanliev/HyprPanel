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

  const recordingIcon = Widget.Box({
    child: Utils.merge([mode.bind("value")], () => {
      return Widget.Label({
        label: "󰑊",
        class_name: `bar-button-icon recording txt-icon bar ${mode.value}`,
      });
    }),
  });

  return {
    component: Widget.Box({
      class_name: "recording",
      children: [recordingIcon],
    }),
    isVisible: true,
    boxClass: "recording",
    isVis,
    props: {
      on_primary_click: async () => {
        Utils.execAsync(
          `${App.configDir}/services/screen_record.sh ${mode.value === "record" ? "stop" : "save"}`,
        ).catch((err) => console.error(err));
      },
      on_secondary_click: async () => {
        if (mode.value === "replay") {
          Utils.execAsync(
            `${App.configDir}/services/screen_record.sh stop`,
          ).catch((err) => console.error(err));
        }
      },
    },
  };
};

export { Recording };

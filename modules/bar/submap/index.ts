const hyprland = await Service.import("hyprland");

const Submap = () => {
  const isVis = Variable(false);

  const submapIcon = Widget.Label({
    label: "󰧹",
    class_name: "bar-button-icon submap txt-icon bar",
  });

  const submapName = Widget.Label({
    setup: (self) =>
      self.hook(
        hyprland,
        function (self, ...args) {
          const name = args[0];
          const upperName = name.toUpperCase();

          name ? isVis.setValue(true) : isVis.setValue(false);
          self.label = upperName;
        },
        "submap",
      ),
    class_name: "bar-button-label submap bar",
  });

  return {
    component: Widget.Box({
      class_name: "submap",
      children: [submapIcon, submapName],
    }),
    isVisible: true,
    isVis,
    boxClass: "submap",
    props: {
      on_primary_click: async () => {
        hyprland.messageAsync(`dispatch submap reset`);
      },
    },
  };
};

export { Submap };

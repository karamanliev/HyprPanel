const hyprland = await Service.import("hyprland");

const Language = () => {
  function getLayoutName(layoutName: string) {
    if (layoutName.includes("English")) {
      return "EN";
    }
    if (layoutName.includes("Bulgarian")) {
      return "BG";
    }
    return layoutName;
  }

  async function getKeyboard() {
    const devices = await Utils.execAsync("hyprctl -j devices");
    const keyboard = JSON.parse(devices).keyboards.find(
      (device) => device.main === true,
    );

    return keyboard;
  }

  const langIcon = Widget.Label({
    label: "󰌌 ",
    class_name: "bar-button-icon language txt-icon bar",
  });

  const langText = Widget.Label({
    setup: (self) =>
      self.hook(
        hyprland,
        async () => {
          const keyboard = await getKeyboard();
          const layoutName = keyboard.active_keymap;

          langText.label = getLayoutName(layoutName);
        },
        "keyboard-layout",
      ),

    class_name: "bar-button-label language",
  });

  return {
    component: Widget.Box({
      class_name: "language",
      children: [langIcon, langText],
    }),
    isVisible: true,
    boxClass: "language",
    props: {
      on_primary_click: async () => {
        const keyboard = await getKeyboard();
        hyprland.messageAsync(`switchxkblayout ${keyboard.name} next`);
      },
    },
  };
};

export { Language };

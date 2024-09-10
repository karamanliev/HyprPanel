import Gdk from "gi://Gdk?version=3.0";
import GLib from "gi://GLib";
import { openMenu } from "../utils.js";
import options from "options";
import { globalWeatherVar } from "globals/weather.js";
import icons from "modules/icons/index.js";
import Gtk from "types/@girs/gtk-3.0/gtk-3.0.js";
const { format, icon, showIcon, showTime, showWeather } = options.bar.clock;
const { style } = options.theme.bar.buttons;
const { unit } = options.menus.clock.weather;

const date = Variable(GLib.DateTime.new_now_local(), {
  poll: [1000, () => GLib.DateTime.new_now_local()],
});
const time = Utils.derive([date, format], (c, f) => c.format(f) || "");

const Clock = () => {
  const weatherIcon = Widget.Icon({
    class_name: "bar-button-icon weather txt-icon bar",
    css: "margin-right: -2px;",
    icon: globalWeatherVar.bind("value").as((v) => {
      let iconQuery = v.current.condition.text
        .trim()
        .toLowerCase()
        .replaceAll(" ", "_");

      if (!v.current.is_day && iconQuery === "partly_cloudy") {
        iconQuery = "partly_cloudy_night";
      }
      return icons.weather[iconQuery];
    }),
  });

  const weatherTemp = Widget.Label({
    css: "margin-right: 6px;",
    class_name: "bar-button-label weather bar",
    label: Utils.merge(
      [globalWeatherVar.bind("value"), unit.bind("value")],
      (wthr, unt) => {
        if (unt === "imperial") {
          return `${Math.ceil(wthr.current.temp_f)}° F`;
        } else {
          return `${Math.ceil(wthr.current.temp_c)}° C`;
        }
      },
    ),
  });

  const clockTime = Widget.Label({
    class_name: "bar-button-label clock bar",
    label: time.bind(),
  });

  const clockIcon = Widget.Label({
    label: icon.bind("value"),
    class_name: "bar-button-icon clock txt-icon bar",
  });

  return {
    component: Widget.Box({
      className: Utils.merge(
        [style.bind("value"), showIcon.bind("value"), showTime.bind("value")],
        (btnStyle, shwIcn, shwLbl) => {
          const styleMap = {
            default: "style1",
            split: "style2",
            wave: "style3",
            wave2: "style4",
          };

          return `bluetooth ${styleMap[btnStyle]} ${!shwLbl ? "no-label" : ""} ${!shwIcn ? "no-icon" : ""}`;
        },
      ),
      children: Utils.merge(
        [
          showIcon.bind("value"),
          showTime.bind("value"),
          showWeather.bind("value"),
        ],
        (shIcn, shTm, shWtr) => {
          const children: Array<Gtk.Widget> = [];

          if (shWtr) {
            children.push(weatherIcon, weatherTemp);
          }

          if (shIcn) {
            children.push(clockIcon);
          }

          if (shTm) {
            children.push(clockTime);
          }

          return children;
        },
      ),
    }),
    isVisible: true,
    boxClass: "clock",
    props: {
      on_primary_click: (clicked: any, event: Gdk.Event) => {
        openMenu(clicked, event, "calendarmenu");
      },
    },
  };
};

export { Clock };

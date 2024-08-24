import Gdk from "gi://Gdk?version=3.0";
import GLib from "gi://GLib";
import { openMenu } from "../utils.js";
import options from "options";
import { theWeather } from "modules/menus/calendar/weather/index.js";
import icons from "modules/icons/index.js";
const { format } = options.bar.clock;

const date = Variable(GLib.DateTime.new_now_local(), {
  poll: [1000, () => GLib.DateTime.new_now_local()],
});
const time = Utils.derive([date, format], (c, f) => c.format(f) || "");

const Clock = () => {
  return {
    component: Widget.Box({
      children: [
        Widget.Icon({
          css: "margin-right: 5px;",
          class_name: "bar-weather-icon",
          icon: theWeather.bind("value").as((v) => {
            let iconQuery = v.current.condition.text
              .trim()
              .toLowerCase()
              .replaceAll(" ", "_");

            if (!v.current.is_day && iconQuery === "partly_cloudy") {
              iconQuery = "partly_cloudy_night";
            }
            return icons.weather[iconQuery];
          }),
        }),
        Widget.Label({
          css: "margin-right: 12px;",
          class_name: "bar-weather",
          label: Utils.merge([theWeather.bind("value")], (wthr) => {
            return `${Math.ceil(wthr.current.temp_c)}° C`;
          }),
        }),
        Widget.Label({
          class_name: "clock",
          label: time.bind(),
        }),
      ],
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

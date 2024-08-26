const systemtray = await Service.import("systemtray");

const Meetings = () => {
  let notificationSent = false;
  let previousEventId: string | null = null;

  const handlePrimaryClick = (event) => {
    const items = systemtray.items;

    const item = items.find(({ id }) => id === "gnome-next-meeting-applet");
    if (item) {
      item.openMenu(event);
    }
  };

  async function getNextEvent() {
    const eventJson = await Utils.execAsync(
      "gnome-next-meeting-applet dbus get_event_json",
    );
    const event = JSON.parse(eventJson);

    return event;
  }

  function generateEventId(event) {
    return `${event.title}-${new Date().getTime()}`;
  }

  function sendNotification(title, timeTo, url) {
    if (
      !notificationSent &&
      !timeTo.includes("h") &&
      timeTo.replace("m", "") === "10"
    ) {
      Utils.notify({
        summary: title,
        body: "Starting in 10 minutes. Prepare!",
        iconName: "x-office-calendar-symbolic",
        actions: url && {
          "Open Meeting URL": () => {
            Utils.execAsync(`brave --profile-directory='Profile 7' "${url}"`);
          },
        },
      });
    }

    notificationSent = true;
  }

  async function checkEventAndNotify() {
    const event = await getNextEvent();

    const currentEventId = generateEventId(event); // Generate a unique ID for the event

    if (currentEventId !== previousEventId) {
      notificationSent = false; // Reset the flag if the event has changed
      previousEventId = currentEventId; // Update the previous event ID
    }

    const timeTo = convertTimeFormat(event.timeto);

    if (
      !timeTo.includes("at") ||
      !timeTo.includes("left") ||
      !timeTo.includes("Tomorrow")
    ) {
      sendNotification(event.title, timeTo, event.url);
    }
  }

  async function getEventLabel() {
    const event = await getNextEvent();
    const timeTo = convertTimeFormat(event.timeto);

    if (timeTo.includes("Tomorrow") | timeTo.includes("left")) {
      return ` ${event.title}  ${timeTo}`;
    } else if (timeTo.includes("at")) {
      return " No upcoming meetings";
    } else {
      return ` ${event.title} in ${timeTo}`;
    }
  }

  function convertTimeFormat(input) {
    // Replace "hours" with "h" and "minutes" with "m"
    let result = input
      .replace(/(\d+) hours?/, "$1h")
      .replace(/(\d+) minutes?/, "$1m")
      .replace(" and ", " ");

    return result;
  }

  const syncInterval = () => {
    const now = new Date();
    const seconds = now.getSeconds();
    const millisecondsToNextMinute =
      (60 - seconds) * 1000 - now.getMilliseconds();
    return millisecondsToNextMinute;
  };

  setInterval(() => {
    checkEventAndNotify();
  }, 60000); // Check every minute

  return {
    component: Widget.Box({
      class_name: "meetings",
      children: [
        Widget.Label({
          label: "󰨲",
          class_name: "bar-button-icon txt-icon bar meetings",
        }),

        Widget.Label({
          setup: (self) =>
            self.hook(systemtray, async () => {
              const setLabelAndStartInterval = async () => {
                self.label = await getEventLabel();

                setTimeout(() => {
                  Utils.interval(60 * 1000, async () => {
                    self.label = await getEventLabel();
                  });
                }, syncInterval());
              };

              setLabelAndStartInterval();
            }),
          class_name: "bar-button-label bar meetings",
        }),
      ],
    }),
    isVisible: true,
    boxClass: "meetings",
    props: {
      on_primary_click: (_, event) => handlePrimaryClick(event),
      on_secondary_click: () => Utils.execAsync("gnome-calendar"),
      on_middle_click: () => {
        const url = Utils.exec(
          `gnome-next-meeting-applet dbus get_event_url`,
        ).trim();

        url
          ? Utils.execAsync(`brave --profile-directory='Profile 7' "${url}"`)
          : Utils.notify({
              summary: "No event URL",
              iconName: "x-office-calendar-symbolic",
            });
      },
    },
  };
};

export { Meetings };

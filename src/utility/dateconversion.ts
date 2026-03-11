import moment from "moment";
export const standardTimeZone = (date: string | Date | number) => {
  const store = moment(date).utc();
  return store;
};

export const date = (date: string) => {
  const store = moment(date).utc().format("YYYY-MM-DD");
  return store;
};

export function formatDate(ts: number) {
  if (typeof ts !== "number" || isNaN(ts)) {
    return "Invalid timestamp";
  }
  const d = new Date(ts);
  if (isNaN(d.getTime())) {
    return "Invalid date";
  }
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayName = days[d.getDay()];
  const monthName = months[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const seconds = d.getSeconds().toString().padStart(2, "0");
  const ms = d.getMilliseconds().toString().padStart(3, "0");

  return `${dayName} ${monthName} ${day} ${year} ${hours}:${minutes}:${seconds}.${ms}`;
}

const timestamp = Number("1748346257774"); // replace with your variable
console.log(formatDate(timestamp));

export const time = (time: string) => {
  const store = moment.utc(time).local().format("hh:mm:ss A").toUpperCase();
  console.log(store);
  return store;
};

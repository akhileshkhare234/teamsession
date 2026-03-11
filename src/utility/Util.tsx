import MomentUtil from "./Moment";
import { parsePhoneNumberFromString } from "libphonenumber-js";
/* eslint-disable @typescript-eslint/no-explicit-any */
export const monthNames = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const monthFullName = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const dateFormate = (dateval: string | number | Date) => {
  const date = new Date(dateval);
  return MomentUtil.formatWithLocale(date, "MM/DD/YYYY, h:mm:ss a");
};

export function epochToReadableTime(epochTime: number): string {
  // Convert epoch time to Date object
  const date = new Date(epochTime);

  // Define date and time components
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero based
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);

  // Construct readable date and time format
  const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedTime;
}

export const queueStatus = (statusID: number) => {
  switch (statusID) {
    case 0:
      return "Queued";
    case 1:
      return "In-Progress";
    case 2:
      return "Stopped";
    case 3:
      return "Error";
    case 4:
      return "Done";

    default:
      return statusID;
  }
};

export const convert = (originalDateStr: any) => {
  const originalDate = new Date(originalDateStr);
  // Extract year, month, and day
  const year = originalDate.getFullYear();
  const month = (originalDate.getMonth() + 1).toString().padStart(2, "0"); // January is 0
  const day = originalDate.getDate().toString().padStart(2, "0");

  // Format the date as "yyyy-MM-dd"
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
};

export const getYear = () => new Date().getFullYear();

export const getMonthByDate = (val: any) =>
  monthFullName[new Date(val).getMonth()];

export const capitalize = (word: string) => {
  if (word && word.length) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLocaleLowerCase();
  }
  return "";
};

export function validatePhoneNumber(phoneNumber: string): boolean {
  try {
    const phone = parsePhoneNumberFromString(phoneNumber, "US");
    return phone?.isValid() || false;
  } catch (error) {
    return false;
  }
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function validatePassword(password: string): any {
  const strength: { [key: number]: string } = {
    1: "very Weak",
    2: "Weak",
    3: "Meduim",
    4: "Strong",
  };
  if (password.length > 15)
    return {
      success: false,
      //message: `${password} + " Password is too lengthy"`,
      message: "Password is too lengthy. Can have max 15 characters.",
    };
  else if (password.length < 8)
    return {
      success: false,
      message: "Password is too short. Need to have atleast 8 characters.",
    };

  let regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!^%*?&]{8,15}$/;
  if (regex.test(password)) {
    return {
      success: true,
      message: "Password is strong",
    };
  }
  let count = 0;
  let regex1 = /[a-z]/;
  if (regex1.test(password)) count++;
  let regex2 = /[A-Z]/;
  if (regex2.test(password)) count++;
  let regex3 = /[\d]/;
  if (regex3.test(password)) count++;
  let regex4 = /[!@#$%^&*.?]/;
  if (regex4.test(password)) count++;

  return {
    success: false,
    message: `"Password is ${strength[count]}"`,
  };
}

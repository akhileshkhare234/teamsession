import {
  parsePhoneNumberFromString,
  isValidPhoneNumber,
  CountryCode,
  AsYouType,
} from "libphonenumber-js";

export class PhoneNumberUtils {
  /**
   * Validates if the input is a valid phone number.
   * @param phoneNumber - The phone number to validate.
   * @param defaultCountry - The default country to assume if not specified in the phone number.
   * @returns True if the phone number is valid; otherwise, false.
   */
  static validatePhoneNumber(
    phoneNumber: string,
    defaultCountry: CountryCode = "US"
  ): boolean {
    try {
      return isValidPhoneNumber(phoneNumber, defaultCountry);
    } catch (error) {
      console.error("Error validating phone number:", error);
      return false;
    }
  }

  /**
   * Parses and formats the phone number into the international format.
   * @param phoneNumber - The phone number to format.
   * @param defaultCountry - The default country to assume if not specified in the phone number.
   * @returns The formatted phone number in international format, or null if invalid.
   */
  static formatPhoneNumber(
    phoneNumber: string,
    defaultCountry: CountryCode = "US"
  ): string | null {
    try {
      const parsed = parsePhoneNumberFromString(phoneNumber, defaultCountry);
      if (parsed && parsed.isValid()) {
        return parsed.formatInternational();
      }
      return null;
    } catch (error) {
      console.error("Error formatting phone number:", error);
      return null;
    }
  }

  /**
   * Checks if a phone number is valid and returns its region code.
   * @param phoneNumber - The phone number to check.
   * @param defaultCountry - The default country to assume if not specified in the phone number.
   * @returns The region code if valid; otherwise, null.
   */
  static getPhoneNumberRegion(
    phoneNumber: string,
    defaultCountry: CountryCode = "US"
  ): string | null {
    try {
      const parsed = parsePhoneNumberFromString(phoneNumber, defaultCountry);
      if (parsed && parsed.isValid()) {
        return parsed.country || null;
      }
      return null;
    } catch (error) {
      console.error("Error retrieving phone number region:", error);
      return null;
    }
  }

  /**
   * Formats the phone number into the E.164 format.
   * @param phoneNumber - The phone number to format.
   * @param defaultCountry - The default country to assume if not specified in the phone number.
   * @returns The formatted phone number in E.164 format, or null if invalid.
   */
  static formatPhoneNumberE164(
    phoneNumber: string,
    defaultCountry: CountryCode = "US"
  ): string | null {
    try {
      const parsed = parsePhoneNumberFromString(phoneNumber, defaultCountry);
      if (parsed && parsed.isValid()) {
        return parsed.format("E.164");
      }
      return null;
    } catch (error) {
      console.error("Error formatting phone number to E.164:", error);
      return null;
    }
  }

  /**
   * Removes all spaces from the phone number.
   * @param phoneNumber - The phone number to process.
   * @returns The phone number without spaces.
   */
  static removeSpacesFromPhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/\s+/g, "");
  }

  /**
   * Dynamically formats the phone number as the user types.
   * @param input - The phone number input to format.
   * @param defaultCountry - The default country to assume if not specified in the input.
   * @returns The phone number formatted dynamically as the user types.
   */
  static formatAsYouType(
    input: string,
    defaultCountry: CountryCode = "US"
  ): string {
    try {
      const formatter = new AsYouType(defaultCountry);
      return formatter.input(input);
    } catch (error) {
      console.error("Error formatting phone number as you type:", error);
      return input;
    }
  }
  /**
   * Extracts the numeric country calling code from a given phone number.
   * @param phoneNumber - The phone number to analyze.
   * @returns The country calling code (e.g., "+1", "+91") if valid; otherwise, null.
   */
  static getCountryCallingCode(phoneNumber: string): string | null {
    try {
      const parsed = parsePhoneNumberFromString(phoneNumber);
      if (parsed && parsed.isValid()) {
        return `+${parsed.countryCallingCode}`; // Returns the numeric country calling code
      }
      return null;
    } catch (error) {
      console.error("Error extracting country calling code:", error);
      return null;
    }
  }
}

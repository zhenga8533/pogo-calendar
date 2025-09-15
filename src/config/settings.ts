import type { Settings } from "../types/settings";

export const initialSettings: Settings = {
  firstDay: 0,
  sourceTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  destinationTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  theme: "auto",
};

// A curated list of representative IANA time zones for common offsets.
const representativeZoneIdentifiers = [
  "Pacific/Midway", // UTC-11
  "Pacific/Honolulu", // UTC-10
  "America/Anchorage", // UTC-9
  "America/Los_Angeles", // UTC-8
  "America/Denver", // UTC-7
  "America/Chicago", // UTC-6
  "America/New_York", // UTC-5
  "America/Caracas", // UTC-4
  "America/Sao_Paulo", // UTC-3
  "Atlantic/South_Georgia", // UTC-2
  "Atlantic/Azores", // UTC-1
  "Europe/London", // UTC+0
  "Europe/Paris", // UTC+1
  "Europe/Helsinki", // UTC+2
  "Europe/Moscow", // UTC+3
  "Asia/Dubai", // UTC+4
  "Asia/Karachi", // UTC+5
  "Asia/Dhaka", // UTC+6
  "Asia/Bangkok", // UTC+7
  "Asia/Singapore", // UTC+8
  "Asia/Tokyo", // UTC+9
  "Australia/Sydney", // UTC+10
  "Pacific/Guadalcanal", // UTC+11
  "Pacific/Auckland", // UTC+12
];

/**
 * Creates a user-friendly label for a given IANA time zone identifier.
 * @param timeZone The IANA time zone identifier (e.g., "America/New_York").
 * @returns A string label, e.g., "UTC-4:00 (Eastern Daylight Time)".
 */
function getTimeZoneLabel(timeZone: string): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "longOffset", // e.g., "GMT-4"
    });
    const offsetPart = formatter.formatToParts(new Date()).find((part) => part.type === "timeZoneName");
    const offset = offsetPart ? offsetPart.value.replace("GMT", "UTC") : "";

    const nameFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "long",
    });
    const namePart = nameFormatter.formatToParts(new Date()).find((part) => part.type === "timeZoneName");
    const name = namePart ? namePart.value : timeZone.split("/").pop()?.replace(/_/g, " ") || "";

    return `${offset} (${name})`;
  } catch (e) {
    // Fallback for any unexpected errors.
    return timeZone;
  }
}

// Get the user's current time zone to add it to the list.
const currentUserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Create a list of time zone objects with value and label properties.
const allZones = [...new Set([currentUserTimeZone, ...representativeZoneIdentifiers])];

export const timeZoneOptions = allZones.map((tz) => ({
  value: tz,
  label: getTimeZoneLabel(tz),
}));

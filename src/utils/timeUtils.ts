// src/utils/timeUtils.ts

import moment from "moment-timezone";

const timeZone = import.meta.env.VITE_TIME_ZONE;

export const getTimeUntilNextMeeting = (meetingTime: string): { hours: number; minutes: number } => {
  const now = moment().tz(timeZone);
  const [hoursString, minutesString] = meetingTime.split(':');
  const hours = parseInt(hoursString, 10);
  const minutes = parseInt(minutesString, 10);

  if (isNaN(hours) || isNaN(minutes)) {
    console.error('Invalid meeting time format:', meetingTime);
    return { hours: NaN, minutes: NaN };
  }

  let nextMeeting = moment().tz(timeZone).set({ hour: hours, minute: minutes, second: 0, millisecond: 0 });

  if (now.isAfter(nextMeeting)) {
    nextMeeting.add(1, 'day');
  }

  const diff = moment.duration(nextMeeting.diff(now));
  return { hours: Math.floor(diff.asHours()), minutes: diff.minutes() };
};

export function formatMeetingTime(timeString:string) {
  const [time] = timeString.split(" ");
  const [hoursString, minutesString] = time.split(":");
  let hours = parseInt(hoursString,10);
  let minutes = parseInt(minutesString,10);

  let ampm = "AM";

  if (hours >= 12) {
    ampm = "PM";
    if (hours > 12) {
      hours -= 12;
    }
  } else if (hours === 0) {
    hours = 12;
  }

  const formattedMinutes = minutes.toString().padStart(2, '0');

  return `${hours}:${formattedMinutes} ${ampm}`;
}
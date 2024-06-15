/**
 * Formatting helpers
 * @module utils/helpers
 * @author Jesse Kaufman <jesse@jessekaufman.com>
 */

Object.defineProperty(String.prototype, "toTitle", {
  value() {
    return this.substring(0, 1).toUpperCase() + this.substring(1);
  },
});

const wrapTimecode = (time, hasHour) => {
  let formattedTime = "";
  let h = null;
  let m = null;
  let s = null;

  // Split timecode into seconds, minutes, and optionally hours
  if (time.match(/\d{1,2}:\d\d:\d\d/)) {
    [h, m, s] = time.split(":");
  } else {
    [m, s] = time.split(":");
  }

  if (hasHour) {
    // If undefined use "00:" for hour, otherwise zero-pad hour and add ":"
    formattedTime = h != null ? "00:" : `${h?.padStart(2, "0")}:`;
  }

  // Add zero-padded minutes and seconds
  formattedTime += `${m.padStart(2, "0")}:${s.padStart(2, "0")}`;

  return `<br/><span class="time">${formattedTime}</span>`;
};

/**
 * Formats transcript
 *
 * Adds styling for timecodes in transcripts and makes them inline
 *
 * @param {string} transcript Transcript to format
 * @param {string} duration - Duration of video
 * @returns {string} Formatted transcript
 */
export const formatTranscript = (transcript, duration) => {
  // Default hasHour to false and use var so the scope is the function
  let hasHour = false;

  // If transcript is undefined, return empty string
  if (!transcript) {
    return "";
  }

  // If item's duration includes an hour, set hasHour = true for later
  if (duration.match(/01:\d\d:\d\d/)) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasHour = true;
  }

  // Wrap timecodes in span for styling
  let wrappedTranscript = transcript.replace(
    /((\d{1,2}:)+\d\d)/g,
    (time, hasHour) => wrapTimecode(time, hasHour)
  );

  return wrappedTranscript;
};

/**
 * Formats duration
 *
 * Converts string from "[hh:]mm:ss" to a human-readable duration
 * excluding any hour, minute, or second with a value of 0
 *
 * @param {string} duration - The duration to format
 * @returns {string} The formatted duration
 */
export const formatDuration = (duration) => {
  let formattedDuration = "";

  const [hours, minutes, seconds] = duration.split(":");

  if (hours > 0) {
    formattedDuration = `${parseInt(hours)}h `;
  }
  if (minutes > 0) {
    formattedDuration += `${parseInt(minutes)}m `;
  }
  if (seconds > 0) {
    formattedDuration += `${parseInt(seconds)}s`;
  }

  return formattedDuration;
};

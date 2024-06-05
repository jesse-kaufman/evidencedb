/**
 * Formatting helpers
 * @module utils/helpers
 * @author Jesse Kaufman <jesse@jessekaufman.com>
 */

/**
 * Formats phone number
 *
 * @param {string} number - Phone number to format
 * @return {string} Formatted phone number
 */
export function formatPhone(number) {
  return (
    number.substring(0, 3) +
    "-" +
    number.substring(3, 6) +
    "-" +
    number.substring(6)
  );
}

/**
 * Formats video transcript
 *
 * Adds styling for timecodes in transcripts and makes them inline
 *
 * @param {string} transcript Transcript to format
 * @param {string} duration - Duration of video
 * @returns {string} Formatted transcript
 */
export function formatVideoTranscript(transcript, duration) {
  // Default hasHour to false and use var so the scope is the function
  var hasHour = false;

  // If transcript is undefined, return empty string
  if (!transcript) {
    return "";
  }

  // If item's duration includes an hour, set hasHour = true for later
  if (duration.match(/01:\d\d:\d\d/)) {
    hasHour = true;
  }

  // Wrap timecodes in span for styling
  return transcript.replace(/((\d{1,2}:)+\d\d)/g, (time) => {
    let formattedTime = "";
    var h,
      m,
      s = null;

    // Split timecode into seconds, minutes, and optionally hours
    if (time.match(/\d{1,2}:\d\d:\d\d/)) {
      [h, m, s] = time.split(":");
    } else {
      [m, s] = time.split(":");
    }

    if (hasHour) {
      // If undefined use "00:" for hour, otherwise zero-pad hour and add ":"
      formattedTime = h === undefined ? "00:" : `${h.padStart(2, "0")}:`;
    }

    // Add zero-padded minutes and seconds
    formattedTime += `${m.padStart(2, "0")}:${s.padStart(2, "0")}`;

    return `<br/><span class="time">${formattedTime}</span>`;
  });
}

/**
 * Formats duration
 *
 * Converts string from "[hh:]mm:ss" to a human-readable duration
 * excluding any hour, minute, or second with a value of 0
 *
 * @param {string} duration - The duration to format
 * @returns {string} The formatted duration
 */
export function formatDuration(duration) {
  let formattedDuration = "";

  const [hours, minutes, seconds] = duration.split(":");

  if (hours && hours > 0) {
    formattedDuration = `${parseInt(hours)}h `;
  }
  if (minutes && minutes > 0) {
    formattedDuration += `${parseInt(minutes)}m `;
  }
  if (seconds && seconds > 0) {
    formattedDuration += `${parseInt(seconds)}s`;
  }

  return formattedDuration;
}

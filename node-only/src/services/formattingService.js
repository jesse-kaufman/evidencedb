/**
 * Formatting helpers
 * @module utils/helpers
 * @author Jesse Kaufman <jesse@jessekaufman.com>
 */

Object.defineProperty(String.prototype, 'toTitle', {
  value() {
    return this.substring(0, 1).toUpperCase() + this.substring(1)
  },
})

const wrapTimecode = (time) => {
  let formattedTime = ''
  let h = null
  let m = null
  let s = null
  let _hasHour = false

  // Split timecode into seconds, minutes, and optionally hours
  if (time.match(/\d{1,2}:\d\d:\d\d/)) {
    ;[h, m, s] = time.split(':')
    _hasHour = true
  } else {
    ;[m, s] = time.split(':')
  }

  // If undefined use "00:" for hour, otherwise zero-pad hour and add ":"
  if (_hasHour === true) {
    // eslint-disable-next-line no-magic-numbers
    formattedTime = h == null ? '00:' : `${h?.padStart(2, '0')}:`
  }

  // Add zero-padded minutes and seconds
  // eslint-disable-next-line no-magic-numbers
  formattedTime += `${m.padStart(2, '0')}:${s.padStart(2, '0')}`

  return `<span class="time">${formattedTime}</span><span class="text">`
}

/**
 * Formats transcript
 *
 * Adds styling for timecodes in transcripts and makes them inline
 *
 * @param {string} transcript Transcript to format
 * @param {string} duration - Duration of video
 * @returns {string} Formatted transcript
 */
export const formatTranscript = (transcript) => {
  // If transcript is undefined, return empty string
  if (!transcript) {
    return ''
  }

  // Wrap time codes in span for styling
  let wrappedTranscript = transcript.replace(/((\d{1,2}:)+\d\d)\n/g, (time) =>
    wrapTimecode(time.trim()),
  )

  wrappedTranscript = wrappedTranscript.replace(/(.*)/g, (line) => {
    return line ? `<div class="line">${line}</span></div>` : ''
  })

  return wrappedTranscript
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
export const formatDuration = (duration) => {
  let formattedDuration = ''

  const [hours, minutes, seconds] = duration.split(':')

  if (hours > 0) {
    formattedDuration = `${parseInt(hours)}h `
  }

  if (minutes > 0) {
    formattedDuration += `${parseInt(minutes)}m `
  }

  if (seconds > 0) {
    formattedDuration += `${parseInt(seconds)}s`
  }

  return formattedDuration
}

export const linkify = (text) => {
  const urlRegex =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi

  return text.replace(urlRegex, (url) => {
    return `<a href="${url.trim()}">${url}</a>`
  })
}

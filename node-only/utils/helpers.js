Object.defineProperty(String.prototype, "toTitle", {
  value() {
    return this.substring(0, 1).toUpperCase() + this.substring(1);
  },
});

exports.formatPhone = (number) =>
  number.substring(0, 3) +
  "-" +
  number.substring(3, 6) +
  "-" +
  number.substring(6);

exports.formatVideoTranscript = (body, duration) => {
  if (!body) {
    return "";
  }

  var hasHour = false;
  if (duration.match(/01:\d\d:\d\d/)) {
    hasHour = true;
  }

  return body.replace(/((\d{1,2}:)+\d\d)/g, (time) => {
    let formattedTime = "";

    if (time.match(/\d{1,2}:\d\d:\d\d/)) {
      var [h, m, s] = time.split(":");
    } else {
      var [m, s] = time.split(":");
    }

    if (hasHour) {
      formattedTime = h !== undefined ? `${h.padStart(2, "0")}:` : "00:";
    }

    formattedTime += `${m.padStart(2, "0")}:${s.padStart(2, "0")}`;

    return `<br/><span class="time">${formattedTime}</span>`;
  });
};

exports.formatDuration = (duration) => {
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
};

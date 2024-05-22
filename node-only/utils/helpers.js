exports.formatPhone = (number) =>
  number.substring(0, 3) +
  "-" +
  number.substring(3, 6) +
  "-" +
  number.substring(6);

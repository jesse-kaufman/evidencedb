exports.formatPhone = (number) =>
  number.substring(0, 3) +
  "-" +
  number.substring(3, 3) +
  "-" +
  number.substring(-4);

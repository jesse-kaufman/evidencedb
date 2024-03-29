export const nl2br = (str, is_xhtml) => {
  if (typeof str === "undefined" || str === null) {
    return "";
  }
  var breakTag =
    is_xhtml || typeof is_xhtml === "undefined" ? "<br />" : "<br>";
  return (str + "").replace(
    /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
    "$1" + breakTag + "$2"
  );
};

export const format_phone = (phone) => {
  return phone.substr(0, 3) + "-" + phone.substr(3, 3) + "-" + phone.substr(6);
};

export const get_email = (from) => {
  return from.match(/<(.*)>/)[1];
};

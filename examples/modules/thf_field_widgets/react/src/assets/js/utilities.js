export function getContrastYIQ(hexColor) {
  if (hexColor.substr(0, 1) === '#') {
    hexColor = hexColor.substring(1);
  }

  var r = parseInt(hexColor.substr(0, 2), 16);
  var g = parseInt(hexColor.substr(2, 2), 16);
  var b = parseInt(hexColor.substr(4, 2), 16);
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128 ? '#212121' : '#ffffff';
}

export function isObjectEmpty(obj) {
  return !obj || Object.keys(obj).length === 0;
}

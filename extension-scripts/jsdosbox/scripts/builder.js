const constants = require("./constants");

exports.props = {
  blackButton: (id, title) => {
    return {
      id: id,
      bgcolor: constants.color.black,
      text: title,
      textColor: constants.color.white,
      align: $align.center,
      font: constants.font.normal,
      smoothRadius: constants.btnRadius,
    };
  },
  redButton: key => {
    return {
      id: key,
      bgcolor: constants.color.red,
      text: key,
      textColor: constants.color.white,
      align: $align.center,
      font: constants.font.large,
      smoothRadius: constants.btnRadius,
    };
  },
  grayButton: (key, name) => {
    return {
      id: key,
      bgcolor: constants.color.keyGray,
      title: name,
      titleColor: constants.color.black,
      font: constants.font.small,
      smoothRadius: 5,
    };
  },
  toolbarButton: (id, key, name) => {
    return {
      id: id,
      info: {
        key: key
      },
      bgcolor: constants.color.keyGray,
      title: name,
      titleColor: constants.color.black,
      font: constants.font.small,
      smoothRadius: 5,
    };
  }
}
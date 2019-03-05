const constants = require("./constants");

exports.props = {
  blackBtn: (id, title) => {
    return {
      id: id,
      bgcolor: constants.color.black,
      text: title,
      textColor: constants.color.white,
      align: $align.center,
      font: constants.font.large,
      smoothRadius: constants.btnRadius,
    };
  },
  grayBtn: (id, title) => {
    return {
      id: id,
      bgcolor: constants.color.clear,
      text: title,
      textColor: constants.color.lightGray,
      align: $align.center,
      font: constants.font.medium,
    };
  },
  redButton: (id, title) => {
    return {
      id: id,
      bgcolor: constants.color.red,
      text: title,
      textColor: constants.color.white,
      align: $align.center,
      font: constants.font.large,
      radius: constants.btnSize.ab.width * 0.5,
    };
  },
  functionBtn: (id, title) => {
    return {
      id: id,
      bgcolor: constants.color.gray,
      title: title,
      font: constants.font.normal,
      smoothRadius: constants.btnRadius,
    };
  }
}
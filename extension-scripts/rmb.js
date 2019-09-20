var c = "零壹贰叁肆伍陆柒捌玖".split("");
// ["零","壹","贰","叁","肆","伍","陆","柒","捌","玖"]
var _c = {}; // 反向对应关系
for (var i = 0; i < c.length; i++) {
  _c[c[i]] = i;
};

var d = "元***万***亿***万";
var e = ",拾,佰,仟".split(",");

function unit4(arr) {
  var str = "",
    i = 0;
  while (arr.length) {
    var t = arr.pop();
    str = (c[t] + (t == 0 ? "" : e[i])) + str;
    i++;
  }

  str = str.replace(/[零]{2,}/g, "零");

  str = str.replace(/^[零]/, "");
  str = str.replace(/[零]$/, "");
  if (str.indexOf("零") == 0) {
    str = str.substring(1);
  }
  if (str.lastIndexOf("零") == str.length - 1) {
    str = str.substring(0, str.length - 1);
  }

  return str;
}

function _formatD(a) {
  // 转化整数部分
  var arr = a.split(""),
    i = 0,
    result = "";
  while (arr.length) {
    var arr1 = arr.splice(-4, 4);

    var dw = d.charAt(i),
      unit = unit4(arr1);

    if (dw == '万' && !unit) {
      dw = "";
    }
    result = unit + dw + result;
    i += 4;
  }
  return result == "元" ? "" : result;
}

function _formatF(b) {
  // 转化小数部分
  b = b || "";
  switch (b.length) {
  case 0:
    return "整";
  case 1:
    return c[b] + "角";
  default:
    return c[b.charAt(0)] + "角" + c[b.charAt(1)] + "分";
  }
}

function _format(n) {
  var a = ("" + n)
    .split("."),
    a0 = a[0],
    a1 = a[1];
  return _formatD(a0) + _formatF(a1);
}

function parse4(u4) {
  var res = 0;
  while (t = /([零壹贰叁肆伍陆柒捌玖])([拾佰仟]?)/g.exec(u4)) {
    var n = _c[t[1]],
      d = {
        "": 1,
        "拾": 10,
        "佰": 100,
        "仟": 1000
      }[t[2]];
    res += n * d;
    u4 = u4.replace(t[0], "");
  }
  var result = ("0000" + res);
  return result.substring(result.length - 4);
}

function _parseD(d) {
  var arr = d.replace(/[零]/g, "")
    .split(/[万亿]/),
    rs = "";
  for (var i = 0; i < arr.length; i++) {
    rs += parse4(arr[i]);
  };
  return rs.replace(/^[0]+/, "");
};

function _parseF(f) {
  var res = "",
    t = f.replace(/[^零壹贰叁肆伍陆柒捌玖]+/g, "")
    .split(""); // 去掉单位
  if (t.length) {
    res = ".";
  } else {
    return "";
  };
  for (var i = 0;
    (i < t.length && i < 2); i++) {
    res += _c[t[i]];
  };
  return res;
};

function _parse(rmb) {
  var a = rmb.split("元"),
    a1 = a[1],
    a0 = a[0];
  if (a.length == 1) {
    a1 = a0;
    a0 = "";
  }
  return _parseD(a0) + _parseF(a1);

};

//小写转大写
function formatRMB(num) {
  if (num.length == 0) {
    return "";
  }
  var n = Number(num);
  if (!isNaN(num)) {
    if (num == 0) {
      return "零元整";
    } else {
      return _format(n);
    }
  } else {
    return "";
  }
}

//大写转小写
function parseRMB(rmb) {
  if (/^[零壹贰叁肆伍陆柒捌玖元万亿拾佰仟角分整]{2,}$/.test(rmb)) {
    var result = _parse(rmb);
    return rmb == formatRMB(result) ? result : result + "(?)";
  } else {
    return "";
  }
};

$ui.render({
  props: {
    title: "人民币大写转换"
  },
  views: [
    {
      type: "input",
      props: {
        id: "format",
        type: $kbType.decimal,
        placeholder: "小写"
      },
      layout: function(make, view) {
        make.left.top.right.inset(10)
        make.height.equalTo(32)
      },
      events: {
        ready: function(sender) {
          sender.focus()
        },
        changed: function(sender) {
          $("parse").text = formatRMB(sender.text)
        }
      }
    },
    {
      type: "input",
      props: {
        id: "parse",
        placeholder: "大写"
      },
      layout: function(make, view) {
        make.left.right.inset(10)
        make.height.equalTo(32)
        make.top.inset(52)
      },
      events: {
        changed: function(sender) {
          $("format").text = parseRMB(sender.text)
        }
      }
    }
  ]
})
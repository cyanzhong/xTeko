var text = $context.text || $clipboard.text

var totalCount = text.length
var cnCount = 0
var enCount = 0
var numberCount = 0
var asciiCount = 0
var symbolCount = 0

var cnReg = /^[\u4E00-\uFA29]*$/
var enReg = /^[a-zA-Z()]+$/
var numberReg = /^\d$/
var asciiReg = /^[\x00-\xFF]*$/
var symbolReg = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/

for (var i = 0; i < text.length; ++i) {

  var character = text.charAt(i)

  if (cnReg.test(character)) {
    ++cnCount
  }
  
  if (enReg.test(character)) {
    ++enCount
  }

  if (numberReg.test(character)) {
    ++numberCount
  }

  if (asciiReg.test(character)) {
    ++asciiCount
  }

  if (symbolReg.test(character)) {
    ++symbolCount
  }
}

var message = ""
message += "总计: " + totalCount + "\n"
message += "中文: " + cnCount + "\n"
message += "英文: " + enCount + "\n"
message += "数字: " + numberCount + "\n"
message += "ASCII: " + asciiCount + "\n"
message += "符号: " + symbolCount

$ui.alert({
  title: "字数统计",
  message: message
})
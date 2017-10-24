var date = new Date()
date.setSeconds(date.getSeconds() + 20)

$clipboard.set({
  value: "Temporary text",
  type: "public.plain-text",
  expirationDate: date
})
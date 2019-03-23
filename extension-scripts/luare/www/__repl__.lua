local js = require "js"

-- Save references to lua baselib functions used
local _G = _G
local load = load
local pack, unpack, tinsert, tremove = table.pack, table.unpack, table.insert, table.remove
local tostring = tostring
local traceback = debug.traceback
local xpcall = xpcall
local global = js.global
local document = global.document

local output = document:getElementById("fengari-console")
local prompt = document:getElementById("fengari-prompt")

local function triggerEvent(el, type)
  local e = document:createEvent("HTMLEvents")
  e:initEvent(type, false, true)
  el:dispatchEvent(e)
end

_G.print = function(...)
  local toprint = pack(...)

  local line = document:createElement("pre")
  line.style["white-space"] = "pre-wrap"
  output:appendChild(line)

  for i = 1, toprint.n do
    if i ~= 1 then
      line:appendChild(document:createTextNode("\t"))
    end
    line:appendChild(document:createTextNode(tostring(toprint[i])))
  end

  output.scrollTop = output.scrollHeight
end

local function evaluate(code)
  do
    local line = document:createElement("span")
    line:appendChild(document:createTextNode(prompt.textContent))
    local item = document:createElement("pre")
    item.className = "lua"
    item.style.padding = "0"
    item.style.display = "inline"
    item.style["white-space"] = "pre-wrap"
    item.textContent = code
    line:appendChild(item)
    output:appendChild(line)
    output:appendChild(document:createElement("br"))
    output.scrollTop = output.scrollHeight
  end

  if code.length == 0 then
    return
  end

  local fn, err = load("return " .. code, "stdin")
  if not fn then
    fn, err = load(code, "stdin")
  end

  if fn then
    local results = pack(xpcall(fn, traceback))
    if results[1] then
      if results.n > 1 then
        _G.print(unpack(results, 2, results.n))
      end
    else
      _G.print(results[2])
    end
  else
    _G.print(err)
  end

  triggerEvent(output, "change")
  return output.innerText
end

_G.print(_G._COPYRIGHT)

global.evaluate = function(_, code)
  return evaluate(code)
end

global:notify("onload", output.innerText)
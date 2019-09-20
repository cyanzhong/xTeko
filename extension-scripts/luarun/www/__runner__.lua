local js = require "js"
local global = js.global
local document = global.document

local print_redir = function(element, ...)
  local toprint = table.pack(...)

  local line = document:createElement("pre")
  line.style["white-space"] = "pre-wrap"
  element:appendChild(line)

  for i = 1, toprint.n do
    if i ~= 1 then
      line:appendChild(document:createTextNode("\t"))
    end
      line:appendChild(document:createTextNode(tostring(toprint[i])))
  end
end

function run_code(code)
  local console = document:getElementById("console")
  console.innerHTML = ""

  local orig_print = _G.print
  _G.print = function(...)
    print_redir(console, ...)
  end

  local success, msg = pcall(load(code))
  if not success then
    print(msg or "An error occured while running snippet: \n" .. code)
  end

  _G.print = orig_print
  return console.innerText
end

global.run_code = function(_, code)
  return run_code(code)
end

global:notify("onload")
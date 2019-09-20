print('util.lua loaded')

local helper = require 'modules.helper'
local util = {}

function util.hello()
  helper.hello()
end

return util
-- Constrain publication tables to the printable width so long evidence fields wrap.
function Table(table)
  local count = #table.colspecs
  local widths

  if count == 2 then
    widths = { 0.30, 0.70 }
  elseif count == 3 then
    widths = { 0.22, 0.53, 0.25 }
  elseif count == 4 then
    local header = ""
    if table.head and table.head.rows and table.head.rows[1] then
      for _, cell in ipairs(table.head.rows[1].cells) do
        header = header .. " " .. pandoc.utils.stringify(cell.contents)
      end
    end
    if header:find("Pass criterion") or header:find("通过标准") then
      widths = { 0.08, 0.26, 0.14, 0.52 }
    else
      widths = { 0.14, 0.56, 0.16, 0.14 }
    end
  elseif count == 5 then
    widths = { 0.12, 0.30, 0.22, 0.20, 0.16 }
  else
    widths = {}
    for index = 1, count do widths[index] = 1 / count end
  end

  for index, colspec in ipairs(table.colspecs) do
    table.colspecs[index] = { colspec[1], widths[index] }
  end
  return table
end

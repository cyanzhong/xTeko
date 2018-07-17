function newButton(id, icon) {
  return {
    id: id,
    bgcolor: $color("tint"),
    icon: $icon(icon, $color("white"), $size(18, 18)),
    radius: 18
  };
}

function newPuppet(name) {
  // Use static files because it's easier to debug
  var data = $file.read(`assets/puppets/${name}.png`);
  return data.image;
}

module.exports = {
  newButton: newButton,
  newPuppet: newPuppet,
}
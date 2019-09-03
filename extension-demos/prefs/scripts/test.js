exports.run = () => {
  const value = $prefs.get("prefs.demo.string");
  alert(`prefs.demo.string: ${value}`);
}
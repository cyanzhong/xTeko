module.exports = {
  "Mota": {
    "filter": (rules, path) => {
      if (path === "/games/sync.php") {
        return "multipart";
      }
      return null;
    },
    "response": (request, path) => {
      if (path === "/games/sync.php") {
        const arguments = request.arguments;
        const form = {};
        arguments.forEach(argument => {
          form[argument.controlName] = argument.string;
        });

        if (form.type === "save") {
          $cache.set("mota-game-states", form);
          return {
            type: "data",
            props: {
              html: JSON.stringify({"code": 0, "msg": "mota"})
            }
          }
        } else if (form.type === "load") {
          const states = $cache.get("mota-game-states");
          return {
            type: "data",
            props: {
              html: JSON.stringify({"code": 0, "msg": JSON.stringify(states)})
            }
          }
        }
      }
      return null;
    }
  }
}
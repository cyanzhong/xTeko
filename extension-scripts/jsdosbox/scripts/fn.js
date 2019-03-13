exports.keys = () => {
  let file = $file.read("assets/fn.json");
  return file ? JSON.parse(file.string) : [
    {
      "name": "Q",
      "code": 81
    },
    {
      "name": "W",
      "code": 87
    },
    {
      "name": "E",
      "code": 69
    },
    {
      "name": "R",
      "code": 82
    },
    {
      "name": "A",
      "code": 65
    },
    {
      "name": "S",
      "code": 83
    },
    {
      "name": "D",
      "code": 68
    },
    {
      "name": "F",
      "code": 70
    }
  ];
}
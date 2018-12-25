var options = {
  tooltip: {},
  visualMap: {
    show: false,
    dimension: 2,
    min: -1,
    max: 1,
    inRange: {
      color: [
        "#313695",
        "#4575b4",
        "#74add1",
        "#abd9e9",
        "#e0f3f8",
        "#ffffbf",
        "#fee090",
        "#fdae61",
        "#f46d43",
        "#d73027",
        "#a50026"
      ]
    }
  },
  xAxis3D: {},
  yAxis3D: {},
  zAxis3D: {},
  grid3D: {},
  series: [
    {
      type: "surface",
      parametric: true,
      // shading: 'albedo',
      parametricEquation: {
        u: {
          min: -Math.PI,
          max: Math.PI,
          step: Math.PI / 20
        },
        v: {
          min: 0,
          max: Math.PI,
          step: Math.PI / 20
        },
        x: function(u, v) {
          return Math.sin(v) * Math.sin(u);
        },
        y: function(u, v) {
          return Math.sin(v) * Math.cos(u);
        },
        z: function(u, v) {
          return Math.cos(v);
        }
      }
    }
  ]
};
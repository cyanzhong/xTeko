const storage = require("./storage");
const helper = require("./helper");
const preview = require("./preview");

exports.open = callback => {
  const data = [
    "atelier-estuary-dark",
    "a11y-dark",
    "a11y-light",
    "agate",
    "an-old-hope",
    "androidstudio",
    "arduino-light",
    "arta",
    "ascetic",
    "atelier-cave-dark",
    "atelier-cave-light",
    "atelier-dune-dark",
    "atelier-dune-light",
    "atelier-estuary-light",
    "atelier-forest-dark",
    "atelier-forest-light",
    "atelier-heath-dark",
    "atelier-heath-light",
    "atelier-lakeside-dark",
    "atelier-lakeside-light",
    "atelier-plateau-dark",
    "atelier-plateau-light",
    "atelier-savanna-dark",
    "atelier-savanna-light",
    "atelier-seaside-dark",
    "atelier-seaside-light",
    "atelier-sulphurpool-dark",
    "atelier-sulphurpool-light",
    "atom-one-dark",
    "atom-one-light",
    "codepen-embed",
    "color-brewer",
    "darcula",
    "dark",
    "default",
    "docco",
    "dracula",
    "far",
    "foundation",
    "github-gist",
    "github",
    "gml",
    "googlecode",
    "grayscale",
    "gruvbox-dark",
    "gruvbox-light",
    "hopscotch",
    "hybrid",
    "idea",
    "ir-black",
    "isbl-editor-dark",
    "isbl-editor-light",
    "kimbie.dark",
    "kimbie.light",
    "lightfair",
    "lioshi",
    "magula",
    "mono-blue",
    "monokai-sublime",
    "monokai",
    "night-owl",
    "nord",
    "obsidian",
    "ocean",
    "paraiso-dark",
    "paraiso-light",
    "purebasic",
    "qtcreator_dark",
    "qtcreator_light",
    "railscasts",
    "rainbow",
    "routeros",
    "shades-of-purple",
    "solarized-dark",
    "solarized-light",
    "srcery",
    "stackoverflow-dark",
    "stackoverflow-light",
    "sunburst",
    "tomorrow-night-blue",
    "tomorrow-night-bright",
    "tomorrow-night-eighties",
    "tomorrow-night",
    "tomorrow",
    "vs",
    "vs2015",
    "xcode",
    "xt256",
    "zenburn",
  ];
  const selectedIndex = data.indexOf(storage.theme());

  $ui.push({
    props: {
      title: $l10n("THEME")
    },
    views: [
      {
        type: "list",
        props: {
          data: data.map(theme => {
            return theme.replace("_", "-");
          })
        },
        layout: $layout.fill,
        events: {
          ready: sender => {
            helper.scrollToIndex(sender, selectedIndex);
          },
          forEachItem: (item, indexPath) => {
            helper.selectItem(item, indexPath, selectedIndex);
          },
          didSelect: (sender, indexPath) => {
            const theme = data[indexPath.row];
            const title = theme.replace("_", "-");
            preview.open({"theme": theme}, title, () => {
              storage.setTheme(theme);
              callback();
            });
          }
        }
      }
    ]
  });
}
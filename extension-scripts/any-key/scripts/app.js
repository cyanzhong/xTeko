const utility = require("./utility");
const arrayHelper = require("./array-helper");
const colors = require("./colors");
const dataManager = require("./data-manager");
const editor = require("./plugin-editor");
const picker = require("./plugin-picker");
const views = require("./views");
var plugins = dataManager.loadPlugins();

exports.render = () => {
  
  let insets = {"top": 6, "left": 6, "bottom": 6, "right": 6};
  let image = utility.loadImage("assets/btn-rect.png");
  let btnImage = utility.imageWithInsets(image, insets);

  let navButtons = [
    {"image": utility.imageNamed("bar-item-add"), "handler": addPlugin},
    {"image": utility.imageNamed("bar-item-info"), "handler": showReadme}
  ];

  let template = [
    {
      type: "image",
      props: {
        id: "image",
        image: btnImage,
        bgcolor: colors.clear,
        contentMode: $contentMode.scaleToFill
      },
      layout: $layout.fill
    },
    {
      type: "image",
      props: {
        id: "icon",
        bgcolor: colors.clear,
      },
      layout: (make, view) => {
        make.left.equalTo(10);
        make.centerY.equalTo(view.super);
        make.size.equalTo($size(18, 18));
      }
    },
    {
      type: "label",
      props: {
        id: "label",
        font: $font("medium", 16),
        align: $align.center
      },
      layout: $layout.center
    }
  ];

  let footer = $app.env == $env.keyboard ? {
    props: {
      height: 50
    },
    views: [
      views.button(
        $l10n("CONFIGURE"),
        (make, view) => {
          make.center.equalTo(view.super);
          make.size.equalTo($size(150, 32));
        },
        () => $app.openURL(`jsbox://run?name=${encodeURIComponent($addin.current.name)}`)
      )
    ]
  } : null;

  let events = {
    ready: reloadPlugins,
    didSelect: (sender, indexPath) => {
      $device.taptic(0);
      let index = indexPath.item;
      if ($app.env === $env.app) {
        showMenu(index);
      } else {
        runPlugin(plugins[index]);
      }
    },
    reorderMoved: (from, to) => {
      arrayHelper.move(plugins, from.item, to.item);
    },
    reorderFinished: savePlugins
  };

  $ui.render({
    props: {
      navButtons: navButtons
    },
    views: [
      {
        type: "matrix",
        props: {
          id: "main-matrix",
          bgcolor: $color("#cfd2d8"),
          columns: 2, itemHeight: 44, spacing: 8,
          reorder: true,
          template: template,
          footer: footer
        },
        layout: $layout.fill,
        events: events
      }
    ]
  });
};

function showReadme() {
  let readme = require("./readme");
  readme.show();
}

async function addPlugin() {
  let items = [$l10n("CUSTOMIZE"), $l10n("BUILTIN_PLUGINS")];
  let {index} = await $ui.menu(items);
  let completion = plugin => savePlugin(plugin, -1);
  if (index === 0) {
    editor.show(null, completion);
  } else {
    picker.show(completion);
  }
}

async function showMenu(index) {
  let items = [
    $l10n("RUN"),
    $l10n("EDIT"),
    $l10n("DELETE"),
  ];

  let handlers = [
    () => runPlugin(plugins[index]),
    () => editPlugin(index),
    () => deletePlugin(index),
  ];

  const selected = await $ui.menu(items);
  if (selected) {
    handlers[selected.index]();
  }
}

function runPlugin(plugin) {
  let content = utility.loadPlugin(plugin);
  let script = `(async() => {\n${content}\n})()`;
  $addin.eval(script);
}

function editPlugin(index) {
  let plugin = plugins[index];
  editor.show(plugin, plugin => savePlugin(plugin, index));
}

async function deletePlugin(index) {
  
  let actions = [$l10n("OK"), $l10n("CANCEL")];
  
  let option = await $ui.alert({
    title: `${$l10n("DELETE")} "${plugins[index].name}"`,
    actions: actions
  });

  if (option && option.index === 0) {
    $("main-matrix").delete(index);
    arrayHelper.remove(plugins, index);
    savePlugins();
  }
}

function savePlugin(plugin, index) {
  if (index < 0) {
    plugins.unshift(plugin);
  } else {
    plugins[index] = plugin;
  }
  reloadPlugins();
  savePlugins();
}

function savePlugins() {
  dataManager.savePlugins(plugins);
}

function reloadPlugins() {
  $("main-matrix").data = plugins.map(item => {
    return {
      icon: {
        icon: utility.loadIcon(item.icon)
      },
      label: {
        text: item.name
      }
    }
  });
}
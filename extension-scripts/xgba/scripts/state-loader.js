const utility = require("./utility");
const moment = require("moment");
var context = {};

exports.open = options => {

  let {path, dumpHandler, loadedHandler} = options;
  let folder = `www/states/${utility.hash(path)}`;
  $file.mkdir(folder);
  var files = [];

  context.folder = folder;
  context.dumpHandler = dumpHandler;
  context.loadedHandler = loadedHandler;

  let template = {
    views: [
      {
        type: "view",
        props: {
          bgcolor: $color("#eef1f1")
        },
        layout: $layout.fill
      },
      {
        type: "label",
        props: {
          id: "name",
          align: $align.center,
          font: $font("medium", 17)
        },
        layout: (make, view) => {
          make.bottom.equalTo(0);
          make.left.right.inset(12);
          make.height.equalTo(28);
        }
      },
      {
        type: "image",
        props: {
          id: "image"
        },
        layout: (make, view) => {
          make.left.top.right.equalTo(0);
          make.bottom.inset(28);
        }
      }
    ] 
  }

  $ui.push({
    props: {
      title: utility.removeExtension(path),
      navButtons: [
        {
          icon: "104",
          handler: newFile
        }
      ]
    },
    views: [
      {
        type: "matrix",
        props: {
          id: "states",
          itemHeight: 160,
          columns: 2,
          spacing: 12,
          template: template
        },
        layout: $layout.fill,
        events: {
          ready: reloadFiles,
          didSelect: selectItem
        }
      }
    ]
  });
}

function newFile() {
  let folder = context.folder;
  let dumpHandler = context.dumpHandler;
  let title = moment().format('YYYY-MM-DD HH:mm:ss');

  dumpHandler(state => {
    if (state == null) {
      return;
    }

    let file = $data({"string": JSON.stringify(state.data)});
    let image = $data({"base64": state.image});

    $file.mkdir(`${folder}/${title}`);

    $file.write({
      data: file,
      path: `${folder}/${title}/data.json`
    });

    $file.write({
      data: image,
      path: `${folder}/${title}/image.png`
    });

    files.unshift(title);
    $("states").insert({
      value: mapFile(title),
      index: 0
    });

    $device.taptic(1);
  });
}

function reloadFiles() {
  let folder = context.folder;
  files = $file.list(folder).sort().reverse();
  $("states").data = files.map(file => mapFile(file));
}

async function selectItem(sender, indexPath) {

  function deleteItem() {
    let folder = `${context.folder}/${files[indexPath.row]}`;
    $file.delete(folder);

    files.splice(indexPath.row, 1);
    sender.delete(indexPath);
  }

  let options = [
    {
      title: $l10n("LOAD"),
      handler: () => {
        let folder = context.folder;
        let path = `${folder}/${files[indexPath.row]}/data.json`;
        path = path.replace("www/states/", "");
        let handler = context.loadedHandler;
        handler(path);
      }
    },
    {
      title: $l10n("OVERWRITE"),
      handler: () => {
        deleteItem();
        newFile();
      }
    },
    {
      title: $l10n("DELETE"),
      handler: deleteItem
    }
  ];

  let {index} = await $ui.menu(options.map(option => option.title));
  options[index].handler();
}

function mapFile(file) {
  return {
    "name": {
      "text": file
    },
    "image": {
      "src": `${context.folder}/${file}/image.png`
    }
  };
}
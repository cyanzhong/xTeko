const dataManager = require("./data-manager");
const utility = require("./utility");
const arrayHelper = require("./array-helper");

// Load all notes
var notes = dataManager.loadNotes();

// Save image from share sheet
let image = $context.image;
if (image) {
  (async() => {
    await $wait(0.5);
    addNote(image);
  })();
}

// Build views
exports.render = () => {

  let navButtons = [
    {"image": utility.imageNamed("bar-item-add"), "handler": loadImage},
    {"image": utility.imageNamed("bar-item-info"), "handler": showReadme}
  ];

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
          id: "note-label",
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
          id: "thumb-image"
        },
        layout: (make, view) => {
          make.left.top.right.equalTo(0);
          make.bottom.inset(28);
        }
      }
    ] 
  }

  $ui.render({
    props: {
      title: "CamNotes",
      navButtons: navButtons
    },
    views: [
      {
        type: "input",
        props: {
          id: "search-bar",
          placeholder: $l10n("SEARCH")
        },
        layout: (make, view) => {
          make.left.top.right.inset(12);
          make.height.equalTo(36);
        },
        events: {
          changed: sender => searchNotes(sender.text),
          returned: sender => sender.blur()
        }
      },
      {
        type: "matrix",
        props: {
          itemHeight: 150,
          columns: 2,
          spacing: 12,
          reorder: true,
          template: template
        },
        layout: (make, view) => {
          make.left.bottom.right.equalTo(0);
          make.top.equalTo(48);
        },
        events: {
          ready: reloadNotes,
          didSelect: (sender, indexPath) => openNote(indexPath),
          reorderMoved: (from, to) => {
            arrayHelper.move(notes, from.item, to.item);
          },
          reorderFinished: saveNotes
        }
      }
    ]
  });
};

async function loadImage() {

  let options = [
    $l10n("TAKE_A_PHOTO"),
    $l10n("FROM_PHOTO_LIBRARY")
  ];

  let {index} = await $ui.menu(options);
  let result = null;

  if (index === 0) {
    result = await $photo.take();
  } else {
    result = await $photo.pick();
  }

  if (result.status) {
    addNote(result.image);
  }
}

async function addNote(image) {
  let options = {
    placeholder: $l10n("ADD_NOTES")
  };
  let text = await $input.text(options);
  makeNote(image, text || "");
}

async function makeNote(image, text) {

  // Create filename
  let filename = `${utility.makeHash()}.png`;

  // Create thumbnail
  let thumbnail = utility.makeThumbnail(image);

  // Make sure folders are available
  utility.makeFolder("images/thumbnails");

  // Save files
  $file.write({"data": image.jpg(0.8), path: `images/${filename}`});
  $file.write({"data": thumbnail.jpg(0.8), path: `images/thumbnails/${filename}`});

  // Create note
  let note = {"text": text, "image": filename};
  notes.unshift(note);

  // Insert
  $("matrix").insert({
    value: mapNote(note),
    index: 0
  });

  // Save
  saveNotes();
}

function openNote(indexPath) {

  let index = indexPath.item;
  let note = notes[index];
  let detail = require("./detail");

  detail.show(note, {
    updated: note => {
      notes[index] = note;
      saveNotes();
      reloadNotes();
    },
    deleted: () => {
      // Remove from array
      arrayHelper.remove(notes, index);
      // Delete files
      $file.delete(`images/${note.image}`);
      $file.delete(`images/thumbnails/${note.image}`);
      // Reload
      saveNotes();
      reloadNotes();
    }
  });
}

function searchNotes(text) {
  let allNotes = dataManager.loadNotes();
  if (text == null || text.length == 0) {
    notes = allNotes;
  } else {
    notes = allNotes.filter(note => note.text.includes(text));
  }
  reloadNotes();
}

function saveNotes() {
  dataManager.saveNotes(notes);
}

function reloadNotes() {
  $("matrix").data = notes.map(note => mapNote(note));
}

function mapNote(note) {
  return {
    "note-label": {
      "text": note.text
    },
    "thumb-image": {
      "image": utility.loadThumnail(note)
    }
  };
}

function showReadme() {
  const readme = require("./readme");
  readme.show();
}
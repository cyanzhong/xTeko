const storage = require("./storage");

const SECTIONS = {
  GENERAL: 0,
  WEBVIEW: 1,
}

const GENERAL_ROWS = {
  PORT: 0,
  OPEN_WITH: 1,
  INDEX_FILE: 2,
}

const WEBVIEW_ROWS = {
  SHOW_TOOLBAR: 0,
  SHOW_PROGRESS: 1,
  FULL_SCREEN_MODE: 2,
  CLIPS_TO_SAFE_AREA: 3,
  DISABLE_SCROLLING: 4,
  USER_AGENT: 5,
}

exports.open = () => {
  $ui.push({
    props: {
      title: $l10n("SETTINGS")
    },
    views: [
      {
        type: "list",
        props: {
          id: "setting-list",
          stickyHeader: false,
          template: [
            {
              type: "label",
              props: {
                id: "title"
              },
              layout: (make, view) => {
                make.left.right.inset(15);
                make.centerY.equalTo(view.super);
              }
            },
            {
              type: "label",
              props: {
                id: "subtitle",
                align: $align.right
              },
              layout: (make, view) => {
                make.right.inset(15);
                make.centerY.equalTo(view.super);
              }
            },
            {
              type: "tab",
              props: {
                id: "tab"
              },
              layout: (make, view) => {
                make.right.inset(15);
                make.centerY.equalTo(view.super);
              },
              events: {
                changed: sender => {
                  if (sender.info && sender.info.id === "browser-index") {
                    storage.setBrowserIndex(sender.index);
                  }
                  $delay(0.3, reloadData);
                }
              }
            },
            {
              type: "switch",
              props: {
                id: "switch"
              },
              layout: (make, view) => {
                make.right.inset(15);
                make.centerY.equalTo(view.super);
              },
              events: {
                changed: sender => {
                  const id = sender.info ? sender.info.id : null;
                  const value = sender.on;
                  if (id === "show-toolbar") {
                    storage.setShowToolbar(value);
                  } else if (id === "show-progress") {
                    storage.setShowProgress(value);
                  } else if (id === "full-screen") {
                    storage.setFullScreen(value);
                  } else if (id === "safe-area") {
                    storage.setSafeArea(value);
                  } else if (id === "disable-scrolling") {
                    storage.setDisableScrolling(value);
                  }
                  $delay(0.3, reloadData);
                }
              }
            }
          ]
        },
        layout: $layout.fill,
        events: {
          didSelect: (sender, indexPath) => {
            const section = indexPath.section;
            const row = indexPath.row;
            if (section === SECTIONS.GENERAL) {
              if (row === GENERAL_ROWS.PORT) {
                setPort();
              } else if (row === GENERAL_ROWS.INDEX_FILE) {
                setIndexPage();
              }
            } else if (section === SECTIONS.WEBVIEW) {
              if (row === WEBVIEW_ROWS.USER_AGENT) {
                setUserAgent();
              }
            }
          }
        }
      }
    ]
  });

  reloadData();
}

async function setPort() {
  const port = await $input.text({
    type: $kbType.number,
    text: `${storage.port()}`
  });
  
  if (port === 0 || port >= 65535) {
    return;
  }

  storage.setPort(parseInt(port));
  reloadData();

  const server = require("./server");
  server.reset();
}

async function setIndexPage() {
  const indexPage = await $input.text({
    type: $kbType.ascii,
    text: storage.indexPage()
  });

  if (indexPage == null || indexPage.length == 0) {
    return;
  }

  storage.setIndexPage(indexPage);
  reloadData();
}

function setUserAgent() {
  const userAgent = require("./user-agent");
  userAgent.open();
}

function reloadData() {

  const switchCell = (title, value, id) => {
    return {
      title: {
        text: title
      },
      subtitle: {
        hidden: true
      },
      tab: {
        hidden: true
      },
      switch: {
        hidden: false,
        on: value,
        info: {
          id: id
        }
      }
    };
  }

  $("setting-list").data = [
    {
      title: $l10n("GENERAL"),
      rows: [
        {
          title: {
            text: $l10n("SERVER_PORT")
          },
          subtitle: {
            hidden: false,
            text: `${storage.port()}`
          },
          tab: {
            hidden: true
          },
          switch: {
            hidden: true
          }
        },
        {
          title: {
            text: $l10n("OPEN_WEBSITE_WITH")
          },
          subtitle: {
            hidden: true
          },
          tab: {
            hidden: false,
            items: [$l10n("SAFARI"), $l10n("WEBVIEW")],
            index: storage.browserIndex(),
            info: {
              id: "browser-index"
            }
          },
          switch: {
            hidden: true
          }
        },
        {
          title: {
            text: $l10n("INDEX_FILE")
          },
          subtitle: {
            hidden: false,
            text: storage.indexPage()
          },
          tab: {
            hidden: true
          },
          switch: {
            hidden: true
          }
        }
      ]
    },
    {
      title: $l10n("WEBVIEW"),
      rows: [
        switchCell($l10n("SHOW_TOOLBAR"), storage.showToolbar(), "show-toolbar"),
        switchCell($l10n("SHOW_PROGRESS"), storage.showProgress(), "show-progress"),
        switchCell($l10n("FULL_SCREEN_MODE"), storage.fullScreen(), "full-screen"),
        switchCell($l10n("CLIPS_TO_SAFE_AREA"), storage.safeArea(), "safe-area"),
        switchCell($l10n("DISABLE_SCROLLING"), storage.disableScrolling(), "disable-scrolling"),
        {
          title: {
            text: $l10n("USER_AGENT")
          },
          subtitle: {
            hidden: true
          },
          tab: {
            hidden: true
          },
          switch: {
            hidden: true
          }
        }
      ]
    }
  ];
}
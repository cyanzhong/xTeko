$app.theme = "auto";

// Prepare data
const data = [
  {
    name: "$device",
    page: {
      views: [
        {
          type: "list",
          props: {
            data: ["info", "taptic"]
          },
          layout: $layout.fill,
          events: {
            didSelect(tableView, {row}) {
              switch (row) {
                case 0:
                  $ui.alert({
                    title: "Info",
                    message: $device.info
                  });
                  break;
                case 1:
                  $device.taptic(0);
                  break;
                default:
                  break;
              }
            }
          }
        }
      ]
    }
  },
  {
    name: "$app",
    page: {
      views: [
        {
          type: "list",
          props: {
            data: ["info", "close", "openURL", "openBrowser", "openExtension"]
          },
          layout: $layout.fill,
          events: {
            didSelect(tableView, {row}) {
              switch (row) {
                case 0:
                  $ui.alert({
                    title: "Info",
                    message: $app.info
                  });
                  break;
                case 1:
                  $app.close();
                  break;
                case 2:
                  $app.openURL("weixin://");
                  break;
                case 3:
                  $app.openBrowser({
                    type: 10000,
                    url: "http://apple.com/cn"
                  });
                  break;
                case 4:
                  $ui.action({
                    actions: $file.extensions.map(file => ({
                      title: file,

                      handler() {
                        $app.openExtension(file);
                      }
                    }))
                  });
                  break;
                default:
                  break;
              }
            }
          }
        }
      ]
    }
  },
  {
    name: "$clipboard",
    page: {
      views: [
        {
          type: "list",
          props: {
            data: [
              "items",
              "text",
              "links",
              "clear"
            ]
          },
          layout: $layout.fill,
          events: {
            didSelect(tableView, indexPath, title) {
              let message = "";
              if (title === "items") {
                message = $clipboard.items;
              } else if (title === "text") {
                message = $clipboard.text;
              } else if (title === "links") {
                message = $clipboard.links;
              } else if (title === "clear") {
                $clipboard.clear();
                message = "Clipboard cleared";
              }
              $ui.alert({
                title: "Clipboard",
                message
              });
            }
          }
        }
      ]
    }
  },
  {
    name: "$http",
    page: {
      views: [
        {
          type: "list",
          props: {
            data: [
              "status",
              "get",
              "post",
              "request",
              "download",
              "upload",
              "shorten",
              "lengthen"
            ]
          },
          layout: $layout.fill,
          events: {
            didSelect(tableView, indexPath, title) {
              if (title === "status") {
                $ui.alert({
                  title: "Network",
                  message: `Status: ${$http.status}`
                });
              } else if (title === "get" || title === "post") {
                $http.get({
                  url: "http://news-at.zhihu.com/api/4/news/latest",
                  handler(resp) {
                    $ui.alert({
                      title: "Response",
                      message: resp.data
                    });
                  }
                });
              } else if (title === "request") {
                $http.request({
                  method: "get",
                  url: "http://news-at.zhihu.com/api/4/news/latest",
                  handler(resp) {
                    $ui.alert({
                      title: "Response",
                      message: resp.data
                    });
                  }
                });
              } else if (title === "download") {
                $http.download({
                  url:
                    "https://images.apple.com/v/ios/what-is/b/images/performance_large.jpg",
                  handler(resp) {
                    $share.sheet(resp.data);
                  }
                });
              } else if (title === "shorten") {
                $http.shorten({
                  url: "https://apple.com",
                  handler(result) {
                    $ui.alert({
                      title: "Shorten",
                      message: result
                    });
                  }
                });
              } else if (title === "lengthen") {
                $http.lengthen({
                  url: "http://t.cn/hYzRy",
                  handler(result) {
                    $ui.alert({
                      title: "Lengthen",
                      message: result
                    });
                  }
                });
              }
            }
          }
        }
      ]
    }
  },
  {
    name: "$file",
    page: {
      views: [
        {
          type: "list",
          props: {
            data: [
              "write",
              "read",
              "delete",
              "list",
              "copy",
              "move",
              "mkdir",
              "exists",
              "isDirectory"
            ]
          },
          layout: $layout.fill,
          events: {
            didSelect(tableView, indexPath, title) {
              function showResult(result) {
                $ui.alert({
                  title: "Result",
                  message: `${result}`
                });
              }
              if (title === "write") {
                var result = $file.write({
                  data: $data({
                    string: "Hello, World!"
                  }),
                  path: "sample.txt"
                });
                showResult(result);
              } else if (title === "read") {
                showResult($file.read("sample.txt").string);
              } else if (title === "delete") {
                showResult($file.delete("sample.txt"));
              } else if (title === "list") {
                showResult($file.list("/"));
              } else if (title === "copy") {
                $file.mkdir("folder");
                var result = $file.copy({
                  src: "sample.txt",
                  dst: "folder/sample.txt"
                });
                showResult(result);
              } else if (title === "move") {
                var result = $file.move({
                  src: "sample.txt",
                  dst: "folder/sample.txt"
                });
                showResult(result);
              } else if (title === "mkdir") {
                showResult($file.mkdir("folder"));
              } else if (title === "exists") {
                showResult($file.exists("folder"));
              } else if (title === "isDirectory") {
                showResult($file.isDirectory("folder"));
              }
            }
          }
        }
      ]
    }
  },
  {
    name: "$photo",
    page: {
      views: [
        {
          type: "list",
          props: {
            data: ["take", "pick", "prompt", "save", "fetch", "edit"]
          },
          layout: $layout.fill,
          events: {
            didSelect(tableView, {row}) {
              function showImage(image) {
                if (image) {
                  $ui.push({
                    title: "Image",
                    views: [
                      {
                        type: "image",
                        props: {
                          image
                        },
                        layout: $layout.fill
                      }
                    ]
                  });
                }
              }
              switch (row) {
                case 0:
                  $photo.take({
                    device: $imgPicker.device.front,
                    handler({image}) {
                      showImage(image);
                    }
                  });
                  break;
                case 1:
                  $photo.pick({
                    handler({image}) {
                      showImage(image);
                    }
                  });
                  break;
                case 2:
                  $photo.prompt({
                    handler({image}) {
                      showImage(image);
                    }
                  });
                  break;
                case 3:
                  $http.download({
                    url:
                      "https://images.apple.com/v/ios/what-is/b/images/performance_large.jpg",
                    handler(resp) {
                      if (resp.data) {
                        $photo.save({
                          data: resp.data,
                          handler(result) {
                            $ui.alert({
                              title: "Save",
                              message: `Result: ${result}`
                            });
                          }
                        });
                      }
                    }
                  });
                  break;
                case 4:
                  $photo.fetch({
                    count: 1,
                    subType: $assetMedia.subType.screenshot,
                    handler(results) {
                      showImage(results[0]);
                    }
                  });
                  break;
                case 5:
                  $photo.fetch({
                    count: 1,
                    handler(results) {
                      const image = results[0];
                      if (image) {
                        $photo.edit({
                          image,
                          handler(edited) {
                            $photo.save({ image: edited });
                          }
                        });
                      }
                    }
                  });
                default:
                  break;
              }
            }
          }
        }
      ]
    }
  },
  {
    name: "$qrcode",
    page: {
      views: [
        {
          type: "list",
          props: {
            data: ["encode", "decode", "scan"]
          },
          layout: $layout.fill,
          events: {
            didSelect(tableView, indexPath, title) {
              if (title === "encode") {
                const image = $qrcode.encode("https://apple.com");
                if (image) {
                  $ui.push({
                    title: "Image",
                    views: [
                      {
                        type: "image",
                        props: {
                          image
                        },
                        layout: $layout.center
                      }
                    ]
                  });
                }
              } else if (title === "decode") {
                $ui.loading(true);
                $http.download({
                  url:
                    "https://raw.githubusercontent.com/cyanzhong/cyanzhong.github.io/master/alipay.png",
                  handler(resp) {
                    $ui.loading(false);
                    $ui.alert({
                      title: "Decoded",
                      message: $qrcode.decode(resp.data.image)
                    });
                  }
                });
              } else if (title === "scan") {
                $qrcode.scan(string => {
                  $ui.alert({
                    title: "Scanned",
                    message: string
                  });
                });
              }
            }
          }
        }
      ]
    }
  },
  {
    name: "$cache",
    page: {
      views: [
        {
          type: "list",
          props: {
            data: ["set", "get", "remove", "clear"]
          },
          layout: $layout.fill,
          events: {
            didSelect(tableView, indexPath, title) {
              if (title === "set") {
                $cache.set("demo-cache", {
                  a: [1, 2, 3],
                  b: "1, 2, 3"
                });
              } else if (title === "get") {
                $ui.alert({
                  title: "Cache",
                  message: $cache.get("demo-cache")
                });
              } else if (title === "remove") {
                $cache.remove("demo-cache");
              } else if (title === "clear") {
                $cache.clear();
              }
            }
          }
        }
      ]
    }
  },
  {
    name: "$thread",
    page: {
      views: [
        {
          type: "list",
          props: {
            data: ["background", "main"]
          },
          layout: $layout.fill,
          events: {
            didSelect(tableView, {row}) {
              if (row == 0) {
                $thread.background({
                  handler() {}
                });
              } else if (row == 1) {
                $thread.main({
                  delay: 1.5,
                  handler() {
                    $ui.alert({
                      title: "Hello, World!"
                    });
                  }
                });
              }
            }
          }
        }
      ]
    }
  },
  {
    name: "$share",
    page: {
      views: [
        {
          type: "list",
          props: {
            data: ["sheet", "wechat", "qq", "universal"]
          },
          layout: $layout.fill,
          events: {
            didSelect(tableView, indexPath, title) {
              const image = $qrcode.encode("https://apple.com");
              if (title === "sheet") {
                $share.sheet(image);
              } else if (title === "wechat") {
                $share.wechat(image);
              } else if (title === "qq") {
                $share.qq(image);
              } else if (title === "universal") {
                $share.universal(image);
              }
            }
          }
        }
      ]
    }
  },
  {
    name: "$push",
    page: {
      views: [
        {
          type: "list",
          props: {
            data: ["schedule", "cancel", "clear"]
          },
          layout: $layout.fill,
          events: {
            didSelect(tableView, {row}, title) {
              if (row == 0) {
                $push.schedule({
                  title: "Push",
                  body: "Hello, World!"
                });
              } else if (row == 1) {
                $push.cancel({
                  title: "Push",
                  body: "Hello, World!"
                });
              } else if (row == 2) {
                $push.clear();
              }
            }
          }
        }
      ]
    }
  },
  {
    name: "$location",
    page: {
      views: [
        {
          type: "list",
          props: {
            data: ["startUpdates", "trackHeading", "stopUpdates"]
          },
          layout: $layout.fill,
          events: {
            didSelect(tableView, {row}) {
              if (row == 0) {
                $location.startUpdates({
                  once: true,
                  handler(location) {
                    $ui.push({
                      props: {
                        title: "Map"
                      },
                      views: [
                        {
                          type: "map",
                          props: {
                            location
                          },
                          layout: $layout.fill
                        }
                      ]
                    });
                  }
                });
              } else if (row == 1) {
                $location.trackHeading({
                  once: true
                });
              } else if (row == 2) {
                $location.stopUpdates();
              }
            }
          }
        }
      ]
    }
  },
  {
    name: "$system",
    page: {
      views: [
        {
          type: "list",
          props: {
            data: ["call", "sms", "mailto", "facetime", "brightness"]
          },
          layout: $layout.fill,
          events: {
            didSelect(tableView, indexPath, title) {
              if (title === "call") {
                $system.call("10010");
              } else if (title === "sms") {
                $system.sms("10010");
              } else if (title === "mailto") {
                $system.mailto("log.e@qq.com");
              } else if (title === "facetime") {
                $system.facetime("10010");
              } else if (title === "brightness") {
                $system.brightness = 0.2;
              }
            }
          }
        }
      ]
    }
  },
  {
    name: "$calendar",
    page: {
      views: [
        {
          type: "list",
          props: {
            data: ["fetch", "create", "delete"]
          },
          layout: $layout.fill,
          events: {
            didSelect(tableView, indexPath, title) {
              if (title === "fetch") {
                $calendar.fetch({
                  startDate: new Date(),
                  hours: 24 * 3,
                  handler({events}) {
                    $ui.alert({
                      title: "Calendar",
                      message: events.map(item => item.title)
                    });
                  }
                });
              } else if (title === "create") {
                $calendar.create({
                  title: "New calendar event",
                  startDate: new Date(),
                  hours: 1,
                  handler(resp) {
                    $ui.alert({
                      title: "Calendar",
                      message: resp
                    });
                  }
                });
              } else if (title === "delete") {
                $calendar.fetch({
                  startDate: new Date(),
                  hours: 24 * 10,
                  handler({events}) {
                    $calendar.delete({
                      event: events[0]
                    });
                  }
                });
              }
            }
          }
        }
      ]
    }
  },
  {
    name: "$reminder",
    page: {
      views: [
        {
          type: "list",
          props: {
            data: ["fetch", "create", "delete"]
          },
          layout: $layout.fill,
          events: {
            didSelect(tableView, indexPath, title) {
              if (title === "fetch") {
                $reminder.fetch({
                  handler({events}) {
                    $ui.alert({
                      title: "Reminder",
                      message: events.map(item => item.title)
                    });
                  }
                });
              } else if (title === "create") {
                $reminder.create({
                  title: "New reminder event",
                  alarmDate: new Date(),
                  handler(resp) {
                    $ui.alert({
                      title: "Reminder",
                      message: resp
                    });
                  }
                });
              } else if (title === "delete") {
                $reminder.fetch({
                  handler({events}) {
                    $reminder.delete({
                      event: events[0]
                    });
                  }
                });
              }
            }
          }
        }
      ]
    }
  },
  {
    name: "$contact",
    page: {
      views: [
        {
          type: "list",
          props: {
            data: ["pick", "fetch", "create", "delete"]
          },
          layout: $layout.fill,
          events: {
            didSelect(tableView, indexPath, title) {
              if (title === "pick") {
                $contact.pick({
                  multi: false,
                  handler({familyName}) {
                    $thread.main({
                      delay: 0.5,
                      handler() {
                        $ui.alert(familyName);
                      }
                    });
                  }
                });
              } else if (title === "fetch") {
                $contact.fetch({
                  key: "Hello, World!",
                  handler(resp) {
                    $ui.alert({
                      title: "Contact",
                      message: resp.map(({givenName, familyName}) => `${givenName} ${familyName}`)
                    });
                  }
                });
              } else if (title === "create") {
                $contact.create({
                  givenName: "Hello, World!",
                  familyName: "Engineer",
                  phoneNumbers: {
                    Home: 18888888888
                  }
                });
              } else if (title === "delete") {
                $contact.fetch({
                  key: "Hello, World!",
                  handler(resp) {
                    $contact.delete({
                      identifiers: resp.map(({identifier}) => identifier)
                    });
                  }
                });
              }
            }
          }
        }
      ]
    }
  },
  {
    name: "$motion",
    page: {
      views: [
        {
          type: "list",
          props: {
            header: {
              type: "label",
              props: {
                height: 80,
                align: $align.center,
                text: "Hey!"
              }
            },
            data: ["startUpdates", "stopUpdates"]
          },
          layout: $layout.fill,
          events: {
            didSelect({header}, {row}) {
              if (row == 0) {
                $motion.startUpdates({
                  handler(resp) {
                    header.text = JSON.stringify(resp);
                  }
                });
              } else {
                $motion.stopUpdates();
              }
            }
          }
        }
      ]
    }
  },
  {
    name: "$spotlight",
    page: {
      views: [
        {
          type: "list",
          props: {
            data: ["index", "delete", "clear"]
          },
          layout: $layout.fill,
          events: {
            didSelect(tableView, indexPath, title) {
              if (title === "index") {
                $spotlight.index({
                  items: ["AAAAA", "BBBBB", "CCCCC"]
                });
              } else if (title === "delete") {
                $spotlight.delete({
                  items: ["AAAAA", "BBBBB", "CCCCC"]
                });
              } else if (title === "clear") {
                $spotlight.clear();
              }
            }
          }
        }
      ]
    }
  },
  {
    name: "$input",
    page: {
      views: [
        {
          type: "list",
          props: {
            data: ["text", "ascii", "number"]
          },
          layout: $layout.fill,
          events: {
            didSelect(tableView, indexPath, title) {
              if (title === "text") {
                $input.text({
                  handler(text) {
                    $ui.toast(text);
                  }
                });
              } else if (title === "ascii") {
                $input.text({
                  type: $kbType.ascii,
                  handler(text) {
                    $ui.toast(text);
                  }
                });
              } else if (title === "number") {
                $input.text({
                  type: $kbType.number,
                  handler(text) {
                    $ui.toast(text);
                  }
                });
              }
            }
          }
        }
      ]
    }
  },
  {
    name: "$text",
    page: {
      views: [
        {
          type: "list",
          props: {
            data: ["tokenize", "lookup", "speech", "base64Encode"]
          },
          layout: $layout.fill,
          events: {
            didSelect(tableView, indexPath, title) {
              if (title === "tokenize") {
                $text.tokenize({
                  text: "我能吞下玻璃而不伤身体",
                  handler(results) {
                    $ui.alert({
                      title: "Tokenize",
                      message: results
                    });
                  }
                });
              } else if (title === "lookup") {
                $text.lookup("Hello");
              } else if (title === "speech") {
                $text.speech({
                  text: "Hello, World!",
                  rate: 0.5
                });
              } else if (title === "base64Encode") {
                $ui.alert({
                  title: "Base64Encode",
                  message: $text.base64Encode("Hello, World!")
                });
              }
            }
          }
        }
      ]
    }
  },
  {
    name: "$pick",
    page: {
      views: [
        {
          type: "list",
          props: {
            data: ["date", "data"]
          },
          layout: $layout.fill,
          events: {
            didSelect(tableView, {row}) {
              if (row == 0) {
                $pick.date({
                  handler(date) {
                    $ui.toast(date);
                  }
                });
              } else {
                $pick.data({
                  props: {
                    items: [["1", "2", "3"], ["A", "B", "C"], ["!", "@", "#"]]
                  },
                  handler(data) {
                    $ui.alert({
                      title: "Data",
                      message: data
                    });
                  }
                });
              }
            }
          }
        }
      ]
    }
  }
];

data.forEach(({page, name}) => {
  page.props = {
    title: name
  };
});

// Prepare view
$ui.render({
  props: {
    title: "API Samples"
  },
  views: [
    {
      type: "list",
      props: {
        id: "main-list"
      },
      layout: $layout.fill,
      events: {
        didSelect(tableView, {row}) {
          $ui.push(data[row].page);
        }
      }
    }
  ]
});

// Render
$("main-list").data = data.map(({name}) => name);
var en = $device.info.language.lastIndexOf("en", 0) === 0
var contacts = $cache.get("contacts") || []

function contactNames() {
  return contacts.map(function(item) { return item.name })
}

function showAllContacts() {
  $ui.menu({
    items: contactNames(),
    handler: function(title, idx) {
      call(contacts[idx])
    }
  })
}
  
function showContactsPicker() {
  $ui.render({
    views: [
      {
        type: "button",
        props: {
          title: en ? "Select Contacts" : "选择联系人"
        },
        layout: function(make) {
          make.left.top.right.inset(10)
          make.height.equalTo(32)
        },
        events: {
          tapped: function(sender) {
            pickContacts()
          }
        }
      },
      {
        type: "list",
        props: {
          data: contactNames(),
          reorder: true,
          actions: [
            {
              title: "delete",
              handler: function(sender, indexPath) {
                deleteContact(indexPath.row)
              }
            }
          ]
        },
        layout: function(make) {
          make.top.equalTo($("button").bottom).offset(10)
          make.left.bottom.right.equalTo(0)
        },
        events: {
          didSelect: function(sender, indexPath) {
            call(contacts[indexPath.row])
          },
          reorderMoved: function(from, to) {
            contacts.move(from.row, to.row)
          },
          reorderFinished: function() {
            $cache.set("contacts", contacts)
          }
        }
      }
    ]
  })
}

function pickContacts() {
  $contact.pick({
    multi: true,
    handler: function(results) {
      var contacts = results.map(function(item) {
        var name = en ? (item.givenName + item.middleName + item.familyName) : (item.familyName + item.givenName + item.middleName)
        return {
          name: name || item.organizationName,
          numbers: item.phoneNumbers.map(function(number) { return number.content })
        }
      })
      insertContacts(contacts)
    }
  })
}

function insertContacts(items) {
  contacts = items.concat(contacts)
  $("list").data = contactNames()
  $cache.set("contacts", contacts)
}

function deleteContact(index) {
  contacts.splice(index, 1)
  $cache.set("contacts", contacts)
}

function call(contact) {
  var numbers = contact.numbers || []
  if (numbers.length > 1) { // Multiple
    $thread.main({
      delay: 0.3,
      handler: function() {
        $ui.menu({
          items: numbers,
          handler: function(title, idx) {
            $system.call(title)
          }
        })
      }
    })
  } else { // Legacy logic
    $system.call(numbers[0] || contact.number)
  }
}

if ($app.env == $env.app) {
  showContactsPicker()
} else {
  showAllContacts()
}

Array.prototype.move = function(from, to) {
  var object = this[from]
  this.splice(from, 1)
  this.splice(to, 0, object)
}
var en = $device.info.language.lastIndexOf("en", 0) === 0
var contacts = $cache.get("contacts") || []

function contactNames() {
  return contacts.map(function(item) { return item.name })
}

function showAllContacts() {
  $ui.menu({
    items: contactNames(),
    handler: function(title, idx) {
      $system.call(contacts[idx].number)
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
        return {
          name: en ? (item.givenName + item.middleName + item.familyName) : (item.familyName + item.givenName + item.middleName),
          number: item.phoneNumbers[0].content
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

if ($app.env == $env.app) {
  showContactsPicker()
} else {
  showAllContacts()
}
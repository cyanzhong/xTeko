//-- Create window --//

$ui.render()

//-- Cell --//

$define({
  type: "TableCell: UITableViewCell"
})

//-- TableView --//

$define({
  type: "TableView: UITableView",
  events: {
    "init": function() {
      self = self.invoke("super.init")
      self.invoke("setTableFooterView", $objc("UIView").invoke("new"))
      self.invoke("registerClass:forCellReuseIdentifier:", $objc("TableCell").invoke("class"), "identifier")
      return self
    }
  }
})

//-- Manager --//

$define({
  type: "Manager: NSObject <UITableViewDelegate, UITableViewDataSource>",
  events: {
    "tableView:numberOfRowsInSection:": function(tableView, section) {
      return 5
    },
    "tableView:cellForRowAtIndexPath:": function(tableView, indexPath) {
      var cell = tableView.invoke("dequeueReusableCellWithIdentifier:forIndexPath:", "identifier", indexPath)
      cell.invoke("textLabel").invoke("setText", "Row: " + indexPath.invoke("row"))
      return cell
    },
    "tableView:didSelectRowAtIndexPath:": function(tableView, indexPath) {
      tableView.invoke("deselectRowAtIndexPath:animated:", indexPath, true)
      var cell = tableView.invoke("cellForRowAtIndexPath:", indexPath)
      var text = cell.invoke("textLabel.text").rawValue()
      $ui.alert("Tapped: " + text)
    },
    "tableView:editActionsForRowAtIndexPath:": function(tableView, indexPath) {
      var handler = $block("void, UITableViewRowAction *, NSIndexPath *", function(action, indexPath) {
        $ui.alert("Action")
      })
      var action = $objc("UITableViewRowAction").invoke("rowActionWithStyle:title:handler:", 1, "Foobar", handler)
      return [action]
    }
  }
})

var window = $ui.window.runtimeValue()
var manager = $objc("Manager").invoke("new")

var table = $objc("TableView").invoke("new")
table.invoke("setFrame", window.invoke("bounds"))
table.invoke("setDelegate", manager)
table.invoke("setDataSource", manager)
window.invoke("addSubview", table)
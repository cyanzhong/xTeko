var date = $objc('NSDate').invoke('dateWithTimeIntervalSince1970', 0)
$objc('NSURLCache').invoke('sharedURLCache').invoke('removeCachedResponsesSinceDate', date)

var types = $objc('NSMutableSet').invoke('set')

types.invoke('addObject', 'WKWebsiteDataTypeDiskCache')
types.invoke('addObject', 'WKWebsiteDataTypeMemoryCache')
types.invoke('addObject', 'WKWebsiteDataTypeOfflineWebApplicationCache')

var handler = $block("void, void", function() {
  $ui.alert("Done")
})

$objc('WKWebsiteDataStore').invoke('defaultDataStore').invoke('removeDataOfTypes:modifiedSince:completionHandler:', types, date, handler)
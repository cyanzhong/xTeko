const rules = 
[
  {
    "title": "Open Tweet",
    "regex": "http(?:s)?://(?:mobile\\.|www\\.|m\\.)?twitter\\.com/(?:@?[a-zA-Z0-9_]{1,15}/status|i/web/status|statuses)/(\\d+).*$",
    "apps": [
      {
        "app": "twitter",
        "format": "twitter://status?id=$1"
      },
      {
        "app": "tweetbot",
        "format": "tweetbot:///status/$1"
      },
      {
        "app": "twitterrific",
        "format": "twitterrific:///tweet?id=$1"
      }
    ]
  },
  {
    "title": "Add Tweet to Collection",
    "regex": "http(?:s)?://(?:mobile\\.|www\\.|m\\.)?twitter\\.com/(?:@?[a-zA-Z0-9_]{1,15}/status|i/web/status|statuses)/(\\d+).*$",
    "apps": [
      {
        "app": "charm",
        "format": "x-charm://collect/$1"
      }
    ]
  },
  {
    "title": "Open Profile",
    "regex": "http(?:s?)://(?:mobile\\.|www\\.|m\\.)?twitter\\.com/(?:@)?(?!search)([a-zA-Z0-9_]{1,15})(?:/with_replies|/following|/followers|/media|/favorites)?/?(\\?.*)?$",
    "apps": [
      {
        "app": "twitter",
        "format": "twitter://user?screen_name=$1"
      },
      {
        "app": "tweetbot",
        "format": "tweetbot:///user_profile/$1"
      },
      {
        "app": "twitterrific",
        "format": "twitterrific:///profile?screen_name=$1"
      }
    ]
  },
  {
    "title": "Open Profile",
    "regex": "http(?:s?)://(?:mobile\\.|www\\.|m\\.)?twitter\\.com/intent/user\\?.*screen_name=?(?:@)?([a-zA-Z0-9_]{1,15}).*$",
    "apps": [
      {
        "app": "twitter",
        "format": "twitter://user?screen_name=$1"
      },
      {
        "app": "tweetbot",
        "format": "tweetbot:///user_profile/$1"
      },
      {
        "app": "twitterrific",
        "format": "twitterrific:///profile?screen_name=$1"
      }
    ]
  },
  {
    "title": "Open Hashtag",
    "regex": "http(?:s?)://(?:mobile\\.|www\\.|m\\.)?twitter\\.com/hashtag/([a-zA-Z0-9_]+).*$",
    "apps": [
      {
        "app": "twitter",
        "format": "twitter://search?query=%23$1"
      },
      {
        "app": "tweetbot",
        "format": "tweetbot:///search?query=%23$1"
      },
      {
        "app": "twitterrific",
        "format": "twitterrific:///search?q=%23$1"
      }
    ]
  },
  {
    "title": "Open Search",
    "regex": "http(?:s)://(?:mobile\\.|www\\.|m\\.)?twitter\\.com/search.*q=([^&]+).*$",
    "apps": [
      {
        "app": "twitter",
        "format": "twitter://search?query=$1"
      },
      {
        "app": "tweetbot",
        "format": "tweetbot:///search?query=$1"
      },
      {
        "app": "twitterrific",
        "format": "twitterrific:///search?q=$1"
      }
    ]
  },
  {
    "title": "Open Moment",
    "regex": "http(?:s?)://(?:mobile\\.|www\\.)?twitter\\.com/i/moments/(\\d+).*$",
    "apps": [
      {
        "app": "twitter",
        "format": "twitter://moment?moment_id=$1"
      }
    ]
  },
  {
    "title": "Open Live Moment",
    "regex": "http(?:s?)://(?:mobile\\.|www\\.|m\\.)?twitter\\.com/i/live/(\\d+).*$",
    "apps": [
      {
        "app": "twitter",
        "format": "twitter://live/timeline/$1"
      }
    ]
  },
  {
    "title": "Open Collection",
    "regex": "http(?:s)://(?:mobile\\.|www\\.|m\\.)?twitter\\.com/(?:@)?([a-zA-Z0-9_]{1,15})/timelines/(\\d+).*?$",
    "apps": [
      {
        "app": "twitter",
        "format": "twitter://custom_timeline?screen_name=$1&timeline_id=$2"
      }
    ]
  },
  {
    "title": "Open Mute Filter",
    "regex": "http(?:s)?://(?:www\\.)?tapbots\\.com.*\\?url=(.*)$",
    "apps": [
      {
        "app": "tweetbot",
        "script": "function process(url, completionHandler) { completionHandler('tweetbot:///' + decodeURIComponent(url.split('tweetbot%3A%2F%2F%2F')[1])) }"
      }
    ]
  },
  {
    "title": "Open Muffle",
    "regex": "http(?:s)?://(?:www\\.)?twitterrific\\.com/ios/muffle(?:/)?\\?add=([^&]*)$",
    "apps": [
      {
        "app": "twitterrific",
        "format": "twitterrific://muffle?add=$1"
      }
    ]
  },
  {
    "title": "Open Post",
    "regex": "http(?:s)?://(?:www\\.)?(?:instagram\\.com|instagr\\.am)/p/([a-zA-Z0-9_\\-\\.]+).*$",
    "apps": [
      {
        "app": "instagram",
        "script": "function process(url, completionHandler) { jsonRequest('https://api.instagram.com/oembed?url=' + url, function(res) { if (res != null) { var mediaIdentifier = res['media_id']; } if (mediaIdentifier != null) { completionHandler('instagram://media?id=' + mediaIdentifier); } else { completionHandler(null); } } ); }"
      }
    ]
  },
  {
    "title": "Open Profile",
    "regex": "http(?:s)?://(?:www\\.)?(?:instagram\\.com|instagr\\.am)/(?!explore)([a-zA-Z0-9_\\.]{1,30})(?:/|/?\\?.*)?$",
    "apps": [
      {
        "app": "instagram",
        "format": "instagram://user?username=$1"
      }
    ]
  },
  {
    "title": "Open Tag",
    "regex": "http(?:s)?://(?:www\\.)?(?:instagram\\.com|instagr\\.am)/(?:explore/)?tags/([a-zA-Z0-9_%]+).*$",
    "apps": [
      {
        "app": "instagram",
        "format": "instagram://tag?name=$1"
      }
    ]
  },
  {
    "title": "Open Location",
    "regex": "http(?:s)?://(?:www\\.)?(?:instagram\\.com|instagr\\.am)/explore/locations/(\\d+).*$",
    "apps": [
      {
        "app": "instagram",
        "format": "instagram://location?id=$1"
      }
    ]
  },
  {
    "title": "Open Event",
    "regex": "http(?:s)?://(?:\\w+\\.)?facebook\\.com/events/(\\d+).*$",
    "apps": [
      {
        "app": "facebook",
        "format": "fb://event?id=$1"
      }
    ]
  },
  {
    "title": "Open Group",
    "regex": "http(?:s)?://(?:\\w+\\.)?facebook\\.com/groups/(?:[^/]+/)?(\\d+).*$",
    "apps": [
      {
        "app": "facebook",
        "format": "fb://group?id=$1"
      }
    ]
  },
  {
    "title": "Open Group",
    "regex": "http(?:s)?://(?:\\w+\\.)?facebook\\.com/groups/(?!\\d+)[^/]+(/(?!\\d+)[^/]*)?$",
    "apps": [
      {
        "app": "facebook",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('.*(fb://group(?:/)?\\\\?id=\\\\d+).*'); var results = regex.exec(res); var match = null; if (results != null && results.length > 1) { match = results[1] }; completionHandler(match); }"
      }
    ]
  },
  {
    "title": "Open Photo",
    "regex": "http(?:s)?://(?:\\w+\\.)?facebook\\.com/(?:photo\\.php.*(?:\\?|&)fbid=|[^/]+/photos/[^/]+/)(\\d+).*?$",
    "apps": [
      {
        "app": "facebook",
        "format": "fb://photo/?id=$1"
      }
    ]
  },
  {
    "title": "View App",
    "regex": "http(?:s)?://apps\\.getpebble\\.com/(?:\\w+/)*application(?:s)?/([:hex:]+)",
    "apps": [
      {
        "app": "pebbletime",
        "format": "pebble-3://appstore/$1"
      }
    ]
  },
  {
    "title": "Open Photo",
    "regex": "http(?:s?)://(?:www\\.)?500px\\.com/photo/(\\d+)(?:(?:/|\\?).*)?$",
    "apps": [
      {
        "app": "500px",
        "format": "px://500px.com/photo/$1"
      }
    ]
  },
  {
    "title": "Open Profile",
    "regex": "http(?:s?)://(?:www\\.)?500px\\.com/(?!photo)([0-9a-zA-Z_-]+)(?:/|\\?)?.*$",
    "apps": [
      {
        "app": "500px",
        "format": "px://500px.com/$1"
      }
    ]
  },
  {
    "title": "Open Photo",
    "regex": "http(?:s)?://(?:m\\.|mobile\\.|www\\.)?flickr\\.com(?:/#|/browser/upgrade/\\?continue=)?/photos/([0-9a-zA-Z_@%-]+)/(\\d+)(?:(?:/|\\?).*)?$",
    "apps": [
      {
        "app": "flickr",
        "format": "flickr://photos/$1/$2"
      }
    ]
  },
  {
    "title": "Open Profile",
    "regex": "http(?:s)?://(?:m\\.|mobile\\.|www\\.)?flickr\\.com(?:/#|/browser/upgrade/\\?continue=)?/(?:photos|people)/([0-9a-zA-Z_@%-]+)(?:/|\\?|/\\?.*)?$",
    "apps": [
      {
        "app": "flickr",
        "format": "flickr://flickr.com/photos/$1"
      }
    ]
  },
  {
    "title": "Open Photoset",
    "regex": "http(?:s)?://(?:m\\.|mobile\\.|www\\.)?flickr\\.com(?:/#|/browser/upgrade/\\?continue=)?/photos/([0-9a-zA-Z_@%-]+)/sets/(\\d+)(?:(?:/|\\?).*)?$",
    "apps": [
      {
        "app": "flickr",
        "format": "flickr://photos/$1/sets/$2"
      }
    ]
  },
  {
    "title": "Open Group",
    "regex": "http(?:s)?://(?:m\\.|mobile\\.|www\\.)?flickr\\.com(?:/#|/browser/upgrade/\\?continue=)?/groups/([0-9a-zA-Z_@%-]+).*$",
    "apps": [
      {
        "app": "flickr",
        "format": "flickr://groups/$1"
      }
    ]
  },
  {
    "title": "Open Photo",
    "regex": "http(?:s)?://(?:[a-zA-Z0-9_\\-\\.]+\\.)?vsco\\.co(?:m)?/(?:[a-zA-Z0-9_\\-\\.]+/)?media/(\\w+).*?$",
    "apps": [
      {
        "app": "vscocam",
        "format": "vsco://grid/$1"
      }
    ]
  },
  {
    "title": "Open Journal",
    "regex": "http(s)?://(?:[a-zA-Z0-9_\\-\\.]+\\.)?vsco\\.co(m)?/(?:[a-zA-Z0-9_\\-\\.]+/)?journal/\\w+.*$",
    "apps": [
      {
        "app": "vscocam",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('(vsco://.*?)\"'); var match = regex.exec(res)[1]; completionHandler(match); }"
      }
    ]
  },
  {
    "title": "Open Profile",
    "regex": "http(s)?://(?:[a-zA-Z0-9_\\-\\.]+\\.)?vsco\\.co(m)?((/[a-zA-Z0-9_\\-\\.]+)?(/(collection|images)|(/)?\\?).*|/)?$",
    "apps": [
      {
        "app": "vscocam",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('(vsco://.*?)\"'); var match = regex.exec(res)[1]; completionHandler(match); }"
      }
    ]
  },
  {
    "title": "Open Blog",
    "regex": "http(?:s?)://(?:www\\.)?([a-zA-Z0-9_\\-]+)\\.tumblr\\.com(?:/(?!(post|image|tagged|app)/).*|\\?.*|#.*)?$",
    "apps": [
      {
        "app": "tumblr",
        "format": "tumblr://x-callback-url/blog?blogName=$1"
      }
    ]
  },
  {
    "title": "Open Blog",
    "regex": "http(?:s)?://(?!.*\\.tumblr\\.com)[a-zA-Z0-9-\\.]+/(?!post|image|tagged|app).*\\n.*\"(?:X-Tumblr-User)\":\"([a-zA-Z0-9_\\-]+)\".*$",
    "apps": [
      {
        "app": "tumblr",
        "format": "tumblr://x-callback-url/blog?blogName=$1"
      }
    ]
  },
  {
    "title": "Open Post",
    "regex": "http(?:s?)://(?:www\\.)?([a-zA-Z0-9_\\-]+)\\.tumblr\\.com/(?!tagged|page)\\w+/(\\d+)(?:(?:/|\\?|#).*)?$",
    "apps": [
      {
        "app": "tumblr",
        "format": "tumblr://x-callback-url/blog?blogName=$1&postID=$2"
      }
    ]
  },
  {
    "title": "Open Post",
    "regex": "http(?:s)?://(?:www\\.)?([a-zA-Z0-9_\\-]+)\\.tumblr\\.com/tagged/(\\d+)(?:(?:/|\\?|#).*)?$",
    "apps": [
      {
        "app": "tumblr",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('([a-zA-Z0-9_\\-]+)\\.tumblr\\.com/post/(\\\\d+)'); var match = regex.exec(res); var blogName = match[1]; var postID = match[2]; completionHandler('tumblr://x-callback-url/blog?blogName=' + blogName + '&postID=' + postID); }"
      }
    ]
  },
  {
    "title": "Open Post",
    "regex": "http(?:s)?://(?!.*\\.tumblr\\.com)[a-zA-Z0-9-.]+/(?!tagged)\\w+/(\\d+).*\\n.*\"(?:X-Tumblr-User)\":\"([a-zA-Z0-9_\\-]+)\".*$",
    "apps": [
      {
        "app": "tumblr",
        "format": "tumblr://x-callback-url/blog?blogName=$2&postID=$1"
      }
    ]
  },
  {
    "title": "Open Journal",
    "regex": "http(?:s)?://app\\.gowander\\.co/web/v1/journals/(\\d+).*$",
    "apps": [
      {
        "app": "wander",
        "format": "comgowanderwander://journals/$1"
      }
    ]
  },
  {
    "title": "Open Moment",
    "regex": "http(?:s?)://(?:www\\.)?path\\.com/(?:p|moment)/.*$",
    "apps": [
      {
        "app": "path",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('https://path.com/moment/([a-f0-9]+)'); var match = regex.exec(res)[1]; completionHandler('path://moments/' + match); }"
      }
    ]
  },
  {
    "title": "Open Profile",
    "regex": "http(?:s?)://(?!(?:help|blog|engineering)\\.)(?:\\w+\\.)?pinterest\\.com/(?!pin|search|explore|categories|join)([a-zA-Z0-9-_]+)(/pins)?(?:/|/?\\?.*)?$",
    "apps": [
      {
        "app": "pinterest",
        "format": "pinterest://user/$1"
      }
    ]
  },
  {
    "title": "Open Board",
    "regex": "http(?:s?)://(?!(?:help|blog|engineering)\\.)(?:\\w+\\.)?pinterest\\.com/(?!pin|search|explore|categories|discover)([a-zA-Z0-9-_]+)(?:/)(?!pins)([a-zA-Z0-9-_]+).*?$",
    "apps": [
      {
        "app": "pinterest",
        "format": "pinterest://board/$1/$2"
      }
    ]
  },
  {
    "title": "Open Pin",
    "regex": "http(?:s?)://(?!(?:help|blog|engineering)\\.)(?:\\w+\\.)?pinterest\\.com/pin/(?!create)([a-zA-Z0-9_\\-]+).*?$",
    "apps": [
      {
        "app": "pinterest",
        "format": "pinterest://pin/$1"
      }
    ]
  },
  {
    "title": "Open Search",
    "regex": "http(?:s)?://(?!(?:help|blog|engineering)\\.)(?:\\w+\\.)?pinterest\\.com/search/([^/|\\?]+).*q=([^&]+).*$",
    "apps": [
      {
        "app": "pinterest",
        "format": "pinterest://search/$1/?q=$2"
      }
    ]
  },
  {
    "title": "Open Category",
    "regex": "http(?:s)?://(?!(?:help|blog|engineering)\\.)(?:\\w+\\.)?pinterest\\.com/(?:categories|explore)(/[^\\/\\?#]+)?.*?",
    "apps": [
      {
        "app": "pinterest",
        "format": "pinterest://categories$1"
      }
    ]
  },
  {
    "title": "Open Topic",
    "regex": "http(?:s)?://(?:www\\.)?flipboard\\.com/topic/.*$",
    "apps": [
      {
        "app": "flipboard",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('(flipboard://.*?)\"'); var match = regex.exec(res)[1]; completionHandler(match); }"
      }
    ]
  },
  {
    "title": "Open Section",
    "regex": "http(?:s)?://(?:www\\.)?flipboard\\.com/(@\\w+(?:/\\w*(-\\w*)+)?|section/.*).*$",
    "apps": [
      {
        "app": "flipboard",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('(flipboard://.*?)\"'); var match = regex.exec(res)[1]; completionHandler(match); }"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://byte\\.co/~([a-zA-Z0-9_\\-]+).*$",
    "apps": [
      {
        "app": "byte",
        "format": "byte://$1"
      }
    ]
  },
  {
    "title": "Open Profile",
    "regex": "http(?:s)?://(?:\\w+\\.)?weibo\\.(?:com|cn)/(?:(?:u|d)/)?(\\w+)(?:/\\?.*|/)?$",
    "apps": [
      {
        "app": "weibo",
        "format": "sinaweibo://userinfo?uid=$1"
      },
      {
        "app": "moke",
        "format": "moke:///user?id=$1"
      }
    ]
  },
  {
    "title": "Open Profile",
    "regex": "http(?:s)?://(?:\\w+\\.)?weibo\\.(?:com|cn)/(?:u/)?(\\d+)(?:/\\?.*|/)?$",
    "apps": [
      {
        "app": "moke",
        "format": "moke:///user?id=$1"
      }
    ]
  },
  {
    "title": "Open Profile",
    "regex": "http(?:s)?://(?:\\w+\\.)?weibo\\.(?:com|cn)/(?:d/)?(?!\\d+)(\\w+)(?:/\\?.*|/)?$",
    "apps": [
      {
        "app": "moke",
        "format": "moke:///user?domain=$1"
      }
    ]
  },
  {
    "title": "Open Status",
    "regex": "http(?:s)?://(?:\\w+\\.)?weibo\\.(?:com|cn)/(?:\\d+|status)/(\\w+).*$",
    "apps": [
      {
        "app": "weibo",
        "format": "sinaweibo://detail?mblogid=$1"
      },
      {
        "app": "moke",
        "format": "moke:///status?mid=$1"
      }
    ]
  },
  {
    "title": "Open Post",
    "regex": "http(?:s)?://blog\\.sina\\.(?:com|cn|com\\.cn)/(?:.*/)?s/blog_(\\w+)\\.html.*$",
    "apps": [
      {
        "app": "sinablog",
        "format": "sinablog://blog.sina.com.cn?from=sinacn&jumptype=app&articleid=$1"
      }
    ]
  },
  {
    "title": "Open Venue",
    "regex": "http(?:s?)://(?:m\\.|www\\.|mobile\\.)?foursquare\\.com(?:/mobile)?/v(?:/\\S+)?/([:hex:]{24}).*$",
    "apps": [
      {
        "app": "foursquare",
        "format": "foursquare://venues/$1"
      },
      {
        "app": "googlemaps",
        "script": "function process(url, completionHandler) { var regex = new RegExp('http(?:s)?://.*foursquare\\.com/v/(?:.*/)?(\\\\w+).*$'); var match = regex.exec(url); var venueIdentifier = match[1]; url = 'https://api.foursquare.com/v2/venues/' + venueIdentifier + '?v=20140921&client_id=Q5H4T3CZWKEKK3QKQKIIKWGISC1UKY2IXJ4BZCZXCLDQ0IMR&client_secret=J1TZFLIIZ4LK3I55AIFV3AW3Z4ICLAQIQ5KPNLTPT3ST03XH'; jsonRequest(url, function(res) { completionHandler('comgooglemaps://?q=' + res['response']['venue']['location']['lat'] + ',' + res['response']['venue']['location']['lng']); } ); }"
      },
      {
        "app": "applemaps",
        "script": "function process(url, completionHandler) { var regex = new RegExp('http(?:s)?://.*foursquare\\.com/v/(?:.*/)?(\\\\w+).*$'); var match = regex.exec(url); var venueIdentifier = match[1]; url = 'https://api.foursquare.com/v2/venues/' + venueIdentifier + '?v=20140921&client_id=Q5H4T3CZWKEKK3QKQKIIKWGISC1UKY2IXJ4BZCZXCLDQ0IMR&client_secret=J1TZFLIIZ4LK3I55AIFV3AW3Z4ICLAQIQ5KPNLTPT3ST03XH'; jsonRequest(url, function(res) { completionHandler('maps://maps.apple.com/maps?q=' + encodeURIComponent(res['response']['venue']['name']) + '&ll=' + res['response']['venue']['location']['lat'] + ',' + res['response']['venue']['location']['lng']); } ); }"
      },
      {
        "app": "waze",
        "script": "function process(url, completionHandler) { var regex = new RegExp('http(?:s)?://.*foursquare\\.com/v/(?:.*/)?(\\\\w+).*$'); var match = regex.exec(url); var venueIdentifier = match[1]; url = 'https://api.foursquare.com/v2/venues/' + venueIdentifier + '?v=20140921&client_id=Q5H4T3CZWKEKK3QKQKIIKWGISC1UKY2IXJ4BZCZXCLDQ0IMR&client_secret=J1TZFLIIZ4LK3I55AIFV3AW3Z4ICLAQIQ5KPNLTPT3ST03XH'; jsonRequest(url, function(res) { completionHandler('waze://?q=' + encodeURIComponent(res['response']['venue']['name']) + '&ll=' + res['response']['venue']['location']['lat'] + ',' + res['response']['venue']['location']['lng']); } ); }"
      },
      {
        "app": "transit",
        "script": "function process(url, completionHandler) { var regex = new RegExp('http(?:s)?://.*foursquare\\.com/v/(?:.*/)?(\\\\w+).*$'); var match = regex.exec(url); var venueIdentifier = match[1]; url = 'https://api.foursquare.com/v2/venues/' + venueIdentifier + '?v=20140921&client_id=Q5H4T3CZWKEKK3QKQKIIKWGISC1UKY2IXJ4BZCZXCLDQ0IMR&client_secret=J1TZFLIIZ4LK3I55AIFV3AW3Z4ICLAQIQ5KPNLTPT3ST03XH'; jsonRequest(url, function(res) { completionHandler('transit://directions?to=' + res['response']['venue']['location']['lat'] + ',' + res['response']['venue']['location']['lng']); } ); }"
      }
    ]
  },
  {
    "title": "Open List",
    "regex": "http(?:s)?://(m\\.|mobile\\.|www\\.)?foursquare\\.com/(?:(?:user/\\d+|[a-zA-Z0-9_%\\-]+)/list|list)/[a-zA-Z0-9_%\\-]+.*$",
    "apps": [
      {
        "app": "foursquare",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('(foursquare://.*?)\"'); var match = regex.exec(res)[1]; completionHandler(match); }"
      }
    ]
  },
  {
    "title": "Open Tip",
    "regex": "http(?:s)?://(?:m\\.|www\\.|mobile\\.)?foursquare\\.com(?:/mobile)?/item/([:hex:]{24})(?:/?)$",
    "apps": [
      {
        "app": "foursquare",
        "format": "foursquare://tips/$1"
      }
    ]
  },
  {
    "title": "Open Profile",
    "regex": "http(?:s)?://(?:m\\.|www\\.|mobile\\.)?foursquare\\.com(?:/mobile)?/(?:u|user)/(\\d+)(?:/?)$",
    "apps": [
      {
        "app": "foursquare",
        "format": "foursquare://users/$1"
      }
    ]
  },
  {
    "title": "Open Search",
    "regex": "http(?:s)?://(?:m\\.|www\\.|mobile\\.)?foursquare\\.com(?:/mobile)?/explore.*q=([^&]+).*?$",
    "apps": [
      {
        "app": "foursquare",
        "format": "foursquare://venues/explore?query=$1"
      }
    ]
  },
  {
    "title": "Open Check-in",
    "regex": "http(?:s)?://(?:www\\.)?swarmapp\\.com(?:/\\w+)?/checkin/([a-fA-F0-9]+\\?s=[a-zA-Z0-9_-]+)(?:.*)$",
    "apps": [
      {
        "app": "swarm",
        "format": "swarm://checkins/$1"
      }
    ]
  },
  {
    "title": "Open Check-in",
    "regex": "http(?:s)?://(?:www\\.)?swarmapp\\.com/c/([a-zA-Z0-9_-]+)(?:.*)$",
    "apps": [
      {
        "app": "swarm",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('(swarm://.*?)\"'); var match = regex.exec(res)[1]; completionHandler(match); }"
      }
    ]
  },
  {
    "title": "Open Venue",
    "regex": "http(s)?://(www\\.)?swarmapp\\.com/((\\w+/)?checkin/|c/).*$",
    "apps": [
      {
        "app": "foursquare",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('foursquare\\.com/v/(?:.*?/)?(\\\\w+)'); var match = regex.exec(res)[1]; completionHandler('foursquare://venues/' + match); }"
      }
    ]
  },
  {
    "title": "Open Listing",
    "regex": "http(?:s)?://(?:www\\.|m\\.)?airbnb(?:\\.\\w+)+/(?:rooms|listings)/(\\d+).*$",
    "apps": [
      {
        "app": "airbnb",
        "format": "airbnb://rooms/$1"
      }
    ]
  },
  {
    "title": "Open Check-in",
    "regex": "http(?:s)?://(?:www\\.)?(?:untappd\\.com/user/[a-zA-Z0-9_\\-\\.]+/checkin/|(?:untp\\.beer|untpd\\.it)/s/c)(\\d+).*$",
    "apps": [
      {
        "app": "untappd",
        "format": "untappd:///?checkin=$1"
      }
    ]
  },
  {
    "title": "Open Beer",
    "regex": "http(?:s)?://(?:www\\.)?untappd\\.com/b/[a-zA-Z0-9_\\-\\.]+/(\\d+).*$",
    "apps": [
      {
        "app": "untappd",
        "format": "untappd:///?beer=$1"
      }
    ]
  },
  {
    "title": "Check in with beer",
    "regex": "http(?:s)?://(?:www\\.)?untappd\\.com/b/[a-zA-Z0-9_\\-\\.]+/(\\d+).*$",
    "apps": [
      {
        "app": "tappdthat",
        "format": "tappdthat://checkin/?beerID=$1"
      }
    ]
  },
  {
    "title": "Open Business",
    "regex": "http(?:s?)://(?:www\\.|mobile\\.|m\\.)?yelp(?:\\.[a-z]+)+/biz/([a-zA-Z0-9%\\-]+).*$",
    "apps": [
      {
        "app": "yelp",
        "format": "yelp:///biz/$1"
      }
    ]
  },
  {
    "title": "Open Business Photos",
    "regex": "http(?:s?)://(?:www\\.|mobile\\.|m\\.)?yelp(?:\\.[a-z]+)+/biz_photos/([a-zA-Z0-9%\\-]+).*$",
    "apps": [
      {
        "app": "yelp",
        "format": "yelp:///biz/photos?biz_id=$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://((?:www\\.)?google(?:\\.\\w+)+/maps/.*)",
    "apps": [
      {
        "app": "googlemaps",
        "format": "comgooglemapsurl://$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://((?:www\\.)?google(?:\\.\\w+)+/maps/place/([^/]+)/(?:(?:@([^/]+)|(?!data)([^/]+)))?.*)$",
    "apps": [
      {
        "app": "applemaps",
        "format": "maps://maps.apple.com/maps?q=$2&ll=$3&address=$4"
      },
      {
        "app": "waze",
        "format": "waze://?q=$2&ll=$3"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(maps\\.google(?:\\.\\w+)+/(?!maps/place/.*).*(\\?.*))",
    "apps": [
      {
        "app": "googlemaps",
        "format": "comgooglemapsurl://$1"
      },
      {
        "app": "applemaps",
        "format": "maps://maps.apple.com/maps$2"
      },
      {
        "app": "waze",
        "format": "waze://$2"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://maps\\.apple\\.com/(?:maps)?\\?(.*)",
    "apps": [
      {
        "app": "applemaps",
        "format": "maps://maps.apple.com/maps?$1"
      },
      {
        "app": "googlemaps",
        "script": "function getParameterByName(url, name) { name = name.replace(new RegExp('[\\[]'), '\\\\[').replace(new RegExp('[\\]]'), '\\\\]'); var regex = new RegExp('[\\\\?&]' + name + '=([^&#]*)'); results = regex.exec(url); return results === null ? '' : decodeURIComponent(results[1].replace(new RegExp('\\\\+', 'g'), ' ')); } function process(url, completionHandler) { var appleAddress = getParameterByName(url, 'address'); if (appleAddress == null || appleAddress.length == 0) { appleAddress = getParameterByName(url, 'hnear'); } var appleLL = getParameterByName(url, 'll'); if (!appleLL) { appleLL = getParameterByName(url, 'sll'); } var appleQ = getParameterByName(url, 'q');  var googleQ= ''; var googleCenter = null; if (appleAddress != null && appleAddress.length > 0) { googleQ = appleAddress; } else if (appleQ != null) { googleQ = appleQ; } if (appleLL != null && appleLL.length > 0) { googleCenter = appleLL; } var query = ''; if (googleQ.length > 0) { query = 'q=' + encodeURIComponent(googleQ); } if (googleCenter.length > 0) { if (query.length > 0) { query = query + '&'; } query = query + 'center=' + googleCenter; } var url = 'comgooglemaps://?' + query; completionHandler(url); }"
      },
      {
        "app": "waze",
        "script": "function getParameterByName(url, name) { name = name.replace(new RegExp('[\\[]'), '\\\\[').replace(new RegExp('[\\]]'), '\\\\]'); var regex = new RegExp('[\\\\?&]' + name + '=([^&#]*)'); results = regex.exec(url); return results === null ? '' : decodeURIComponent(results[1].replace(new RegExp('\\\\+', 'g'), ' ')); } function process(url, completionHandler) { var appleAddress = getParameterByName(url, 'address'); if (appleAddress == null || appleAddress.length == 0) { appleAddress = getParameterByName(url, 'hnear'); } var appleLL = getParameterByName(url, 'll'); if (!appleLL) { appleLL = getParameterByName(url, 'sll'); } var appleQ = getParameterByName(url, 'q');  var googleQ= ''; var googleCenter = null; if (appleQ != null) { googleQ = appleQ; } if (appleAddress != null && appleAddress.length > 0) { if (googleQ.length > 0) { googleQ = googleQ + ','; } googleQ = googleQ + appleAddress; } if (appleLL != null && appleLL.length > 0) { googleCenter = appleLL; } var query = ''; if (googleQ.length > 0) { query = 'q=' + encodeURIComponent(googleQ); } if (googleCenter.length > 0) { if (query.length > 0) { query = query + '&'; } query = query + 'll=' + googleCenter; } var url = 'waze://?' + query; completionHandler(url); }"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:www\\.)?waze\\.to(?:/)?\\?([^#]+).*$",
    "apps": [
      {
        "app": "waze",
        "format": "waze://?$1"
      },
      {
        "app": "applemaps",
        "format": "maps://maps.apple.com/maps?$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:www\\.)?waze\\.to(?:/)?\\?(?:.+&)?ll=([^&]+).*$",
    "apps": [
      {
        "app": "googlemaps",
        "format": "comgooglemaps://?q=$1&center=$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:\\w+\\.)*(?:maps\\.(?:apple|google)(?:.\\w+)+|google(?:\\.\\w+)+/maps|waze\\.to).*(?:ll=|@)([\\-0-9\\.]+,[\\-0-9\\.]+).*?$",
    "apps": [
      {
        "app": "transit",
        "format": "transit://directions?to=$1"
      }
    ]
  },
  {
    "title": "Open Video",
    "regex": "http(?:s)?://(?:www\\.|m\\.)?(?:youtu\\.be/|youtube\\.com/(?:embed/|.*(?:\\?|&)v=))([a-zA-Z0-9_\\-]+).*?((\\?|&)(start|t)=\\w+)?.*?$",
    "apps": [
      {
        "app": "youtube",
        "format": "youtube://$1$2"
      },
      {
        "app": "protube",
        "format": "protube://video/$1"
      },
      {
        "app": "youplayer",
        "format": "youplayer://youtube.com/watch?v=$1"
      },
      {
        "app": "cornertube",
        "format": "cornertube://video/https://youtu.be/$1"
      },
      {
        "app": "piptube",
        "format": "piptube://openvideo?url=https://www.youtube.com/watch?v=$1"
      }
    ]
  },
  {
    "title": "Open Profile",
    "regex": "http(?:s)?://(?:www\\.|m\\.)?youtube\\.com/user/([\\w]+).*$",
    "apps": [
      {
        "app": "youtube",
        "format": "youtube://youtube.com/user/$1"
      },
      {
        "app": "protube",
        "format": "protube://user/$1"
      },
      {
        "app": "youplayer",
        "format": "youplayer://youtube.com/user/$1"
      }
    ]
  },
  {
    "title": "Open Channel",
    "regex": "http(?:s)?://(?:www\\.|m\\.)?youtube\\.com/channel/([a-zA-Z0-9_\\-]+).*$",
    "apps": [
      {
        "app": "youtube",
        "format": "youtube://youtube.com/channel/$1"
      },
      {
        "app": "protube",
        "format": "protube://channel/$1"
      },
      {
        "app": "youplayer",
        "format": "youplayer://youtube.com/channel/$1"
      }
    ]
  },
  {
    "title": "Open Playlist",
    "regex": "http(?:s)?://(?:www\\.|m\\.)?youtube\\.com/playlist.*list=([a-zA-Z0-9_\\-]+).*?$",
    "apps": [
      {
        "app": "youtube",
        "format": "youtube://youtube.com/playlist?list=$1"
      },
      {
        "app": "protube",
        "format": "protube://playlist/$1"
      },
      {
        "app": "youplayer",
        "format": "youplayer://youtube.com/playlist?list=$1"
      }
    ]
  },
  {
    "title": "Open Broadcast",
    "regex": "http(?:s?)://(?:www\\.)?(?:periscope|pscp)\\.tv/[^/]+/([^/|\\?]+)(?:/|/?\\?.*)?$",
    "apps": [
      {
        "app": "periscope",
        "format": "pscp://broadcast/$1"
      }
    ]
  },
  {
    "title": "Open Stream",
    "regex": "http(?:s)?://(?:[a-zA-Z0-9_\\-]+\\.)*twitch\\.tv/(?!directory)(\\w+)(?!.*/v/\\d+).*$",
    "apps": [
      {
        "app": "twitch",
        "format": "twitch://stream/$1"
      }
    ]
  },
  {
    "title": "Open Game Directory",
    "regex": "http(?:s)?://(?:[a-zA-Z0-9_\\-]+\\.)*twitch\\.tv/directory/game/([a-zA-Z0-9_\\-%]+).*$",
    "apps": [
      {
        "app": "twitch",
        "format": "twitch://game/$1"
      }
    ]
  },
  {
    "title": "Open Video",
    "regex": "http(?:s)?://(?:[a-zA-Z0-9_\\-]+\\.)*twitch\\.tv/(?!directory)(?:\\w+)/v/(\\d+).*$",
    "apps": [
      {
        "app": "twitch",
        "format": "twitch://video/v$1"
      }
    ]
  },
  {
    "title": "Open Post",
    "regex": "http(?:s)?://(?:www\\.)?flipagram\\.com/f/(\\w+).*$",
    "apps": [
      {
        "app": "flipagram",
        "format": "flipagram://flipagram/$1"
      }
    ]
  },
  {
    "title": "Open Dubsmash",
    "regex": "http(?:s)?://api\\.dubsmash\\.com/goto/(\\w+).*$",
    "apps": [
      {
        "app": "dubsmash",
        "format": "dubsmash://1/snip/$1"
      }
    ]
  },
  {
    "title": "Open File",
    "regex": "http(?:s?)://(?:www\\.)?dropbox\\.com/s/\\w+.*$",
    "apps": [
      {
        "app": "dropbox",
        "script": "function process(url, completionHandler) { completionHandler('dbapi-6:/1/viewLink?url=' + encodeURIComponent(url)); }"
      }
    ]
  },
  {
    "title": "Open Folder",
    "regex": "http(?:s?)://(?:www\\.)?dropbox\\.com/sh/\\w+.*$",
    "apps": [
      {
        "app": "dropbox",
        "script": "function process(url, completionHandler) { completionHandler('dbapi-6:/1/viewLink?url=' + encodeURIComponent(url)); }"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "(http(?:s?)://drive\\.google\\.com/(?:open|file|folder).*)$",
    "apps": [
      {
        "app": "googledrive",
        "format": "googledrive://$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://m\\.box\\.com/shared_item/(.*)$",
    "apps": [
      {
        "app": "box",
        "format": "boxopenshared://shared_item?url=$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:app\\.)?box\\.com/s/(\\w+).*$",
    "apps": [
      {
        "app": "box",
        "format": "boxopenshared://shared_item?url=https%3A%2F%2Fapp.box.com%2Fs%2F$1"
      }
    ]
  },
  {
    "title": "Open Profile",
    "regex": "http(?:s)?://(?:www\\.)?vimeo\\.com/([a-zA-Z](\\w+))(?:/)?(?:\\?.*)?$",
    "apps": [
      {
        "app": "vimeo",
        "format": "vimeo://app.vimeo.com/users/$1"
      }
    ]
  },
  {
    "title": "Open Video",
    "regex": "http(?:s)?://(?:www\\.|player\\.)?vimeo\\.com/(?:video/)?(\\d+)(?:/)?.*$",
    "apps": [
      {
        "app": "vimeo",
        "format": "vimeo://app.vimeo.com/videos/$1"
      }
    ]
  },
  {
    "title": "Open Channel",
    "regex": "http(?:s)?://(?:www\\.)?vimeo\\.com/channels/(\\w+)(?:/)?(?:\\?.*)?$",
    "apps": [
      {
        "app": "vimeo",
        "format": "vimeo://app.vimeo.com/channels/$1"
      }
    ]
  },
  {
    "title": "Open Category",
    "regex": "http(?:s)?://(?:www\\.)?vimeo\\.com/categories/(\\w+)(?:/)?(?:\\?.*)?$",
    "apps": [
      {
        "app": "vimeo",
        "format": "vimeo://app.vimeo.com/categories/$1"
      }
    ]
  },
  {
    "title": "Open Video",
    "regex": "http(?:s)?://(?:\\w+\\.)?youku\\.com/v_show/id_(\\w+).*$",
    "apps": [
      {
        "app": "youku",
        "format": "youku://play?vid=$1"
      },
      {
        "app": "youkuhd",
        "format": "youkuhd://play?vid=$1"
      }
    ]
  },
  {
    "title": "Open Video",
    "regex": "http(?:s)?://(?:www\\.)?bilibili\\.com/(?:.*/)?video/av(\\d+).*$",
    "apps": [
      {
        "app": "bilibili",
        "format": "bilibili://?av=$1"
      }
    ]
  },
  {
    "title": "Open Video",
    "regex": "http(?:s)?://(?:www\\.)?hulu(?:\\.\\w+)+/watch/(\\d+).*$",
    "apps": [
      {
        "app": "hulu",
        "format": "hulu://w/$1"
      }
    ]
  },
  {
    "title": "Open Video",
    "regex": "http(?:s)?://(?:www\\.)vevo\\.com/watch/(?:[a-zA-Z0-9()\\-_%]+/)*(\\w+).*$",
    "apps": [
      {
        "app": "vevo",
        "format": "vevo://video/$1"
      }
    ]
  },
  {
    "title": "Open Track",
    "regex": "http(?:s?)://(?:play\\.|open\\.|www\\.)?spotify\\.com/track/([:alnum:]+).*$",
    "apps": [
      {
        "app": "spotify",
        "format": "spotify:track:$1"
      }
    ]
  },
  {
    "title": "Open Album",
    "regex": "http(?:s?)://(?:play\\.|open\\.|www\\.)?spotify\\.com/album/([:alnum:]+).*$",
    "apps": [
      {
        "app": "spotify",
        "format": "spotify:album:$1"
      }
    ]
  },
  {
    "title": "Open Playlist",
    "regex": "http(?:s?)://(?:play\\.|open\\.|www\\.)?spotify\\.com/user/(\\w+)/playlist/([:alnum:]+).*$",
    "apps": [
      {
        "app": "spotify",
        "format": "spotify:user:$1:playlist:$2"
      }
    ]
  },
  {
    "title": "Open User",
    "regex": "http(?:s?)://(?:play\\.|open\\.|www\\.)?spotify\\.com/user/(\\w+)(?!.*/playlist.*).*$",
    "apps": [
      {
        "app": "spotify",
        "format": "spotify:user:$1"
      }
    ]
  },
  {
    "title": "Open Artist",
    "regex": "http(?:s?)://(?:play\\.|open\\.|www\\.)?spotify\\.com/artist/(\\w+).*$",
    "apps": [
      {
        "app": "spotify",
        "format": "spotify:artist:$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(s?)://(www\\.|m\\.)?soundcloud\\.com/[^/]+(/[^/]+)?",
    "apps": [
      {
        "app": "soundcloud",
        "script": "function process(url, completionHandler) { url = 'https://api.soundcloud.com/resolve?client_id=27fcfadd796648a26072b6041ff5bf74&url=' + url; jsonRequest(url, function(result) { var appURL = null; if (result['kind'] === 'track') { appURL = 'soundcloud://sounds:' + result['id']; } else if (result['kind'] === 'user') { appURL = 'soundcloud://users:' + result['id']; } else if (result['kind'] === 'playlist') { appURL = 'soundcloud://sets:' + result['id']; } completionHandler(appURL); } ); }"
      }
    ]
  },
  {
    "title": "Open Track",
    "regex": "http(?:s)?://(?:www\\.)?hypem\\.com/track/([:alnum:]+).*$",
    "apps": [
      {
        "app": "hypemachine",
        "format": "hypem://track/$1"
      }
    ]
  },
  {
    "title": "Open Profile",
    "regex": "http(?:s)?://(?:www\\.)?hypem\\.com/(?!track|popular|twitter|tags)(\\w+).*$",
    "apps": [
      {
        "app": "hypemachine",
        "format": "hypem://playlist/?key=PlaylistFriend&section=users&username=$1"
      }
    ]
  },
  {
    "title": "Open Playlist",
    "regex": "http(?:s)?://(?:www\\.)?hypem\\.com/(?!track|popular|latest|twitter|tags)(\\w+).*$",
    "apps": [
      {
        "app": "hypemachine",
        "format": "hypem://playlist/?key=PlaylistFriend&section=users&username=$1"
      }
    ]
  },
  {
    "title": "Open Station",
    "regex": "http(?:s)?://(?:www\\.)?tunein\\.com/(?:station(?:/)?\\?StationId=|radio/(?:\\S*-)*s)(\\d+).*$",
    "apps": [
      {
        "app": "tunein",
        "format": "tunein://?profile/s$1"
      }
    ]
  },
  {
    "title": "Add Podcast",
    "regex": "http(?:s)?://(?:www\\.)?(overcast\\.fm/\\+.+)$",
    "apps": [
      {
        "app": "overcast",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('(overcast:///\\\\d+)'); var match = regex.exec(res)[1]; completionHandler(match); }"
      },
      {
        "app": "castro",
        "format": "castro://subscribe/$1"
      },
      {
        "app": "pocketcasts",
        "format": "pktc://subscribe/$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(s)?://pca.st/\\w+$",
    "apps": [
      {
        "app": "pocketcasts",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('.*(pktc://.*?)\\'.*'); var results = regex.exec(res); var match = null; if (results != null && results.length > 1) { match = results[1] }; completionHandler(match); }"
      }
    ]
  },
  {
    "title": "Open List",
    "regex": "http(?:s)?://lists\\.pocketcasts\\.com/([^/]*).*$",
    "apps": [
      {
        "app": "pocketcasts",
        "format": "pktc://sharelist/lists.pocketcasts.com/$1"
      }
    ]
  },
  {
    "title": "Add iTunes Podcast",
    "regex": "http(?:s)?://(?:geo\\.)?(itunes\\.apple\\.com/(?:.*/)*podcast/(?:.*/)?id\\d+.*)$",
    "apps": [
      {
        "app": "overcast",
        "script": "function process(url, completionHandler) { completionHandler('overcast://x-callback-url/add?url=' + encodeURIComponent(url)); }"
      },
      {
        "app": "castro",
        "format": "castro://subscribe/$1"
      },
      {
        "app": "pocketcasts",
        "format": "pktc://subscribe/$1"
      }
    ]
  },
  {
    "title": "Open Product",
    "regex": "http(?:s)?://(?:www\\.)?producthunt\\.com/(?:posts|tech|games|podcasts|books|)/([a-zA-Z0-9_\\-%]+).*$",
    "apps": [
      {
        "app": "producthunt",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('producthunt://post/(\\\\d+)'); var match = regex.exec(res)[1]; completionHandler('producthunt://post/' + match); }"
      }
    ]
  },
  {
    "title": "Open User",
    "regex": "http(?:s)?://(?:www\\.)?producthunt\\.com/@(\\w+)(?!.*/collections/.*)(.*)$",
    "apps": [
      {
        "app": "producthunt",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('producthunt://user/(\\\\d+)'); var match = regex.exec(res)[1]; completionHandler('producthunt://user/' + match); }"
      }
    ]
  },
  {
    "title": "Open Collection",
    "regex": "http(?:s)?://(?:www\\.)?producthunt\\.com/@(?:\\w+)/collections/.*$",
    "apps": [
      {
        "app": "producthunt",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('producthunt://collection/(\\\\d+)'); var match = regex.exec(res)[1]; completionHandler('producthunt://collection/' + match); }"
      }
    ]
  },
  {
    "title": "Open Talk",
    "regex": "http(?:s?)://(?:www\\.)?ted\\.com/talks/(\\w+).*$",
    "apps": [
      {
        "app": "ted",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('(ted://talks/\\\\d+)'); var match = regex.exec(res)[1]; completionHandler(match); }"
      }
    ]
  },
  {
    "title": "Open Subreddit",
    "regex": "http(?:s)?://(?:\\w+\\.)?reddit\\.com/r/([a-zA-Z0-9_\\-%]+)(?:/(\\?.*)?$|\\?.*$|/$)?$",
    "apps": [
      {
        "app": "alienblue",
        "format": "alienblue://r/$1"
      }
    ]
  },
  {
    "title": "Open Thread",
    "regex": "http(?:s)?://(?:\\w+\\.)?reddit\\.com/(r/[a-zA-Z0-9_\\-%]+/(?:comments|info)/\\w+.*)$",
    "apps": [
      {
        "app": "alienblue",
        "format": "alienblue://thread/$1"
      }
    ]
  },
  {
    "title": "Open Thread",
    "regex": "http(?:s)?://(?:\\w+\\.)?reddit\\.com/(?:comments|info)/\\w+.*$",
    "apps": [
      {
        "app": "alienblue",
        "script": "function process(url, completionHandler) { var regex = new RegExp('reddit.com/(?:comments|info)/(\\\\w+).*?$'); var id = regex.exec(url)[1]; url = 'https://api.reddit.com/info/' + id; jsonRequest(url, function(res) { var permalink = res[0]['data']['children'][0]['data']['permalink']; completionHandler('alienblue://thread' + permalink); } ); }"
      }
    ]
  },
  {
    "title": "Open Post",
    "regex": "http(?:s)?://(?:www\\.)?theguardian\\.(?:com|co\\.uk)/(.*)$",
    "apps": [
      {
        "app": "theguardian",
        "format": "gnmguardian://$1"
      }
    ]
  },
  {
    "title": "Open Post",
    "regex": "http(?:s)?://(?:www\\.)?buzzfeed\\.com/(\\w+/[a-zA-Z0-9_\\-%]+).*$",
    "apps": [
      {
        "app": "buzzfeed",
        "format": "buzzfeed://buzz/$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://((?:\\w+\\.)?(reddit\\.com/.*))",
    "apps": [
      {
        "app": "reddit",
        "format": "reddit://$1"
      },
      {
        "app": "narwhal",
        "script": "function process(url, completionHandler) { completionHandler('narwhal://open-url/' + encodeURIComponent(url.split('?')[0])); }"
      },
      {
        "app": "amrc",
        "format": "amrc://$2"
      },
      {
        "app": "beam",
        "format": "beamapp://$2"
      },
      {
        "app": "readder",
        "format": "readder://open-url/https://$2"
      }
    ]
  },
  {
    "title": "Open Document",
    "regex": "http(?:s)?://(?:\\w+\\.)?scribd\\.com(?:/\\w+)*/(?:doc|embeds)/(\\d+).*$",
    "apps": [
      {
        "app": "scribd",
        "format": "iscribd://doc?id=$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:www\\.)?stumbleupon\\.com/(?:su|to/s)/(\\w+).*$",
    "apps": [
      {
        "app": "stumbleupon",
        "format": "stumbleupon://urlid/$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:www\\.)?medium\\.com/(.*)$",
    "apps": [
      {
        "app": "medium",
        "format": "medium://$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?!.*medium\\.com)[a-zA-Z0-9\\-.]+/(?!\\?.*)(.+)\\n.*\"(?:x-powered-by)\":\"(?:kale|medium)\".*$",
    "apps": [
      {
        "app": "medium",
        "format": "medium://p/$1"
      }
    ]
  },
  {
    "title": "Open Publication",
    "regex": "http(?:s)?://(?!.*medium\\.com)[a-zA-Z0-9\\-.]+(?:/(?:\\?.*)?)?\\n.*\"(?:x-powered-by)\":\"(?:kale|medium)\".*$",
    "apps": [
      {
        "app": "medium",
        "script": "function process(url, completionHandler) { var res = $http.sync(url.split('\\n')[0]); var regex = RegExp('(medium://.*?)\"'); var match = regex.exec(res)[1]; completionHandler(match); }"
      }
    ]
  },
  {
    "title": "Open Product",
    "regex": "http(?:s)?://(?:\\w+\\.)*(?:amazon|amzn)((?:\\.\\w+)+)/(?:.*?/)?(?:(?:(?:dp|gp)(?:/aw/d)?)|product|.*/ASIN)/([a-zA-Z0-9]+).*$",
    "apps": [
      {
        "app": "amazon",
        "format": "com.amazon.mobile.shopping://amazon$1/products/$2"
      },
      {
        "app": "associate",
        "script": "function process(url, completionHandler) { completionHandler('associate://x-callback-url/convert?url=' + encodeURIComponent(url)); }"
      }
    ]
  },
  {
    "title": "Open Deal",
    "regex": "http(?:s)?://(?:www\\.)groupon(?:\\.\\w+)+/deals/.*$",
    "apps": [
      {
        "app": "groupon",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('ios-app://352683833/groupon/dispatch/(.*?)\"'); var match = regex.exec(res)[1]; completionHandler('groupon:///dispatch/' + match); }"
      }
    ]
  },
  {
    "title": "Open Product",
    "regex": "http(?:s)?://(?:\\w+\\.)*aliexpress\\.com/(?:\\w+/)?item(?:/[^/]+)?/(\\d+)\\.html.*$",
    "apps": [
      {
        "app": "aliexpress",
        "format": "aliexpress://product/detail?productId=$1"
      },
      {
        "app": "aliexpresshd",
        "format": "aliexpresshd://product/detail?productId=$1"
      }
    ]
  },
  {
    "title": "Open Product",
    "regex": "http(?:s)?://(?:\\w+\\.)?alibaba\\.com/product(?:-detail)?/(?:[a-zA-Z0-9_\\-]*_)?(\\d+).*$",
    "apps": [
      {
        "app": "alibaba",
        "format": "enalibaba://detail/?id=$1"
      }
    ]
  },
  {
    "title": "Open Product",
    "regex": "http(?:s)?://(?:www\\.|rover\\.|m\\.)?ebay(?:\\.\\w+)+/itm/(?:[0-9A-Za-z_-]+/)?(\\d+)(?:/|\\?)?(?:.*)$",
    "apps": [
      {
        "app": "ebay",
        "format": "ebay://launch?itm=$1"
      }
    ]
  },
  {
    "title": "Open Project",
    "regex": "http(?:s)?://((?:www\\.)?kickstarter\\.com/projects/[a-zA-Z0-9_%-]+/[a-zA-Z0-9_%-]+).*?$",
    "apps": [
      {
        "app": "kickstarter",
        "format": "ksr://$1"
      }
    ]
  },
  {
    "title": "Open Item",
    "regex": "http(?:s?)://(?:www\\.|m\\.)?etsy\\.com/(?:.+/)*listing/(\\d+).*$",
    "apps": [
      {
        "app": "etsy",
        "format": "etsy://listing/$1"
      }
    ]
  },
  {
    "title": "Open Product",
    "regex": "http(?:s)?://(?:www\\.)?fancy\\.com/things/(\\d+).*$",
    "apps": [
      {
        "app": "fancy",
        "format": "fancy://things/$1"
      }
    ]
  },
  {
    "title": "Open Project",
    "regex": "http(?:s)?://(?:www\\.)?behance\\.net/gallery/(?:(?:[a-zA-Z0-9_\\-\\.]/)+)?(\\d+).*$",
    "apps": [
      {
        "app": "behance",
        "format": "behance://project/$1"
      }
    ]
  },
  {
    "title": "Open Post",
    "regex": "http(?:s)?://(?:www\\.)?weheartit\\.com/entry/(\\d+).*$",
    "apps": [
      {
        "app": "weheartit",
        "format": "whi://entry/$1"
      }
    ]
  },
  {
    "title": "Open Profile",
    "regex": "http(?:s)?://(?:www\\.)?weheartit\\.com/(?!entry)([a-zA-Z0-9_\\-]+)(?!.*/collections/.+).*$$",
    "apps": [
      {
        "app": "weheartit",
        "format": "whi://user/$1"
      }
    ]
  },
  {
    "title": "Open Collection",
    "regex": "http(?:s)?://(?:www\\.)?weheartit\\.com/(?!entry)((?:[a-zA-Z0-9_\\-]+)/collections/(?:[a-zA-Z0-9_\\-]+)).*$",
    "apps": [
      {
        "app": "weheartit",
        "format": "whi://$1"
      }
    ]
  },
  {
    "title": "Open Comic",
    "regex": "http(?:s)?://(?:www\\.|m\\.)?xkcd\\.com/(\\d+).*$",
    "apps": [
      {
        "app": "xkcdhd",
        "format": "xkcd://$1"
      }
    ]
  },
  {
    "title": "Open Frontback",
    "regex": "http(s?)://(www\\.)?(frontback\\.me/p|frntb\\.ac)/[a-zA-Z0-9]+(\\S*)$",
    "apps": [
      {
        "app": "frontback",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('(frontback://posts/\\\\d+)'); var match = regex.exec(res)[1]; completionHandler(match); }"
      }
    ]
  },
  {
    "title": "Open Event",
    "regex": "http(?:s)?://(?:www\\.)?eventbrite(?:\\.\\w+)+/e(?:vent)?/(?:[a-zA-Z0-9_]+-)*(\\d+).*$",
    "apps": [
      {
        "app": "eventbrite",
        "format": "com-eventbrite-attendee:event/$1"
      }
    ]
  },
  {
    "title": "Open Event",
    "regex": "http(?:s?)://(?:m\\.|mobile\\.|www\\.)?meetup\\.com/([a-zA-Z0-9_\\-%]+)(?:/.*)?/(\\d+).*$",
    "apps": [
      {
        "app": "meetup",
        "format": "meetup://events/$2"
      },
      {
        "app": "googlemaps",
        "script": "function process(url, completionHandler) { var regex = new RegExp('http(?:s?)://(?:m\\\\.|mobile\\\\.|www\\\\.)?meetup\\\\.com/([a-zA-Z0-9_\\\\-%]+)(?:/.*)?/(\\\\d+).*$'); var match = regex.exec(url); var groupIdentifier = match[1]; var eventIdentifier = match[2]; url = 'https://api.meetup.com/' + groupIdentifier + '/events/' + eventIdentifier; jsonRequest(url, function(res) { if (res['venue'] != null && res['venue']['name'] != null && res['venue']['lat'] != null & res['venue']['lon'] != null) { completionHandler('comgooglemaps://?q=' + res['venue']['lat'] + ',' + res['venue']['lon']); } else { completionHandler(null); } } ); }"
      },
      {
        "app": "applemaps",
        "script": "function process(url, completionHandler) { var regex = new RegExp('http(?:s?)://(?:m\\\\.|mobile\\\\.|www\\\\.)?meetup\\\\.com/([a-zA-Z0-9_\\\\-%]+)(?:/.*)?/(\\\\d+).*$'); var match = regex.exec(url); var groupIdentifier = match[1]; var eventIdentifier = match[2]; url = 'https://api.meetup.com/' + groupIdentifier + '/events/' + eventIdentifier; jsonRequest(url, function(res) { if (res['venue'] != null && res['venue']['name'] != null && res['venue']['lat'] != null & res['venue']['lon'] != null) { completionHandler('maps://maps.apple.com/maps?q=' + encodeURIComponent(res['venue']['name']) + '&ll=' + res['venue']['lat'] + ',' + res['venue']['lon']); } else { completionHandler(null); } } ); }"
      },
      {
        "app": "waze",
        "script": "function process(url, completionHandler) { var regex = new RegExp('http(?:s?)://(?:m\\\\.|mobile\\\\.|www\\\\.)?meetup\\\\.com/([a-zA-Z0-9_\\\\-%]+)(?:/.*)?/(\\\\d+).*$'); var match = regex.exec(url); var groupIdentifier = match[1]; var eventIdentifier = match[2]; url = 'https://api.meetup.com/' + groupIdentifier + '/events/' + eventIdentifier; jsonRequest(url, function(res) { if (res['venue'] != null && res['venue']['name'] != null && res['venue']['lat'] != null & res['venue']['lon'] != null) { completionHandler('waze://?q=' + encodeURIComponent(res['venue']['name']) + '&ll=' + res['venue']['lat'] + ',' + res['venue']['lon']); } else { completionHandler(null); } } ); }"
      },
      {
        "app": "transit",
        "script": "function process(url, completionHandler) { var regex = new RegExp('http(?:s?)://(?:m\\\\.|mobile\\\\.|www\\\\.)?meetup\\\\.com/([a-zA-Z0-9_\\\\-%]+)(?:/.*)?/(\\\\d+).*$'); var match = regex.exec(url); var groupIdentifier = match[1]; var eventIdentifier = match[2]; url = 'https://api.meetup.com/' + groupIdentifier + '/events/' + eventIdentifier; jsonRequest(url, function(res) { if (res['venue'] != null && res['venue']['lat'] != null & res['venue']['lon'] != null) { completionHandler('transit://directions?to=' + res['venue']['lat'] + ',' + res['venue']['lon']); } else { completionHandler(null); } } ); }"
      }
    ]
  },
  {
    "title": "Open Doodle",
    "regex": "http(?:s)?://(?:www\\.)?doodle\\.com/(?:poll/)?([a-z0-9]{16}).*$",
    "apps": [
      {
        "app": "doodle",
        "format": "doodle://?pollId=$1"
      }
    ]
  },
  {
    "title": "Open Event",
    "regex": "http(?:s)?://(?:www\\.|m\\.|mobile\\.)stubhub\\.com/(?:\\S+/)*(?:\\w+-)*(\\d+).*$",
    "apps": [
      {
        "app": "stubhub",
        "format": "stubhub://stubhub.com/?event_id=$1"
      }
    ]
  },
  {
    "title": "Open Event",
    "regex": "http(s)?://(www\\.)?goldstar\\.com/events/[a-zA-Z0-9\\-_]+/[a-zA-Z0-9\\-_]+.*$",
    "apps": [
      {
        "app": "goldstar",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('(goldstar://.*?)\"'); var match = regex.exec(res)[1]; completionHandler(match); }"
      }
    ]
  },
  {
    "title": "Open Profile",
    "regex": "http(?:s)?://(?:touch\\.)?(?:\\w+\\.)?linkedin\\.com/(?:(?:.*(?:/|#))?profile/(?:view?.*id=)?(\\d+)|in/([^/]+)).*$",
    "apps": [
      {
        "app": "linkedin",
        "format": "linkedin://profile/$1$2"
      }
    ]
  },
  {
    "title": "Open Title",
    "regex": "http(?:s)?://(?:www\\.|m\\.)imdb\\.com/title/(tt\\d+).*$",
    "apps": [
      {
        "app": "imdb",
        "format": "imdb:///title/$1"
      }
    ]
  },
  {
    "title": "Open Chart",
    "regex": "http(?:s)?://(?:www\\.|m\\.)imdb\\.com/chart/(\\w+).*$",
    "apps": [
      {
        "app": "imdb",
        "format": "imdb:///chart/$1"
      }
    ]
  },
  {
    "title": "Open Name",
    "regex": "http(?:s)?://(?:www\\.|m\\.)imdb\\.com/name/(nm\\d+).*$",
    "apps": [
      {
        "app": "imdb",
        "format": "imdb:///name/$1"
      }
    ]
  },
  {
    "title": "Open Activity",
    "regex": "http(?:s)?://(?:www\\.|m\\.)?strava\\.com/activities/(\\d+).*$",
    "apps": [
      {
        "app": "strava",
        "format": "strava://activities/$1"
      }
    ]
  },
  {
    "title": "Open Run",
    "regex": "http(?:s)?://(?:www\\.)?runkeeper\\.com/(?:user/\\w+/activity/\\d+|activity/?.*)",
    "apps": [
      {
        "app": "runkeeper",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('(runkeeper://\\\\?view=activity&tripuuid=(\\\\w+|-)+)'); var match = regex.exec(res)[1]; completionHandler(match); }"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://((?!www\\.)(?:([a-zA-Z0-9\\-]+)\\.)(?:\\w+\\.)*wikipedia\\.(?:com|org)/(?:[^/]+/)?(.*))$",
    "apps": [
      {
        "app": "wikipedia",
        "format": "wikipedia-official://$1"
      },
      {
        "app": "viki",
        "format": "v-for-wiki://article/$2/$3"
      },
      {
        "app": "wikilinks",
        "script": "function process(url, completion) { url = url.replace(new RegExp('\\.org/[^/]+/'), '.org/wiki/'); completion('wikilinks://openwikipediaurl?url=' + encodeURIComponent(btoa(url))); }"
      },
      {
        "app": "wikipanion",
        "format": "wplink://$2.wikipedia.org/wiki/$3"
      },
      {
        "app": "wikipanionpad",
        "format": "wplink://$2.wikipedia.org/wiki/$3"
      },
      {
        "app": "wikiwand",
        "format": "wikiwand-article://$2/$3"
      },
      {
        "app": "wonder",
        "format": "wonder://$1"
      },
      {
        "app": "curiosity",
        "script": "function process(url, completionHandler) { var regex = new RegExp('(http(?:s)?://((?!www\\\\.)(?:([a-zA-Z0-9\\\\-]+)\\\\.)(?:\\\\w+\\\\.)*wikipedia\\\\.(?:com|org)/(?:[^/]+/)?(.*)))$'); var match = regex.exec(url); var locale = match[3]; var title = match[4]; url = 'https://' + locale + '.wikipedia.org/w/api.php?action=query&format=json&titles=' + title; jsonRequest(url, function(res) { var pageid = Object.keys(res['query']['pages'])[0]; completionHandler('curiosity://p/' + locale + '/' + pageid); } ); }"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:www\\.)?tamper\\.io/(?:curiosity|inquire)/share.*(?:(?:\\?|&)p=(\\d+).*&l=([a-zA-Z0-9\\-_]+)|(?:\\?|&)l=([a-zA-Z0-9\\-_]+).*&p=(\\d+)).*$",
    "apps": [
      {
        "app": "wikipedia",
        "script": "function process(url, completionHandler) { var regex = new RegExp('http(?:s)?://(?:www\\\\.)?tamper\\\\.io/(?:curiosity|inquire)/share.*(?:(?:\\\\?|&)p=(\\\\d+).*&l=([a-zA-Z0-9\\\\-_]+)|(?:\\\\?|&)l=([a-zA-Z0-9\\\\-_]+).*&p=(\\\\d+)).*$'); var match = regex.exec(url); var locale = null; if (match[2] != null) { locale = match[2] } else if (match[3] != null) { locale = match[3]; } var pageid = null; if (match[1] != null) { pageid = match[1] } else if (match[4] != null) { pageid = match[4]; } url = 'https://' + locale + '.wikipedia.org/w/api.php?action=query&format=json&pageids=' + pageid; jsonRequest(url, function(res) { var key = Object.keys(res['query']['pages'])[0]; var title = res['query']['pages'][key]['title']; completionHandler('wikipedia-official://' + locale + '.wikipedia.org/wiki/' + encodeURIComponent(title)); } ); }"
      },
      {
        "app": "viki",
        "script": "function process(url, completionHandler) { var regex = new RegExp('http(?:s)?://(?:www\\\\.)?tamper\\\\.io/(?:curiosity|inquire)/share.*(?:(?:\\\\?|&)p=(\\\\d+).*&l=([a-zA-Z0-9\\\\-_]+)|(?:\\\\?|&)l=([a-zA-Z0-9\\\\-_]+).*&p=(\\\\d+)).*$'); var match = regex.exec(url); var locale = null; if (match[2] != null) { locale = match[2] } else if (match[3] != null) { locale = match[3]; } var pageid = null; if (match[1] != null) { pageid = match[1] } else if (match[4] != null) { pageid = match[4]; } url = 'https://' + locale + '.wikipedia.org/w/api.php?action=query&format=json&pageids=' + pageid; jsonRequest(url, function(res) { var key = Object.keys(res['query']['pages'])[0]; var title = res['query']['pages'][key]['title']; completionHandler('v-for-wiki://article/' + locale + '/' + encodeURIComponent(title)); } ); }"
      },
      {
        "app": "wikilinks",
        "script": "function process(url, completionHandler) { var regex = new RegExp('http(?:s)?://(?:www\\\\.)?tamper\\\\.io/(?:curiosity|inquire)/share.*(?:(?:\\\\?|&)p=(\\\\d+).*&l=([a-zA-Z0-9\\\\-_]+)|(?:\\\\?|&)l=([a-zA-Z0-9\\\\-_]+).*&p=(\\\\d+)).*$'); var match = regex.exec(url); var locale = null; if (match[2] != null) { locale = match[2] } else if (match[3] != null) { locale = match[3]; } var pageid = null; if (match[1] != null) { pageid = match[1] } else if (match[4] != null) { pageid = match[4]; } url = 'https://' + locale + '.wikipedia.org/w/api.php?action=query&format=json&pageids=' + pageid; jsonRequest(url, function(res) { var key = Object.keys(res['query']['pages'])[0]; var title = res['query']['pages'][key]['title']; var outURL = 'https://' + locale + '.wikipedia.org/wiki/' + encodeURIComponent(title); completionHandler('wikilinks://openwikipediaurl?url=' + encodeURIComponent(btoa(outURL))); } ); }"
      },
      {
        "app": "wikipanion",
        "script": "function process(url, completionHandler) { var regex = new RegExp('http(?:s)?://(?:www\\\\.)?tamper\\\\.io/(?:curiosity|inquire)/share.*(?:(?:\\\\?|&)p=(\\\\d+).*&l=([a-zA-Z0-9\\\\-_]+)|(?:\\\\?|&)l=([a-zA-Z0-9\\\\-_]+).*&p=(\\\\d+)).*$'); var match = regex.exec(url); var locale = null; if (match[2] != null) { locale = match[2] } else if (match[3] != null) { locale = match[3]; } var pageid = null; if (match[1] != null) { pageid = match[1] } else if (match[4] != null) { pageid = match[4]; } url = 'https://' + locale + '.wikipedia.org/w/api.php?action=query&format=json&pageids=' + pageid; jsonRequest(url, function(res) { var key = Object.keys(res['query']['pages'])[0]; var title = res['query']['pages'][key]['title']; completionHandler('wplink://' + locale + '.wikipedia.org/wiki/' + encodeURIComponent(title)); } ); }"
      },
      {
        "app": "wikipanionpad",
        "script": "function process(url, completionHandler) { var regex = new RegExp('http(?:s)?://(?:www\\\\.)?tamper\\\\.io/(?:curiosity|inquire)/share.*(?:(?:\\\\?|&)p=(\\\\d+).*&l=([a-zA-Z0-9\\\\-_]+)|(?:\\\\?|&)l=([a-zA-Z0-9\\\\-_]+).*&p=(\\\\d+)).*$'); var match = regex.exec(url); var locale = null; if (match[2] != null) { locale = match[2] } else if (match[3] != null) { locale = match[3]; } var pageid = null; if (match[1] != null) { pageid = match[1] } else if (match[4] != null) { pageid = match[4]; } url = 'https://' + locale + '.wikipedia.org/w/api.php?action=query&format=json&pageids=' + pageid; jsonRequest(url, function(res) { var key = Object.keys(res['query']['pages'])[0]; var title = res['query']['pages'][key]['title']; completionHandler('wplink://' + locale + '.wikipedia.org/wiki/' + encodeURIComponent(title)); } ); }"
      },
      {
        "app": "wikiwand",
        "script": "function process(url, completionHandler) { var regex = new RegExp('http(?:s)?://(?:www\\\\.)?tamper\\\\.io/(?:curiosity|inquire)/share.*(?:(?:\\\\?|&)p=(\\\\d+).*&l=([a-zA-Z0-9\\\\-_]+)|(?:\\\\?|&)l=([a-zA-Z0-9\\\\-_]+).*&p=(\\\\d+)).*$'); var match = regex.exec(url); var locale = null; if (match[2] != null) { locale = match[2] } else if (match[3] != null) { locale = match[3]; } var pageid = null; if (match[1] != null) { pageid = match[1] } else if (match[4] != null) { pageid = match[4]; } url = 'https://' + locale + '.wikipedia.org/w/api.php?action=query&format=json&pageids=' + pageid; jsonRequest(url, function(res) { var key = Object.keys(res['query']['pages'])[0]; var title = res['query']['pages'][key]['title']; completionHandler('wikiwand-article://' + locale + '/' + encodeURIComponent(title)); } ); }"
      },
      {
        "app": "wonder",
        "script": "function process(url, completionHandler) { var regex = new RegExp('http(?:s)?://(?:www\\\\.)?tamper\\\\.io/(?:curiosity|inquire)/share.*(?:(?:\\\\?|&)p=(\\\\d+).*&l=([a-zA-Z0-9\\\\-_]+)|(?:\\\\?|&)l=([a-zA-Z0-9\\\\-_]+).*&p=(\\\\d+)).*$'); var match = regex.exec(url); var locale = null; if (match[2] != null) { locale = match[2] } else if (match[3] != null) { locale = match[3]; } var pageid = null; if (match[1] != null) { pageid = match[1] } else if (match[4] != null) { pageid = match[4]; } url = 'https://' + locale + '.wikipedia.org/w/api.php?action=query&format=json&pageids=' + pageid; jsonRequest(url, function(res) { var key = Object.keys(res['query']['pages'])[0]; var title = res['query']['pages'][key]['title']; completionHandler('wonder://' + locale + '.wikipedia.org/wiki/' + encodeURIComponent(title)); } ); }"
      },
      {
        "app": "curiosity",
        "format": "curiosity://p/$2$3/$1$4"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s?)://((?:\\w+\\.)*github\\.com/.*)",
    "apps": [
      {
        "app": "ioctocat",
        "format": "ioc://$1"
      },
      {
        "app": "codehub",
        "format": "codehub://$1"
      }
    ]
  },
  {
    "title": "Show Repository",
    "regex": "http(?:s)?://(?:(?:(?!gist)\\w+\\.)*(?:(github)\\.com|(bitbucket)\\.org|(gitlab)\\.com)/([^/]+)/([^/]+?)(?:\\.git)?((/)?\\?.*$)?)$",
    "apps": [
      {
        "app": "workingcopy",
        "script": "function process(url, completionHandler) { completionHandler('working-copy://show?remote=' + encodeURIComponent(url)); }"
      },
      {
        "app": "git2go",
        "format": "gittogo://repositories/$1$2$3/$4/$5$6"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s?)://((?:\\w+\\.)*stackoverflow\\.com/.*)",
    "apps": [
      {
        "app": "stackoverflow",
        "format": "com.stackexchange.stackoverflow://$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s?)://((?:\\w+\\.)*(?:(?:stackoverflow|stackexchange|serverfault|superuser|stackapps)\\.com|mathoverflow\\.net)/.*)",
    "apps": [
      {
        "app": "stackexchange",
        "format": "se-zaphod://$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://((?:\\w+\\.)+quora\\.com/.*)$",
    "apps": [
      {
        "app": "quora",
        "format": "qhttp://$1"
      }
    ]
  },
  {
    "title": "Open Profile",
    "regex": "http(?:s)?://(?:www\\.)zhihu\\.com/people/([a-zA-Z0-9_\\-%]+).*$",
    "apps": [
      {
        "app": "zhihu",
        "format": "zhihu://people/$1"
      }
    ]
  },
  {
    "title": "Open Topic",
    "regex": "http(?:s)?://(?:www\\.)zhihu\\.com/topic/(\\d+).*$",
    "apps": [
      {
        "app": "zhihu",
        "format": "zhihu://topics/$1"
      }
    ]
  },
  {
    "title": "Open Question",
    "regex": "http(?:s)?://(?:www\\.)zhihu\\.com/question/(\\d+)(?!.*/answer/\\d+).*$",
    "apps": [
      {
        "app": "zhihu",
        "format": "zhihu://questions/$1"
      }
    ]
  },
  {
    "title": "Open Answer",
    "regex": "http(?:s)?://(?:www\\.)zhihu\\.com/question/(?:\\d+)/answer/(\\d+).*$",
    "apps": [
      {
        "app": "zhihu",
        "format": "zhihu://answers/$1"
      }
    ]
  },
  {
    "title": "Open Note",
    "regex": "http(?:s)?://(?:www\\.)evernote\\.com/shard/s\\d+/sh/([:hex:]+-)*[:hex:]+/[:hex:]+.*$",
    "apps": [
      {
        "app": "evernote",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('(evernote://.*?)\"'); var match = regex.exec(res)[1]; completionHandler(match); }"
      }
    ]
  },
  {
    "title": "Open Document",
    "regex": "http(?:s)?://(?:\\w+\\.)*quip\\.com/([a-zA-Z0-9]{12}).*$",
    "apps": [
      {
        "app": "quip",
        "format": "quip://$1"
      }
    ]
  },
  {
    "title": "Open Board",
    "regex": "http(?:s)?://(?:www\\.)?trello\\.com/b/(\\w+).*$",
    "apps": [
      {
        "app": "trello",
        "format": "trello://x-callback-url/showBoard?shortlink=$1"
      }
    ]
  },
  {
    "title": "Open Card",
    "regex": "http(?:s)?://(?:www\\.)?trello\\.com/c/(\\w+).*$",
    "apps": [
      {
        "app": "trello",
        "format": "trello://x-callback-url/showCard?shortlink=$1"
      }
    ]
  },
  {
    "title": "Open Action",
    "regex": "http(?:s)?://(?:www\\.)?launchcenterpro\\.com/(\\w{6}).*$",
    "apps": [
      {
        "app": "launchcenterpro",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('(launch://import.*?)\"'); var match = regex.exec(res)[1]; completionHandler(match); }"
      },
      {
        "app": "launchcenterproipad",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('(launch://import.*?)\"'); var match = regex.exec(res)[1]; completionHandler(match); }"
      }
    ]
  },
  {
    "title": "Open Recipe",
    "regex": "http(?:s?)://(?:www\\.)?ifttt\\.com/recipes/([0-9]+).*$",
    "apps": [
      {
        "app": "ifttt",
        "format": "ifttt://shared_recipe/$1"
      }
    ]
  },
  {
    "title": "Add Workflow",
    "regex": "http(?:s?)://(?:www\\.)?workflow.is/workflows/([:hex:]+).*$",
    "apps": [
      {
        "app": "workflow",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('(workflow://workflows/.*)\"'); var match = regex.exec(res)[1]; match = htmlDecode(match); completionHandler(match); }"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:www\\.)?houzz(?:\\.\\w+)+/((?:photos|ideabooks)/(\\d+)).*$",
    "apps": [
      {
        "app": "houzz",
        "format": "houzz:///$1"
      }
    ]
  },
  {
    "title": "Open Details",
    "regex": "http(?:s)?://(?:\\w+\\.)?zillow\\.com/homedetails/.*?(\\d+)_zpid.*$",
    "apps": [
      {
        "app": "zillow",
        "format": "zillowapp://hdp/$1"
      }
    ]
  },
  {
    "title": "Open Listing",
    "regex": "http(?:s)?://(?:www\\.)?redfin\\.com/[a-zA-Z]{2}/(?:[a-zA-Z0-9_\\-]+/){0,2}home/(\\d+).*$",
    "apps": [
      {
        "app": "redfin",
        "format": "redfin://home/$1"
      }
    ]
  },
  {
    "title": "Open Listing",
    "regex": "http(?:s)?://(?:\\w+\\.)?trulia\\.com/property/\\d+.*$",
    "apps": [
      {
        "app": "trulia",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('(urlHash=.*?)\"'); var match = regex.exec(res)[1]; completionHandler('truliapdpforsale://?' + match); }"
      }
    ]
  },
  {
    "title": "Open Listing",
    "regex": "http(?:s)?://(?:\\w+\\.)?trulia\\.com/rental(?:-community)?/\\d+.*$",
    "apps": [
      {
        "app": "truliarent",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('(urlHash=.*?)\"'); var match = regex.exec(res)[1]; completionHandler('truliapdpforrent://?' + match); }"
      }
    ]
  },
  {
    "title": "Open Illustration",
    "regex": "http(?:s)?://(?:\\w+\\.)?pixiv\\.net/member_illust\\.php?.*illust_id=(\\d+).*?$",
    "apps": [
      {
        "app": "pixiv",
        "format": "pixiv://illusts/$1"
      }
    ]
  },
  {
    "title": "Open Profile",
    "regex": "http(?:s)?://(?:\\w+\\.)?pixiv\\.net/member\\.php?.*id=(\\d+).*?$",
    "apps": [
      {
        "app": "pixiv",
        "format": "pixiv://users/$1"
      }
    ]
  },
  {
    "title": "View App",
    "regex": "http(?:s)?://(?:geo\\.)?itunes\\.apple\\.com/(?:.*/)*app/(?:.*/)?id(\\d+)(?!.*(?:&|\\?)mt=12.*).*$",
    "apps": [
      {
        "app": "appstore",
        "format": "opener://x-callback-url/show-store-product-details?id=$1"
      }
    ]
  },
  {
    "title": "View App",
    "regex": "http(?:s)?://(?:geo\\.)?itunes\\.apple\\.com/(?:.*/)*app/(?:.*/)?id(\\d+).*$",
    "apps": [
      {
        "app": "appshopper",
        "format": "appshoppersocial://app/$1"
      },
      {
        "app": "appzapp",
        "format": "appzapp://app?appid=$1"
      },
      {
        "app": "catchapp",
        "format": "catchapp://app?id=$1"
      },
      {
        "app": "catchapppad",
        "format": "catchapp://app?id=$1"
      },
      {
        "app": "pricetag",
        "format": "pricetag://activity?id=$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:geo\\.)?itunes\\.apple\\.com/(?:.*/)*(artist|album|music-video)/(?:.*/)?id(\\d+).*?(?:(?:\\?|&)(i=(?:\\d+)))?.*?$",
    "apps": [
      {
        "app": "itunesstore",
        "format": "itms://itunes.apple.com/$1/id$2?at=1001l3kM&$3"
      },
      {
        "app": "applemusic",
        "format": "music://itunes.apple.com/$1/id$2?at=1001l3kM&$3"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:geo\\.)?itunes\\.apple\\.com/(?:.*/)*(movie|tv-season)/(?:.*/)?id(\\d+).*?(?:(?:\\?|&)(i=(?:\\d+)))?.*?$",
    "apps": [
      {
        "app": "itunesstore",
        "format": "itms://itunes.apple.com/$1/id$2?at=1001l3kM&$3"
      }
    ]
  },
  {
    "title": "Open Playlist",
    "regex": "http(?:s)?://((?:geo\\.)?itunes\\.apple\\.com/(?:.*/)?playlist/.*)$",
    "apps": [
      {
        "app": "applemusic",
        "format": "music://$1"
      }
    ]
  },
  {
    "title": "Convert Link",
    "regex": "(http(?:s)?://(?:geo\\.)?itunes\\.apple\\.com/(?!.*/podcast/.*)(?:.*/)?id(\\d+).*)$",
    "apps": [
      {
        "app": "blink",
        "format": "blink://x-callback-url/search?q=$1"
      }
    ]
  },
  {
    "title": "Open Deal",
    "regex": "http(?:s)?://(?:www\\.)?slickdeals\\.net/f/(\\d+).*$",
    "apps": [
      {
        "app": "slickdeals",
        "format": "slickdeals://thread/$1"
      }
    ]
  },
  {
    "title": "Open Story",
    "regex": "http(?:s)?://abcnews\\.go\\.com/.*(?:(?:\\w+-)|/story.*(?:\\?|&)id=)+(\\d+).*?$",
    "apps": [
      {
        "app": "abcnewsiphone",
        "format": "abcnewsiphone://link/story,$1"
      },
      {
        "app": "abcnewsipad",
        "format": "abcnewsipad://link/story,$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:\\w+\\.)?imgur\\.com/(?:gallery/|a/|r/.*/)?(\\w+).*?$",
    "apps": [
      {
        "app": "imgur",
        "format": "imgur://imgur.com/$1"
      }
    ]
  },
  {
    "title": "Open Shot",
    "regex": "http(?:s)?://(?:(?!help)\\w+\\.)?dribbble\\.com/shots/(\\d+).*?$",
    "apps": [
      {
        "app": "zeeen",
        "format": "zeeen://shot/$1"
      }
    ]
  },
  {
    "title": "Open Profile",
    "regex": "http(?:s)?://(?:(?!help)\\w+\\.)?dribbble\\.com/(?:player(?:s)?/)?(?!shots|session|signup|search|skills|teams|meetups|stories|jobs|about)(\\w+).*$",
    "apps": [
      {
        "app": "zeeen",
        "format": "zeeen://player/$1"
      }
    ]
  },
  {
    "title": "Open Issue",
    "regex": "http(?:s)?://((\\w+\\.)*jira(\\.\\w+)+.*$)",
    "apps": [
      {
        "app": "jira",
        "format": "jira://$1"
      },
      {
        "app": "jirapad",
        "format": "jira://$1"
      }
    ]
  },
  {
    "title": "Open Track",
    "regex": "http(?:s)?://(?:www\\.)?tidal\\.com/(?:#!/)?track/(\\d+).*$",
    "apps": [
      {
        "app": "tidal",
        "format": "tidal://track/$1"
      }
    ]
  },
  {
    "title": "Open Album",
    "regex": "http(?:s)?://(?:www\\.)?tidal\\.com/(?:#!/)?album/(\\d+).*$",
    "apps": [
      {
        "app": "tidal",
        "format": "tidal://album/$1"
      }
    ]
  },
  {
    "title": "Open Artist",
    "regex": "http(?:s)?://(?:www\\.)?tidal\\.com/(?:#!/)?artist/(\\d+).*$",
    "apps": [
      {
        "app": "tidal",
        "format": "tidal://artist/$1"
      }
    ]
  },
  {
    "title": "Open Playlist",
    "regex": "http(?:s)?://(?:www\\.)?tidal\\.com/(?:#!/)?playlist/([a-fA-F0-9\\-]+).*$",
    "apps": [
      {
        "app": "tidal",
        "format": "tidal://playlist/$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://((?:\\w+\\.)*(?:taobao|tmall)\\.com/.*)$",
    "apps": [
      {
        "app": "taobao",
        "format": "taobao://$1"
      },
      {
        "app": "taobaopad",
        "format": "taobao://$1"
      }
    ]
  },
  {
    "title": "Open Item",
    "regex": "http(?:s)?://(?:(?:\\w+\\.)*jd\\.(?:com|hk)/(?:.*/)?(\\d+)\\.(?:s)?html|(?:\\w+\\.)*jd\\.(?:com|hk)/(?:ware/view\\.action|my/).*(?:wareId|sku)=(\\d+)).*?$",
    "apps": [
      {
        "app": "jingdong",
        "format": "openapp.jdmobile://virtual?params=%7B%22category%22%3A%22jump%22%2C%22des%22%3A%22productDetail%22%2C%22sourceType%22%3A%22unknown%22%2C%22sourceValue%22%3A%22unknown%22%2C%22skuId%22%3A%22$1$2%22%7D"
      },
      {
        "app": "jingdongpad",
        "format": "openapp.jdiPad://virtual?params=%7B%22category%22%3A%22jump%22%2C%22des%22%3A%22productDetail%22%2C%22sourceType%22%3A%22unknown%22%2C%22sourceValue%22%3A%22unknown%22%2C%22skuId%22%3A%22$1$2%22%7D"
      }
    ]
  },
  {
    "title": "Open List",
    "regex": "http(?:s)?://li\\.st/(?:l/((?:[:hex:]+-)+(?:[:hex:]+)|\\w+)|(?!l|about|contact|faq|community|privacy|terms)[^/]+/.*-(\\w+)).*?$",
    "apps": [
      {
        "app": "thelistapp",
        "format": "thelistapp://l/$1$2"
      }
    ]
  },
  {
    "title": "Open Profile",
    "regex": "http(?:s)?://li\\.st/(?:u/)?(?!l|about|contact|faq|community|privacy|terms)([^/\\?]+)(?:(?:/)?\\?.*|/)?$",
    "apps": [
      {
        "app": "thelistapp",
        "format": "thelistapp://u/$1"
      }
    ]
  },
  {
    "title": "Open Post",
    "regex": "http(?:s)?://tieba\\.baidu\\.(?:com|cn)/p/(\\d+).*$",
    "apps": [
      {
        "app": "tieba",
        "format": "com.baidu.tieba://jumptoforum?kz=$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:www\\.|m\\.)?vk\\.(?:com|ru)/(.*)$",
    "apps": [
      {
        "app": "vk",
        "format": "vk://vk.com/$1"
      }
    ]
  },
  {
    "title": "Add Tracking Info",
    "regex": "http(?:s)?://(?:www\\.|m\\.)?(?:tools\\.|trkcnfrm\\.smi\\.|trkcnfrm1\\.smi\\.)?usps\\.com.*(?:\\?|&)(?:tLabels|strOrigTrackNum|origTrackNum|qtc_tLabels1|formattedLabel)=(\\d+).*$",
    "apps": [
      {
        "app": "deliveries",
        "script": "function process(url, completionHandler) { completionHandler('deliveries://add/' + encodeURIComponent(url)); }"
      }
    ]
  },
  {
    "title": "Add Tracking Info",
    "regex": "http(?:s)?://(?:www\\.|m\\.)?(?:wwwapps\\.|campusship\\.)?ups\\.com.*(?:\\?|&)(?:InquiryNumber1|tracknum|trackNums|inquiry1|trackingNumber|InquiryNumber)=(\\w+).*$",
    "apps": [
      {
        "app": "deliveries",
        "script": "function process(url, completionHandler) { completionHandler('deliveries://add/' + encodeURIComponent(url)); }"
      }
    ]
  },
  {
    "title": "Add Tracking Info",
    "regex": "http(?:s)?://(?:www\\.|m\\.)?(?:spportal\\.)?(?:fedex|federalexpress)\\.com.*(?:\\?|&)(?:tracknumbers|tracknums|trackNum|track_number_0|tracknumber_list|TRACKING|PID)=(\\d+).*$",
    "apps": [
      {
        "app": "deliveries",
        "script": "function process(url, completionHandler) { completionHandler('deliveries://add/' + encodeURIComponent(url)); }"
      }
    ]
  },
  {
    "title": "Add Tracking Info",
    "regex": "http(?:s)?://(?:www\\.|m\\.)?(?:track\\.)?(?:dhl|dhl-usa|airborne)\\.com.*(?:\\?|&)(?:AWB|ShipmentNumber|shipmentNumber)=(\\d+).*$",
    "apps": [
      {
        "app": "deliveries",
        "script": "function process(url, completionHandler) { completionHandler('deliveries://add/' + encodeURIComponent(url)); }"
      }
    ]
  },
  {
    "title": "Add Tracking Info",
    "regex": "http(?:s)?://(?:www\\.|m\\.)?(?:webtrack\\.)?(?:dhlglobalmail\\.com|dhlgm\\.mytracking\\.net).*(?:\\?|&)(?:trackingnumber|TrackingID)=(\\d+).*$",
    "apps": [
      {
        "app": "deliveries",
        "script": "function process(url, completionHandler) { completionHandler('deliveries://add/' + encodeURIComponent(url)); }"
      }
    ]
  },
  {
    "title": "Add Tracking Info",
    "regex": "http(?:s)?://(?:(?:\\w+\\.)*dhl\\.de|webportal-at\\.dhl\\.com).*(?:\\?|&)(?:idc|packet_id|sid|AWB|ic)=(\\d+).*$",
    "apps": [
      {
        "app": "deliveries",
        "script": "function process(url, completionHandler) { completionHandler('deliveries://add/' + encodeURIComponent(url)); }"
      }
    ]
  },
  {
    "title": "Add Tracking Info",
    "regex": "http(?:s)?://(?:\\w+\\.)*dhl\\.co\\.uk.*(?:\\?|&)PCL_NO=(\\d+).*$",
    "apps": [
      {
        "app": "deliveries",
        "script": "function process(url, completionHandler) { completionHandler('deliveries://add/' + encodeURIComponent(url)); }"
      }
    ]
  },
  {
    "title": "Add Tracking Info",
    "regex": "http(?:s)?://checkout\\.google\\.com.*(?:\\?|&)t=(\\d+).*$",
    "apps": [
      {
        "app": "deliveries",
        "script": "function process(url, completionHandler) { completionHandler('deliveries://add/' + encodeURIComponent(url)); }"
      }
    ]
  },
  {
    "title": "Add Tracking Info",
    "regex": "http(?:s)?://(?:\\w+\\.)?ontrac\\.com.*(?:\\?|&)tracking_number=(\\w+).*$",
    "apps": [
      {
        "app": "deliveries",
        "script": "function process(url, completionHandler) { completionHandler('deliveries://add/' + encodeURIComponent(url)); }"
      }
    ]
  },
  {
    "title": "Add Tracking Info",
    "regex": "http(?:s)?://(?:www\\.)?(?:secure\\.|secure1\\.|secure2\\.)?(?:store\\.)?apple\\.com/(?:.*)?(?!hk-zh/|jp/)(?:order/guest/|vieworder/|orderNumberField=|olsson=)(\\w+).*$",
    "apps": [
      {
        "app": "deliveries",
        "script": "function process(url, completionHandler) { completionHandler('deliveries://add/' + encodeURIComponent(url)); }"
      }
    ]
  },
  {
    "title": "Add Tracking Info",
    "regex": "http(?:s)?://(?:www\\.)?(?:secure\\.|secure1\\.|secure2\\.)?(?:store\\.)?apple\\.com/(?:.*)?hk-zh(/.*)?(?:order/guest/|vieworder/|orderNumberField=|olsson=)(\\w+).*$",
    "apps": [
      {
        "app": "deliveries",
        "script": "function process(url, completionHandler) { completionHandler('deliveries://add/' + encodeURIComponent(url)); }"
      }
    ]
  },
  {
    "title": "Add Tracking Info",
    "regex": "http(?:s)?://(?:www\\.)?(?:secure\\.|secure1\\.|secure2\\.)?(?:store\\.)?apple\\.com/(?:.*)?hk-zh(/.*)?(?:order/guest/|vieworder/|orderNumberField=|olsson=)(\\w+).*$",
    "apps": [
      {
        "app": "deliveries",
        "script": "function process(url, completionHandler) { completionHandler('deliveries://add/' + encodeURIComponent(url)); }"
      }
    ]
  },
  {
    "title": "Add Tracking Info",
    "regex": "http(?:s)?://(?:www\\.)?applestore\\.bridge-point\\.com.*(?:\\?|&)sc=(\\w+).*$",
    "apps": [
      {
        "app": "deliveries",
        "script": "function process(url, completionHandler) { completionHandler('deliveries://add/' + encodeURIComponent(url)); }"
      }
    ]
  },
  {
    "title": "Add Tracking Info",
    "regex": "http(?:s)?://(?:\\w+\\.)*(amazon(?:\\.\\w+)+).*(?:\\?|&)(?:trackingNumber|orderId|orderID|oid|orderIDs)=(\\d{3,3}-\\d+-\\d+).*$",
    "apps": [
      {
        "app": "deliveries",
        "script": "function process(url, completionHandler) { completionHandler('deliveries://add/' + encodeURIComponent(url)); }"
      }
    ]
  },
  {
    "title": "Open Story",
    "regex": "http(?:s)?://(?:www\\.)?apple\\.news/([a-zA-Z0-9_\\-]+).*?$",
    "apps": [
      {
        "app": "applenews",
        "format": "applenews:/$1"
      }
    ]
  },
  {
    "title": "Open Restaurant",
    "regex": "http(?:s)?://(?:\\w+\\.)+?opentable(?:\\.\\w+)+(?:/restaurants/.*/(\\d+)|.*rid=(\\d+).*||.*\\n.*er=(\\d+).*)$",
    "apps": [
      {
        "app": "opentable",
        "format": "reservetable-com.contextoptional.OpenTable-1://?rid=$1$2$3"
      }
    ]
  },
  {
    "title": "Open Story",
    "regex": "http(?:s)?://news\\.ycombinator\\.com/item.*(?:\\?|&)id=(\\d+).*?$",
    "apps": [
      {
        "app": "boreal",
        "format": "borealhn://post?$1"
      }
    ]
  },
  {
    "title": "Open Commentary",
    "regex": "http(?:s)?://news\\.ycombinator\\.com/item.*(?:\\?|&)id=(\\d+).*?$",
    "apps": [
      {
        "app": "boreal",
        "format": "borealhn://comments?$1"
      }
    ]
  },
  {
    "title": "Open Profile",
    "regex": "http(?:s)?://news\\.ycombinator\\.com/user.*(?:\\?|&)id=([^&]+).*?$",
    "apps": [
      {
        "app": "boreal",
        "format": "borealhn://profile?$1"
      }
    ]
  },
  {
    "title": "Open Video",
    "regex": "http(?:s)?://(?:\\w+\\.)?(?:nicovideo\\.jp/watch/|nico\\.ms/)((?:sm)?\\d+).*$",
    "apps": [
      {
        "app": "niconico",
        "format": "niconico://$1"
      },
      {
        "app": "inico2",
        "format": "inico2http://www.nicovideo.jp/watch/$1"
      },
      {
        "app": "smileplayer2",
        "format": "smileplayer2://id/$1"
      },
      {
        "app": "nicoli",
        "format": "nicolihttp://www.nicovideo.jp/watch/$1"
      }
    ]
  },
  {
    "title": "Open Video",
    "regex": "http(?:s)?://(?:\\w+\\.)?(?:nicovideo\\.jp/watch/|nico\\.ms/)(so\\d+).*$",
    "apps": [
      {
        "app": "inico2",
        "format": "inico2http://www.nicovideo.jp/watch/$1"
      },
      {
        "app": "smileplayer2",
        "format": "smileplayer2://id/$1"
      },
      {
        "app": "nicoli",
        "format": "nicolihttp://www.nicovideo.jp/watch/$1"
      }
    ]
  },
  {
    "title": "Open Video",
    "regex": "http(?:s)?://(?:\\w+\\.)?(?:nicovideo\\.jp/watch/|nico\\.ms/)(nm\\d+).*$",
    "apps": [
      {
        "app": "niconico",
        "format": "niconico://$1"
      },
      {
        "app": "inico2",
        "format": "inico2http://www.nicovideo.jp/watch/$1"
      },
      {
        "app": "nicoli",
        "format": "nicolihttp://www.nicovideo.jp/watch/$1"
      }
    ]
  },
  {
    "title": "Open Live Video",
    "regex": "http(?:s)?://(?:\\w+\\.)?(?:nicovideo\\.jp/watch/|nico\\.ms/)(lv\\d+).*$",
    "apps": [
      {
        "app": "niconico",
        "format": "niconico://$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(plus\\.google\\.com/.*)$",
    "apps": [
      {
        "app": "googleplus",
        "format": "gplus://$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:www\\.|m\\.)?(wolframalpha\\.com/input.*)$",
    "apps": [
      {
        "app": "wolframalpha",
        "format": "wolframalpha://$1"
      }
    ]
  },
  {
    "title": "Open Story",
    "regex": "http(?:s)?://(?:www\\.|m\\.|mobile\\.)(nytimes\\.com/\\d+/\\d+/\\d+.*)$",
    "apps": [
      {
        "app": "nytimes",
        "format": "nytimes://www.$1"
      }
    ]
  },
  {
    "title": "Open Task",
    "regex": "http(?:s)?://(?:\\w+\\.)*asana\\.com/(\\d/\\d+/\\d+.*)$",
    "apps": [
      {
        "app": "asana",
        "format": "asana://app.asana.com/$1"
      }
    ]
  },
  {
    "title": "Import PDF",
    "regex": "(http(?:s)?://([^?]+(?:\\.pdf).*))$",
    "apps": [
      {
        "app": "pdfexpert",
        "format": "pdfehttp://$2"
      },
      {
        "app": "pdfviewer",
        "format": "pdfviewer://x-callback-url/add-file?url=$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:\\w+\\.)?goodreads\\.com/(.*)$",
    "apps": [
      {
        "app": "goodreads",
        "format": "goodreads://$1"
      }
    ]
  },
  {
    "title": "Open Doc",
    "regex": "http(?:s)?://(docs\\.google\\.com/.*document/d/.*)$",
    "apps": [
      {
        "app": "googledocs",
        "format": "googledocs://$1"
      }
    ]
  },
  {
    "title": "Open Sheet",
    "regex": "http(?:s)?://(docs\\.google\\.com/.*spreadsheets/d/.*)$",
    "apps": [
      {
        "app": "googlesheets",
        "format": "googlesheets://$1"
      }
    ]
  },
  {
    "title": "Open Slides",
    "regex": "http(?:s)?://(docs\\.google\\.com/.*presentation/d/.*)$",
    "apps": [
      {
        "app": "googleslides",
        "format": "googleslides://$1"
      }
    ]
  },
  {
    "title": "Add User",
    "regex": "http(?:s)?://(?:www\\.)?snapchat\\.com/add/([^/]+).*?$",
    "apps": [
      {
        "app": "snapchat",
        "format": "snapchat://add/$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:www\\.)?snapchat\\.com/unlock(.*)$",
    "apps": [
      {
        "app": "snapchat",
        "format": "snapchat://unlock$1"
      }
    ]
  },
  {
    "title": "Add User",
    "regex": "http(?:s)?://(?:www\\.)?peach\\.cool/add/([^/]+).*?$",
    "apps": [
      {
        "app": "peach",
        "format": "peach://add/$1"
      }
    ]
  },
  {
    "title": "Open Post",
    "regex": "http(?:s)?://(?:www\\.)?wear\\.jp/[^/]+/coordinate/(\\d+).*?$",
    "apps": [
      {
        "app": "wear",
        "format": "wear2020://wear.jp/coordinate/$1"
      }
    ]
  },
  {
    "title": "Open Story",
    "regex": "http(?:s)?://(?:\\w+\\.)*media\\.daum\\.net/(?:m/media/(?:[^/]+/)?newsview/|v/)(\\d+).*?$",
    "apps": [
      {
        "app": "daum",
        "format": "daumapps://web?url=http%3A%2F%2Fv.media.daum.net%2Fv%2F$1%3Ff%3Dm"
      }
    ]
  },
  {
    "title": "Open Profile",
    "regex": "http(?:s)?://([^\\.]+)\\.deviantart\\.com(?:(/)?\\?.*|/(gallery(/)?(\\?.*)?)?)?$",
    "apps": [
      {
        "app": "deviantart",
        "format": "deviantart://profile/$1"
      }
    ]
  },
  {
    "title": "Open Gallery",
    "regex": "http(?:s)?://([^\\.]+)\\.deviantart\\.com/gallery/\\d+.*$",
    "apps": [
      {
        "app": "deviantart",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('://gallery/([^\\\"]+)'); var match = regex.exec(res)[1]; completionHandler('deviantart://gallery/' + match); }"
      }
    ]
  },
  {
    "title": "Open Collection",
    "regex": "http(?:s)?://([^\\.]+)\\.deviantart\\.com/favourites/\\d+.*$",
    "apps": [
      {
        "app": "deviantart",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('://collection/([^\\\"]+)'); var match = regex.exec(res)[1]; completionHandler('deviantart://collection/' + match); }"
      }
    ]
  },
  {
    "title": "Open Deviation",
    "regex": "http(?:s)?://(([^\\.]+)\\.deviantart\\.com/(art|journal)/|sta\\.sh/).*$",
    "apps": [
      {
        "app": "deviantart",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('://deviation/([^\\\"]+)'); var match = regex.exec(res)[1]; completionHandler('deviantart://deviation/' + match); }"
      }
    ]
  },
  {
    "title": "Open Tag",
    "regex": "http(?:s)?://(?:\\w+\\.)*deviantart\\.com/tag/([^/]+).*$",
    "apps": [
      {
        "app": "deviantart",
        "format": "deviantart://tag/$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:www\\.)?anchor\\.fm/(w/.*)$",
    "apps": [
      {
        "app": "anchor",
        "format": "anchorfm://app/$1"
      }
    ]
  },
  {
    "title": "Open Story",
    "regex": "http(?:s)?://(?:\\w+\\.)*9gag\\.com/gag/([^/]+).*$",
    "apps": [
      {
        "app": "9gag",
        "format": "ninegag://9gag.com/gag/$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:\\w+\\.)?tabelog\\.com/(?:\\w+/){3,4}(\\d+).*?$",
    "apps": [
      {
        "app": "tabelog",
        "format": "tabelog-v2://rstdtl/$1"
      }
    ]
  },
  {
    "title": "Open Auction",
    "regex": "http(?:s)?://(?:\\w+\\.)*auctions\\.yahoo\\.co\\.jp(?:/.*)?/auction/(\\w+).*$",
    "apps": [
      {
        "app": "yahooauctions",
        "format": "yjauctions://auctionitem?auctionid=$1"
      }
    ]
  },
  {
    "title": "Open ",
    "regex": "http(?:s)?://(?:www\\.)?ticketfly\\.com/(?:purchase/)?event/(\\d+).*?$",
    "apps": [
      {
        "app": "ticketfly",
        "format": "ticketfly://app/events/$1"
      }
    ]
  },
  {
    "title": "Open Recommendation",
    "regex": "http(?:s)?://rex\\.is/p/(\\d+).*?$",
    "apps": [
      {
        "app": "rex",
        "format": "rex://pick/$1/view"
      }
    ]
  },
  {
    "title": "Open Song",
    "regex": "http(?:s)?://(?:www\\.)?(soundhound\\.com/?.*t=\\d+.*)$",
    "apps": [
      {
        "app": "soundhound",
        "format": "soundhound://$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:[^\\.])+\\.hatenablog(?:\\.\\w+)+.*$",
    "apps": [
      {
        "app": "hatenablog",
        "script": "function process(url, completionHandler) { completionHandler('hatenablog:///open?uri=' + encodeURIComponent(url)); }"
      }
    ]
  },
  {
    "title": "Open Story",
    "regex": "http(?:s)?://(?:\\w+\\.)*thescore\\.com/(?:[^/]+/)?news/(\\d+).*?$",
    "apps": [
      {
        "app": "thescore",
        "format": "thescore:///news/$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:\\w+\\.)*glassdoor\\.com/(.*)$",
    "apps": [
      {
        "app": "glassdoor",
        "format": "glassdoor://$1"
      }
    ]
  },
  {
    "title": "Open Chat",
    "regex": "http(?:s)://(?:www\\.)?(?:telegram|t)\\.me/(?!addstickers)([^/\\?#]+).*$",
    "apps": [
      {
        "app": "telegram",
        "format": "tg://resolve?domain=$1"
      }
    ]
  },
  {
    "title": "Add Stickers",
    "regex": "http(?:s)://(?:www\\.)?(?:telegram|t)\\.me/addstickers/([^/\\?#]+).*$",
    "apps": [
      {
        "app": "telegram",
        "format": "tg://addstickers?set=$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:\\w+\\.)*mobile01\\.com/(\\w+detail)\\.php\\?(.*)$",
    "apps": [
      {
        "app": "mobile01",
        "format": "m01://$1?$2"
      }
    ]
  },
  {
    "title": "View Lyrics",
    "regex": "http(?:s)?://(?:www\\.)?genius\\.com/(\\d+|.*-lyrics).*$",
    "apps": [
      {
        "app": "genius",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('(genius://.*?)\"'); var results = regex.exec(res); var match = null; if (results != null && results.length > 1) { match = results[1] }; completionHandler(match); }"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:\\w+\\.)*espn\\.com(?:\\.\\w+)?/(?!video).*id/(\\d+).*$",
    "apps": [
      {
        "app": "espn",
        "format": "sportscenter://x-callback-url/showStory?uid=$1"
      }
    ]
  },
  {
    "title": "Open Media",
    "regex": "(http(?:s)?://([^:/\\s]+)/[^?]+\\.(mp4|mkv|tp|mov|avi|wmv|asf|flv|ogv|rmvb|mp3|wav|wma|flac|ape))/?(\\?.*)?$",
    "apps": [
      {
        "app": "nplayer",
        "format": "nplayer-$1"
      }
    ]
  },
  {
    "title": "Stream Media",
    "regex": "(http(?:s)?://([^:/\\s]+)/[^?]+\\.(mpeg|mp1v|mpg1|PIM1|mp2v|mpg2|vcr2|hdv1|hdv2|hdv3|mx.n|mx.p|DIV1|DIV2|DIV3|mp4|mp41|mp42|MPG4|MPG3|DIV4|DIV5|DIV6|col1|col0|3ivd|DIVX|Xvid|mp4s|m4s2|xvid|mp4v|fmp4|3iv2|smp4|h261|h262|h263|h264|s264|AVC1|DAVC|H264|X264|VSSH|SVQ.|cvid|thra|wmv1|wmv2|wmv3|wvc1|wmva|VP31|VP30|VP3|VP50|VP5|VP51|VP60|VP61|VP62|VP6F|VP6A|VP7|FSV1|IV31|IV32|IV41|IV51|RV10|RV13|RV20|RV30|RV40|BBCD|wmv|mpga|mp3|LAME|mp4a|a52|a52b|atrc|ILBC|Qclp|lpcJ|28_8|dnet|sipr|cook|atrc|raac|racp|ralf|shrn|spex|vorb|ogg|dts|wma|wma1|wma2|flac|alac|samr|SONC|3gp|asf|au|avi|flv|mov|ogm|mkv|mka|ts|mpg|mp2|nsc|nsv|nut|ra|ram|rm|tv|rmbv|a52|dts|aac|dv|vid|tta|tac|ty|wav|dts|xa))/?(\\?.*)?$",
    "apps": [
      {
        "app": "vlc",
        "script": "function process(url, completionHandler) { completionHandler('vlc-x-callback://x-callback-url/stream?url=' + encodeURIComponent(url)); }"
      },
      {
        "app": "infuse",
        "script": "function process(url, completionHandler) { completionHandler('infuse://x-callback-url/play?url=' + encodeURIComponent(url)); }"
      }
    ]
  },
  {
    "title": "Download Media",
    "regex": "(http(?:s)?://([^:/\\s]+)/[^?]+\\.(mpeg|mp1v|mpg1|PIM1|mp2v|mpg2|vcr2|hdv1|hdv2|hdv3|mx.n|mx.p|DIV1|DIV2|DIV3|mp4|mp41|mp42|MPG4|MPG3|DIV4|DIV5|DIV6|col1|col0|3ivd|DIVX|Xvid|mp4s|m4s2|xvid|mp4v|fmp4|3iv2|smp4|h261|h262|h263|h264|s264|AVC1|DAVC|H264|X264|VSSH|SVQ.|cvid|thra|wmv1|wmv2|wmv3|wvc1|wmva|VP31|VP30|VP3|VP50|VP5|VP51|VP60|VP61|VP62|VP6F|VP6A|VP7|FSV1|IV31|IV32|IV41|IV51|RV10|RV13|RV20|RV30|RV40|BBCD|wmv|mpga|mp3|LAME|mp4a|a52|a52b|atrc|ILBC|Qclp|lpcJ|28_8|dnet|sipr|cook|atrc|raac|racp|ralf|shrn|spex|vorb|ogg|dts|wma|wma1|wma2|flac|alac|samr|SONC|3gp|asf|au|avi|flv|mov|ogm|mkv|mka|ts|mpg|mp2|nsc|nsv|nut|ra|ram|rm|tv|rmbv|a52|dts|aac|dv|vid|tta|tac|ty|wav|dts|xa))/?(\\?.*)?$",
    "apps": [
      {
        "app": "vlc",
        "script": "function process(url, completionHandler) { completionHandler('vlc-x-callback://x-callback-url/download?url=' + encodeURIComponent(url)); }"
      }
    ]
  },
  {
    "title": "Open Note",
    "regex": "http(s)?://(www\\.)?jianshu\\.com/p/\\w+",
    "apps": [
      {
        "app": "jianshu",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('(jianshu://notes/\\\\d+)'); var results = regex.exec(res); var match = null; if (results != null && results.length > 1) { match = results[1] }; completionHandler(match); }"
      }
    ]
  },
  {
    "title": "Open Geocache",
    "regex": "http(?:s)?://(?:www\\.)?(?:geocaching\\.com/geocache|coord\\.info)/(GC[A-Za-z0-9]+).*$",
    "apps": [
      {
        "app": "cachly",
        "format": "cachly://gccode=$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:www\\.)?netflix\\.com/((watch|title)/.*)$",
    "apps": [
      {
        "app": "netflix",
        "format": "nflx://$1"
      }
    ]
  },
  {
    "title": "Open Sale",
    "regex": "http(?:s)?://(?:\\w+\\.)?wallapop\\.com/(?:i/|item/.*-)(\\d+).*?$",
    "apps": [
      {
        "app": "wallapop",
        "format": "wallapop://i/$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:www\\.|m\\.)?douyu\\.(?:com|tv)/(\\d+).*?$",
    "apps": [
      {
        "app": "douyu",
        "format": "douyutv://$1&0&"
      }
    ]
  },
  {
    "title": "Open Video",
    "regex": "http(?:s)?://(?:www\\.)?abemafresh\\.tv/(?:[^/]+)/(\\d+).*?$",
    "apps": [
      {
        "app": "amebafresh",
        "format": "amebafresh://program/$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "(http(?:s)?://(\\w+\\.)?namu\\.wiki/.*)$",
    "apps": [
      {
        "app": "namuviewer",
        "format": "namuviewer://?url=$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:\\w+\\.)?pandora\\.com/(?!station/play/).*",
    "apps": [
      {
        "app": "pandora",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('(pandorav\\\\d+:/.*?)\"'); var results = regex.exec(res); var match = null; if (results != null && results.length > 1) { match = results[1] }; completionHandler(match); }"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:\\w+\\.)?pandora\\.com/station/play/(\\d+).*?",
    "apps": [
      {
        "app": "pandora",
        "format": "pandorav2:/createStation?stationId=$1"
      }
    ]
  },
  {
    "title": "Open Article",
    "regex": "http(?:s)?://(?:\\w+\\.)?wsj\\.com/articles/.*$",
    "apps": [
      {
        "app": "wsj",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('(wsj://.*?)\"'); var results = regex.exec(res); var match = null; if (results != null && results.length > 1) { match = results[1].replace(new RegExp('&headline=[^&]*'), '') + '&headline=' }; completionHandler(match); }"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:\\w+\\.)?mixcloud\\.com/(.+)$",
    "apps": [
      {
        "app": "mixcloud",
        "format": "mc://$1"
      }
    ]
  },
  {
    "title": "Open Story",
    "regex": "http(?:s)?://(?:\\w+\\.)?lemonde\\.fr/[^/]+/article/.*?_(\\d+).*?$",
    "apps": [
      {
        "app": "lemonde",
        "format": "lmfr://element/article/$1"
      }
    ]
  },
  {
    "title": "Open Slides",
    "regex": "http(s)?://(www\\.)?slideshare\\.net/[^/]+/[^/|\\?]+.*$",
    "apps": [
      {
        "app": "slideshare",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('.*(slideshare-app://ss/\\\\d+).*'); var results = regex.exec(res); var match = null; if (results != null && results.length > 1) { match = results[1] }; completionHandler(match); }"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:www\\.)?(appadvice\\.com/.*)$",
    "apps": [
      {
        "app": "appadvice",
        "format": "aaexternal://$1"
      }
    ]
  },
  {
    "title": "Open Doc",
    "regex": "http(?:s)?://paper\\.dropbox\\.com/doc/.*$",
    "apps": [
      {
        "app": "dropboxpaper",
        "script": "function process(url, completionHandler) { completionHandler('dbx-paper://open-doc?url=' + encodeURIComponent(url)); }"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://music\\.163\\.com/(?:(?:m|#)/)?(song|album|playlist|program)(?:(?:.*(?:&|\\?)id=|/))(\\d+).*$",
    "apps": [
      {
        "app": "orpheus",
        "format": "orpheus://$1/$2"
      }
    ]
  },
  {
    "title": "Open Story",
    "regex": "http(?:s)?://(?:www\\.)?blendle\\.com/(?:i|item)/(?:[^/]+/[^/]+/)?([^/|\\?]*).*$",
    "apps": [
      {
        "app": "blendle",
        "format": "blendle://item/$1"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:\\w+\\.)?(?:zomato\\.com|zoma\\.to).*$",
    "apps": [
      {
        "app": "zomato",
        "script": "function process(url, completionHandler) { var res = $http.sync(url); var regex = RegExp('.*(zomato://[^\"]+).*'); var results = regex.exec(res); var match = null; if (results != null && results.length > 1) { match = results[1] }; completionHandler(match); }"
      }
    ]
  },
  {
    "title": "Open Link",
    "regex": "http(?:s)?://(?:\\w+\\.)?eventshigh\\.com/(.*)$",
    "apps": [
      {
        "app": "eventshigh",
        "format": "ehapp://$1"
      }
    ]
  }
]

$app.hidden = true

var link = $context.link || $clipboard.link

if (!link) {
  return
}

var matched = false

for (var rule of rules) {
  var regex = new RegExp(rule.regex)
  var matches = regex.exec(link)
  if (matches) {
    matched = true
    var apps = rule.apps
    if (apps.length == 1) {
      open(apps[0], link, matches)
    } else {
      $ui.menu({
        items: apps.map(function(x) { return x.app }),
        handler: function(title, idx) {
          open(apps[idx], link, matches)
        }
      })
    }
    break
  }
}

if (!matched) {
  $app.openURL(link)
}

function open(app, url, matches) {
  var format = app.format
  if (format) {
    for (var idx=1; idx<matches.length; ++idx) {
      format = format.replace("$" + idx, matches[idx])
    }
    $app.openURL(format)
  } else {
    var script = app.script
    if (script) {
      eval(script)
      process(url, function(match) {
        $app.openURL(match)
      })
    }
  }
}

function jsonRequest(url, completionHandler) {
  $http.get({
    url: url,
    handler: function(resp) {
      var data = resp.data
      completionHandler(data);
    }
  })
}
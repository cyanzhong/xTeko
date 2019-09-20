var entities = [
  { name: $l10n("SOFTWARE"), code: "software" },
  { name: $l10n("MUSIC"), code: "musicTrack" },
  { name: $l10n("MOVIE"), code: "movie" },
  { name: $l10n("PODCAST"), code: "podcast" },
]

var countries = [
  { name: "🇨🇳 CN", code: "cn" },
  { name: "🇭🇰 HK", code: "hk" },
  { name: "🇺🇸 US", code: "us" },
  { name: "🇬🇧 UK", code: "uk" },
  { name: "🇯🇵 JP", code: "jp" }
]

module.exports = {
  entities: entities,
  countries: countries
}
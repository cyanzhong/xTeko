let suffix = ".traineddata.gz";

let supportedLanguages = [
  {"name": "Afrikaans", "code": "afr"},
  {"name": "Arabic", "code": "ara"},
  {"name": "Azerbaijani", "code": "aze"},
  {"name": "Belarusian", "code": "bel"},
  {"name": "Bengali", "code": "ben"},
  {"name": "Bulgarian", "code": "bul"},
  {"name": "Catalan", "code": "cat"},
  {"name": "Czech", "code": "ces"},
  {"name": "Chinese", "code": "chi_sim"},
  {"name": "Traditional Chinese", "code": "chi_tra"},
  {"name": "Cherokee", "code": "chr"},
  {"name": "Danish", "code": "dan"},
  {"name": "German", "code": "deu"},
  {"name": "Greek", "code": "ell"},
  {"name": "English", "code": "eng"},
  {"name": "English (Old)", "code": "enm"},
  {"name": "Esperanto", "code": "epo"},
  {"name": "Esperanto alternative", "code": "epo_alt"},
  {"name": "Math", "code": "equ"},
  {"name": "Estonian", "code": "est"},
  {"name": "Basque", "code": "eus"},
  {"name": "Persian (Farsi)", "code": "fas"},
  {"name": "Finnish", "code": "fin"},
  {"name": "French", "code": "fra"},
  {"name": "Frankish", "code": "frk"},
  {"name": "French (Old)", "code": "frm"},
  {"name": "Galician", "code": "glg"},
  {"name": "Ancient Greek", "code": "grc"},
  {"name": "Hebrew", "code": "heb"},
  {"name": "Hindi", "code": "hin"},
  {"name": "Croatian", "code": "hrv"},
  {"name": "Hungarian", "code": "hun"},
  {"name": "Indonesian", "code": "ind"},
  {"name": "Icelandic", "code": "isl"},
  {"name": "Italian", "code": "ita"},
  {"name": "Italian (Old)", "code": "ita_old"},
  {"name": "Japanese", "code": "jpn"},
  {"name": "Kannada", "code": "kan"},
  {"name": "Korean", "code": "kor"},
  {"name": "Latvian", "code": "lav"},
  {"name": "Lithuanian", "code": "lit"},
  {"name": "Malayalam", "code": "mal"},
  {"name": "Macedonian", "code": "mkd"},
  {"name": "Maltese", "code": "mlt"},
  {"name": "Malay", "code": "msa"},
  {"name": "Dutch", "code": "nld"},
  {"name": "Norwegian", "code": "nor"},
  {"name": "Polish", "code": "pol"},
  {"name": "Portuguese", "code": "por"},
  {"name": "Romanian", "code": "ron"},
  {"name": "Russian", "code": "rus"},
  {"name": "Slovakian", "code": "slk"},
  {"name": "Slovenian", "code": "slv"},
  {"name": "Spanish", "code": "spa"},
  {"name": "Old Spanish", "code": "spa_old"},
  {"name": "Albanian", "code": "sqi"},
  {"name": "Serbian (Latin)", "code": "srp"},
  {"name": "Swahili", "code": "swa"},
  {"name": "Swedish", "code": "swe"},
  {"name": "Tamil", "code": "tam"},
  {"name": "Telugu", "code": "tel"},
  {"name": "Tagalog", "code": "tgl"},
  {"name": "Thai", "code": "tha"},
  {"name": "Turkish", "code": "tur"},
  {"name": "Ukrainian", "code": "ukr"},
  {"name": "Vietnamese", "code": "vie"},
];

var recognizeLanguage = $cache.get("recognize-language") || "eng";
var installedLanguages = [];

async function showMenu() {
  let selected = await $ui.menu(supportedLanguages.map(item => item.name));
  if (selected == null) {
    return;
  }

  let code = supportedLanguages[selected.index].code;
  let filename = `${code}.traineddata.gz`;
  let url = `https://cdn.rawgit.com/naptha/tessdata/gh-pages/3.02/${filename}`;
  let { data } = await $http.download({"url": url, "showsProgress": true});

  if (data) {
    $file.write({"data": data, "path": `www/data/${filename}`});
    reloadData();
  }
}

function reloadData() {

  let contents = $file.list("www/data");
  
  installedLanguages = supportedLanguages.filter(item => {
    return contents.indexOf(`${item.code}${suffix}`) !== -1;
  });

  $("data-list").data = installedLanguages.map(item => `${item.name} (${item.code})`);
}

module.exports.show = () => {
  $ui.push({
    props: {
      title: "Languages",
      navButtons: [
        {
          title: "Download",
          handler: showMenu
        }
      ]
    },
    views: [
      {
        type: "list",
        props: {
          id: "data-list",
          actions: [
            {
              title: "Delete",
              handler: (sender, indexPath) => {
                let code = installedLanguages[indexPath.row].code;
                let path = `www/data/${code}${suffix}`;
                $file.delete(path);
              }
            }
          ]
        },
        layout: $layout.fill,
        events: {
          didSelect: (sender, indexPath) => {
            let language = installedLanguages[indexPath.row];
            recognizeLanguage = language.code;
            $cache.set("recognize-language", recognizeLanguage);
            $ui.toast(`Selected: ${language.name}`);
            $device.taptic(2);
            reloadData();
          },
          forEachItem: (view, indexPath) => {
            let code = installedLanguages[indexPath.row].code;
            view.alpha = code === recognizeLanguage ? 1.0 : 0.4;
          }
        }
      }
    ]
  });
  reloadData();
}
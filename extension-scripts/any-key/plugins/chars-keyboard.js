/*
* @author https://t.me/Neurogram
*/

const helper = require("scripts/helper");

var point =
  "。，、：∶；‘’“”〝〞ˆˇ﹕︰﹔﹖﹑·¨.¸;´？！～—｜‖＂〃｀@﹫¡¿﹏﹋︴々﹟#﹩$﹠&﹪%﹡﹢×﹦‐￣¯―﹨˜﹍﹎＿-~（）〈〉‹›﹛﹜『』〖〗［］《》〔〕{}「」【】︵︷︿︹︽_︶︸﹀︺︾ˉ﹂﹄︼﹁﹃︻▲●□…→";

var math =
  "≥≮≠^∽≌≯≈＜＞≥≤=≈‖∠≡+-×÷＋－±/=≤㏑∨⊙㏒‖∑∈∠⌒∶%∪∴∵∝∞∏∫∮∟⊿∷⊥∧∩√℃℉㎎㎏㎜㎝㎞㎡㏄㏎㏕℅‰‱∫∬∭∮∯∰∱∲∳½⅓⅔¼¾⅛⅜⅝⅞₁₂₃₄º¹²³⁴ⁿ";

var star =
  "♥❤❥❣❦❧♡۵ღ♠♣♥♤♡ஐ⋆☆★✫✬✭✮✯✩✰⁂⁑✢✣✤✥❋✦✧✪❂✡✱✲✳✴✵✶✷✸✹✺✻✼❄❅❆❇❈❉❊♔♚♕♛♖♜♗♝♘♞♙♟☤♧♨♪♫♩♬♭♮♯°ø¶‖§∮";

var other =
  "®©℗℠℡™℻⚀⚁⚂⚃⚄⚅⚲⚢⚣⚤⚦⚧⚨⚩♂♀☿㊚㊛☺☻☹〠㋡㋛シッツヅ〲〴ϡتﭢ☚☛☜☝☞☟✌✍☑✓✔√☓☒✘ㄨ✕✖ރ✗✢✣☩╳メ";

var No =
  "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳㉑㉒㉓㉔㉕㉖㉗㉘㉙㉚㉛㉜㉝㉞㉟㊱㊲㊳㊴㊵㊶㊷㊸㊹㊺㊻㊼㊽㊾㊿⓪ⓞ⓵⓶⓷⓸⓹⓺⓻⓼⓽⓾⑴⑵⑶⑷⑸⑹⑺⑻⑼⑽⑾⑿⒀⒁⒂⒃⒄⒅⒆⒇➊➋➌➍➎➏➐➑➒➓⓫⓬⓭⓮⓯⓰⓱⓲⓳⓴º¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉⒈⒉⒊⒋⒌⒍⒎⒏⒐⒑⒒⒓⒔⒕⒖⒗⒘⒙⒚⒛ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹ㊀㊁㊂㊃㊄㊅㊆㊇㊈㊉㈠㈡㈢㈣㈤㈥㈦㈧㈨㈩";

var letter =
  "ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ⒜⒝⒞⒟⒠⒡⒢⒣⒤⒥⒦⒧⒨⒩⒪⒫⒬⒭⒮⒯⒰⒱⒲⒳⒴⒵ɑɓɕɗȡᶒʄɠɦɧɨɉᶄȴɱȵɵᶈᶐᵲʂȶƫųʋωȿỿʑʐḀḁḂḃḄḅḆḇḈḉḊḋḌḍḎḏḐḑḒḓḔḕḖḗḘḙḚḛḜḝḞḟḠḡḢḣḤḥḦḧḨḩḪḫḬḭḮḯḰḱḲḳḴḵḶḷḸḹḺḻḼḽḾḿṀṁṂṃṄṅṆṇṈṉṊṋṌṍṎṏṐṑṒṓṔṕṖṗṘṙṚṛṜṝṞṟṠṡṢṣṤṥṦṧṨṩṪṫṬṭṮṯṰṱṲṳṴṵṶṷṸṹṺṻṼṽṾṿẀẁẂẃẄẅẆẇẈẉẊẋẌẍẎẏẐẑẒẓẔẕ";

var lang =
  "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζνξοπρσηθικλμτυφχψωАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя";

var geometry =
  "❏❐❑❒▏▐░▒▓▔▕■□▢▣▤▥▦▧▨▩▪▫▬▭▮▯ˍ∎⊞⊟⊠⊡⋄▱◆◇◈◧◨◩◪◫◰◱◲◳◻◼◽◾⧈⧫⎔◙◘▀▁▂▃▄▅▆▇▉▊▋█▌▍▎▛▜▝▞▟▖▗▘▙▚▰⊙●○◎◕¤☪❂✪☻☼Θ⊖⊘⊕⊚⊛⊜⊝◉◌◍◐◑◒◓◔⊗◖◗◯◴◵◶◷⚫❍⦁⦶⦸◤◥◄►▶◀◣◢▲▼▸◂▴▾△▽▷◁⊿▻◅▵▿▹◃∆◬◭◮◸◹◺◿∇☢";

var arrow =
  "➟➡➢➣➤➥➦➧➨➚➘➙➛➜➝➞➸♐➲➳⏎➴➵➶➷➸➹➺➻➼➽←↑→↓↔↕↖↗↘↙↚↛↜↝↞↟↠↡↢↣↤↥↦↧↨➫➬➩➪➭➮➯➱↩↪↫↬↭↮↯↰↱↲↳↴↵↶↷↸↹↺↻↼↽↾↿⇀⇁⇂⇃⇄⇅⇆⇇⇈⇉⇊⇋⇌⇍⇎⇏⇐⇑⇒⇓⇔⇕⇖⇗⇘⇙⇚⇛⇜⇝⇞⇟⇠⇡⇢⇣⇤⇥⇦⇧⇨⇩⇪";

var draw =
  "┌┬┐┏┳┓╒╤╕╭─╮├┼┤┣╋┫╞╪╡│╳│└┴┘┗┻┛╘╧╛╰─╯┏┳┓┏━┓┎┰┒┍┯┑┣╋┫┃┃┠╂┨┝┿┥┗┻┛┗━┛┖┸┚┕┷┙┏┱┐┌┲┓┌┬┐┏┳┓┡╃┤├╄┩┟╁┧┞┴┦└┴┘└┴┘┗╁┛└┴┘─━┄┅┈┈╲│┃┆┇┊┋╱ϟ≡—╾╭╮╯╰◜◝◞◟◠◡╴╵╶╷╸╹╺╻╼╽╿▏▕╌╍╎╏═`ˊᐟ‐‒―⁃≣⋐⋑⋒⋓⌒⌜⌝⌞⌟⎯─━│┃┄┅┆┇┈┉┊┋☰☱☲☳☴☵☶☷～≈∽≋~﹏﹋﹌˜ˆ︴";

var item1 = $cache.get("histories");
if (item1) {
  var item1Data = item1.history;
} else {
  var item1Data = [];
}

var items = ["◷", "。", "½", "❥", "™", "①", "ⓐ", "Α", "❏", "➟", "┌"];
var symbols = [
  item1Data,
  point,
  math,
  star,
  other,
  No,
  letter,
  lang,
  geometry,
  arrow,
  draw
];

$ui.push({
  props: {
    title: $l10n("Chars Keyboard")
  },
  views: [
    {
      type: "view",
      views: [
        {
          type: "matrix",
          props: {
            id: "chars-matrix",
            columns: 9,
            spacing: 0,
            square: true,
            bgcolor: $color("white"),
            data: item1Data,
            template: {
              props: {},
              views: [
                {
                  type: "label",
                  props: {
                    id: "label",
                    textColor: $color("black"),
                    bgcolor: $color("white"),
                    radius: 0,
                    align: $align.center,
                    font: $font(25)
                  },
                  layout: $layout.fill
                }
              ]
            }
          },
          layout: function(make, view) {
            make.edges.insets($insets(0, 0, 35, 0));
          },
          events: {
            didSelect: function(sender, indexPath, data) {
              helper.setText(data.label.text);
              historyCache(data.label.text);
            }
          }
        },
        {
          type: "menu",
          props: {
            items: items
          },
          layout: function(make, view) {
            make.bottom.inset(0);
            make.width.equalTo(view.super);
            make.height.equalTo($app.env == $env.app ? 44 : 35);
          },
          events: {
            changed: function(sender) {
              dataPick(sender.index);
            }
          }
        }
      ],
      layout: (make, view) => {
        make.edges.equalTo(view.super.safeArea);
      }
    }
  ]
});

function dataPick(index) {
  if (index == 0) {
    $("chars-matrix").data = item1Data;
  } else {
    var data = symbols[index];
    $("chars-matrix").data = dataPush(data);
  }
}

function dataPush(data) {
  var dataX = [];
  for (var i in data) {
    dataX.push({
      label: {
        text: data[i]
      }
    });
  }
  return dataX;
}

function historyCache(symbol) {
  var item1 = "";
  for (var i in item1Data) {
    if (i == 35) break;
    item1 = item1 + item1Data[i].label.text;
  }
  var duplicate = item1.replace(symbol, "");
  item1 = symbol + duplicate;
  var history = dataPush(item1);
  $cache.set("histories", {
    history: history
  });
  item1 = $cache.get("histories");
  item1Data = item1.history;
}
/**
 * lunr - http://lunrjs.com - A bit like Solr, but much smaller and not as bright - 0.5.11
 * Copyright (C) 2015 Oliver Nightingale
 * MIT Licensed
 * @license
 */

;(function(){

/**
 * Convenience function for instantiating a new lunr index and configuring it
 * with the default pipeline functions and the passed config function.
 *
 * When using this convenience function a new index will be created with the
 * following functions already in the pipeline:
 *
 * lunr.StopWordFilter - filters out any stop words before they enter the
 * index
 *
 * lunr.stemmer - stems the tokens before entering the index.
 *
 * Example:
 *
 *     var idx = lunr(function () {
 *       this.field('title', 10)
 *       this.field('tags', 100)
 *       this.field('body')
 *       
 *       this.ref('cid')
 *       
 *       this.pipeline.add(function () {
 *         // some custom pipeline function
 *       })
 *       
 *     })
 *
 * @param {Function} config A function that will be called with the new instance
 * of the lunr.Index as both its context and first parameter. It can be used to
 * customize the instance of new lunr.Index.
 * @namespace
 * @module
 * @returns {lunr.Index}
 *
 */
var lunr = function (config) {
  var idx = new lunr.Index

  idx.pipeline.add(
    lunr.trimmer,
    lunr.stopWordFilter,
    lunr.stemmer
  )

  if (config) config.call(idx, idx)

  return idx
}

lunr.version = "0.5.11"
// TinySegmenter 0.1 -- Super compact Japanese tokenizer in Javascript
// (c) 2008 Taku Kudo <taku@chasen.org>
// TinySegmenter is freely distributable under the terms of a new BSD licence.
// For details, see http://chasen.org/~taku/software/TinySegmenter/LICENCE.txt

function TinySegmenter() {
  var patterns = {
    "[一二三四五六七八九十百千万億兆]":"M",
    "[一-龠々〆ヵヶ]":"H",
    "[ぁ-ん]":"I",
    "[ァ-ヴーｱ-ﾝﾞｰ]":"K",
    "[a-zA-Zａ-ｚＡ-Ｚ]":"A",
    "[0-9０-９]":"N"
  }
  this.chartype_ = [];
  for (var i in patterns) {
    var regexp = new RegExp;
    regexp.compile(i)
    this.chartype_.push([regexp, patterns[i]]);
  }

  this.BIAS__ = -332
  this.BC1__ = {"HH":6,"II":2461,"KH":406,"OH":-1378};
  this.BC2__ = {"AA":-3267,"AI":2744,"AN":-878,"HH":-4070,"HM":-1711,"HN":4012,"HO":3761,"IA":1327,"IH":-1184,"II":-1332,"IK":1721,"IO":5492,"KI":3831,"KK":-8741,"MH":-3132,"MK":3334,"OO":-2920};
  this.BC3__ = {"HH":996,"HI":626,"HK":-721,"HN":-1307,"HO":-836,"IH":-301,"KK":2762,"MK":1079,"MM":4034,"OA":-1652,"OH":266};
  this.BP1__ = {"BB":295,"OB":304,"OO":-125,"UB":352};
  this.BP2__ = {"BO":60,"OO":-1762};
  this.BQ1__ = {"BHH":1150,"BHM":1521,"BII":-1158,"BIM":886,"BMH":1208,"BNH":449,"BOH":-91,"BOO":-2597,"OHI":451,"OIH":-296,"OKA":1851,"OKH":-1020,"OKK":904,"OOO":2965};
  this.BQ2__ = {"BHH":118,"BHI":-1159,"BHM":466,"BIH":-919,"BKK":-1720,"BKO":864,"OHH":-1139,"OHM":-181,"OIH":153,"UHI":-1146};
  this.BQ3__ = {"BHH":-792,"BHI":2664,"BII":-299,"BKI":419,"BMH":937,"BMM":8335,"BNN":998,"BOH":775,"OHH":2174,"OHM":439,"OII":280,"OKH":1798,"OKI":-793,"OKO":-2242,"OMH":-2402,"OOO":11699};
  this.BQ4__ = {"BHH":-3895,"BIH":3761,"BII":-4654,"BIK":1348,"BKK":-1806,"BMI":-3385,"BOO":-12396,"OAH":926,"OHH":266,"OHK":-2036,"ONN":-973};
  this.BW1__ = {",と":660,",同":727,"B1あ":1404,"B1同":542,"、と":660,"、同":727,"」と":1682,"あっ":1505,"いう":1743,"いっ":-2055,"いる":672,"うし":-4817,"うん":665,"から":3472,"がら":600,"こう":-790,"こと":2083,"こん":-1262,"さら":-4143,"さん":4573,"した":2641,"して":1104,"すで":-3399,"そこ":1977,"それ":-871,"たち":1122,"ため":601,"った":3463,"つい":-802,"てい":805,"てき":1249,"でき":1127,"です":3445,"では":844,"とい":-4915,"とみ":1922,"どこ":3887,"ない":5713,"なっ":3015,"など":7379,"なん":-1113,"にし":2468,"には":1498,"にも":1671,"に対":-912,"の一":-501,"の中":741,"ませ":2448,"まで":1711,"まま":2600,"まる":-2155,"やむ":-1947,"よっ":-2565,"れた":2369,"れで":-913,"をし":1860,"を見":731,"亡く":-1886,"京都":2558,"取り":-2784,"大き":-2604,"大阪":1497,"平方":-2314,"引き":-1336,"日本":-195,"本当":-2423,"毎日":-2113,"目指":-724,"Ｂ１あ":1404,"Ｂ１同":542,"｣と":1682};
  this.BW2__ = {"..":-11822,"11":-669,"――":-5730,"−−":-13175,"いう":-1609,"うか":2490,"かし":-1350,"かも":-602,"から":-7194,"かれ":4612,"がい":853,"がら":-3198,"きた":1941,"くな":-1597,"こと":-8392,"この":-4193,"させ":4533,"され":13168,"さん":-3977,"しい":-1819,"しか":-545,"した":5078,"して":972,"しな":939,"その":-3744,"たい":-1253,"たた":-662,"ただ":-3857,"たち":-786,"たと":1224,"たは":-939,"った":4589,"って":1647,"っと":-2094,"てい":6144,"てき":3640,"てく":2551,"ては":-3110,"ても":-3065,"でい":2666,"でき":-1528,"でし":-3828,"です":-4761,"でも":-4203,"とい":1890,"とこ":-1746,"とと":-2279,"との":720,"とみ":5168,"とも":-3941,"ない":-2488,"なが":-1313,"など":-6509,"なの":2614,"なん":3099,"にお":-1615,"にし":2748,"にな":2454,"によ":-7236,"に対":-14943,"に従":-4688,"に関":-11388,"のか":2093,"ので":-7059,"のに":-6041,"のの":-6125,"はい":1073,"はが":-1033,"はず":-2532,"ばれ":1813,"まし":-1316,"まで":-6621,"まれ":5409,"めて":-3153,"もい":2230,"もの":-10713,"らか":-944,"らし":-1611,"らに":-1897,"りし":651,"りま":1620,"れた":4270,"れて":849,"れば":4114,"ろう":6067,"われ":7901,"を通":-11877,"んだ":728,"んな":-4115,"一人":602,"一方":-1375,"一日":970,"一部":-1051,"上が":-4479,"会社":-1116,"出て":2163,"分の":-7758,"同党":970,"同日":-913,"大阪":-2471,"委員":-1250,"少な":-1050,"年度":-8669,"年間":-1626,"府県":-2363,"手権":-1982,"新聞":-4066,"日新":-722,"日本":-7068,"日米":3372,"曜日":-601,"朝鮮":-2355,"本人":-2697,"東京":-1543,"然と":-1384,"社会":-1276,"立て":-990,"第に":-1612,"米国":-4268,"１１":-669};
  this.BW3__ = {"あた":-2194,"あり":719,"ある":3846,"い.":-1185,"い。":-1185,"いい":5308,"いえ":2079,"いく":3029,"いた":2056,"いっ":1883,"いる":5600,"いわ":1527,"うち":1117,"うと":4798,"えと":1454,"か.":2857,"か。":2857,"かけ":-743,"かっ":-4098,"かに":-669,"から":6520,"かり":-2670,"が,":1816,"が、":1816,"がき":-4855,"がけ":-1127,"がっ":-913,"がら":-4977,"がり":-2064,"きた":1645,"けど":1374,"こと":7397,"この":1542,"ころ":-2757,"さい":-714,"さを":976,"し,":1557,"し、":1557,"しい":-3714,"した":3562,"して":1449,"しな":2608,"しま":1200,"す.":-1310,"す。":-1310,"する":6521,"ず,":3426,"ず、":3426,"ずに":841,"そう":428,"た.":8875,"た。":8875,"たい":-594,"たの":812,"たり":-1183,"たる":-853,"だ.":4098,"だ。":4098,"だっ":1004,"った":-4748,"って":300,"てい":6240,"てお":855,"ても":302,"です":1437,"でに":-1482,"では":2295,"とう":-1387,"とし":2266,"との":541,"とも":-3543,"どう":4664,"ない":1796,"なく":-903,"など":2135,"に,":-1021,"に、":-1021,"にし":1771,"にな":1906,"には":2644,"の,":-724,"の、":-724,"の子":-1000,"は,":1337,"は、":1337,"べき":2181,"まし":1113,"ます":6943,"まっ":-1549,"まで":6154,"まれ":-793,"らし":1479,"られ":6820,"るる":3818,"れ,":854,"れ、":854,"れた":1850,"れて":1375,"れば":-3246,"れる":1091,"われ":-605,"んだ":606,"んで":798,"カ月":990,"会議":860,"入り":1232,"大会":2217,"始め":1681,"市":965,"新聞":-5055,"日,":974,"日、":974,"社会":2024,"ｶ月":990};
  this.TC1__ = {"AAA":1093,"HHH":1029,"HHM":580,"HII":998,"HOH":-390,"HOM":-331,"IHI":1169,"IOH":-142,"IOI":-1015,"IOM":467,"MMH":187,"OOI":-1832};
  this.TC2__ = {"HHO":2088,"HII":-1023,"HMM":-1154,"IHI":-1965,"KKH":703,"OII":-2649};
  this.TC3__ = {"AAA":-294,"HHH":346,"HHI":-341,"HII":-1088,"HIK":731,"HOH":-1486,"IHH":128,"IHI":-3041,"IHO":-1935,"IIH":-825,"IIM":-1035,"IOI":-542,"KHH":-1216,"KKA":491,"KKH":-1217,"KOK":-1009,"MHH":-2694,"MHM":-457,"MHO":123,"MMH":-471,"NNH":-1689,"NNO":662,"OHO":-3393};
  this.TC4__ = {"HHH":-203,"HHI":1344,"HHK":365,"HHM":-122,"HHN":182,"HHO":669,"HIH":804,"HII":679,"HOH":446,"IHH":695,"IHO":-2324,"IIH":321,"III":1497,"IIO":656,"IOO":54,"KAK":4845,"KKA":3386,"KKK":3065,"MHH":-405,"MHI":201,"MMH":-241,"MMM":661,"MOM":841};
  this.TQ1__ = {"BHHH":-227,"BHHI":316,"BHIH":-132,"BIHH":60,"BIII":1595,"BNHH":-744,"BOHH":225,"BOOO":-908,"OAKK":482,"OHHH":281,"OHIH":249,"OIHI":200,"OIIH":-68};
  this.TQ2__ = {"BIHH":-1401,"BIII":-1033,"BKAK":-543,"BOOO":-5591};
  this.TQ3__ = {"BHHH":478,"BHHM":-1073,"BHIH":222,"BHII":-504,"BIIH":-116,"BIII":-105,"BMHI":-863,"BMHM":-464,"BOMH":620,"OHHH":346,"OHHI":1729,"OHII":997,"OHMH":481,"OIHH":623,"OIIH":1344,"OKAK":2792,"OKHH":587,"OKKA":679,"OOHH":110,"OOII":-685};
  this.TQ4__ = {"BHHH":-721,"BHHM":-3604,"BHII":-966,"BIIH":-607,"BIII":-2181,"OAAA":-2763,"OAKK":180,"OHHH":-294,"OHHI":2446,"OHHO":480,"OHIH":-1573,"OIHH":1935,"OIHI":-493,"OIIH":626,"OIII":-4007,"OKAK":-8156};
  this.TW1__ = {"につい":-4681,"東京都":2026};
  this.TW2__ = {"ある程":-2049,"いった":-1256,"ころが":-2434,"しょう":3873,"その後":-4430,"だって":-1049,"ていた":1833,"として":-4657,"ともに":-4517,"もので":1882,"一気に":-792,"初めて":-1512,"同時に":-8097,"大きな":-1255,"対して":-2721,"社会党":-3216};
  this.TW3__ = {"いただ":-1734,"してい":1314,"として":-4314,"につい":-5483,"にとっ":-5989,"に当た":-6247,"ので,":-727,"ので、":-727,"のもの":-600,"れから":-3752,"十二月":-2287};
  this.TW4__ = {"いう.":8576,"いう。":8576,"からな":-2348,"してい":2958,"たが,":1516,"たが、":1516,"ている":1538,"という":1349,"ました":5543,"ません":1097,"ようと":-4258,"よると":5865};
  this.UC1__ = {"A":484,"K":93,"M":645,"O":-505};
  this.UC2__ = {"A":819,"H":1059,"I":409,"M":3987,"N":5775,"O":646};
  this.UC3__ = {"A":-1370,"I":2311};
  this.UC4__ = {"A":-2643,"H":1809,"I":-1032,"K":-3450,"M":3565,"N":3876,"O":6646};
  this.UC5__ = {"H":313,"I":-1238,"K":-799,"M":539,"O":-831};
  this.UC6__ = {"H":-506,"I":-253,"K":87,"M":247,"O":-387};
  this.UP1__ = {"O":-214};
  this.UP2__ = {"B":69,"O":935};
  this.UP3__ = {"B":189};
  this.UQ1__ = {"BH":21,"BI":-12,"BK":-99,"BN":142,"BO":-56,"OH":-95,"OI":477,"OK":410,"OO":-2422};
  this.UQ2__ = {"BH":216,"BI":113,"OK":1759};
  this.UQ3__ = {"BA":-479,"BH":42,"BI":1913,"BK":-7198,"BM":3160,"BN":6427,"BO":14761,"OI":-827,"ON":-3212};
  this.UW1__ = {",":156,"、":156,"「":-463,"あ":-941,"う":-127,"が":-553,"き":121,"こ":505,"で":-201,"と":-547,"ど":-123,"に":-789,"の":-185,"は":-847,"も":-466,"や":-470,"よ":182,"ら":-292,"り":208,"れ":169,"を":-446,"ん":-137,"・":-135,"主":-402,"京":-268,"区":-912,"午":871,"国":-460,"大":561,"委":729,"市":-411,"日":-141,"理":361,"生":-408,"県":-386,"都":-718,"｢":-463,"･":-135};
  this.UW2__ = {",":-829,"、":-829,"〇":892,"「":-645,"」":3145,"あ":-538,"い":505,"う":134,"お":-502,"か":1454,"が":-856,"く":-412,"こ":1141,"さ":878,"ざ":540,"し":1529,"す":-675,"せ":300,"そ":-1011,"た":188,"だ":1837,"つ":-949,"て":-291,"で":-268,"と":-981,"ど":1273,"な":1063,"に":-1764,"の":130,"は":-409,"ひ":-1273,"べ":1261,"ま":600,"も":-1263,"や":-402,"よ":1639,"り":-579,"る":-694,"れ":571,"を":-2516,"ん":2095,"ア":-587,"カ":306,"キ":568,"ッ":831,"三":-758,"不":-2150,"世":-302,"中":-968,"主":-861,"事":492,"人":-123,"会":978,"保":362,"入":548,"初":-3025,"副":-1566,"北":-3414,"区":-422,"大":-1769,"天":-865,"太":-483,"子":-1519,"学":760,"実":1023,"小":-2009,"市":-813,"年":-1060,"強":1067,"手":-1519,"揺":-1033,"政":1522,"文":-1355,"新":-1682,"日":-1815,"明":-1462,"最":-630,"朝":-1843,"本":-1650,"東":-931,"果":-665,"次":-2378,"民":-180,"気":-1740,"理":752,"発":529,"目":-1584,"相":-242,"県":-1165,"立":-763,"第":810,"米":509,"自":-1353,"行":838,"西":-744,"見":-3874,"調":1010,"議":1198,"込":3041,"開":1758,"間":-1257,"｢":-645,"｣":3145,"ｯ":831,"ｱ":-587,"ｶ":306,"ｷ":568};
  this.UW3__ = {",":4889,"1":-800,"−":-1723,"、":4889,"々":-2311,"〇":5827,"」":2670,"〓":-3573,"あ":-2696,"い":1006,"う":2342,"え":1983,"お":-4864,"か":-1163,"が":3271,"く":1004,"け":388,"げ":401,"こ":-3552,"ご":-3116,"さ":-1058,"し":-395,"す":584,"せ":3685,"そ":-5228,"た":842,"ち":-521,"っ":-1444,"つ":-1081,"て":6167,"で":2318,"と":1691,"ど":-899,"な":-2788,"に":2745,"の":4056,"は":4555,"ひ":-2171,"ふ":-1798,"へ":1199,"ほ":-5516,"ま":-4384,"み":-120,"め":1205,"も":2323,"や":-788,"よ":-202,"ら":727,"り":649,"る":5905,"れ":2773,"わ":-1207,"を":6620,"ん":-518,"ア":551,"グ":1319,"ス":874,"ッ":-1350,"ト":521,"ム":1109,"ル":1591,"ロ":2201,"ン":278,"・":-3794,"一":-1619,"下":-1759,"世":-2087,"両":3815,"中":653,"主":-758,"予":-1193,"二":974,"人":2742,"今":792,"他":1889,"以":-1368,"低":811,"何":4265,"作":-361,"保":-2439,"元":4858,"党":3593,"全":1574,"公":-3030,"六":755,"共":-1880,"円":5807,"再":3095,"分":457,"初":2475,"別":1129,"前":2286,"副":4437,"力":365,"動":-949,"務":-1872,"化":1327,"北":-1038,"区":4646,"千":-2309,"午":-783,"協":-1006,"口":483,"右":1233,"各":3588,"合":-241,"同":3906,"和":-837,"員":4513,"国":642,"型":1389,"場":1219,"外":-241,"妻":2016,"学":-1356,"安":-423,"実":-1008,"家":1078,"小":-513,"少":-3102,"州":1155,"市":3197,"平":-1804,"年":2416,"広":-1030,"府":1605,"度":1452,"建":-2352,"当":-3885,"得":1905,"思":-1291,"性":1822,"戸":-488,"指":-3973,"政":-2013,"教":-1479,"数":3222,"文":-1489,"新":1764,"日":2099,"旧":5792,"昨":-661,"時":-1248,"曜":-951,"最":-937,"月":4125,"期":360,"李":3094,"村":364,"東":-805,"核":5156,"森":2438,"業":484,"氏":2613,"民":-1694,"決":-1073,"法":1868,"海":-495,"無":979,"物":461,"特":-3850,"生":-273,"用":914,"町":1215,"的":7313,"直":-1835,"省":792,"県":6293,"知":-1528,"私":4231,"税":401,"立":-960,"第":1201,"米":7767,"系":3066,"約":3663,"級":1384,"統":-4229,"総":1163,"線":1255,"者":6457,"能":725,"自":-2869,"英":785,"見":1044,"調":-562,"財":-733,"費":1777,"車":1835,"軍":1375,"込":-1504,"通":-1136,"選":-681,"郎":1026,"郡":4404,"部":1200,"金":2163,"長":421,"開":-1432,"間":1302,"関":-1282,"雨":2009,"電":-1045,"非":2066,"駅":1620,"１":-800,"｣":2670,"･":-3794,"ｯ":-1350,"ｱ":551,"ｸﾞ":1319,"ｽ":874,"ﾄ":521,"ﾑ":1109,"ﾙ":1591,"ﾛ":2201,"ﾝ":278};
  this.UW4__ = {",":3930,".":3508,"―":-4841,"、":3930,"。":3508,"〇":4999,"「":1895,"」":3798,"〓":-5156,"あ":4752,"い":-3435,"う":-640,"え":-2514,"お":2405,"か":530,"が":6006,"き":-4482,"ぎ":-3821,"く":-3788,"け":-4376,"げ":-4734,"こ":2255,"ご":1979,"さ":2864,"し":-843,"じ":-2506,"す":-731,"ず":1251,"せ":181,"そ":4091,"た":5034,"だ":5408,"ち":-3654,"っ":-5882,"つ":-1659,"て":3994,"で":7410,"と":4547,"な":5433,"に":6499,"ぬ":1853,"ね":1413,"の":7396,"は":8578,"ば":1940,"ひ":4249,"び":-4134,"ふ":1345,"へ":6665,"べ":-744,"ほ":1464,"ま":1051,"み":-2082,"む":-882,"め":-5046,"も":4169,"ゃ":-2666,"や":2795,"ょ":-1544,"よ":3351,"ら":-2922,"り":-9726,"る":-14896,"れ":-2613,"ろ":-4570,"わ":-1783,"を":13150,"ん":-2352,"カ":2145,"コ":1789,"セ":1287,"ッ":-724,"ト":-403,"メ":-1635,"ラ":-881,"リ":-541,"ル":-856,"ン":-3637,"・":-4371,"ー":-11870,"一":-2069,"中":2210,"予":782,"事":-190,"井":-1768,"人":1036,"以":544,"会":950,"体":-1286,"作":530,"側":4292,"先":601,"党":-2006,"共":-1212,"内":584,"円":788,"初":1347,"前":1623,"副":3879,"力":-302,"動":-740,"務":-2715,"化":776,"区":4517,"協":1013,"参":1555,"合":-1834,"和":-681,"員":-910,"器":-851,"回":1500,"国":-619,"園":-1200,"地":866,"場":-1410,"塁":-2094,"士":-1413,"多":1067,"大":571,"子":-4802,"学":-1397,"定":-1057,"寺":-809,"小":1910,"屋":-1328,"山":-1500,"島":-2056,"川":-2667,"市":2771,"年":374,"庁":-4556,"後":456,"性":553,"感":916,"所":-1566,"支":856,"改":787,"政":2182,"教":704,"文":522,"方":-856,"日":1798,"時":1829,"最":845,"月":-9066,"木":-485,"来":-442,"校":-360,"業":-1043,"氏":5388,"民":-2716,"気":-910,"沢":-939,"済":-543,"物":-735,"率":672,"球":-1267,"生":-1286,"産":-1101,"田":-2900,"町":1826,"的":2586,"目":922,"省":-3485,"県":2997,"空":-867,"立":-2112,"第":788,"米":2937,"系":786,"約":2171,"経":1146,"統":-1169,"総":940,"線":-994,"署":749,"者":2145,"能":-730,"般":-852,"行":-792,"規":792,"警":-1184,"議":-244,"谷":-1000,"賞":730,"車":-1481,"軍":1158,"輪":-1433,"込":-3370,"近":929,"道":-1291,"選":2596,"郎":-4866,"都":1192,"野":-1100,"銀":-2213,"長":357,"間":-2344,"院":-2297,"際":-2604,"電":-878,"領":-1659,"題":-792,"館":-1984,"首":1749,"高":2120,"｢":1895,"｣":3798,"･":-4371,"ｯ":-724,"ｰ":-11870,"ｶ":2145,"ｺ":1789,"ｾ":1287,"ﾄ":-403,"ﾒ":-1635,"ﾗ":-881,"ﾘ":-541,"ﾙ":-856,"ﾝ":-3637};
  this.UW5__ = {",":465,".":-299,"1":-514,"E2":-32768,"]":-2762,"、":465,"。":-299,"「":363,"あ":1655,"い":331,"う":-503,"え":1199,"お":527,"か":647,"が":-421,"き":1624,"ぎ":1971,"く":312,"げ":-983,"さ":-1537,"し":-1371,"す":-852,"だ":-1186,"ち":1093,"っ":52,"つ":921,"て":-18,"で":-850,"と":-127,"ど":1682,"な":-787,"に":-1224,"の":-635,"は":-578,"べ":1001,"み":502,"め":865,"ゃ":3350,"ょ":854,"り":-208,"る":429,"れ":504,"わ":419,"を":-1264,"ん":327,"イ":241,"ル":451,"ン":-343,"中":-871,"京":722,"会":-1153,"党":-654,"務":3519,"区":-901,"告":848,"員":2104,"大":-1296,"学":-548,"定":1785,"嵐":-1304,"市":-2991,"席":921,"年":1763,"思":872,"所":-814,"挙":1618,"新":-1682,"日":218,"月":-4353,"査":932,"格":1356,"機":-1508,"氏":-1347,"田":240,"町":-3912,"的":-3149,"相":1319,"省":-1052,"県":-4003,"研":-997,"社":-278,"空":-813,"統":1955,"者":-2233,"表":663,"語":-1073,"議":1219,"選":-1018,"郎":-368,"長":786,"間":1191,"題":2368,"館":-689,"１":-514,"Ｅ２":-32768,"｢":363,"ｲ":241,"ﾙ":451,"ﾝ":-343};
  this.UW6__ = {",":227,".":808,"1":-270,"E1":306,"、":227,"。":808,"あ":-307,"う":189,"か":241,"が":-73,"く":-121,"こ":-200,"じ":1782,"す":383,"た":-428,"っ":573,"て":-1014,"で":101,"と":-105,"な":-253,"に":-149,"の":-417,"は":-236,"も":-206,"り":187,"る":-135,"を":195,"ル":-673,"ン":-496,"一":-277,"中":201,"件":-800,"会":624,"前":302,"区":1792,"員":-1212,"委":798,"学":-960,"市":887,"広":-695,"後":535,"業":-697,"相":753,"社":-507,"福":974,"空":-822,"者":1811,"連":463,"郎":1082,"１":-270,"Ｅ１":306,"ﾙ":-673,"ﾝ":-496};
  
  return this;
}

TinySegmenter.prototype.ctype_ = function(str) {
  for (var i in this.chartype_) {
    if (str.match(this.chartype_[i][0])) {
      return this.chartype_[i][1];
    }
  }
  return "O";
}

TinySegmenter.prototype.ts_ = function(v) {
  if (v) { return v; }
  return 0;
}

TinySegmenter.prototype.segment = function(input) {
  if (input == null || input == undefined || input == "") {
    return [];
  }
  var result = [];
  var seg = ["B3","B2","B1"];
  var ctype = ["O","O","O"];
  var o = input.split("");
  for (i = 0; i < o.length; ++i) {
    seg.push(o[i]);
    ctype.push(this.ctype_(o[i]))
  }
  seg.push("E1");
  seg.push("E2");
  seg.push("E3");
  ctype.push("O");
  ctype.push("O");
  ctype.push("O");
  var word = seg[3];
  var p1 = "U";
  var p2 = "U";
  var p3 = "U";
  for (var i = 4; i < seg.length - 3; ++i) {
    var score = this.BIAS__;
    var w1 = seg[i-3];
    var w2 = seg[i-2];
    var w3 = seg[i-1];
    var w4 = seg[i];
    var w5 = seg[i+1];
    var w6 = seg[i+2];
    var c1 = ctype[i-3];
    var c2 = ctype[i-2];
    var c3 = ctype[i-1];
    var c4 = ctype[i];
    var c5 = ctype[i+1];
    var c6 = ctype[i+2];
    score += this.ts_(this.UP1__[p1]);
    score += this.ts_(this.UP2__[p2]);
    score += this.ts_(this.UP3__[p3]);
    score += this.ts_(this.BP1__[p1 + p2]);
    score += this.ts_(this.BP2__[p2 + p3]);
    score += this.ts_(this.UW1__[w1]);
    score += this.ts_(this.UW2__[w2]);
    score += this.ts_(this.UW3__[w3]);
    score += this.ts_(this.UW4__[w4]);
    score += this.ts_(this.UW5__[w5]);
    score += this.ts_(this.UW6__[w6]);
    score += this.ts_(this.BW1__[w2 + w3]);
    score += this.ts_(this.BW2__[w3 + w4]);
    score += this.ts_(this.BW3__[w4 + w5]);
    score += this.ts_(this.TW1__[w1 + w2 + w3]);
    score += this.ts_(this.TW2__[w2 + w3 + w4]);
    score += this.ts_(this.TW3__[w3 + w4 + w5]);
    score += this.ts_(this.TW4__[w4 + w5 + w6]);
    score += this.ts_(this.UC1__[c1]);
    score += this.ts_(this.UC2__[c2]);
    score += this.ts_(this.UC3__[c3]);
    score += this.ts_(this.UC4__[c4]);
    score += this.ts_(this.UC5__[c5]);
    score += this.ts_(this.UC6__[c6]);
    score += this.ts_(this.BC1__[c2 + c3]);
    score += this.ts_(this.BC2__[c3 + c4]);
    score += this.ts_(this.BC3__[c4 + c5]);
    score += this.ts_(this.TC1__[c1 + c2 + c3]);
    score += this.ts_(this.TC2__[c2 + c3 + c4]);
    score += this.ts_(this.TC3__[c3 + c4 + c5]);
    score += this.ts_(this.TC4__[c4 + c5 + c6]);
//  score += this.ts_(this.TC5__[c4 + c5 + c6]);    
    score += this.ts_(this.UQ1__[p1 + c1]);
    score += this.ts_(this.UQ2__[p2 + c2]);
    score += this.ts_(this.UQ3__[p3 + c3]);
    score += this.ts_(this.BQ1__[p2 + c2 + c3]);
    score += this.ts_(this.BQ2__[p2 + c3 + c4]);
    score += this.ts_(this.BQ3__[p3 + c2 + c3]);
    score += this.ts_(this.BQ4__[p3 + c3 + c4]);
    score += this.ts_(this.TQ1__[p2 + c1 + c2 + c3]);
    score += this.ts_(this.TQ2__[p2 + c2 + c3 + c4]);
    score += this.ts_(this.TQ3__[p3 + c1 + c2 + c3]);
    score += this.ts_(this.TQ4__[p3 + c2 + c3 + c4]);
    var p = "O";
    if (score > 0) {
      result.push(word);
      word = "";
      p = "B";
    }
    p1 = p2;
    p2 = p3;
    p3 = p;
    word += seg[i];
  }
  result.push(word);

  return result;
}
/*!
 * lunr.utils
 * Copyright (C) 2015 Oliver Nightingale
 */

/**
 * A namespace containing utils for the rest of the lunr library
 */
lunr.utils = {}

/**
 * Print a warning message to the console.
 *
 * @param {String} message The message to be printed.
 * @memberOf Utils
 */
lunr.utils.warn = (function (global) {
  return function (message) {
    if (global.console && console.warn) {
      console.warn(message)
    }
  }
})(this)

/*!
 * lunr.EventEmitter
 * Copyright (C) 2015 Oliver Nightingale
 */

/**
 * lunr.EventEmitter is an event emitter for lunr. It manages adding and removing event handlers and triggering events and their handlers.
 *
 * @constructor
 */
lunr.EventEmitter = function () {
  this.events = {}
}

/**
 * Binds a handler function to a specific event(s).
 *
 * Can bind a single function to many different events in one call.
 *
 * @param {String} [eventName] The name(s) of events to bind this function to.
 * @param {Function} fn The function to call when an event is fired.
 * @memberOf EventEmitter
 */
lunr.EventEmitter.prototype.addListener = function () {
  var args = Array.prototype.slice.call(arguments),
      fn = args.pop(),
      names = args

  if (typeof fn !== "function") throw new TypeError ("last argument must be a function")

  names.forEach(function (name) {
    if (!this.hasHandler(name)) this.events[name] = []
    this.events[name].push(fn)
  }, this)
}

/**
 * Removes a handler function from a specific event.
 *
 * @param {String} eventName The name of the event to remove this function from.
 * @param {Function} fn The function to remove from an event.
 * @memberOf EventEmitter
 */
lunr.EventEmitter.prototype.removeListener = function (name, fn) {
  if (!this.hasHandler(name)) return

  var fnIndex = this.events[name].indexOf(fn)
  this.events[name].splice(fnIndex, 1)

  if (!this.events[name].length) delete this.events[name]
}

/**
 * Calls all functions bound to the given event.
 *
 * Additional data can be passed to the event handler as arguments to `emit`
 * after the event name.
 *
 * @param {String} eventName The name of the event to emit.
 * @memberOf EventEmitter
 */
lunr.EventEmitter.prototype.emit = function (name) {
  if (!this.hasHandler(name)) return

  var args = Array.prototype.slice.call(arguments, 1)

  this.events[name].forEach(function (fn) {
    fn.apply(undefined, args)
  })
}

/**
 * Checks whether a handler has ever been stored against an event.
 *
 * @param {String} eventName The name of the event to check.
 * @private
 * @memberOf EventEmitter
 */
lunr.EventEmitter.prototype.hasHandler = function (name) {
  return name in this.events
}

/*!
 * lunr.tokenizer
 * Copyright (C) 2015 Oliver Nightingale
 */

/**
 * A function for splitting a string into tokens ready to be inserted into
 * the search index.
 *
 * @module
 * @param {String} obj The string to convert into tokens
 * @returns {Array}
 */
lunr.tokenizer = function (obj) {
  if (!arguments.length || obj == null || obj == undefined) return []
  if (Array.isArray(obj)) return obj.map(function (t) { return t.toLowerCase() })

  var txt = obj.toString();
  var escapeTxt;
  var i = txt.length;
  var isJapanese = false;
  while (i--) {
    escapeTxt = escape(txt.substring(i, i+1));
    if (escapeTxt.length >= 6) {
      isJapanese = true;
      break;
    }
  }

  if (isJapanese) {
    var segmenter = new TinySegmenter();
    return segmenter.segment(txt)
  } else {
    return obj.toString().trim().toLowerCase().split(/[\s\-]+/)
  }
}

/*!
 * lunr.Pipeline
 * Copyright (C) 2015 Oliver Nightingale
 */

/**
 * lunr.Pipelines maintain an ordered list of functions to be applied to all
 * tokens in documents entering the search index and queries being ran against
 * the index.
 *
 * An instance of lunr.Index created with the lunr shortcut will contain a
 * pipeline with a stop word filter and an English language stemmer. Extra
 * functions can be added before or after either of these functions or these
 * default functions can be removed.
 *
 * When run the pipeline will call each function in turn, passing a token, the
 * index of that token in the original list of all tokens and finally a list of
 * all the original tokens.
 *
 * The output of functions in the pipeline will be passed to the next function
 * in the pipeline. To exclude a token from entering the index the function
 * should return undefined, the rest of the pipeline will not be called with
 * this token.
 *
 * For serialisation of pipelines to work, all functions used in an instance of
 * a pipeline should be registered with lunr.Pipeline. Registered functions can
 * then be loaded. If trying to load a serialised pipeline that uses functions
 * that are not registered an error will be thrown.
 *
 * If not planning on serialising the pipeline then registering pipeline functions
 * is not necessary.
 *
 * @constructor
 */
lunr.Pipeline = function () {
  this._stack = []
}

lunr.Pipeline.registeredFunctions = {}

/**
 * Register a function with the pipeline.
 *
 * Functions that are used in the pipeline should be registered if the pipeline
 * needs to be serialised, or a serialised pipeline needs to be loaded.
 *
 * Registering a function does not add it to a pipeline, functions must still be
 * added to instances of the pipeline for them to be used when running a pipeline.
 *
 * @param {Function} fn The function to check for.
 * @param {String} label The label to register this function with
 * @memberOf Pipeline
 */
lunr.Pipeline.registerFunction = function (fn, label) {
  if (label in this.registeredFunctions) {
    lunr.utils.warn('Overwriting existing registered function: ' + label)
  }

  fn.label = label
  lunr.Pipeline.registeredFunctions[fn.label] = fn
}

/**
 * Warns if the function is not registered as a Pipeline function.
 *
 * @param {Function} fn The function to check for.
 * @private
 * @memberOf Pipeline
 */
lunr.Pipeline.warnIfFunctionNotRegistered = function (fn) {
  var isRegistered = fn.label && (fn.label in this.registeredFunctions)

  if (!isRegistered) {
    lunr.utils.warn('Function is not registered with pipeline. This may cause problems when serialising the index.\n', fn)
  }
}

/**
 * Loads a previously serialised pipeline.
 *
 * All functions to be loaded must already be registered with lunr.Pipeline.
 * If any function from the serialised data has not been registered then an
 * error will be thrown.
 *
 * @param {Object} serialised The serialised pipeline to load.
 * @returns {lunr.Pipeline}
 * @memberOf Pipeline
 */
lunr.Pipeline.load = function (serialised) {
  var pipeline = new lunr.Pipeline

  serialised.forEach(function (fnName) {
    var fn = lunr.Pipeline.registeredFunctions[fnName]

    if (fn) {
      pipeline.add(fn)
    } else {
      throw new Error('Cannot load un-registered function: ' + fnName)
    }
  })

  return pipeline
}

/**
 * Adds new functions to the end of the pipeline.
 *
 * Logs a warning if the function has not been registered.
 *
 * @param {Function} functions Any number of functions to add to the pipeline.
 * @memberOf Pipeline
 */
lunr.Pipeline.prototype.add = function () {
  var fns = Array.prototype.slice.call(arguments)

  fns.forEach(function (fn) {
    lunr.Pipeline.warnIfFunctionNotRegistered(fn)
    this._stack.push(fn)
  }, this)
}

/**
 * Adds a single function after a function that already exists in the
 * pipeline.
 *
 * Logs a warning if the function has not been registered.
 *
 * @param {Function} existingFn A function that already exists in the pipeline.
 * @param {Function} newFn The new function to add to the pipeline.
 * @memberOf Pipeline
 */
lunr.Pipeline.prototype.after = function (existingFn, newFn) {
  lunr.Pipeline.warnIfFunctionNotRegistered(newFn)

  var pos = this._stack.indexOf(existingFn)
  if (pos == -1) {
    throw new Error('Cannot find existingFn')
  }

  pos = pos + 1
  this._stack.splice(pos, 0, newFn)
}

/**
 * Adds a single function before a function that already exists in the
 * pipeline.
 *
 * Logs a warning if the function has not been registered.
 *
 * @param {Function} existingFn A function that already exists in the pipeline.
 * @param {Function} newFn The new function to add to the pipeline.
 * @memberOf Pipeline
 */
lunr.Pipeline.prototype.before = function (existingFn, newFn) {
  lunr.Pipeline.warnIfFunctionNotRegistered(newFn)

  var pos = this._stack.indexOf(existingFn)
  if (pos == -1) {
    throw new Error('Cannot find existingFn')
  }

  this._stack.splice(pos, 0, newFn)
}

/**
 * Removes a function from the pipeline.
 *
 * @param {Function} fn The function to remove from the pipeline.
 * @memberOf Pipeline
 */
lunr.Pipeline.prototype.remove = function (fn) {
  var pos = this._stack.indexOf(fn)
  if (pos == -1) {
    return
  }

  this._stack.splice(pos, 1)
}

/**
 * Runs the current list of functions that make up the pipeline against the
 * passed tokens.
 *
 * @param {Array} tokens The tokens to run through the pipeline.
 * @returns {Array}
 * @memberOf Pipeline
 */
lunr.Pipeline.prototype.run = function (tokens) {
  var out = [],
      tokenLength = tokens.length,
      stackLength = this._stack.length

  for (var i = 0; i < tokenLength; i++) {
    var token = tokens[i]

    for (var j = 0; j < stackLength; j++) {
      token = this._stack[j](token, i, tokens)
      if (token === void 0) break
    };

    if (token !== void 0) out.push(token)
  };

  return out
}

/**
 * Resets the pipeline by removing any existing processors.
 *
 * @memberOf Pipeline
 */
lunr.Pipeline.prototype.reset = function () {
  this._stack = []
}

/**
 * Returns a representation of the pipeline ready for serialisation.
 *
 * Logs a warning if the function has not been registered.
 *
 * @returns {Array}
 * @memberOf Pipeline
 */
lunr.Pipeline.prototype.toJSON = function () {
  return this._stack.map(function (fn) {
    lunr.Pipeline.warnIfFunctionNotRegistered(fn)

    return fn.label
  })
}
/*!
 * lunr.Vector
 * Copyright (C) 2015 Oliver Nightingale
 */

/**
 * lunr.Vectors implement vector related operations for
 * a series of elements.
 *
 * @constructor
 */
lunr.Vector = function () {
  this._magnitude = null
  this.list = undefined
  this.length = 0
}

/**
 * lunr.Vector.Node is a simple struct for each node
 * in a lunr.Vector.
 *
 * @private
 * @param {Number} The index of the node in the vector.
 * @param {Object} The data at this node in the vector.
 * @param {lunr.Vector.Node} The node directly after this node in the vector.
 * @constructor
 * @memberOf Vector
 */
lunr.Vector.Node = function (idx, val, next) {
  this.idx = idx
  this.val = val
  this.next = next
}

/**
 * Inserts a new value at a position in a vector.
 *
 * @param {Number} The index at which to insert a value.
 * @param {Object} The object to insert in the vector.
 * @memberOf Vector.
 */
lunr.Vector.prototype.insert = function (idx, val) {
  this._magnitude = undefined;
  var list = this.list

  if (!list) {
    this.list = new lunr.Vector.Node (idx, val, list)
    return this.length++
  }

  if (idx < list.idx) {
    this.list = new lunr.Vector.Node (idx, val, list)
    return this.length++
  }

  var prev = list,
      next = list.next

  while (next != undefined) {
    if (idx < next.idx) {
      prev.next = new lunr.Vector.Node (idx, val, next)
      return this.length++
    }

    prev = next, next = next.next
  }

  prev.next = new lunr.Vector.Node (idx, val, next)
  return this.length++
}

/**
 * Calculates the magnitude of this vector.
 *
 * @returns {Number}
 * @memberOf Vector
 */
lunr.Vector.prototype.magnitude = function () {
  if (this._magnitude) return this._magnitude
  var node = this.list,
      sumOfSquares = 0,
      val

  while (node) {
    val = node.val
    sumOfSquares += val * val
    node = node.next
  }

  return this._magnitude = Math.sqrt(sumOfSquares)
}

/**
 * Calculates the dot product of this vector and another vector.
 *
 * @param {lunr.Vector} otherVector The vector to compute the dot product with.
 * @returns {Number}
 * @memberOf Vector
 */
lunr.Vector.prototype.dot = function (otherVector) {
  var node = this.list,
      otherNode = otherVector.list,
      dotProduct = 0

  while (node && otherNode) {
    if (node.idx < otherNode.idx) {
      node = node.next
    } else if (node.idx > otherNode.idx) {
      otherNode = otherNode.next
    } else {
      dotProduct += node.val * otherNode.val
      node = node.next
      otherNode = otherNode.next
    }
  }

  return dotProduct
}

/**
 * Calculates the cosine similarity between this vector and another
 * vector.
 *
 * @param {lunr.Vector} otherVector The other vector to calculate the
 * similarity with.
 * @returns {Number}
 * @memberOf Vector
 */
lunr.Vector.prototype.similarity = function (otherVector) {
  return this.dot(otherVector) / (this.magnitude() * otherVector.magnitude())
}
/*!
 * lunr.SortedSet
 * Copyright (C) 2015 Oliver Nightingale
 */

/**
 * lunr.SortedSets are used to maintain an array of uniq values in a sorted
 * order.
 *
 * @constructor
 */
lunr.SortedSet = function () {
  this.length = 0
  this.elements = []
}

/**
 * Loads a previously serialised sorted set.
 *
 * @param {Array} serialisedData The serialised set to load.
 * @returns {lunr.SortedSet}
 * @memberOf SortedSet
 */
lunr.SortedSet.load = function (serialisedData) {
  var set = new this

  set.elements = serialisedData
  set.length = serialisedData.length

  return set
}

/**
 * Inserts new items into the set in the correct position to maintain the
 * order.
 *
 * @param {Object} The objects to add to this set.
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.add = function () {
  var i, element

  for (i = 0; i < arguments.length; i++) {
    element = arguments[i]
    if (~this.indexOf(element)) continue
    this.elements.splice(this.locationFor(element), 0, element)
  }

  this.length = this.elements.length
}

/**
 * Converts this sorted set into an array.
 *
 * @returns {Array}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.toArray = function () {
  return this.elements.slice()
}

/**
 * Creates a new array with the results of calling a provided function on every
 * element in this sorted set.
 *
 * Delegates to Array.prototype.map and has the same signature.
 *
 * @param {Function} fn The function that is called on each element of the
 * set.
 * @param {Object} ctx An optional object that can be used as the context
 * for the function fn.
 * @returns {Array}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.map = function (fn, ctx) {
  return this.elements.map(fn, ctx)
}

/**
 * Executes a provided function once per sorted set element.
 *
 * Delegates to Array.prototype.forEach and has the same signature.
 *
 * @param {Function} fn The function that is called on each element of the
 * set.
 * @param {Object} ctx An optional object that can be used as the context
 * @memberOf SortedSet
 * for the function fn.
 */
lunr.SortedSet.prototype.forEach = function (fn, ctx) {
  return this.elements.forEach(fn, ctx)
}

/**
 * Returns the index at which a given element can be found in the
 * sorted set, or -1 if it is not present.
 *
 * @param {Object} elem The object to locate in the sorted set.
 * @returns {Number}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.indexOf = function (elem) {
  var start = 0,
      end = this.elements.length,
      sectionLength = end - start,
      pivot = start + Math.floor(sectionLength / 2),
      pivotElem = this.elements[pivot]

  while (sectionLength > 1) {
    if (pivotElem === elem) return pivot

    if (pivotElem < elem) start = pivot
    if (pivotElem > elem) end = pivot

    sectionLength = end - start
    pivot = start + Math.floor(sectionLength / 2)
    pivotElem = this.elements[pivot]
  }

  if (pivotElem === elem) return pivot

  return -1
}

/**
 * Returns the position within the sorted set that an element should be
 * inserted at to maintain the current order of the set.
 *
 * This function assumes that the element to search for does not already exist
 * in the sorted set.
 *
 * @param {Object} elem The elem to find the position for in the set
 * @returns {Number}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.locationFor = function (elem) {
  var start = 0,
      end = this.elements.length,
      sectionLength = end - start,
      pivot = start + Math.floor(sectionLength / 2),
      pivotElem = this.elements[pivot]

  while (sectionLength > 1) {
    if (pivotElem < elem) start = pivot
    if (pivotElem > elem) end = pivot

    sectionLength = end - start
    pivot = start + Math.floor(sectionLength / 2)
    pivotElem = this.elements[pivot]
  }

  if (pivotElem > elem) return pivot
  if (pivotElem < elem) return pivot + 1
}

/**
 * Creates a new lunr.SortedSet that contains the elements in the intersection
 * of this set and the passed set.
 *
 * @param {lunr.SortedSet} otherSet The set to intersect with this set.
 * @returns {lunr.SortedSet}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.intersect = function (otherSet) {
  var intersectSet = new lunr.SortedSet,
      i = 0, j = 0,
      a_len = this.length, b_len = otherSet.length,
      a = this.elements, b = otherSet.elements

  while (true) {
    if (i > a_len - 1 || j > b_len - 1) break

    if (a[i] === b[j]) {
      intersectSet.add(a[i])
      i++, j++
      continue
    }

    if (a[i] < b[j]) {
      i++
      continue
    }

    if (a[i] > b[j]) {
      j++
      continue
    }
  };

  return intersectSet
}

/**
 * Makes a copy of this set
 *
 * @returns {lunr.SortedSet}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.clone = function () {
  var clone = new lunr.SortedSet

  clone.elements = this.toArray()
  clone.length = clone.elements.length

  return clone
}

/**
 * Creates a new lunr.SortedSet that contains the elements in the union
 * of this set and the passed set.
 *
 * @param {lunr.SortedSet} otherSet The set to union with this set.
 * @returns {lunr.SortedSet}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.union = function (otherSet) {
  var longSet, shortSet, unionSet

  if (this.length >= otherSet.length) {
    longSet = this, shortSet = otherSet
  } else {
    longSet = otherSet, shortSet = this
  }

  unionSet = longSet.clone()

  unionSet.add.apply(unionSet, shortSet.toArray())

  return unionSet
}

/**
 * Returns a representation of the sorted set ready for serialisation.
 *
 * @returns {Array}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.toJSON = function () {
  return this.toArray()
}
/*!
 * lunr.Index
 * Copyright (C) 2015 Oliver Nightingale
 */

/**
 * lunr.Index is object that manages a search index.  It contains the indexes
 * and stores all the tokens and document lookups.  It also provides the main
 * user facing API for the library.
 *
 * @constructor
 */
lunr.Index = function () {
  this._fields = []
  this._ref = 'id'
  this.pipeline = new lunr.Pipeline
  this.documentStore = new lunr.Store
  this.tokenStore = new lunr.TokenStore
  this.corpusTokens = new lunr.SortedSet
  this.eventEmitter =  new lunr.EventEmitter

  this._idfCache = {}

  this.on('add', 'remove', 'update', (function () {
    this._idfCache = {}
  }).bind(this))
}

/**
 * Bind a handler to events being emitted by the index.
 *
 * The handler can be bound to many events at the same time.
 *
 * @param {String} [eventName] The name(s) of events to bind the function to.
 * @param {Function} fn The serialised set to load.
 * @memberOf Index
 */
lunr.Index.prototype.on = function () {
  var args = Array.prototype.slice.call(arguments)
  return this.eventEmitter.addListener.apply(this.eventEmitter, args)
}

/**
 * Removes a handler from an event being emitted by the index.
 *
 * @param {String} eventName The name of events to remove the function from.
 * @param {Function} fn The serialised set to load.
 * @memberOf Index
 */
lunr.Index.prototype.off = function (name, fn) {
  return this.eventEmitter.removeListener(name, fn)
}

/**
 * Loads a previously serialised index.
 *
 * Issues a warning if the index being imported was serialised
 * by a different version of lunr.
 *
 * @param {Object} serialisedData The serialised set to load.
 * @returns {lunr.Index}
 * @memberOf Index
 */
lunr.Index.load = function (serialisedData) {
  if (serialisedData.version !== lunr.version) {
    lunr.utils.warn('version mismatch: current ' + lunr.version + ' importing ' + serialisedData.version)
  }

  var idx = new this

  idx._fields = serialisedData.fields
  idx._ref = serialisedData.ref

  idx.documentStore = lunr.Store.load(serialisedData.documentStore)
  idx.tokenStore = lunr.TokenStore.load(serialisedData.tokenStore)
  idx.corpusTokens = lunr.SortedSet.load(serialisedData.corpusTokens)
  idx.pipeline = lunr.Pipeline.load(serialisedData.pipeline)

  return idx
}

/**
 * Adds a field to the list of fields that will be searchable within documents
 * in the index.
 *
 * An optional boost param can be passed to affect how much tokens in this field
 * rank in search results, by default the boost value is 1.
 *
 * Fields should be added before any documents are added to the index, fields
 * that are added after documents are added to the index will only apply to new
 * documents added to the index.
 *
 * @param {String} fieldName The name of the field within the document that
 * should be indexed
 * @param {Number} boost An optional boost that can be applied to terms in this
 * field.
 * @returns {lunr.Index}
 * @memberOf Index
 */
lunr.Index.prototype.field = function (fieldName, opts) {
  var opts = opts || {},
      field = { name: fieldName, boost: opts.boost || 1 }

  this._fields.push(field)
  return this
}

/**
 * Sets the property used to uniquely identify documents added to the index,
 * by default this property is 'id'.
 *
 * This should only be changed before adding documents to the index, changing
 * the ref property without resetting the index can lead to unexpected results.
 *
 * @param {String} refName The property to use to uniquely identify the
 * documents in the index.
 * @param {Boolean} emitEvent Whether to emit add events, defaults to true
 * @returns {lunr.Index}
 * @memberOf Index
 */
lunr.Index.prototype.ref = function (refName) {
  this._ref = refName
  return this
}

/**
 * Add a document to the index.
 *
 * This is the way new documents enter the index, this function will run the
 * fields from the document through the index's pipeline and then add it to
 * the index, it will then show up in search results.
 *
 * An 'add' event is emitted with the document that has been added and the index
 * the document has been added to. This event can be silenced by passing false
 * as the second argument to add.
 *
 * @param {Object} doc The document to add to the index.
 * @param {Boolean} emitEvent Whether or not to emit events, default true.
 * @memberOf Index
 */
lunr.Index.prototype.add = function (doc, emitEvent) {
  var docTokens = {},
      allDocumentTokens = new lunr.SortedSet,
      docRef = doc[this._ref],
      emitEvent = emitEvent === undefined ? true : emitEvent

  this._fields.forEach(function (field) {
    var fieldTokens = this.pipeline.run(lunr.tokenizer(doc[field.name]))

    docTokens[field.name] = fieldTokens
    lunr.SortedSet.prototype.add.apply(allDocumentTokens, fieldTokens)
  }, this)

  this.documentStore.set(docRef, allDocumentTokens)
  lunr.SortedSet.prototype.add.apply(this.corpusTokens, allDocumentTokens.toArray())

  for (var i = 0; i < allDocumentTokens.length; i++) {
    var token = allDocumentTokens.elements[i]
    var tf = this._fields.reduce(function (memo, field) {
      var fieldLength = docTokens[field.name].length

      if (!fieldLength) return memo

      var tokenCount = docTokens[field.name].filter(function (t) { return t === token }).length

      return memo + (tokenCount / fieldLength * field.boost)
    }, 0)

    this.tokenStore.add(token, { ref: docRef, tf: tf })
  };

  if (emitEvent) this.eventEmitter.emit('add', doc, this)
}

/**
 * Removes a document from the index.
 *
 * To make sure documents no longer show up in search results they can be
 * removed from the index using this method.
 *
 * The document passed only needs to have the same ref property value as the
 * document that was added to the index, they could be completely different
 * objects.
 *
 * A 'remove' event is emitted with the document that has been removed and the index
 * the document has been removed from. This event can be silenced by passing false
 * as the second argument to remove.
 *
 * @param {Object} doc The document to remove from the index.
 * @param {Boolean} emitEvent Whether to emit remove events, defaults to true
 * @memberOf Index
 */
lunr.Index.prototype.remove = function (doc, emitEvent) {
  var docRef = doc[this._ref],
      emitEvent = emitEvent === undefined ? true : emitEvent

  if (!this.documentStore.has(docRef)) return

  var docTokens = this.documentStore.get(docRef)

  this.documentStore.remove(docRef)

  docTokens.forEach(function (token) {
    this.tokenStore.remove(token, docRef)
  }, this)

  if (emitEvent) this.eventEmitter.emit('remove', doc, this)
}

/**
 * Updates a document in the index.
 *
 * When a document contained within the index gets updated, fields changed,
 * added or removed, to make sure it correctly matched against search queries,
 * it should be updated in the index.
 *
 * This method is just a wrapper around `remove` and `add`
 *
 * An 'update' event is emitted with the document that has been updated and the index.
 * This event can be silenced by passing false as the second argument to update. Only
 * an update event will be fired, the 'add' and 'remove' events of the underlying calls
 * are silenced.
 *
 * @param {Object} doc The document to update in the index.
 * @param {Boolean} emitEvent Whether to emit update events, defaults to true
 * @see Index.prototype.remove
 * @see Index.prototype.add
 * @memberOf Index
 */
lunr.Index.prototype.update = function (doc, emitEvent) {
  var emitEvent = emitEvent === undefined ? true : emitEvent

  this.remove(doc, false)
  this.add(doc, false)

  if (emitEvent) this.eventEmitter.emit('update', doc, this)
}

/**
 * Calculates the inverse document frequency for a token within the index.
 *
 * @param {String} token The token to calculate the idf of.
 * @see Index.prototype.idf
 * @private
 * @memberOf Index
 */
lunr.Index.prototype.idf = function (term) {
  var cacheKey = "@" + term
  if (Object.prototype.hasOwnProperty.call(this._idfCache, cacheKey)) return this._idfCache[cacheKey]

  var documentFrequency = this.tokenStore.count(term),
      idf = 1

  if (documentFrequency > 0) {
    idf = 1 + Math.log(this.documentStore.length / documentFrequency)
  }

  return this._idfCache[cacheKey] = idf
}

/**
 * Searches the index using the passed query.
 *
 * Queries should be a string, multiple words are allowed and will lead to an
 * AND based query, e.g. `idx.search('foo bar')` will run a search for
 * documents containing both 'foo' and 'bar'.
 *
 * All query tokens are passed through the same pipeline that document tokens
 * are passed through, so any language processing involved will be run on every
 * query term.
 *
 * Each query term is expanded, so that the term 'he' might be expanded to
 * 'hello' and 'help' if those terms were already included in the index.
 *
 * Matching documents are returned as an array of objects, each object contains
 * the matching document ref, as set for this index, and the similarity score
 * for this document against the query.
 *
 * @param {String} query The query to search the index with.
 * @returns {Object}
 * @see Index.prototype.idf
 * @see Index.prototype.documentVector
 * @memberOf Index
 */
lunr.Index.prototype.search = function (query) {
  var queryTokens = this.pipeline.run(lunr.tokenizer(query)),
      queryVector = new lunr.Vector,
      documentSets = [],
      fieldBoosts = this._fields.reduce(function (memo, f) { return memo + f.boost }, 0)

  var hasSomeToken = queryTokens.some(function (token) {
    return this.tokenStore.has(token)
  }, this)

  if (!hasSomeToken) return []

  queryTokens
    .forEach(function (token, i, tokens) {
      var tf = 1 / tokens.length * this._fields.length * fieldBoosts,
          self = this

      var set = this.tokenStore.expand(token).reduce(function (memo, key) {
        var pos = self.corpusTokens.indexOf(key),
            idf = self.idf(key),
            similarityBoost = 1,
            set = new lunr.SortedSet

        // if the expanded key is not an exact match to the token then
        // penalise the score for this key by how different the key is
        // to the token.
        if (key !== token) {
          var diff = Math.max(3, key.length - token.length)
          similarityBoost = 1 / Math.log(diff)
        }

        // calculate the query tf-idf score for this token
        // applying an similarityBoost to ensure exact matches
        // these rank higher than expanded terms
        if (pos > -1) queryVector.insert(pos, tf * idf * similarityBoost)

        // add all the documents that have this key into a set
        Object.keys(self.tokenStore.get(key)).forEach(function (ref) { set.add(ref) })

        return memo.union(set)
      }, new lunr.SortedSet)

      documentSets.push(set)
    }, this)

  var documentSet = documentSets.reduce(function (memo, set) {
    return memo.intersect(set)
  })

  return documentSet
    .map(function (ref) {
      return { ref: ref, score: queryVector.similarity(this.documentVector(ref)) }
    }, this)
    .sort(function (a, b) {
      return b.score - a.score
    })
}

/**
 * Generates a vector containing all the tokens in the document matching the
 * passed documentRef.
 *
 * The vector contains the tf-idf score for each token contained in the
 * document with the passed documentRef.  The vector will contain an element
 * for every token in the indexes corpus, if the document does not contain that
 * token the element will be 0.
 *
 * @param {Object} documentRef The ref to find the document with.
 * @returns {lunr.Vector}
 * @private
 * @memberOf Index
 */
lunr.Index.prototype.documentVector = function (documentRef) {
  var documentTokens = this.documentStore.get(documentRef),
      documentTokensLength = documentTokens.length,
      documentVector = new lunr.Vector

  for (var i = 0; i < documentTokensLength; i++) {
    var token = documentTokens.elements[i],
        tf = this.tokenStore.get(token)[documentRef].tf,
        idf = this.idf(token)

    documentVector.insert(this.corpusTokens.indexOf(token), tf * idf)
  };

  return documentVector
}

/**
 * Returns a representation of the index ready for serialisation.
 *
 * @returns {Object}
 * @memberOf Index
 */
lunr.Index.prototype.toJSON = function () {
  return {
    version: lunr.version,
    fields: this._fields,
    ref: this._ref,
    documentStore: this.documentStore.toJSON(),
    tokenStore: this.tokenStore.toJSON(),
    corpusTokens: this.corpusTokens.toJSON(),
    pipeline: this.pipeline.toJSON()
  }
}

/**
 * Applies a plugin to the current index.
 *
 * A plugin is a function that is called with the index as its context.
 * Plugins can be used to customise or extend the behaviour the index
 * in some way. A plugin is just a function, that encapsulated the custom
 * behaviour that should be applied to the index.
 *
 * The plugin function will be called with the index as its argument, additional
 * arguments can also be passed when calling use. The function will be called
 * with the index as its context.
 *
 * Example:
 *
 *     var myPlugin = function (idx, arg1, arg2) {
 *       // `this` is the index to be extended
 *       // apply any extensions etc here.
 *     }
 *
 *     var idx = lunr(function () {
 *       this.use(myPlugin, 'arg1', 'arg2')
 *     })
 *
 * @param {Function} plugin The plugin to apply.
 * @memberOf Index
 */
lunr.Index.prototype.use = function (plugin) {
  var args = Array.prototype.slice.call(arguments, 1)
  args.unshift(this)
  plugin.apply(this, args)
}
/*!
 * lunr.Store
 * Copyright (C) 2015 Oliver Nightingale
 */

/**
 * lunr.Store is a simple key-value store used for storing sets of tokens for
 * documents stored in index.
 *
 * @constructor
 * @module
 */
lunr.Store = function () {
  this.store = {}
  this.length = 0
}

/**
 * Loads a previously serialised store
 *
 * @param {Object} serialisedData The serialised store to load.
 * @returns {lunr.Store}
 * @memberOf Store
 */
lunr.Store.load = function (serialisedData) {
  var store = new this

  store.length = serialisedData.length
  store.store = Object.keys(serialisedData.store).reduce(function (memo, key) {
    memo[key] = lunr.SortedSet.load(serialisedData.store[key])
    return memo
  }, {})

  return store
}

/**
 * Stores the given tokens in the store against the given id.
 *
 * @param {Object} id The key used to store the tokens against.
 * @param {Object} tokens The tokens to store against the key.
 * @memberOf Store
 */
lunr.Store.prototype.set = function (id, tokens) {
  if (!this.has(id)) this.length++
  this.store[id] = tokens
}

/**
 * Retrieves the tokens from the store for a given key.
 *
 * @param {Object} id The key to lookup and retrieve from the store.
 * @returns {Object}
 * @memberOf Store
 */
lunr.Store.prototype.get = function (id) {
  return this.store[id]
}

/**
 * Checks whether the store contains a key.
 *
 * @param {Object} id The id to look up in the store.
 * @returns {Boolean}
 * @memberOf Store
 */
lunr.Store.prototype.has = function (id) {
  return id in this.store
}

/**
 * Removes the value for a key in the store.
 *
 * @param {Object} id The id to remove from the store.
 * @memberOf Store
 */
lunr.Store.prototype.remove = function (id) {
  if (!this.has(id)) return

  delete this.store[id]
  this.length--
}

/**
 * Returns a representation of the store ready for serialisation.
 *
 * @returns {Object}
 * @memberOf Store
 */
lunr.Store.prototype.toJSON = function () {
  return {
    store: this.store,
    length: this.length
  }
}

/*!
 * lunr.stemmer
 * Copyright (C) 2015 Oliver Nightingale
 * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
 */

/**
 * lunr.stemmer is an english language stemmer, this is a JavaScript
 * implementation of the PorterStemmer taken from http://tartarus.org/~martin
 *
 * @module
 * @param {String} str The string to stem
 * @returns {String}
 * @see lunr.Pipeline
 */
lunr.stemmer = (function(){
  var step2list = {
      "ational" : "ate",
      "tional" : "tion",
      "enci" : "ence",
      "anci" : "ance",
      "izer" : "ize",
      "bli" : "ble",
      "alli" : "al",
      "entli" : "ent",
      "eli" : "e",
      "ousli" : "ous",
      "ization" : "ize",
      "ation" : "ate",
      "ator" : "ate",
      "alism" : "al",
      "iveness" : "ive",
      "fulness" : "ful",
      "ousness" : "ous",
      "aliti" : "al",
      "iviti" : "ive",
      "biliti" : "ble",
      "logi" : "log"
    },

    step3list = {
      "icate" : "ic",
      "ative" : "",
      "alize" : "al",
      "iciti" : "ic",
      "ical" : "ic",
      "ful" : "",
      "ness" : ""
    },

    c = "[^aeiou]",          // consonant
    v = "[aeiouy]",          // vowel
    C = c + "[^aeiouy]*",    // consonant sequence
    V = v + "[aeiou]*",      // vowel sequence

    mgr0 = "^(" + C + ")?" + V + C,               // [C]VC... is m>0
    meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$",  // [C]VC[V] is m=1
    mgr1 = "^(" + C + ")?" + V + C + V + C,       // [C]VCVC... is m>1
    s_v = "^(" + C + ")?" + v;                   // vowel in stem

  var re_mgr0 = new RegExp(mgr0);
  var re_mgr1 = new RegExp(mgr1);
  var re_meq1 = new RegExp(meq1);
  var re_s_v = new RegExp(s_v);

  var re_1a = /^(.+?)(ss|i)es$/;
  var re2_1a = /^(.+?)([^s])s$/;
  var re_1b = /^(.+?)eed$/;
  var re2_1b = /^(.+?)(ed|ing)$/;
  var re_1b_2 = /.$/;
  var re2_1b_2 = /(at|bl|iz)$/;
  var re3_1b_2 = new RegExp("([^aeiouylsz])\\1$");
  var re4_1b_2 = new RegExp("^" + C + v + "[^aeiouwxy]$");

  var re_1c = /^(.+?[^aeiou])y$/;
  var re_2 = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;

  var re_3 = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;

  var re_4 = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
  var re2_4 = /^(.+?)(s|t)(ion)$/;

  var re_5 = /^(.+?)e$/;
  var re_5_1 = /ll$/;
  var re3_5 = new RegExp("^" + C + v + "[^aeiouwxy]$");

  var porterStemmer = function porterStemmer(w) {
    var   stem,
      suffix,
      firstch,
      re,
      re2,
      re3,
      re4;

    if (w.length < 3) { return w; }

    firstch = w.substr(0,1);
    if (firstch == "y") {
      w = firstch.toUpperCase() + w.substr(1);
    }

    // Step 1a
    re = re_1a
    re2 = re2_1a;

    if (re.test(w)) { w = w.replace(re,"$1$2"); }
    else if (re2.test(w)) { w = w.replace(re2,"$1$2"); }

    // Step 1b
    re = re_1b;
    re2 = re2_1b;
    if (re.test(w)) {
      var fp = re.exec(w);
      re = re_mgr0;
      if (re.test(fp[1])) {
        re = re_1b_2;
        w = w.replace(re,"");
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1];
      re2 = re_s_v;
      if (re2.test(stem)) {
        w = stem;
        re2 = re2_1b_2;
        re3 = re3_1b_2;
        re4 = re4_1b_2;
        if (re2.test(w)) {  w = w + "e"; }
        else if (re3.test(w)) { re = re_1b_2; w = w.replace(re,""); }
        else if (re4.test(w)) { w = w + "e"; }
      }
    }

    // Step 1c - replace suffix y or Y by i if preceded by a non-vowel which is not the first letter of the word (so cry -> cri, by -> by, say -> say)
    re = re_1c;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      w = stem + "i";
    }

    // Step 2
    re = re_2;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = re_mgr0;
      if (re.test(stem)) {
        w = stem + step2list[suffix];
      }
    }

    // Step 3
    re = re_3;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = re_mgr0;
      if (re.test(stem)) {
        w = stem + step3list[suffix];
      }
    }

    // Step 4
    re = re_4;
    re2 = re2_4;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = re_mgr1;
      if (re.test(stem)) {
        w = stem;
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1] + fp[2];
      re2 = re_mgr1;
      if (re2.test(stem)) {
        w = stem;
      }
    }

    // Step 5
    re = re_5;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = re_mgr1;
      re2 = re_meq1;
      re3 = re3_5;
      if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
        w = stem;
      }
    }

    re = re_5_1;
    re2 = re_mgr1;
    if (re.test(w) && re2.test(w)) {
      re = re_1b_2;
      w = w.replace(re,"");
    }

    // and turn initial Y back to y

    if (firstch == "y") {
      w = firstch.toLowerCase() + w.substr(1);
    }

    return w;
  };

  return porterStemmer;
})();

lunr.Pipeline.registerFunction(lunr.stemmer, 'stemmer')
/*!
 * lunr.stopWordFilter
 * Copyright (C) 2015 Oliver Nightingale
 */

/**
 * lunr.stopWordFilter is an English language stop word list filter, any words
 * contained in the list will not be passed through the filter.
 *
 * This is intended to be used in the Pipeline. If the token does not pass the
 * filter then undefined will be returned.
 *
 * @module
 * @param {String} token The token to pass through the filter
 * @returns {String}
 * @see lunr.Pipeline
 */
lunr.stopWordFilter = function (token) {
  if (lunr.stopWordFilter.stopWords.indexOf(token) === -1) return token
}

lunr.stopWordFilter.stopWords = new lunr.SortedSet
lunr.stopWordFilter.stopWords.length = 119 + 34
lunr.stopWordFilter.stopWords.elements = [
  "",
  "a",
  "able",
  "about",
  "across",
  "after",
  "all",
  "almost",
  "also",
  "am",
  "among",
  "an",
  "and",
  "any",
  "are",
  "as",
  "at",
  "be",
  "because",
  "been",
  "but",
  "by",
  "can",
  "cannot",
  "could",
  "dear",
  "did",
  "do",
  "does",
  "either",
  "else",
  "ever",
  "every",
  "for",
  "from",
  "get",
  "got",
  "had",
  "has",
  "have",
  "he",
  "her",
  "hers",
  "him",
  "his",
  "how",
  "however",
  "i",
  "if",
  "in",
  "into",
  "is",
  "it",
  "its",
  "just",
  "least",
  "let",
  "like",
  "likely",
  "may",
  "me",
  "might",
  "most",
  "must",
  "my",
  "neither",
  "no",
  "nor",
  "not",
  "of",
  "off",
  "often",
  "on",
  "only",
  "or",
  "other",
  "our",
  "own",
  "rather",
  "said",
  "say",
  "says",
  "she",
  "should",
  "since",
  "so",
  "some",
  "than",
  "that",
  "the",
  "their",
  "them",
  "then",
  "there",
  "these",
  "they",
  "this",
  "tis",
  "to",
  "too",
  "twas",
  "us",
  "wants",
  "was",
  "we",
  "were",
  "what",
  "when",
  "where",
  "which",
  "while",
  "who",
  "whom",
  "why",
  "will",
  "with",
  "would",
  "yet",
  "you",
  "your",

  "が",
  "の",
  "を",
  "に",
  "へ",
  "と",
  "から",
  "より",
  "で",
  "や",
  "やら",
  "か",
  "なり",
  "だの",
  "は",
  "も",
  "こそ",
  "しか",
  "でも",
  "さえ",
  "だに",
  "ば",
  "と",
  "ても",
  "のに",
  "ので",
  "し",
  "て",
  "ながら",
  "たり",
  "つつ",
  "な",
  "とも",
  "ぞ",
]

lunr.Pipeline.registerFunction(lunr.stopWordFilter, 'stopWordFilter')
/*!
 * lunr.trimmer
 * Copyright (C) 2015 Oliver Nightingale
 */

/**
 * lunr.trimmer is a pipeline function for trimming non word
 * characters from the begining and end of tokens before they
 * enter the index.
 *
 * This implementation may not work correctly for non latin
 * characters and should either be removed or adapted for use
 * with languages with non-latin characters.
 *
 * @module
 * @param {String} token The token to pass through the filter
 * @returns {String}
 * @see lunr.Pipeline
 */
lunr.trimmer = function (token) {
  var rePrefix = /^[　 	-–—―.。・（）()［］\[\]｛｝{}【】⟨⟩〈〉<>、､,，،…‥〽「」『』〜~！!：:？?\"'|_＿〝〟“”‘’;/⁄／«»↵]+/;
  var reSuffix =  /[　 	-–—―.。・（）()［］\[\]｛｝{}【】⟨⟩〈〉<>、､,，،…‥〽「」『』〜~！!：:？?\"'|_＿〝〟“”‘’;/⁄／«»↵]+$/;

  return token
    //.replace(/^\W+/, '')
    //.replace(/\W+$/, '')
    .replace(rePrefix, '')
    .replace(reSuffix, '')
}

lunr.Pipeline.registerFunction(lunr.trimmer, 'trimmer')
/*!
 * lunr.stemmer
 * Copyright (C) 2015 Oliver Nightingale
 * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
 */

/**
 * lunr.TokenStore is used for efficient storing and lookup of the reverse
 * index of token to document ref.
 *
 * @constructor
 */
lunr.TokenStore = function () {
  this.root = { docs: {} }
  this.length = 0
}

/**
 * Loads a previously serialised token store
 *
 * @param {Object} serialisedData The serialised token store to load.
 * @returns {lunr.TokenStore}
 * @memberOf TokenStore
 */
lunr.TokenStore.load = function (serialisedData) {
  var store = new this

  store.root = serialisedData.root
  store.length = serialisedData.length

  return store
}

/**
 * Adds a new token doc pair to the store.
 *
 * By default this function starts at the root of the current store, however
 * it can start at any node of any token store if required.
 *
 * @param {String} token The token to store the doc under
 * @param {Object} doc The doc to store against the token
 * @param {Object} root An optional node at which to start looking for the
 * correct place to enter the doc, by default the root of this lunr.TokenStore
 * is used.
 * @memberOf TokenStore
 */
lunr.TokenStore.prototype.add = function (token, doc, root) {
  var root = root || this.root,
      key = token[0],
      rest = token.slice(1)

  if (!(key in root)) root[key] = {docs: {}}

  if (rest.length === 0) {
    root[key].docs[doc.ref] = doc
    this.length += 1
    return
  } else {
    return this.add(rest, doc, root[key])
  }
}

/**
 * Checks whether this key is contained within this lunr.TokenStore.
 *
 * By default this function starts at the root of the current store, however
 * it can start at any node of any token store if required.
 *
 * @param {String} token The token to check for
 * @param {Object} root An optional node at which to start
 * @memberOf TokenStore
 */
lunr.TokenStore.prototype.has = function (token) {
  if (!token) return false

  var node = this.root

  for (var i = 0; i < token.length; i++) {
    if (!node[token[i]]) return false

    node = node[token[i]]
  }

  return true
}

/**
 * Retrieve a node from the token store for a given token.
 *
 * By default this function starts at the root of the current store, however
 * it can start at any node of any token store if required.
 *
 * @param {String} token The token to get the node for.
 * @param {Object} root An optional node at which to start.
 * @returns {Object}
 * @see TokenStore.prototype.get
 * @memberOf TokenStore
 */
lunr.TokenStore.prototype.getNode = function (token) {
  if (!token) return {}

  var node = this.root

  for (var i = 0; i < token.length; i++) {
    if (!node[token[i]]) return {}

    node = node[token[i]]
  }

  return node
}

/**
 * Retrieve the documents for a node for the given token.
 *
 * By default this function starts at the root of the current store, however
 * it can start at any node of any token store if required.
 *
 * @param {String} token The token to get the documents for.
 * @param {Object} root An optional node at which to start.
 * @returns {Object}
 * @memberOf TokenStore
 */
lunr.TokenStore.prototype.get = function (token, root) {
  return this.getNode(token, root).docs || {}
}

lunr.TokenStore.prototype.count = function (token, root) {
  return Object.keys(this.get(token, root)).length
}

/**
 * Remove the document identified by ref from the token in the store.
 *
 * By default this function starts at the root of the current store, however
 * it can start at any node of any token store if required.
 *
 * @param {String} token The token to get the documents for.
 * @param {String} ref The ref of the document to remove from this token.
 * @param {Object} root An optional node at which to start.
 * @returns {Object}
 * @memberOf TokenStore
 */
lunr.TokenStore.prototype.remove = function (token, ref) {
  if (!token) return
  var node = this.root

  for (var i = 0; i < token.length; i++) {
    if (!(token[i] in node)) return
    node = node[token[i]]
  }

  delete node.docs[ref]
}

/**
 * Find all the possible suffixes of the passed token using tokens
 * currently in the store.
 *
 * @param {String} token The token to expand.
 * @returns {Array}
 * @memberOf TokenStore
 */
lunr.TokenStore.prototype.expand = function (token, memo) {
  var root = this.getNode(token),
      docs = root.docs || {},
      memo = memo || []

  if (Object.keys(docs).length) memo.push(token)

  Object.keys(root)
    .forEach(function (key) {
      if (key === 'docs') return

      memo.concat(this.expand(token + key, memo))
    }, this)

  return memo
}

/**
 * Returns a representation of the token store ready for serialisation.
 *
 * @returns {Object}
 * @memberOf TokenStore
 */
lunr.TokenStore.prototype.toJSON = function () {
  return {
    root: this.root,
    length: this.length
  }
}


  /**
   * export the module via AMD, CommonJS or as a browser global
   * Export code from https://github.com/umdjs/umd/blob/master/returnExports.js
   */
  ;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(factory)
    } else if (typeof exports === 'object') {
      /**
       * Node. Does not work with strict CommonJS, but
       * only CommonJS-like enviroments that support module.exports,
       * like Node.
       */
      module.exports = factory()
    } else {
      // Browser globals (root is window)
      root.lunr = factory()
    }
  }(this, function () {
    /**
     * Just return a value to define the module export.
     * This example returns an object, but the module
     * can return a function as the exported value.
     */
    return lunr
  }))
})();

// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: portrait;
// PokéWidget v1.1.4
// 
// Developer: RealNyk
// Release Date: 01/25/2022
// 
// Release Notes: 
//    - Cleaned up the codebase.
//    - Tapping widget links to TCGPlayer site
//    - Added Siri voice controls
//    - Added changing backgrounds based on Pokemon
// 
// Parameter Key: [Series][Set#]-[Card#]
// 
// Example: swsh8-266
// 
//    swsh = Sword and Shield 
//    8 = Set 8
//    266 = Card 266

const API__URL = `https://api.pokemontcg.io/v2/cards?q=id:`+((args.widgetParameter == null) ? `swsh8-266` : args.widgetParameter)

const API__REQ = new Request(API__URL)
const API__RES = await API__REQ.loadString()
const CARD_DATA = `${API__RES}`
const CARD_JSON = await API__REQ.loadJSON()

const IMGCARD = (CARD_JSON.data[0].images.large)
const CARD_PNG = await getBG(IMGCARD)

const IMGSET = CARD_JSON.data[0].set.images.logo
const pack_logo = await getBG(IMGSET)

const background = await getBG("http://dreamitive.org/widgets/pokemon2.jpeg")
const eevee = await getBG("http://dreamitive.org/widgets/pokemon.jpeg")
const gengar = await getBG("https://wallpaperaccess.com/download/pokemon-gengar-560392")
const birds = await getBG("http://dreamitive.org/widgets/birds.jpeg")
const charizard = await getBG("http://dreamitive.org/widgets/char.jpeg")
const dragonite = await getBG("http://dreamitive.org/widgets/dragonite.jpeg")
const dpg = await getBG("http://dreamitive.org/widgets/dpg.jpeg")
const lugia = await getBG("http://dreamitive.org/widgets/lugia.jpeg")

async function getBG(url) {
   let imgReq = new Request(url)
   return await imgReq.loadImage()
}

if (true || config.runsInWidget) {
  let widget = createWidget()

  widget.presentSmall()
  Script.setWidget(widget)
  Script.complete()
} else {
  let table = createStatTable()
}

function createWidget() 
{
  const widget = new ListWidget()
  
  let data = CARD_JSON
  const new_price = data.data[0].cardmarket.prices.averageSellPrice

  const CARDNAME = data.data[0].name
  const cardID = data.data[0].number

  widget.addSpacer();
  
  widget.addSpacer(32)

  const ss = widget.addStack()
  const pkmnName = ss.addText(CARDNAME)
  pkmnName.centerAlignText()
  pkmnName.textColor = Color.black()
  pkmnName.font = Font.semiboldMonospacedSystemFont(18)

  const date = new Date()
  const time = widget.addText("      Updated at " + date.getHours() + ":" + (date.getMinutes().toString().length == 1 ? "0"+date.getMinutes() : date.getMinutes()))
  time.font = Font.semiboldSystemFont(6)
  time.textColor = Color.gray()
  time.leftAlignText()

  pkmnName.textOpacity = 0.7

  const sub = widget.addStack()
  const imgsub = sub.addStack()
  const cardSub = imgsub.addStack()
  
  const cardText = widget.addText("     " +cardID + "/" + data.data[0].set.total)
  cardText.font = Font.semiboldMonospacedSystemFont(8)
  cardText.textColor = Color.gray()
  
  widget.addSpacer(2)
  const pkmnPrice = widget.addText("$" + new_price)
  pkmnPrice.leftAlignText()

  pkmnPrice.font = Font.semiboldMonospacedSystemFont(22)
  pkmnPrice.textColor = Color.blue()
  pkmnPrice.textOpacity = 1.0
  
  const pkmnIMG = imgsub.addImage(CARD_PNG)
  pkmnIMG.imageSize = new Size(80,80)
  pkmnIMG.centerAlignImage()
  
  const logo = imgsub.addImage(pack_logo)
  logo.imageSize = new Size(60,60)

  widget.addSpacer(40)
  
  widget.url = "https://prices.pokemontcg.io/cardmarket/" + ((args.widgetParameter == null) ? `swsh8-266` : args.widgetParameter)

  if (config.runsWithSiri)
  {
    Speech.speak(CARDNAME + " is card " + cardID + " from set " + data.data[0].set.name + " is currently worth $" + new_price)
    Script.complete()
  }
  
  
  if (CARDNAME.toString().includes("Espeon") ||
      CARDNAME.toString().includes("Sylveon") ||
      CARDNAME.toString().includes("Glaceon") ||
      CARDNAME.toString().includes("Flareon") ||
      CARDNAME.toString().includes("Leafeon") ||
      CARDNAME.toString().includes("Umbreon") ||
      CARDNAME.toString().includes("Jolteon") ||
      CARDNAME.toString().includes("Vaporeon") ||
      CARDNAME.toString().includes("Eevee"))
  {
    widget.backgroundImage = eevee
  }else if (CARDNAME.toString().includes("Gengar"))
  {
    widget.backgroundImage = gengar
    pkmnPrice.textColor = Color.black()
    pkmnPrice.textOpacity = 0.7
  }else if (CARDNAME.toString().includes("Moltres") || CARDNAME.toString().includes("Zapados") || CARDNAME.toString().includes("Articuno"))
  {
    widget.backgroundImage = birds
    pkmnPrice.textColor = Color.black()
  }else if (CARDNAME.toString().includes("Charizard"))
  {
    widget.backgroundImage = charizard
    pkmnPrice.textColor = Color.black()
  }else if (CARDNAME.toString().includes("Dragonite"))
  {
    widget.backgroundImage = dragonite
    pkmnPrice.textColor = Color.black()
  }else if (CARDNAME.toString().includes("Lugia"))
  {
    widget.backgroundImage = lugia
    pkmnPrice.textColor = Color.black()
  }else if (CARDNAME.toString().includes("Dialga") || CARDNAME.toString().includes("Palkia") || CARDNAME.toString().includes("Giratina"))
  {
    widget.backgroundImage = dpg
    pkmnPrice.textColor = Color.black()
  }else{
    widget.backgroundImage = background
  }

  return widget
}

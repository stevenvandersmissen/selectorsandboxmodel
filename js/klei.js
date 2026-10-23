/* Gegenereerd door tools/bouw.py — niet met de hand aanpassen.
   Publieke dataset van de CSS-cursus: opdrachten, regels en vragen,
   zonder énige oplossing of startcode. */
window.KLEI = window.JSB = { data: {
 "meta": {
  "titel": "CSS opbouwen",
  "ondertitel": "selectors, combinatoren en de doos — gemeten, niet geraden",
  "jaar": "5de jaar",
  "thema": "kaartjes voor een festivalprogramma"
 },
 "topics": [
  {
   "id": "basis",
   "num": "01",
   "titel": "De vijf wijzers van de basis",
   "dots": "Element, klasse, id, ster en komma — meer heb je op dag één niet.",
   "theorie": "<p>Een CSS-regel heeft twee delen: <b>waarnaar</b> je wijst en <b>wat</b> je erzet. Het eerste deel is het gevaarlijkst: een selector die niets vindt, geeft geen fout — hij doet gewoon niets. `<code>.kaart</code> is een klasse, <code>#kaart</code> een id en <code>kaart</code> een element dat niet bestaat. Wie de punt vergeet, schrijft voor de leegte.</p><p><b>De vijf wijzers.</b> <code>p</code> is elk element met die naam, <code>.kaart</code> elk element met die klasse, <code>#titel</code> het ene element met dat id, <code>*</code> alles, en <code>h1, h2, .titel</code> één blok voor drie wijzers. Meer is er niet aan de basis.</p><p><b>Waarom klassen en geen namen.</b> <code>h2</code> kleurt elke koptekst op de pagina, ook die van de voettekst. <code>.titel</code> kleurt alleen wat jij die klasse hebt gegeven. En als je die <code>&lt;h2&gt;</code> later door een <code>&lt;p&gt;</code> laat vervangen, verlies je al die stijl; een klasse blijft staan. Stijl op klassen, structuur op elementen.</p><p><b>Een id is geen stijl, een id is een adres.</b> Het is uniek op de pagina en je gebruikt het om naartoe te springen of te labelen. Als stijlwijzer werkt het moeyelijk, maar je moet daarna altijd iets specifiekers schrijven om er weer bovenop te komen. daarom: klasse voor uiterlijk, id voor verwijzing.</p><p><b>De ster is een belofte, geen schoonmaakmiddel.</b> <code>* { color: orange }</code> kleurt élk knooppunt, ook de dingen die je vergat. <code>.kaart *</code> is dezelfde kracht met een hekpunt: alleen wat ín die kaart zit. Wie met <code>*</code> begint, eindigt met terugnemen.</p>",
   "voorbeeld": {
    "kop": "De onzichtbare nul",
    "code": "/* <section class=\"kaart\"><h2 class=\"titel\">Fest</h2></section> */\n.kaart {\n  color: #0a0a0a;          /* landt: de section heeft class=\"kaart\" */\n}\nkaart {\n  padding: 1rem;           /* landt NOOIT: er bestaat geen <kaart> */\n}\n#kaart {\n  border: 3px solid;       /* landt niet: het is een klasse, geen id */\n}\n.titel {\n  font-size: 1.4rem;       /* landt: die klasse staat op de h2 */\n}",
    "uitleg": "Twee van de vier regels doen iets, twee niet, en géén ervan klaagt. Daarom meet je in plaats van je voor te stellen wat er zal staan."
   },
   "oefeningen": [
    {
     "soort": "Warm-up",
     "titel": "Punt of geen punt",
     "soortOef": "css",
     "brief": "<ul><li>Geef <code>.kaart</code> <code>color: #0a0a0a</code>.</li><li>En <code>font-size: 1.2rem</code>, in hetzelfde blok.</li><li>Laat de motor beide meten en lees ze na in het tabblad <em>meten</em>.</li></ul>",
     "velden": [
      {
       "id": "vermoed",
       "label": "vermoed — wat gaat de meting zeggen?"
      },
      {
       "id": "css",
       "label": "css — het enige vlak waarin je hier typt"
      }
     ],
     "checks": [
      "niet:!important::!important is geen herstel: het maakt elke volgende regel machteloos.",
      "niet:\\bvar\\s+::Gebruik const in het meetvak: wie var tikt, zoekt straks dode muis.",
      "css:\\.kaart\\s*\\{::Met een punt: .kaart is een klasse, kaart een onbestaand element.",
      "stijl:.kaart|color|#0a0a0a::De meting ziet de kaart zwart.",
      "stijl:.kaart|font-size|1.2rem::En één punt twintig groter.",
      "vw:2|.kaart::Twee eigenschappen: kleur en maat.",
      "geenFout::Lees eerst de melding: zolang je CSS of code struikelt, meet het vak niets."
     ],
     "verwacht": {},
     "opzet": {
      "html": "<section class=\"kaart\"><h2 class=\"titel\">Fest</h2><p>tekst</p></section>"
     }
    },
    {
     "soort": "Oefening",
     "titel": "Punt of kruisje",
     "soortOef": "css",
     "brief": "<ul><li>De <code>h2</code> draagt klasse <code>.titel</code>, de paragraaf draagt id <code>titel</code>.</li><li>Kleur <code>.titel</code> oranje en geef <code>#titel</code> <code>font-size: 1.6rem</code>.</li><li>Twee blokken, twee wijzers: meet élk apart.</li></ul>",
     "velden": [
      {
       "id": "vermoed",
       "label": "vermoed — wat gaat de meting zeggen?"
      },
      {
       "id": "css",
       "label": "css — het enige vlak waarin je hier typt"
      }
     ],
     "checks": [
      "niet:!important::!important is geen herstel: het maakt elke volgende regel machteloos.",
      "niet:\\bvar\\s+::Gebruik const in het meetvak: wie var tikt, zoekt straks dode muis.",
      "css:\\.titel\\s*\\{::De koptekst heeft een klasse: mik met .titel.",
      "css:#titel\\s*\\{::En de paragraaf een id: mik met #titel.",
      "stijl:.titel|color|#ff3b00::Oranje hoort op de klasse, niet op het id.",
      "stijl:#titel|font-size|1.6rem::En de maat op het id.",
      "cssRegels:2::Twee blokken: wie ze mengt, meet vals.",
      "vw:1|.titel::Eén eigenschap vermoed je over de klasse.",
      "geenFout::Lees eerst de melding: zolang je CSS of code struikelt, meet het vak niets."
     ],
     "verwacht": {},
     "opzet": {
      "html": "<section class=\"kaart\"><h2 class=\"titel\">Fest</h2><p id=\"titel\">tekst</p></section>"
     }
    },
    {
     "soort": "Bonus",
     "titel": "Alles wat in de kaart zit",
     "soortOef": "css",
     "brief": "<ul><li>Kleur <b>alles</b> wat in <code>.kaart</code> zit oranje, met één enkele ster-wijzer.</li><li>Laat de motor de <code>h2</code> en de <code>p</code> meten: twee stroken, dezelfde kleur.</li></ul>",
     "velden": [
      {
       "id": "vermoed",
       "label": "vermoed — wat gaat de meting zeggen?"
      },
      {
       "id": "css",
       "label": "css — het enige vlak waarin je hier typt"
      }
     ],
     "checks": [
      "niet:!important::!important is geen herstel: het maakt elke volgende regel machteloos.",
      "niet:\\bvar\\s+::Gebruik const in het meetvak: wie var tikt, zoekt straks dode muis.",
      "css:\\.kaart\\s+\\*::Een ster alleen is te gul: .kaart * kleurt wat ín de kaart zit.",
      "vw:1|.kaart *::Eén eigenschap: wat de ster nalaat, is de kleur.",
      "vw:1|.kaart *::Eén eigenschap: wat de ster nalaat, is de kleur.",
      "stijl:.kaart *|color|#ff3b00::De ster-wijzer zelf is ook een meetpunt.",
      "geenFout::Lees eerst de melding: zolang je CSS of code struikelt, meet het vak niets."
     ],
     "verwacht": {},
     "opzet": {
      "html": "<section class=\"kaart\"><h2 class=\"titel\">Fest</h2><p>tekst</p></section>"
     }
    },
    {
     "soort": "Oefening",
     "titel": "Eén blok, drie wijzers",
     "soortOef": "css",
     "brief": "<ul><li>Geef <code>h2</code>, <code>p</code> en <code>.prijs</code> in <b>één</b> regel <code>line-height: 1.6</code>.</li><li>Lees na wat de motor voor de koptekst noteert.</li></ul>",
     "velden": [
      {
       "id": "vermoed",
       "label": "vermoed — wat gaat de meting zeggen?"
      },
      {
       "id": "css",
       "label": "css — het enige vlak waarin je hier typt"
      }
     ],
     "checks": [
      "niet:!important::!important is geen herstel: het maakt elke volgende regel machteloos.",
      "niet:\\bvar\\s+::Gebruik const in het meetvak: wie var tikt, zoekt straks dode muis.",
      "css:h2\\s*,\\s*p\\s*,\\s*\\.prijs::Eén selector-lijn met drie wijzers en twee komma's.",
      "stijl:h2|line-height|1.6::De eerste wijzer van je lijst raakt de koptekst.",
      "cssRegels:3::Eén blok is genoeg: geen drie keer dezelfde regel.",
      "vw:1|h2::Eén eigenschap: de lijnhoogte.",
      "geenFout::Lees eerst de melding: zolang je CSS of code struikelt, meet het vak niets."
     ],
     "opzet": {
      "html": "<section class=\"kaart\"><h2>Fest</h2><p>tekst</p><span class=\"prijs\">18</span></section>"
     }
    }
   ],
   "vragen": [
    {
     "kind": "mc",
     "vraag": "Welke wijzer raakt <code>&lt;section class=\"kaart\"&gt;</code>?",
     "opties": [
      "<code>.kaart</code>",
      "<code>kaart</code>",
      "<code>#kaart</code>",
      "<code>*kaart</code>"
     ],
     "goed": 0,
     "uitleg": "Een punt is een klasse. Zonder punt zocht je een element <code>&lt;kaart&gt;</code>, met <code>#</code> een id dat hier niet staat, en <code>*kaart</code> is geen geldige selector.",
     "check": "mv:0|0::Een punt is een klasse."
    },
    {
     "kind": "open",
     "vraag": "Waarom geeft een selector die niets vindt géén foutmelding, en wat doe je daarom?",
     "keywords": [
      "stille fout",
      "geen error",
      "meten",
      "controleer",
      "getComputedStyle",
      "zichtbaar"
     ],
     "minKeywords": 2,
     "terug": "CSS kent geen \"niet gevonden\": een regel die niemand wijst, wordt genegeerd alsof hij niet bestond. Daarom hoort bij elke opdracht een meting — <code>__stijl(...)</code> hier, <code>getComputedStyle</code> in de echte browser — en niet de hoop dat het wel zal lukken.",
     "check": "op:1::Minstens 2 begrippen uit de lijst: dan zie ik dat je het snapt."
    },
    {
     "kind": "mc",
     "vraag": "Wanneer is <code>#kop</code> als stijlwijzer een slecht idee?",
     "opties": [
      "altijd bijna: een id is een adres, geen stijl",
      "nooit, ids zijn netter dan klassen",
      "alleen in een <code>&lt;nav&gt;</code>",
      "als er meer dan één id op de pagina staat"
     ],
     "goed": 0,
     "uitleg": "Een id uniek maken om naartoe te springen is goed; het als stijlwijzer gebruiken maakt elke volgende regel zwaarder dan hij moet zijn.",
     "check": "mv:2|0::Een id uniek maken om naartoe te springen is goed; het als stijlwijzer gebruiken maakt elke volgende regel zwaarder dan hij moet zijn."
    },
    {
     "kind": "open",
     "vraag": "Wat is het verschil tussen <code>*</code> en <code>.kaart *</code>?",
     "keywords": [
      "alles op de pagina",
      "afstammeling",
      "voorouders",
      "gevaarlijk",
      "breed",
      "beperkt"
     ],
     "minKeywords": 2,
     "terug": "<code>*</code> geldt voor élk knooppunt op de pagina, ook buiten jouw kaart. <code>.kaart *</code> is dezelfde kracht, maar alleen voor wat er ín die kaart zit — de afstand tussen de twee is precies het verschil tussen een schoonmaakmiddel en een ongeluk.",
     "check": "op:3::Minstens 2 begrippen uit de lijst: dan zie ik dat je het snapt."
    }
   ]
  },
  {
   "id": "combinatoren",
   "num": "02",
   "titel": "Combinatoren: spatie, child, adjacent en general sibling",
   "dots": "Vier tekens die zeggen wáár een wijzer landt: descendant, child, adjacent sibling en general sibling.",
   "theorie": "<p>Een losse wijzer zegt <b>wat</b> je zoekt. Een <b>combinator</b> — het teken tussen twee wijzers — zegt <b>waar</b>. Er zijn er vier, en je raadt ze niet uit de html: je leest ze.</p><p><code>.kaart .prijs</code> (spatie) is een <b>afstammeling</b>: elke prijs die érgens in die kaart zit, hoe diep ook. <code>.kaart &gt; .prijs</code> is een <b>child</b>: alleen wie er rechtstreeks in zit. Het verschil zie je pas als iemand later een <code>&lt;div&gt;</code> tussenvoegt — dan doet de spatie nog alles en de <code>&gt;</code> niets meer.</p><p><code>h2 + p</code> (plus) is de <b>adjacent sibling</b>: paragrafen die direkt op een koptekst volgen, de eerste van een blok. <code>h2 ~ p</code> (tilde) is <b>general sibling</b> erna: alle paragrafen na die koptekst, tot het einde van de moeder. Wie <code>+</code> schrijft waar <code>~</code> moest, vergeet de tweede paragraaf; wie <code>~</code> schrijft waar <code>+</code> moest, kleurt de inleiding meester.</p><p>Combinatoren wijzigen je gewicht niet: <code>.kaart &gt; .prijs</code> weegt even zwaar als <code>.kaart .prijs</code>. Ze veranderen alleen de <b>plek</b> waar de regel landt — en dat is precies wat je hier meet, niet wat je je voorstelt.</p>",
   "voorbeeld": {
    "kop": "De regel die één kaart te veel deed",
    "code": "/* <section class=\"kaart\"><p>18</p><div><p>24</p></div></section> */\n.kaart p {\n  color: #ff3b00;   /* landt op BEIDE paragrafen: spatie is elke diepte */\n}\n.kaart > p {\n  color: #0047ff;   /* landt op de eerste alleen: direct child */\n}\n.kaart p + p {\n  font-style: italic;  /* landt nergens: er is geen tweede p in dat niveau */\n}\ndiv p {\n  font-weight: 700;    /* landt op de tweede: wie in de div zit, is afstammeling */\n}",
    "uitleg": "Vier regels, vier verschillende verzamelingen knooppunten, en géén klacht in de console. De combinator is de enige die je dat verschil laat zien."
   },
   "oefeningen": [
    {
     "soort": "Warm-up",
     "titel": "Overal in de kaart",
     "soortOef": "css",
     "brief": "<ul><li>De <code>li</code> items zitten in een <code>ul</code> in <code>.programma</code>.</li><li>Kleur <b>elke</b> <code>li</code> in <code>.programma</code> oranje met één <code>.programma li</code>-regel, <code>color: #ff3b00</code>.</li><li>De losse <code>li</code> erbuiten mag je met rust laten: meet beide en kijk wie er oranje werd.</li></ul>",
     "velden": [
      {
       "id": "css",
       "label": "css — het enige vlak waarin je hier typt"
      },
      {
       "id": "vermoed",
       "label": "vermoed — wat gaat de meting zeggen?"
      }
     ],
     "checks": [
      "niet:!important::!important is geen herstel: het maakt elke volgende regel machteloos.",
      "niet:\\bvar\\s+::Typ je CSS uitgeschreven; `var` is een variabele en die ken ik hier niet.",
      "css:\\.programma\\s+li::Deze wijzer staat er in de opdracht: .programma li.",
      "geenFout::Lees eerst de melding: zolang je CSS struikelt, meet het vak niets.",
      "stijl:.programma li|color|#ff3b00::De motor meet color: #ff3b00.",
      "vw:1|.programma li::Vermoed eerst deze 1 eigenschap(pen).",
      "cssRegels:1::Schrijf het in 1 blok(ken)."
     ],
     "verwacht": {},
     "opzet": {
      "html": "<div class=\"programma\"><ul><li>19:30 De Stoel</li><li>20:15 Kraai</li></ul></div>\n<ul><li>Programma onder voorbehoud</li></ul>"
     }
    },
    {
     "soort": "Oefening",
     "titel": "Enkel de directe children",
     "soortOef": "css",
     "brief": "<ul><li>De <code>.kaart</code> zélf heeft twee directe <code>p</code>-children en één <code>div</code> met daarin nóg een <code>p</code>.</li><li>Geef <b>enkel</b> de directe children <code>border-bottom: 2px solid #0047ff</code>, met <code>.</code>kaart &gt; p</code>.</li><li>Meet beide stroken: de geneste <code>p</code> hoort kaal te blijven.</li></ul>",
     "velden": [
      {
       "id": "css",
       "label": "css — het enige vlak waarin je hier typt"
      },
      {
       "id": "vermoed",
       "label": "vermoed — wat gaat de meting zeggen?"
      }
     ],
     "checks": [
      "niet:!important::!important is geen herstel: het maakt elke volgende regel machteloos.",
      "niet:\\bvar\\s+::Typ je CSS uitgeschreven; `var` is een variabele en die ken ik hier niet.",
      "css:\\.kaart\\s+>\\s+p::Deze wijzer staat er in de opdracht: .kaart > p.",
      "geenFout::Lees eerst de melding: zolang je CSS struikelt, meet het vak niets.",
      "stijl:.kaart > p|border-bottom|2px solid #0047ff::De motor meet border-bottom: 2px solid #0047ff.",
      "vw:1|.kaart > p::Vermoed eerst deze 1 eigenschap(pen).",
      "cssRegels:1::Schrijf het in 1 blok(ken)."
     ],
     "verwacht": {},
     "opzet": {
      "html": "<section class=\"kaart\"><p>Eerste</p><p>Tweede</p><div><p>Genest</p></div></section>"
     }
    },
    {
     "soort": "Oefening",
     "titel": "Alleen de eerste paragraaf",
     "soortOef": "css",
     "brief": "<ul><li>Elke <code>p</code> die <b>direkt</b> op een <code>h2</code> volgt, wordt <code>font-weight: 700</code>.</li><li>De <code>p</code> die na de <code>ul</code> komt, mag gewoon gewoon blijven.</li><li>De motor meet de eerste paragraaf; de tweede moet <code>400</code> blijven.</li></ul>",
     "velden": [
      {
       "id": "css",
       "label": "css — het enige vlak waarin je hier typt"
      },
      {
       "id": "vermoed",
       "label": "vermoed — wat gaat de meting zeggen?"
      }
     ],
     "checks": [
      "niet:!important::!important is geen herstel: het maakt elke volgende regel machteloos.",
      "niet:\\bvar\\s+::Typ je CSS uitgeschreven; `var` is een variabele en die ken ik hier niet.",
      "css:h2\\s+\\+\\s+p::Deze wijzer staat er in de opdracht: h2 + p.",
      "geenFout::Lees eerst de melding: zolang je CSS struikelt, meet het vak niets.",
      "stijl:h2 + p|font-weight|700::De motor meet font-weight: 700.",
      "vw:1|h2 + p::Vermoed eerst deze 1 eigenschap(pen).",
      "cssRegels:1::Schrijf het in 1 blok(ken)."
     ],
     "verwacht": {},
     "opzet": {
      "html": "<section class=\"kaart\"><h2>Verdwenen Stad</h2><p>Inleiding</p><ul><li>19:30</li></ul><p>Tweede blok</p></section>"
     }
    },
    {
     "soort": "Bonus",
     "titel": "Alles ná de poster",
     "soortOef": "css",
     "brief": "<ul><li>In <code>.poster</code> staan <code>h2</code>, <code>p</code> en <code>a</code> naast de <code>img</code>.</li><li>Maak met <b>één</b> regel alles <b>ná de koptekst</b> half doorzichtig: <code>.poster h2 ~ * { opacity: 0.6 }</code>.</li><li>De poster en de titel zelf blijven volledig: meet beide stroken en vergelijk.</li></ul>",
     "velden": [
      {
       "id": "css",
       "label": "css — het enige vlak waarin je hier typt"
      },
      {
       "id": "vermoed",
       "label": "vermoed — wat gaat de meting zeggen?"
      }
     ],
     "checks": [
      "niet:!important::!important is geen herstel: het maakt elke volgende regel machteloos.",
      "niet:\\bvar\\s+::Typ je CSS uitgeschreven; `var` is een variabele en die ken ik hier niet.",
      "css:\\.poster\\s+h2\\s*~\\s*\\*::Alles ná de koptekst, in één tilde-regel.",
      "geenFout::Lees eerst de melding: zolang je CSS struikelt, meet het vak niets.",
      "stijl:.poster h2 ~ *|opacity|0.6::Alles ná de titel wordt half doorzichtig; de titel zelf niet.",
      "vw:1|.poster h2 ~ *::Vermoed eerst deze 1 eigenschap(pen).",
      "cssRegels:1::Schrijf het in 1 blok(ken)."
     ],
     "verwacht": {},
     "opzet": {
      "html": "<section class=\"poster\"><img src=\"poster.png\" alt=\"poster\">\n  <h2>Zaterdag 20:00</h2><p>De Stoel · Kraai · Verdwenen Stad</p><a href=\"#\">Tickets</a></section>"
     }
    }
   ],
   "vragen": [
    {
     "kind": "mc",
     "vraag": "Welke regel raakt de <code>&lt;p&gt;</code> in <code>&lt;div&gt;</code> binnen <code>.kaart</code> <b>niet</b>?",
     "opties": [
      "<code>.kaart p</code>",
      "<code>.kaart &gt; p</code>",
      "<code>.kaart &gt; div p</code>",
      "<code>div p</code>"
     ],
     "goed": 1,
     "uitleg": "<code>&gt;</code> stopt bij het directe child; die p zit twee niveaus diep. De spatie en <code>.kaart &gt; div p</code> raken hem wél.",
     "check": "mv:0|1::De children-combinator stopt één niveau te hoog."
    },
    {
     "kind": "mc",
     "vraag": "<code>h2 + p</code> en <code>h2 ~ p</code>: wat is het verschil?",
     "opties": [
      "geen, het zijn twee schrijfwijzen voor dezelfde regel",
      "+ is de paragraaf direkt na de h2, ~ elke paragraaf erna",
      "+ werkt in een lijst, ~ werkt in een sectie",
      "~ is zwaarder in de cascade dan +"
     ],
     "goed": 1,
     "uitleg": "Plus is de onmiddellijke buur, tilde elke sibling erna. De tilde raakt dus meer knooppunten, nooit zwaardere.",
     "check": "mv:1|1::Plus is de sibling direkt erna, tilde elke sibling erna."
    },
    {
     "kind": "open",
     "vraag": "Wanneer kies je <code>&gt;</code> in plaats van de spatie? Geef een nooit-vergeten voorbeeld.",
     "keywords": [
      "child",
      "direct",
      "genest",
      "dieper",
      "tussenvoegen",
      "div"
     ],
     "minKeywords": 3,
     "terug": "Bij voorkeur waar je alleen de directe children bedoelt: als iemand later een <code>&lt;div&gt;</code> tussenvoegt, landt de spatie nog steeds en de <code>&gt;</code> niet. Die tweede is dus de eerlijke belofte.",
     "check": "op:2::Noem het directe child én wat er misgaat bij inbakken."
    },
    {
     "kind": "open",
     "vraag": "Waarom is <code>.kaart .prijs</code> niet zwaarder dan <code>.kaart &gt; p .prijs</code>?",
     "keywords": [
      "gewicht",
      "combinator",
      "telt niet",
      "zelfde",
      "klasse",
      "element"
     ],
     "minKeywords": 3,
     "terug": "Combinatoren tellen niet mee in het gewicht: twee klassen wegen twee klassen, ongeacht het teken ertussen. Wat wél beslist, is de volgorde in het bestand.",
     "check": "op:3::Combinatoren tellen niet mee in het gewicht."
    }
   ]
  },
  {
   "id": "rijk",
   "num": "03",
   "titel": "Specifieker verwijzen: klasse, attribute en :not()",
   "dots": "Samenstellen, filteren en negeren — drie wijzers die je dagdagelijks nodig hebt.",
   "theorie": "<p><b>Samenstellen.</b> <code>a.uit</code> is één element dat beide draagt: de link <em>met</em> die klasse. <code>.kaart .uit</code> (met spatie) is iets anders — daar zoek je een .uit <em>in</em> een kaart. Wie de spatie vergeet, wijst breder dan hij dacht, en dat merk je pas aan het einde van de pagina.</p><p><b>Filteren op attribuut.</b> <code>a[target=\"_blank\"]</code> kiest op een eigenschap van het element zelf, niet op een klasse die iemand toevallig zette. <code>^=</code> begint met, <code>$=</code> eindigt op, <code>*=</code> bevat ergens. Dat is de enige wijzer die meebeweegt met de html.</p><p><b>Negeren.</b> <code>:not(.goud)</code> raakt allesbehalve die klasse; <code>:is(h2, .prijs)</code> is een lijst die je één blok voor drie wijzers laat schrijven. Beide tellen mee in het gewicht zoals hun argument, dus <code>:not()</code> maakt een regel niet lichter — dat is een broodnodige mythe om los te laten.</p>",
   "voorbeeld": {
    "kop": "De spatie die twee kaarten raakte",
    "code": "/* <section class=\"kaart\"><a class=\"uit\" href=\"#\">Bekijken</a></section> */\n.kaart a.uit {\n  color: #ff3b00;   /* landt: link, met klasse, in de kaart */\n}\n.kaart .uit {\n  color: #0047ff;   /* landt ook, maar raakt élk element met .uit */\n}\na .uit {\n  color: #00c853;   /* landt NOOIT: .uit zit niet ín een link */\n}\n.kaart a:not(.uit) {\n  font-style: italic;  /* landt op de ANDERE link: not filtert uit */\n}",
    "uitleg": "Drie wijzers op hetzelfde element, één landt. Daarom meet je: de selector die je bedoelt en de selector die landt zijn twee verschillende dingen."
   },
   "oefeningen": [
    {
     "soort": "Oefening",
     "titel": "Enkel het directe child",
     "soortOef": "css",
     "brief": "<ul><li>De kaart en de lijst erin dragen allebei een <code>.titel</code>.</li><li>Kleur <b>enkel</b> de titel die direct in <code>.kaart</code> zit.</li><li>Laat beide meten en kijk in <em>meten</em> welk element er oranje werd: ze verschillen.</li></ul>",
     "velden": [
      {
       "id": "vermoed",
       "label": "vermoed — wat gaat de meting zeggen?"
      },
      {
       "id": "css",
       "label": "css — het enige vlak waarin je hier typt"
      }
     ],
     "checks": [
      "niet:!important::!important is geen herstel: het maakt elke volgende regel machteloos.",
      "niet:\\bvar\\s+::Gebruik const in het meetvak: wie var tikt, zoekt straks dode muis.",
      "css:\\.kaart\\s*>\\s*\\.[\\w-]+::Een child-wijzer: .kaart > .titel stopt bij het eerste niveau.",
      "stijl:.titel|color|#ff3b00::De eerste .titel die past, is die van de kaart zelf.",
      "niet:\\.kaart\\s+\\.titel\\s*\\{::Met een spatie kleurt de titel in de lijst ook mee.",
      "vw:1|.titel::Eén eigenschap: de kleur.",
      "geenFout::Lees eerst de melding: zolang je CSS of code struikelt, meet het vak niets."
     ],
     "verwacht": {},
     "opzet": {
      "html": "<section class=\"kaart\"><h2 class=\"titel\">Fest</h2><ul><li class=\"titel\">Line-up</li></ul></section>"
     }
    },
    {
     "soort": "Oefening",
     "titel": "De link die het verdient",
     "soortOef": "css",
     "brief": "<ul><li>In <code>.kaart</code> staan twee links; de eerste draagt de klasse <code>.uit</code> — uitverkocht.</li><li>Haal die ene door met <code>text-decoration-line: line-through</code> en geef hem <code>color: #ff3b00</code>, in één blok gekoppeld als <code>.kaart a.uit</code>.</li><li>De motor meet <code>.kaart a.uit</code>; dat is de link in jouw doelwit.</li></ul><p class=\"must-note\">Eén blok, twee eigenschappen. Geen <code>!important</code> en geen losse <code>a</code>-regel: zo zie je in de voorschou meteen welke link er oranje uitziet.</p>",
     "velden": [
      {
       "id": "vermoed",
       "label": "vermoed — wat gaat de meting zeggen?"
      },
      {
       "id": "css",
       "label": "css — het enige vlak waarin je hier typt"
      }
     ],
     "checks": [
      "niet:!important::!important is geen herstel: het maakt elke volgende regel machteloos.",
      "niet:\\bvar\\s+::Gebruik const in het meetvak: wie var tikt, zoekt straks dode muis.",
      "css:\\.kaart\\s+a\\.uit\\s*\\{::De wijzer koppelt de klasse aan de link.",
      "stijl:.kaart a.uit|text-decoration-line|line-through::Het blok .kaart a.uit draagt de streep — dat meet ik in je eigen CSS.",
      "vw:2|.kaart a.uit::Eén eigenschap vermoed je over die wijzer.",
      "cssRegels:1::Eén blok volstaat.",
      "geenFout::Lees eerst de melding: zolang je CSS of code struikelt, meet het vak niets."
     ],
     "verwacht": {},
     "opzet": {
      "html": "<section class=\"kaart\">\n  <h2 class=\"titel\">Verdwenen Stad</h2>\n  <a class=\"uit\" href=\"#\">Bekijken</a>\n  <a href=\"#\">Kopen</a>\n</section>"
     }
    },
    {
     "soort": "Bonus",
     "titel": "Iedereen behalve de gouden",
     "soortOef": "css",
     "brief": "<ul><li>Elk item in <code>.lijst</code> krijgt <code>padding: 0.4rem</code>.</li><li>Wie <code>.goud</code> draagt, krijgt <code>padding: 0.8rem</code> — en de gewone items krijgen met <code>:not(.goud)</code> <code>background: #f5f1e6</code>.</li><li>Laat de gewone lijn en de gouden meten en vergelijk beide padding.</li></ul><p class=\"must-note\">Meetpunten zijn_selector_-sleutels: <code>.lijst li</code> en <code>.lijst li.goud</code> staan allebei in je stijlvak, dus allebei zijn ze meetbaar.</p>",
     "velden": [
      {
       "id": "vermoed",
       "label": "vermoed — wat gaat de meting zeggen?"
      },
      {
       "id": "css",
       "label": "css — het enige vlak waarin je hier typt"
      }
     ],
     "checks": [
      "niet:!important::!important is geen herstel: het maakt elke volgende regel machteloos.",
      "niet:\\bvar\\s+::Gebruik const in het meetvak: wie var tikt, zoekt straks dode muis.",
      "css:\\.lijst\\s+li::De regel die alles raakt, schrijf je eerst.",
      "stijl:.lijst li|padding|0.4rem::De basisregel landt op de eerste lijn: 0.4rem.",
      "vw:1|.lijst li::Eén eigenschap: de padding van de gewone lijn.",
      "cssRegels:3::Drie blokken: basis, uitzondering en de gouden lijn zelf.",
      "css::not\\(\\.goud\\)::En minstens één blok met :not(.goud) — dat is de les, niet de omweg.",
      "geenFout::Lees eerst de melding: zolang je CSS of code struikelt, meet het vak niets."
     ],
     "verwacht": {},
     "opzet": {
      "html": "<ul class=\"lijst\"><li>a</li><li class=\"goud\">b</li><li>c</li></ul>"
     }
    },
    {
     "soort": "Oefening",
     "titel": "Eén blok voor drie wijzers",
     "soortOef": "css",
     "brief": "<ul><li><code>h2</code>, <code>h3</code> en <code>.prijs</code> moeten samen <code>letter-spacing: 0.02em</code> krijgen.</li><li>Schrijf dat in <b>één</b> blok met <code>:is(h2, h3, .prijs)</code> binnen <code>.kaart</code>.</li><li>Meet de prijs: de meting moet <code>0.02em</code> tonen, de <code>p</code> niet.</li></ul>",
     "velden": [
      {
       "id": "css",
       "label": "css — het enige vlak waarin je hier typt"
      },
      {
       "id": "vermoed",
       "label": "vermoed — wat gaat de meting zeggen?"
      }
     ],
     "checks": [
      "niet:!important::!important is geen herstel: het maakt elke volgende regel machteloos.",
      "niet:\\bvar\\s+::Typ je CSS uitgeschreven; `var` is een variabele en die ken ik hier niet.",
      "css:\\.kaart\\s+:is\\(h2,\\s+h3,\\s+\\.prijs\\)::Deze wijzer staat er in de opdracht: .kaart :is(h2, h3, .prijs).",
      "geenFout::Lees eerst de melding: zolang je CSS struikelt, meet het vak niets.",
      "stijl:.kaart :is(h2, h3, .prijs)|letter-spacing|0.02em::De motor meet letter-spacing: 0.02em.",
      "vw:1|.kaart :is(h2, h3, .prijs)::Vermoed eerst deze 1 eigenschap(pen).",
      "cssRegels:1::Schrijf het in 1 blok(ken)."
     ],
     "verwacht": {},
     "opzet": {
      "html": "<section class=\"kaart\"><h2>Festival</h2><h3>Zaterdag</h3><p class=\"prijs\">18</p><p>Tekst</p></section>"
     }
    }
   ],
   "vragen": [
    {
     "kind": "mc",
     "vraag": "Wat raakt <code>a.uit</code>?",
     "opties": [
      "elk element met klasse <code>uit</code> in een link",
      "links die zelf de klasse <code>uit</code> dragen",
      "alleen de eerste link op de pagina",
      "elke link behalve die met klasse <code>uit</code>"
     ],
     "goed": 1,
     "uitleg": "Zonder spatie moeten beide op hetzelfde element staan: het element is een <code>a</code> én het draagt <code>.uit</code>.",
     "check": "mv:0|1::Twee wijzers, één element: a.uit is een link met die klasse."
    },
    {
     "kind": "mc",
     "vraag": "Welke wijzer kiest links naar een andere website?",
     "opties": [
      "<code>a[target]</code>",
      "<code>a[target=\"_blank\"]</code>",
      "<code>a[target^=\"http\"]</code>",
      "<code>.extern</code>"
     ],
     "goed": 1,
     "uitleg": "<code>target=\"_blank\"</code> is de afspraak voor extern. <code>[target]</code> raakt ook links naar een iframe, <code>.extern</code> is een klasse die iemand moet zetten, en <code>^=\"http\"</code> mist <code>mailto:</code> niet maar kapt wél interne http-links af.",
     "check": "mv:1|1::Attracteur op de exacte waarde: target=\"_blank\"."
    },
    {
     "kind": "open",
     "vraag": "Waarom is <code>.kaart .uit</code> méér dan <code>.kaart a.uit</code>?",
     "keywords": [
      "spatie",
      "element",
      "zelf",
      "afstammeling",
      "alle"
     ],
     "minKeywords": 3,
     "terug": "Met spatie zoek je een afstammeling: élk element met .uit in de kaart, link of niet. Samengesteld (<code>a.uit</code>) moet het zélf een link zijn.",
     "check": "op:2::Spatie = afstammeling, samenstelling = hetzelfde element."
    },
    {
     "kind": "open",
     "vraag": "Wanneer is <code>:not()</code> de eerlijke keuze en wanneer een omweg?",
     "keywords": [
      "alle",
      "behalve",
      "uitzondering",
      "klassen",
      "lijst"
     ],
     "minKeywords": 3,
     "terug": "Eerlijk als je werkelijk 'alles behalve' bedoelt. Een omweg wordt het als je oneindig veel uitzonderingen ophoopt in plaats van één klasse te zetten.",
     "check": "op:3:::not is voor 'alles behalve', niet voor tien uitzonderingen."
    }
   ]
  },
  {
   "id": "doos",
   "num": "04",
   "titel": "De doos en wat erbij komt",
   "dots": "Content, padding, border en margin: de doos, gestoeld en nagemeten.",
   "theorie": "<p><b>Elk element is een doos.</b> Van binnen naar buiten: de inhoud, de <code>padding</code>, de <code>border</code> en de <code>margin</code>. De eerste drie raken mekaar, de marge is lucht ertussen: die heeft geen kleur en geen rand.</p><p><b>De rekensom.</b> <code>width: 300px</code> plus <code>padding: 1rem</code> plus <code>border: 3px</code> is breder dan 300. <code>box-sizing: border-box</code> maakt van die som één belofte: <b>300 is 300</b>, padding en border snijden in de breedte. Daarom begint bijna elk stijlvak met <code>*, *::before, *::after { box-sizing: border-box }</code>.</p><p><b>Marge centreert alleen met een bekende breedte.</b> <code>margin: 0 auto</code> verdeelt wat <b>over</b> is. Heeft de doos geen breedte, dan vult hij alles en valt er niets te verdelen — dan is auto twee keer nul.</p><p><b>Bewaar de adem voor de tekst.</b> <code>max-width: 65ch</code> is langer dan mooi is om te lezen, maar <code>ch</code> meet naar de breedte van een <code>0</code> in jouw lettertype: een kolom die meeschaalt met de tekstgrootte in plaats van met het scherm.</p><figure class=\"boxmodel-fig\" id=\"box-model\"><svg viewBox=\"0 0 700 456\" role=\"img\" aria-label=\"Het box model: content, padding, border en margin, van binnen naar buiten\" xmlns=\"http://www.w3.org/2000/svg\" preserveAspectRatio=\"xMidYMid meet\"><text class=\"bk-titel\" x=\"20\" y=\"26\">DE DOOS, VAN BINNEN NAAR BUITEN</text><rect x=\"20\" y=\"44\" width=\"660\" height=\"312\" fill=\"#fff8e6\" stroke=\"#ffb300\" stroke-width=\"2\" stroke-dasharray=\"7 5\"/><text class=\"bk-kop\" x=\"40\" y=\"72\" fill=\"#8a6100\">margin</text><text class=\"bk-leg\" x=\"40\" y=\"90\">lucht tussen dozen — geen kleur, geen rand, geen klikbaar</text><rect x=\"86\" y=\"112\" width=\"528\" height=\"176\" fill=\"#ff3b00\"/><text class=\"bk-kop\" x=\"100\" y=\"138\" fill=\"#fff\">border</text><text class=\"bk-leg\" x=\"100\" y=\"156\" fill=\"#fff\">3px solid #0a0a0a — rand telt mee voor wat je zélf ziet</text><rect x=\"140\" y=\"162\" width=\"420\" height=\"76\" fill=\"#0047ff\" opacity=\"0.16\"/><text class=\"bk-kop\" x=\"154\" y=\"186\" fill=\"#002a99\">padding</text><text class=\"bk-leg\" x=\"154\" y=\"204\" fill=\"#002a99\">vulling — krijgt de achtergrondkleur van de doos</text><rect x=\"190\" y=\"180\" width=\"320\" height=\"40\" fill=\"#f5f1e6\" stroke=\"#0a0a0a\" stroke-width=\"2\"/><text class=\"bk-kop\" x=\"202\" y=\"205\">content · <tspan class=\"bk-waarde\">width: 300px</tspan></text><path d=\"M20 344 v14 M86 344 v14\" stroke=\"#0a0a0a\" stroke-width=\"2\"/><path d=\"M20 351 H86\" stroke=\"#0a0a0a\" stroke-width=\"2\"/><text class=\"bk-waarde\" x=\"100\" y=\"356\">margin-left: 2rem</text><path d=\"M614 344 v14 M680 344 v14\" stroke=\"#0a0a0a\" stroke-width=\"2\"/><path d=\"M614 351 H680\" stroke=\"#0a0a0a\" stroke-width=\"2\"/><text class=\"bk-waarde\" x=\"452\" y=\"378\">300 + 2·16 + 2·3 = 338px — dát is de doos</text><g transform=\"translate(20,408)\"><rect width=\"16\" height=\"16\" y=\"-12\" fill=\"#fff8e6\" stroke=\"#ffb300\" stroke-width=\"2\" stroke-dasharray=\"5 3\"/><text class=\"bk-leg\" x=\"24\" y=\"0\">margin</text><rect x=\"110\" width=\"16\" height=\"16\" y=\"-12\" fill=\"#ff3b00\"/><text class=\"bk-leg\" x=\"134\" y=\"0\">border</text><rect x=\"220\" width=\"16\" height=\"16\" y=\"-12\" fill=\"#0047ff\" opacity=\"0.3\"/><text class=\"bk-leg\" x=\"244\" y=\"0\">padding</text><rect x=\"334\" width=\"16\" height=\"16\" y=\"-12\" fill=\"#f5f1e6\" stroke=\"#0a0a0a\" stroke-width=\"2\"/><text class=\"bk-leg\" x=\"358\" y=\"0\">content</text><text class=\"bk-leg\" x=\"452\" y=\"0\">box-sizing: content-box</text><text class=\"bk-waarde\" x=\"618\" y=\"0\">← de som hierboven</text></g></svg><figcaption>De vulling en de rand komen bij de <code>width</code> <em>bovenop</em>: 338px, niet 300. <code>box-sizing: border-box</code> snijdt ze erin en is dus de belofte «300 is 300» — daarom begint bijna elk stijlvak ermee.</figcaption></figure>",
   "voorbeeld": {
    "kop": "Waar de 300 naartoe ging",
    "code": ".kaart {\n  width: 300px;\n  padding: 1rem;          /* de doos wordt 332px: vulling komt erbij */\n  border: 3px solid #0a0a0a;\n}\n.kaart.beter {\n  box-sizing: border-box;\n  /* nu is 300px het totaal: vulling en rand snijden in de breedte */\n}",
    "uitleg": "Zonder <code>box-sizing</code> is <code>width</code> de breedte van de inhoud; met <code>border-box</code> is het de breedte van de doos. Eén regel, twee getallen die betekenis veranderen. Kijk voor de som nog eens naar de <a href=\"#box-model\">tekening van de doos</a> hierboven: padding en border liggen eromheen, niet erin."
   },
   "oefeningen": [
    {
     "soort": "Oefening",
     "titel": "Vulling en rand",
     "soortOef": "css",
     "brief": "<ul><li>Geef <code>.kaart</code> <code>padding: 1rem</code> en een <code>border: 3px solid #0a0a0a</code>.</li><li>Meet beide en print ze.</li></ul>",
     "velden": [
      {
       "id": "vermoed",
       "label": "vermoed — wat gaat de meting zeggen?"
      },
      {
       "id": "css",
       "label": "css — het enige vlak waarin je hier typt"
      }
     ],
     "checks": [
      "niet:!important::!important is geen herstel: het maakt elke volgende regel machteloos.",
      "niet:\\bvar\\s+::Gebruik const in het meetvak: wie var tikt, zoekt straks dode muis.",
      "css:padding\\s*:\\s*1rem::De vulling is één rem, geen twee.",
      "stijl:.kaart|padding|1rem::De meting ziet de vulling.",
      "stijl:.kaart|border|3px solid #0a0a0a::En de rand, in één keer opgeschreven.",
      "vw:2|.kaart::Twee eigenschappen: padding en border.",
      "geenFout::Lees eerst de melding: zolang je CSS of code struikelt, meet het vak niets."
     ],
     "verwacht": {},
     "opzet": {
      "html": "<section class=\"kaart\">tekst</section>"
     }
    },
    {
     "soort": "Oefening",
     "titel": "De eerlijke som",
     "soortOef": "css",
     "brief": "<ul><li>De kaart is 200px breed en heeft <code>padding: 2rem</code>.</li><li>Zet <code>box-sizing: border-box</code> erbij, zodat 200 ook 200 blijft.</li><li>Laat de doos meten en lees in <em>meten</em> wat er nu staat.</li></ul>",
     "velden": [
      {
       "id": "vermoed",
       "label": "vermoed — wat gaat de meting zeggen?"
      },
      {
       "id": "css",
       "label": "css — het enige vlak waarin je hier typt"
      }
     ],
     "checks": [
      "niet:!important::!important is geen herstel: het maakt elke volgende regel machteloos.",
      "niet:\\bvar\\s+::Gebruik const in het meetvak: wie var tikt, zoekt straks dode muis.",
      "stijl:.kaart|padding|2rem::De opzet-vulling staat er nog: je overwrite is smaller dan je dacht niet.",
      "css:box-sizing\\s*:\\s*border-box::border-box is de belofte dat de breedte het totaal is.",
      "stijl:.kaart|box-sizing|border-box::De meting bevestigt het.",
      "stijl:.kaart|width|200px::En de breedte blijft 200px staan.",
      "cssRegels:1::Eén blok boven de opzet: de opzet hoef je niet over te schrijven.",
      "vw:3|.kaart::Eén eigenschap: box-sizing.",
      "geenFout::Lees eerst de melding: zolang je CSS of code struikelt, meet het vak niets."
     ],
     "verwacht": {},
     "opzet": {
      "html": "<section class=\"kaart\">tekst</section>",
      "css": ".kaart {\n  width: 200px;\n  padding: 2rem;\n}"
     }
    },
    {
     "soort": "Oefening",
     "titel": "Centreren zonder toverwoord",
     "soortOef": "css",
     "brief": "<ul><li>Geef <code>.kaart</code> <code>width: 300px</code> en laat de marge links en rechts zelf verdelen.</li><li>Laat beide marges meten.</li></ul>",
     "velden": [
      {
       "id": "vermoed",
       "label": "vermoed — wat gaat de meting zeggen?"
      },
      {
       "id": "css",
       "label": "css — het enige vlak waarin je hier typt"
      }
     ],
     "checks": [
      "niet:!important::!important is geen herstel: het maakt elke volgende regel machteloos.",
      "niet:\\bvar\\s+::Gebruik const in het meetvak: wie var tikt, zoekt straks dode muis.",
      "css:width\\s*:\\s*300px::Zonder breedte verdeelt auto niets.",
      "css:margin\\s*:\\s*0\\s+auto|margin-left\\s*:\\s*auto::De centrering zit in auto, niet in een mooie waarde.",
      "vw:2|.kaart::Twee eigenschappen: breedte en marge.",
      "stijl:.kaart|margin|0 auto::De meting bewaart de marge zoals jij haar schreef.",
      "geenFout::Lees eerst de melding: zolang je CSS of code struikelt, meet het vak niets."
     ],
     "verwacht": {},
     "opzet": {
      "html": "<section class=\"kaart\">tekst</section>"
     }
    },
    {
     "soort": "Bonus",
     "titel": "Adem en een leesbare lijn",
     "soortOef": "css",
     "brief": "<ul><li>Titel en paragraaf in de kaart: geef ze samen <code>max-width: 65ch</code> in één regel.</li><li>De paragraaf krijgt <code>margin-bottom: 1rem</code> en de <code>.prijs</code> <code>background: #ffb300</code>.</li><li>Meet de paragraaf en print zijn breedtebeperking.</li></ul>",
     "velden": [
      {
       "id": "vermoed",
       "label": "vermoed — wat gaat de meting zeggen?"
      },
      {
       "id": "css",
       "label": "css — het enige vlak waarin je hier typt"
      }
     ],
     "checks": [
      "niet:!important::!important is geen herstel: het maakt elke volgende regel machteloos.",
      "niet:\\bvar\\s+::Gebruik const in het meetvak: wie var tikt, zoekt straks dode muis.",
      "css:h2\\s*,\\s*p\\s*\\{::Eén blok voor twee wijzers: h2, p { ... }",
      "stijl:p|max-width|65ch::De paragraaf blijft leesbaar breed.",
      "stijl:p|margin-bottom|1rem::En hij houdt zijn adem onderaan.",
      "cssRegels:3::Twee blokken: het lijstje en de prijs.",
      "vw:2|p::Twee eigenschappen op de paragraaf.",
      "stijl:.prijs|background|#ffb300::De prijs krijgt een gele rug.",
      "geenFout::Lees eerst de melding: zolang je CSS of code struikelt, meet het vak niets."
     ],
     "opzet": {
      "html": "<section class=\"kaart\"><h2>Titel</h2><p>tekst</p><span class=\"prijs\">18</span></section>"
     }
    }
   ],
   "vragen": [
    {
     "kind": "mc",
     "vraag": "Van binnen naar buiten: welke volgorde klopt?",
     "opties": [
      "inhoud, padding, border, margin",
      "margin, border, padding, inhoud",
      "padding, inhoud, margin, border",
      "inhoud, border, padding, margin"
     ],
     "goed": 0,
     "uitleg": "De inhoud zit hetst binnen, daar omheen de padding, dan de border en als laatste de marge — en juist die marge is lucht tussen dozen, geen kleur.",
     "check": "mv:0|0::De inhoud zit hetst binnen, daar omheen de padding, dan de border en als laatste de marge — en juist die marge is lucht tussen dozen, geen kleur."
    },
    {
     "kind": "mc",
     "vraag": "Een <code>&lt;span&gt;</code> met <code>width: 200px</code> blijft zo breed als zijn tekst. Wat ontbreekt er het minst erg?",
     "opties": [
      "<code>display: inline-block</code>",
      "<code>box-sizing: border-box</code>",
      "<code>float: left</code>",
      "<code>position: relative</code>"
     ],
     "goed": 0,
     "uitleg": "Een inline-doos negeert breedte. <code>inline-block</code> (of <code>block</code>) maakt de breedte eerlijk; box-sizing verandert alleen de som, niet het gedrag.",
     "check": "mv:1|0::Een inline-doos negeert breedte."
    },
    {
     "kind": "mc",
     "vraag": "Waarom centreert <code>margin: 0 auto</code> niet?",
     "opties": [
      "de doos heeft geen breedte en vult dus alles",
      "auto werkt alleen in flex",
      "marges hebben geen links en rechts",
      "het element is een div"
     ],
     "goed": 0,
     "uitleg": "Zonder bekende breedte is er niets over om te verdelen: de auto's zijn 0. Geef <code>width</code> of <code>max-width</code> en de centrering verschijnt.",
     "check": "mv:2|0::Zonder bekende breedte is er niets over om te verdelen: de auto's zijn 0."
    },
    {
     "kind": "open",
     "vraag": "Wat doet <code>box-sizing: border-box</code> met <code>width: 300px</code> en <code>padding: 1rem</code>, en waarom zet men het op <code>*</code>?",
     "keywords": [
      "breedte",
      "totaal",
      "binnen",
      "snijden",
      "belofte",
      "voorspelbaar"
     ],
     "minKeywords": 3,
     "terug": "Met border-box <b>is</b> 300px het totaal: de vulling snijdt in de breedte, er komt niets bij. Op <code>*</code> gezet omdat je dan één belofte hebt voor de hele pagina en niet per element moet raden wat \"300\" betekent.",
     "check": "op:3::Minstens 3 begrippen uit de lijst: dan zie ik dat je het snapt."
    }
   ]
  }
 ]
} };

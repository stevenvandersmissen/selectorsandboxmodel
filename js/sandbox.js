/* ============================================================
   sandbox.js · de uitvoeringslaag van de cursus
   ----------------------------------------------------------
   Eén plek die code uitvoert, in drie smaken:
     • browser            : <iframe sandbox="allow-scripts"> + postMessage
     • Node, synchroon    : voor gewone opdrachten (de testkist)
     • Node, met wachten  : voor opdrachten met modus "omlopen"
   Alle drie delen dezelfde omlijsting, dus wat de testkist groen
   ziet, is groen in de klas.

   API van de zandbak:
     console.log/warn/error   → geteld, wordt "uitvoer"
     geef(waarde)             → wat de checker vergelijkt
     roep(f, "naam")          → volgt één functie
     __ROEP                   → elke aanroep van je eigen functies
     document                 → nagebouwd: getElementById / querySelector
     __DOM                    → de toestand van dat document
     setTimeout / setInterval → eigen klok, loopt alleen met:
     await omlopen(ms)        →   "laat de tijd verstrijken"
   De stijlmotor: cssVerdeel-, stijlblokken worden gelezen, de cascade
   beslist per eigenschap (specificiteit, dan bronvolgorde), inline wint van een
   regel en !important wint van inline. `@media`-blokken worden uitgepakt alsof
   de band opging. Geërfd wordt níét nagedaan: wat je meet, is wat er zélf staat.

   Geblokkeerd: fetch, XMLHttpRequest, WebSocket, EventSource, alert,
   prompt, confirm, localStorage, sessionStorage, indexedDB, document.write.
   Elke lus mag 2 000 000 ronden; daarna zegt de zandbak het. Reageert de
   iframe niet binnen vier seconden, dan wordt het kader afgebroken.
   ============================================================ */
(function () {
  const SANDBOX = (window.SANDBOX = {});
  const Ronden = 2000000;

  const STIJL_BROEK = [
    "  /* ---------- de stijlmotor: cascades, specificity, meten ----------",
    "     Eenvoudig maar waarheidsgetrouw genoeg voor de oefeningen: commentaar",
    "     weg, blokken lezen, declarations in volgorde van specificity en bron.",
    "     `@media`-blokken worden uitgepakt (de band is al \"de regel die wint\"). */",
    "  function __topStukken(s, knip) {",
    "    const out = [];",
    "    let bak = \"\", diep = 0;",
    "    for (let k = 0; k < s.length; k++) {",
    "      const c = s[k];",
    "      if (c === \"(\") diep += 1;",
    "      if (c === \")\") diep = Math.max(0, diep - 1);",
    "      if (!diep && knip.indexOf(c) !== -1) { out.push(bak); bak = \"\"; continue; }",
    "      bak += c;",
    "    }",
    "    out.push(bak);",
    "    return out;",
    "  }",
    "  function __verdeelSel(reeks) {",
    "    return __topStukken(String(reeks == null ? \"\" : reeks), \",\")",
    "      .map((x) => x.replace(/\\s+/g, \" \").trim()).filter(Boolean);",
    "  }",
    "  function __verdeelReeks(reeks) {",
    "    const s = String(reeks == null ? \"\" : reeks);",
    "    const delen = [];",
    "    let bak = \"\", diep = 0;",
    "    const duw = () => {",
    "      const t = bak.trim();",
    "      bak = \"\";",
    "      if (!t) return;",
    "      /* modifiers aan de staart van een wijzer ([:hover], [target=\"x\"],",
    "         :focus, .a:not(.b)) zijn voor de match-regel apart: hier is de",
    "         knoop-zoeker aan het werk. :is() en :where() blijven staan, want",
    "         die bevatten komma-lijsten die niet mogen versnipperen */",
    "      const kaal = t.replace(/((?:^|(?<=[\\w)]))[\\s]*\\[[^\\]]*\\])|((?:^|(?<=[\\w)]))::?(?!is\\(|where\\()[\\w-]+(\\([^()]*\\))?)+\\s*$/g, \"\").trim();",
    "      delen.push(kaal || t);",
    "    };",
    "    for (let k = 0; k < s.length; k++) {",
    "      const c = s[k];",
    "      if (c === \"(\") diep += 1;",
    "      if (c === \")\") diep = Math.max(0, diep - 1);",
    "      if (!diep && (c === \">\" || c === \"+\" || c === \"~\" || c === \",\")) { duw(); if (c !== \",\") delen.push(c); continue; }",
    "      if (!diep && (c === \" \" || c === \"\\n\" || c === \"\\t\")) { duw(); continue; }",
    "      bak += c;",
    "    }",
    "    duw();",
    "    return delen;",
    "  }",
    "  function __strippen(s) {",
    "    const i = s.indexOf(\"{\");",
    "    if (i === -1) return \"\";",
    "    const j = s.lastIndexOf(\"}\");",
    "    return j > i ? s.slice(i + 1, j) : s.slice(i + 1);",
    "  }",
    "  function __declaraties(reeks) {",
    "    const out = [];",
    "    String(reeks == null ? \"\" : reeks).split(\";\").forEach((deel) => {",
    "      const d = deel.trim();",
    "      if (!d) return;",
    "      const k = d.indexOf(\":\");",
    "      if (k < 1) return;",
    "      out.push({ eig: d.slice(0, k).trim().toLowerCase(), waarde: d.slice(k + 1).trim() });",
    "    });",
    "    return out;",
    "  }",
    "  function __gewicht(sel) {",
    "    let id = 0, klas = 0, knoop = 0;",
    "    let s = String(sel);",
    "    id = (s.match(/#[\\w-]+/g) || []).length;",
    "    s = s.replace(/#[\\w-]+/g, \" \");",
    "    klas = (s.match(/\\.[\\w-]+/g) || []).length + (s.match(/\\[[^\\]]*\\]/g) || []).length + (s.match(/:(?!:)[\\w-]+/g) || []).length;",
    "    s = s.replace(/\\.[\\w-]+/g, \" \").replace(/\\[[^\\]]*\\]/g, \" \").replace(/::?[\\w-]+/g, \" \");",
    "    knoop = s.split(/\\s+/).filter((x) => x && x !== \"*\" && x !== \">\").length;",
    "    return id * 1000 + klas * 10 + knoop;",
    "  }",
    "  function __eigenWijzer(knoop, deel) {",
    "    const s = String(deel == null ? \"\" : deel).trim().replace(/,+$/, \"\");",
    "    if (!s) return false;",
    "    if (s === \"*\") return true;",
    "    /* een staat of een nadijsel is geen knooppunt om op te matchen: wie",
    "       a:hover schrijft, krijgt het element \u2014 de staat is voor de voorschou */",
    "    const kaal = s.replace(/::?(?!not\\(|is\\(|where\\()[\\w-]+(\\([^()]*\\))?/g, \"\");",
    "    if (kaal.trim() && kaal.trim() !== s) return __eigenWijzer(knoop, kaal.trim());",
    "    const fn = s.match(/^:(?:is|where)\\((.*)\\)$/i);",
    "    if (fn) {",
    "      return fn[1].split(\",\").some((p) => __eigenWijzer(knoop, p));",
    "    }",
    "    const nn = s.match(/^:not\\((.*)\\)$/i);",
    "    if (nn) {",
    "      return !nn[1].split(\",\").some((p) => __eigenWijzer(knoop, p));",
    "    }",
    "    const m = s.match(/^(?:(\\w[\\w-]*))?(#[\\w-]+)?((?:\\.[\\w-]+)*)$/);",
    "    if (!m) return false;",
    "    if (m[1] && m[1].toLowerCase() !== String(knoop.tag || \"\").toLowerCase()) return false;",
    "    if (m[2] && \"#\" + String(knoop.id || \"\") !== m[2]) return false;",
    "    const gezocht = m[3] ? m[3].slice(1).split(\".\") : [];",
    "    const eigen = String(knoop.klassen || \"\").split(/\\s+/).filter(Boolean);",
    "    return gezocht.every((c) => eigen.indexOf(c) !== -1);",
    "  }",
    "  function __past(knoop, deel) {",
    "    return __eigenWijzer(knoop, deel);",
    "  }",
    "  function __stroken(css) {",
    "    const bron = String(css == null ? \"\" : css).replace(/\\/\\*[\\s\\S]*?\\*\\//g, \" \");",
    "    /* wie een accolade vergeet, krijgt een melding in plaats van een stijlvak",
    "       dat stilletjes verdroogt: eerst het evenwicht, dan pas de blokken */",
    "    const open = (bron.match(/[{]/g) || []).length, toe = (bron.match(/[}]/g) || []).length;",
    "    if (open !== toe) throw new Error('CSS: elk blok sluiten met } (te veel open accolades)');",
    "    /* declaraties vóór de eerste selector: de klassieke vergeten selector */",
    "    /* een losse declaratie vóór de eerste accolade = een vergeten selector,",
    "       de parameters van @media (...) zijn geen declaratie: die strook ik weg */",
    "    const la = bron.indexOf(\"{\");",
    "    const kop = la === -1 ? bron : bron.slice(0, la);",
    "    /* een losse declaratie v\u00f3\u00f3r de eerste accolade = een vergeten selector. De",
    "       bewaking mag zelf geen vals alarm worden: [href^=\"mailto:x\"] en @media",
    "       (min-width: 600px) bevatten ook dubbele punten, en :hover is geen",
    "       declaratie. Daarom: vierkante haken weg, en enkel een \"woord:\" aan het",
    "       begin van een regel telt als declaratie-zonder-selector */",
    "    const kaal = kop.replace(/\\[[^\\]]*\\]/g, \"\");",
    "    if (la === -1 && /(^|[\\n;{])\\s*[-a-zA-Z][-a-zA-Z0-9]*\\s*:/.test(kaal) && !/^\\s*@/.test(kaal.trim()))",
    "      throw new Error('CSS: die regel heeft geen selector');",
    "    /* een blok moet gesloten zijn vóór het volgende opent; in @media mogen",
    "       meerdere regels in één blok staan, dus daar laat ik de naad-bewaking los */",
    "    if (!/@(media|supports|layer|keyframes)/.test(bron)) {",
    "      const naden = bron.split(/[}](?=[^{}]*[{])/);",
    "      for (let q = 0; q < naden.length - 1; q += 1) {",
    "        if ((naden[q].match(/[{]/g) || []).length > 1) throw new Error('CSS: een blok per regel, gesloten voor het volgende opent');",
    "      }",
    "    }",
    "    const tekst = /@media[^{]*\\{/.test(bron)",
    "      ? bron.replace(/@media[^{]*\\{/g, \"@media{\").replace(/@media\\{([\\s\\S]*?)\\}\\s*(?=@media\\{|$)/g, \"$1\")",
    "      : bron;",
    "    const uit = [];",
    "    tekst.split(\"}\").forEach((stuk) => {",
    "      if (stuk.indexOf(\"{\") === -1) return;",
    "      const stroken = __declaraties(__strippen(stuk));",
    "      if (!stroken.length) return;",
    "      const selectors = __verdeelSel(/^[^{]*\\{/.test(stuk) ? stuk.slice(0, stuk.indexOf(\"{\")) : \"\")",
    "        .filter((s) => !/^@/.test(s));",
    "      selectors.forEach((sel) => {",
    "        const zelf = uit.filter((b) => b.sel === sel)[0];",
    "        if (zelf) { stroken.forEach((d) => { const oude = zelf.stroken.filter((x) => x.eig === d.eig)[0]; if (oude) { oude.waarde = d.waarde; } else zelf.stroken.push(d); }); return; }",
    "        uit.push({ sel: sel, stroken: stroken.map((d) => ({ eig: d.eig, waarde: d.waarde })), gewicht: __gewicht(sel), rauw: sel });",
    "      });",
    "    });",
    "    return uit;",
    "  }",
    "  function __kettingPast(knoop, delen, i, rauw) {",
    "    if (!knoop) return false;",
    "    /* de ketting wordt op kale wijzers gezocht; de rauwe versie bepaalt of",
    "       modifiers (:not, [attr], .een.andere) ook echt op deze knoop staan */",
    "    const echt = (rauw || [])[i];",
    "    if (!(echt ? __past(knoop, echt) : __past(knoop, delen[i]))) return false;",
    "    if (i === 0) return true;",
    "    /* de ketting wordt van rechts gelezen: het teken v\u00f3\u00f3r deel i bepaalt",
    "       waar deel i-1 gezocht wordt. > ouder, + de directe broer links, ~ eender",
    "       welke broer links, een spatie elke voorouder. */",
    "    if (delen[i - 1] === \">\") return __kettingPast(knoop.__ouder, delen, i - 2, rauw);",
    "    if (delen[i - 1] === \"+\") return !!knoop.__vorige && __kettingPast(knoop.__vorige, delen, i - 2, rauw);",
    "    if (delen[i - 1] === \"~\") {",
    "      let n = knoop.__vorige;",
    "      while (n) { if (__kettingPast(n, delen, i - 2, rauw)) return true; n = n.__vorige; }",
    "      return false;",
    "    }",
    "    let j = i - 1;",
    "    if (!delen[j]) return false;",
    "    let ouder = knoop.__ouder;",
    "    while (ouder) { if (__kettingPast(ouder, delen, j)) return true; ouder = ouder.__ouder; }",
    "    return false;",
    "  }",
    "  function __pastKetting(knoop, ketting, rauw) {",
    "    const d = Array.isArray(ketting) ? ketting : __verdeelReeks(ketting);",
    "    if (!d.length || !knoop) return false;",
    "    return __kettingPast(knoop, d, d.length - 1, rauw);",
    "  }",
    "  function __stijlPas(boom, css, klaar) {",
    "    const knopen = [];",
    "    function loop(node, ouder) {",
    "      node.__orde = knopen.length;",
    "      node.__ouder = ouder;",
    "      knopen.push(node);",
    "      (node.__kinderen || []).forEach((k) => loop(k, node));",
    "    }",
    "    (boom || []).forEach((n) => loop(n, null));",
    "    /* broers en zussen op een rij: nodig voor + en ~ */",
    "    (function koppel(list) {",
    "      (list || []).forEach((n, j) => {",
    "        n.__volgende = (list || [])[j + 1] || null;",
    "        n.__vorige = j > 0 ? list[j - 1] : null;",
    "        koppel(n.__kinderen);",
    "      });",
    "    })(boom);",
    "    knopen.forEach((n) => { n.__stijl = {}; n.__winnaar = {}; });",
    "    const stroken = __stroken(css);",
    "    klaar = klaar || stroken.map((b) => __verdeelReeks(b.sel));",
    "    const matches = stroken.map((b, i) => {",
    "      const rauw = __topStukken(String(b.rauw || b.sel || \"\"), \" >+~,\").map((x) => x.trim());",
    "      return knopen.map((n) => __pastKetting(n, klaar[i], rauw));",
    "    });",
    "    stroken.forEach((b, orde) => {",
    "      const raak = matches[orde];",
    "      knopen.forEach((n, j) => {",
    "        if (!raak[j]) return;",
    "        b.stroken.forEach((d) => {",
    "          let zwaart = b.gewicht;",
    "          let waarde = d.waarde;",
    "          if (/\\s*!\\s*important\\s*$/i.test(waarde)) { waarde = waarde.replace(/\\s*!\\s*important\\s*$/i, \"\"); zwaart += 1e6; }",
    "          const vorige = n.__winnaar[d.eig];",
    "          if (vorige && (vorige.zwaart > zwaart || (vorige.zwaart === zwaart && vorige.orde >= orde))) return;",
    "          n.__winnaar[d.eig] = { zwaart: zwaart, orde: orde };",
    "          n.__stijl[d.eig] = waarde;",
    "        });",
    "      });",
    "    });",
    "    /* inline style: wint van elke regel in het blok, behalve van !important */",
    "    knopen.forEach((n) => {",
    "      __declaraties(n.style || \"\").forEach((d) => {",
    "        const vorige = n.__winnaar[d.eig];",
    "        if (vorige && vorige.zwaart >= 1e6) return;",
    "        n.__stijl[d.eig] = d.waarde;",
    "      });",
    "    });",
    "    /* Rapport per selector, ná de cascade. Een strook is ook bereikbaar via",
    "       zijn deel-selector (.prijs neben .kaart .prijs): dezelfde kaart, dus",
    "       dezelfde waarheid — de student tikt in het meetvak vaak de korte vorm. */",
    "    const sloten = [];",
    "    stroken.forEach((b, i) => {",
    "      const sleutel = String(b.sel).replace(/\\s+/g, \" \").trim();",
    "      if (!sleutel) return;",
    "      const delen = [sleutel];",
    "      __topStukken(sleutel, \",\").forEach((reeks) => {",
    "        const stuk = reeks.trim();",
    "        if (!stuk) return;",
    "        const kaalt = stuk.replace(/\\[[^\\]]*\\]/g, \"\").replace(/::?[\\w-]+(\\([^()]*\\))?/g, \"\");",
    "        const laatste = (__topStukken(kaalt, \" >+~\").filter(Boolean).pop() || \"\").split(\":\")[0];",
    "        if (laatste) delen.push(laatste);",
    
    
    "      });",
    "      const kaart = [];",
    "      knopen.forEach((n, j) => {",
    "        if (!matches[i][j]) return;",
    "        kaart.push(Object.assign({}, n.__stijl));",
    "      });",
    "      if (!kaart.length) return;",
    "      [...new Set(delen)].forEach((d) => {",
    "        if (!__stijlUit[d]) __stijlUit[d] = kaart;",
    "      });",
    "      sloten.push({ sleutel: sleutel, kaart: kaart, strook: i });",
    "    });",
    "    /* twee stroken met dezelfde selector: één lijst kaarten, laatst wint per eigenschap */",
    "    for (let a = 0; a < sloten.length; a += 1) {",
    "      for (let b = a + 1; b < sloten.length; b += 1) {",
    "        if (sloten[a].sleutel !== sloten[b].sleutel) continue;",
    "        sloten[a].kaart.forEach((k, j) => Object.assign(k, sloten[b].kaart[j] || {}));",
    "      }",
    "    }",
    "    return knopen;",
    "  }",
    "  function __stijlEcht(sel, boom) {",
    "    const s = String(sel == null ? \"\" : sel).replace(/\\s+/g, \" \").trim();",
    "    if (!s) return {};",
    "    const knopen = __stijlPas(boom || (typeof __boom === \"undefined\" ? [] : __boom), __CSS);",
    "    const ketting = __verdeelReeks(s);",
    "    const ergens = knopen.filter((n) => __pastKetting(n, ketting))[0];",
    "    const stijl = Object.assign({}, (ergens || {}).__stijl);",
    "    /* in JS heet font-weight soms fontWeight: beide schrijfwijzen lezen hier */",
    "    Object.keys(stijl).forEach((e) => {",
    "      const kameleon = e.replace(/-([a-z])/g, (m, c) => c.toUpperCase());",
    "      if (kameleon !== e && stijl[kameleon] === undefined) stijl[kameleon] = stijl[e];",
    "    });",
    "    return stijl;",
    "  }",
    "  function __stijl(sel) { return __stijlVan(sel, __boom); }",
  ].join("\n");

  const VOOR = [
    "const __log = [];",
    "let __geeft = null, __heeftGegeven = false;",
    "const __ROEP = [];",
    "const __Rondes = { n: 0 };",
    "const __toegepast = new WeakSet();",
    "function __ronden() { if (++__Rondes.n > " + Ronden + ") throw new Error('Te veel ronden: die lus komt nooit meer terecht.'); }",
    "function __toon(x) {",
    "  try {",
    "    if (typeof x === 'string') return x;",
    "    if (x === undefined) return 'undefined';",
    "    if (x === null) return 'null';",
    "    if (typeof x === 'number' || typeof x === 'boolean') return String(x);",
    "    if (typeof x === 'function') return 'function ' + (x.name || 'anoniem') + '()';",
    "    return JSON.stringify(x);",
    "  } catch (e) { return String(x); }",
    "}",
    "function __knoop(sel) {",
    "  const n = { selecteer: sel, textContent: '', innerHTML: '', value: '', classes: [], atributen: {}, stijlen: {},",
    "    setAttribute(k, w) { this.atributen[k] = String(w); },",
    "    getAttribute(k) { return this.atributen[k] === undefined ? null : this.atributen[k]; },",
    "    appendChild(k) { this.kind = k; return k; } };",
    "  n.classList = {",
    "    add: (c) => { if (n.classes.indexOf(c) === -1) n.classes.push(c); },",
    "    remove: (c) => { const i = n.classes.indexOf(c); if (i !== -1) n.classes.splice(i, 1); },",
    "    contains: (c) => n.classes.indexOf(c) !== -1,",
    "    toggle: (c) => { const i = n.classes.indexOf(c); if (i === -1) n.classes.push(c); else n.classes.splice(i, 1); },",
    "  };",
    "  return n;",
    "}",
    "const __DOM = new Proxy({}, {",
    "  get(d, k) { if (typeof k !== 'string') return undefined; if (!d[k]) d[k] = __knoop(k); return d[k]; },",
    "  set(d, k, v) { d[k] = v; return true; },",
    "});",
    "let __boom = [];",
    "const __stijlUit = {};",
    "function eigenschappen(sel) { const s = __stijlVan(sel, __boom); return Object.keys(s).map((k) => k + ': ' + s[k]); }",
    "function gemeten() { return __vlak.slice(); }",
    "let __CSS = '';",
    "let __stijlVan = function () { return {}; };",
    "let __vlak = [];",
    STIJL_BROEK,
    "__stijlVan = __stijlEcht;",
    "const __doc = {",
    "  getElementById: (id) => __DOM['#' + id],",
    "  querySelector: (s) => __DOM[s],",
    "  querySelectorAll: (s) => [__DOM[s]],",
    "  write: () => { throw new Error('document.write is geblokkeerd in deze zandbak.'); },",
    "  body: __DOM['body'],",
    "};",
    "function __dek(f, naam) {",
    "  if (typeof f !== 'function' || f.__gecheckt || __toegepast.has(f)) return f;",
    "  const d = function () { __ronden(); __ROEP.push({ naam: naam, aantal: arguments.length, args: Array.prototype.slice.call(arguments) }); return f.apply(this, arguments); };",
    "  d.__gecheckt = true;",
    "  try { __toegepast.add(f); } catch (e) {}",
    "  try { Object.defineProperty(d, 'name', { value: naam }); } catch (e) {}",
    "  return d;",
    "}",
    "const geef = (w) => { __geeft = w; __heeftGegeven = true; };",
    "const roep = (f, naam) => __dek(f, naam || (f && f.name) || 'anoniem');",
    "const __verbod = (naam) => new Proxy(function () { throw new Error(naam + ' is geblokkeerd in deze zandbak: hier alleen de taal, geen netten en geen vensters.'); }, {",
    "  get: function (t, k) { if (k === 'toString' || k === 'valueOf' || k === 'constructor' || k === 'then') return undefined; throw new Error(naam + ' is geblokkeerd in deze zandbak.'); },",
    "  set: function () { throw new Error(naam + ' is geblokkeerd in deze zandbak.'); },",
    "  apply: function () { throw new Error(naam + ' is geblokkeerd in deze zandbak.'); }, });",
    "const console = {",
    "  log: (...a) => { __ronden(); __log.push({ soort: 'log', tekst: a.map(__toon).join(' ') }); },",
    "  info: (...a) => __log.push({ soort: 'log', tekst: a.map(__toon).join(' ') }),",
    "  warn: (...a) => __log.push({ soort: 'warn', tekst: a.map(__toon).join(' ') }),",
    "  error: (...a) => __log.push({ soort: 'fout', tekst: a.map(__toon).join(' ') }),",
    "  table: (...a) => __log.push({ soort: 'log', tekst: a.map(__toon).join(' ') }),",
    "};",
    "const fetch = __verbod('fetch'), XMLHttpRequest = __verbod('XMLHttpRequest'), WebSocket = __verbod('WebSocket'), EventSource = __verbod('EventSource');",
    "const alert = __verbod('alert'), prompt = __verbod('prompt'), confirm = __verbod('confirm');",
    "const localStorage = __verbod('localStorage'), sessionStorage = __verbod('sessionStorage'), indexedDB = __verbod('indexedDB');",
    "const document = __doc;",
    "function __stuur(o) {",
    "  if (typeof __UIT !== 'undefined' && __UIT) {",
    "    if (__UIT.__bij) __UIT.__bij(o);",
    "    else Object.assign(__UIT, { log: o.log, geeft: o.geeft, heeft: o.heeft, roep: o.roep, dom: o.dom, stijl: o.stijl, selectors: o.selectors,",
    "      /* een gemelde stijlfout mag niet door het slotrapport worden uitgeWist */",
    "      fout: o.fout || __UIT.fout || null });",
    "    return;",
    "  }",
    "  try { parent.postMessage(Object.assign({ __kuur: 1 }, o), '*'); } catch (e) {}",
    "}",
    "function __rapport(stijlfout) { __stuur({ fout: stijlfout || null, log: __log, geeft: __geeft, heeft: __heeftGegeven, roep: __ROEP, dom: __DOM, selectors: __vlak, stijl: __stijlUit }); }",
    "function __val(err) { __stuur({ fout: 'Asynchrone afhandeling: ' + (err && err.message ? err.message : err), log: __log, geeft: __geeft, heeft: __heeftGegeven, roep: __ROEP, dom: __DOM }); }",
  ].join("\n");

  /* De eigen klok: alleen in modus "omlopen". Belletjes lopen af zodra de
     leerling `await omlopen(ms)` schrijft, in volgorde van hun tijd. */
  const KLOK = [
    "const __tijd = { nu: 0 };",
    "const __bellingen = [];",
    "let __bellNr = 0;",
    "function setTimeout(fn, ms, ...arg) { const nr = ++__bellNr; __bellingen.push({ nr: nr, om: __tijd.nu + Math.max(0, Number(ms) || 0), fn: fn, arg: arg }); return nr; }",
    "function clearTimeout(nr) { const i = __bellingen.findIndex((b) => b.nr === nr); if (i !== -1) __bellingen.splice(i, 1); }",
    "function setInterval(fn, ms, ...arg) { const nr = ++__bellNr; __bellingen.push({ nr: nr, om: __tijd.nu + Math.max(1, Number(ms) || 1), fn: fn, arg: arg, per: Math.max(1, Number(ms) || 1) }); return nr; }",
    "function clearInterval(nr) { clearTimeout(nr); }",
    "class __Bell {",
    "  constructor(fn) { this.__w = null; this.__v = undefined; this.__k = null; const ok = (w) => { if (this.__w) return; this.__w = 'goed'; this.__v = w; this.__door(); }; const nee = (e) => { if (this.__w) return; this.__w = 'fout'; this.__k = e; this.__door(); }; this.__ok = ok; this.__nee = nee; if (fn) { try { fn(ok, nee); } catch (e) { nee(e); } } }",
    "  __door() { const doorgaan = this.__w === 'goed' ? this.__a : this.__b; if (!doorgaan) return; this.__a = null; this.__b = null; try { doorgaan(this.__w === 'goed' ? this.__v : this.__k); } catch (e) { console.error(e && e.message ? e.message : e); } }",
    "  then(goed, fout) { const volgende = new __Bell(); this.__a = (w) => { try { const r = goed ? goed(w) : w; if (r && typeof r.then === 'function') { r.then((z) => volgende.__ok(z), (e) => volgende.__nee(e)); } else volgende.__ok(r); } catch (e) { volgende.__nee(e); } };",
    "    this.__b = (e) => { if (fout) { try { volgende.__ok(fout(e)); } catch (err) { volgende.__nee(err); } } else volgende.__nee(e); };",
    "    if (this.__w) this.__door();",
    "    return volgende;",
    "  }",
    "  catch(fout) { return this.then(undefined, fout); }",
    "  finally(op) { return this.then((w) => { op(); return w; }, (e) => { op(); throw e; }); }",
    "  static resolve(w) { const b = new __Bell(); b.__ok(w); return b; }",
    "  static reject(e) { const b = new __Bell(); b.__nee(e); return b; }",
    "}",
    "const Promise = __Bell;",
    "function __omlopen(ms) {",
    "  const tot = __tijd.nu + Math.max(0, Number(ms) || 0);",
    "  for (let veil = 0; veil < 2000; veil++) {",
    "    __bellingen.sort((a, b) => a.om - b.om);",
    "    const e = __bellingen[0];",
    "    if (!e || e.om > tot) break;",
    "    __tijd.nu = e.om;",
    "    if (e.per) { e.om = __tijd.nu + e.per; } else { __bellingen.shift(); }",
    "    try { e.fn.apply(null, e.arg); } catch (err) { __log.push({ soort: 'fout', tekst: String(err && err.message ? err.message : err) }); }",
    "  }",
    "  __tijd.nu = tot;",
    "  return Promise.resolve(0);",
    "}",
    "function omlopen(ms) { return __omlopen(ms); }",
    "const klok = () => __tijd.nu;",
  ].join("\n");

  /* Elke lus krijgt de rondenteller vooraan in zijn lichaam. Snaartjes en
     commentaren worden overgeslagen, anders wordt "for (" in een tekst
     aangezien voor een lus. */
  SANDBOX.bewijk = function (code, opties) {
    const opt = opties || {};
    let br = String(code == null ? "" : code);
    if (opt.modus === "omlopen") {
      if (/\bawait\b/.test(br)) {
        throw new Error("Deze zandbak tikt met een eigen klok: await bestaat hier niet. Ketting met .then(...) en roep omlopen(ms) aan om de belletjes te laten afgaan.");
      }
      if (/\.then\s*\(/.test(br) && !/\bomlopen\b/.test(br)) {
        throw new Error("Er is een .then() maar geen omlopen(): de belletjes zijn nooit gelopen, dus ik kan niets controleren. Roep omlopen(ms) aan.");
      }
      if (/new\s+setTimeout\s*\(/.test(br) && !/\bomlopen\b/.test(br)) {
        throw new Error("Je setTimeout staat nog in de wachtrij: roep omlopen(ms) aan, dan pas loopt het af.");
      }
    } else if (/\bawait\b/.test(br) || /\bomlopen\b/.test(br) || /setTimeout\s*\(/.test(br)) {
      throw new Error("Deze oefening heeft geen klok: tijden en `await` horen in een oefening met modus \"omlopen\".");
    }
    let uit = "", i = 0;
    const isWs = (k) => /\s/.test(br[k] || "");
    const isNaam = (k) => /[\w$]/.test(br[k] || "");
    function overSnaar(k) {
      const teken = br[k];
      k += 1;
      while (k < br.length) {
        if (br[k] === "\\") { k += 2; continue; }
        if (br[k] === teken) return k + 1;
        k += 1;
      }
      return k;
    }
    function overCommentaar(k) {
      if (br[k + 1] === "/") { const e = br.indexOf("\n", k); return e === -1 ? br.length : e; }
      const e = br.indexOf("*/", k);
      return e === -1 ? br.length : e + 2;
    }
    function lusKop(k) {
      let diep = 0, j = k;
      while (j < br.length) {
        const ch = br[j];
        if (ch === '"' || ch === "'" || ch === "`") { j = overSnaar(j); continue; }
        if (ch === "/" && (br[j + 1] === "/" || br[j + 1] === "*")) { j = overCommentaar(j); continue; }
        if (ch === "(") diep += 1;
        else if (ch === ")") { diep -= 1; if (diep === 0) return j + 1; }
        j += 1;
      }
      return -1;
    }
    function lusEinde(k) {
      let diep = 0, j = k;
      while (j < br.length) {
        const ch = br[j];
        if (ch === '"' || ch === "'" || ch === "`") { j = overSnaar(j); continue; }
        if (ch === "/" && (br[j + 1] === "/" || br[j + 1] === "*")) { j = overCommentaar(j); continue; }
        if (ch === "{") diep += 1;
        else if (ch === "}") { diep -= 1; if (diep === 0) return j; }
        j += 1;
      }
      return -1;
    }
    while (i < br.length) {
      const ch = br[i];
      if (ch === '"' || ch === "'" || ch === "`") { const e = overSnaar(i); uit += br.slice(i, e); i = e; continue; }
      if (ch === "/" && (br[i + 1] === "/" || br[i + 1] === "*")) { const e = overCommentaar(i); uit += br.slice(i, e); i = e; continue; }
      const m = /^(for|while)\b/.exec(br.slice(i));
      if (m && !isNaam(i - 1)) {
        const slot = m[1];
        let j = i + slot.length;
        while (isWs(j)) j += 1;
        if (br[j] === "(") {
          const naKop = lusKop(j);
          if (naKop !== -1) {
            let k = naKop;
            while (isWs(k)) k += 1;
            uit += br.slice(i, naKop);
            if (br[k] === "{") {
              const sluit = lusEinde(k);
              if (sluit !== -1 && sluit > k + 1) { uit += "{ __ronden();"; i = k + 1; continue; }
              if (sluit !== -1) { uit += "{"; i = k + 1; continue; }
            }
            let e = k, diep = 0, s2 = null;
            while (e < br.length) {
              const c2 = br[e];
              if (s2) { if (c2 === "\\") { e += 2; continue; } if (c2 === s2) s2 = null; e += 1; continue; }
              if (c2 === '"' || c2 === "'" || c2 === "`") { s2 = c2; e += 1; continue; }
              if (c2 === "(" || c2 === "[") diep += 1;
              else if (c2 === ")" || c2 === "]") diep -= 1;
              else if (c2 === "/" && (br[e + 1] === "/" || br[e + 1] === "*")) break;
              if (diep === 0 && (c2 === ";" || c2 === "}")) break;
              e += 1;
            }
            uit += "{ __ronden(); " + br.slice(k, e) + " }";
            i = e;
            continue;
          }
        }
      }
      uit += ch;
      i += 1;
    }
    return uit;
  };

  function gedeclareerden(code) {
    const namen = [];
    const re = /\bfunction\s+([A-Za-z_$][\w$]*)\s*\(|\b(?:const|let)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:function\b|\([^)]*\)\s*=>|[A-Za-z_$][\w$]*\s*=>)/g;
    let m;
    while ((m = re.exec(code))) {
      const n = m[1] || m[2];
      if (n && namen.indexOf(n) === -1 && !/^(geef|roep|console|document|omlopen|__)/.test(n)) namen.push(n);
    }
    return namen;
  }
  SANDBOX.gedeclareerden = gedeclareerden;

  function zaadBrowser(html) {
    const s = String(html == null ? "" : html);
    if (!s.trim()) return "";
    return [
      "/* --- het zaad: de opzet van deze oefening, in het iframe zelf --- */",
      "document.body.insertAdjacentHTML('beforeend', " + JSON.stringify(s) + ");",
      "__boom = Array.prototype.slice.call(document.body.children).map(function __a(el) {",
      "  return { tag: el.tagName.toLowerCase(), id: el.id || '', klassen: el.className || '',",
      "    style: el.getAttribute('style') || '', tekst: (el.textContent || '').trim(),",
      "    __kinderen: Array.prototype.map.call(el.children, __a) };",
      "});",
      "(function tel(node) { (node.__kinderen || []).forEach((k) => {",
      "  const d = __DOM[k.id ? '#' + k.id : k.tag];",
      "  if (d && !d.textContent) d.textContent = k.tekst;",
      "  tel(k);",
      "}); })({ __kinderen: __boom });",
    ].join("\n");
  }

  function zaadNode(html) {
    const s = String(html == null ? "" : html);
    if (!s.trim()) return "";
    return [
      "/* --- zaad, met een mini-parser (de testkist heeft geen DOMParser) --- */",
      "const __s = " + JSON.stringify(s) + ";",
      "const __h = [];",
      "let __diep = { __kinderen: __h, tag: 'root' };",
      "const __re = /<(\\/)?([a-zA-Z][\\w-]*)((?:\\s+[\\w-]+(?:\\s*=\\s*(?:\"[^\"]*\"|'[^']*'|[^>\\s]+))?)*)\\s*(\\/?)>/g;",
      "let __m;",
      "while ((__m = __re.exec(__s))) {",
      "  const sluit = __m[1], tag = __m[2].toLowerCase(), at = __m[3] || '', ledig = __m[4];",
      "  if (sluit) { if (__diep.tag === tag && __diep.__ouder) __diep = __diep.__ouder; continue; }",
      "  const idm = at.match(/\\bid\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^>\\s]+))/i);",
      "  const klm = at.match(/\\bclass\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^>\\s]+))/i);",
      "  const stl = at.match(/\\bstyle\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^>\\s]+))/i);",
      "  const n = { tag: tag, id: idm ? (idm[1] || idm[2] || idm[3] || '') : '',",
      "    klassen: klm ? (klm[1] || klm[2] || klm[3] || '') : '',",
      "    style: stl ? (stl[1] || stl[2] || stl[3] || '') : '', tekst: '', __kinderen: [], __ouder: __diep };",
      "  __diep.__kinderen.push(n);",
      "  if (ledig) continue;",
      "  const van = __s.slice(__m.index + __m[0].length);",
      "  const tot = van.indexOf('</' + tag + '>');",
      "  n.tekst = (tot === -1 ? van : van.slice(0, tot)).replace(/<[^>]*>/g, ' ').replace(/\\s+/g, ' ').trim();",
      "  __diep = n;",
      "}",
      "/* de knoopen uit het zaad in __DOM zetten, alsof de leerling ze typte */",
      "const __kns = [];",
      "(function __loop(n) { (n.__kinderen || []).forEach((k) => { __kns.push(k); __loop(k); }); })({ __kinderen: __h });",
      "__kns.forEach((n) => {",
      "  const sloten = [];",
      "  if (n.id) sloten.push('#' + n.id);",
      "  if (n.klassen) n.klassen.trim().split(/\\s+/).forEach((c) => sloten.push('.' + c));",
      "  sloten.push(n.tag);",
      "  sloten.forEach((k) => {",
      "    const d = __DOM[k];",
      "    d.textContent = d.textContent || n.tekst;",
      "    d.classes = d.classes.length ? d.classes : n.klassen.trim().split(/\\s+/).filter(Boolean);",
      "    if (n.style) d.stijlen.__inline = n.style;",
      "    d.__aantal = (d.__aantal || 0) + 1;",
      "  });",
      "});",
      "__boom = __h;",
    ].join("\n");
  }

  /* één keer de bron bouwen, voor alle drie de smaken */
  function knoop(code, html, css, opt) {
    let eigen;
    try { eigen = SANDBOX.bewijk(String(code == null ? "" : code), opt); }
    catch (bezwaar) { return { weigering: String(bezwaar && bezwaar.message ? bezwaar.message : bezwaar) }; }
    const L = [];
    L.push(VOOR);
    if (opt.modus === "omlopen") L.push(KLOK);
    L.push("__CSS = " + JSON.stringify(String(css == null ? "" : css)) + ";");
    L.push("let __stijlfout = null;");
    L.push("try { __stroken(__CSS).forEach((b) => { if (__vlak.indexOf(b.sel) === -1) __vlak.push(b.sel); }); } catch (e) { __stijlfout = String(e && e.message ? e.message : e); }");
    L.push(opt.inIframe ? zaadBrowser(html) : zaadNode(html));
    /* de boom een keer langs de motor halen vóór de gebruikerscode: zo zijn
       __ouder/__volgende gezet en meet __stijl(...) in de mirror precies wat
       het meetpaneel in de browser laat zien */
    L.push("try { __stijlPas(__boom, __CSS); } catch (e) {}");
    L.push("/* ---- jouw code ---- */");
    L.push("try {");
    L.push(eigen);
    L.push("/* ---- einde jouw code ---- */");
    const namen = gedeclareerden(eigen);
    if (namen.length) L.push(namen.map((n) => "try { " + n + " = __dek(" + n + ", '" + n + "'); } catch (e) {}").join("\n"));
    L.push("/* ---- meetfase: de cascade toepassen, dan pas rapport ---- */");
    L.push("try { __stijlPas(__boom, __CSS); } catch (e) { if (!__stijlfout) __stijlfout = String(e && e.message ? e.message : e); }");
    L.push("__rapport(__stijlfout);");
    L.push("} catch (__e) {");
    L.push("  __stuur({");
    L.push("    cssFout: __stijlfout, fout: String((__e && __e.constructor && __e.constructor.name) || 'Fout') + ': ' + (__e && __e.message ? __e.message : __e),");
    L.push("    log: __log, geeft: __geeft, heeft: __heeftGegeven, roep: __ROEP, dom: __DOM, selectors: __vlak, stijl: __stijlUit");
    L.push("  });");
    L.push("}");
    return { bron: L.join("\n") };
  }

  SANDBOX.bouw = function (code, html, css, opties) {
    const opt = Object.assign({ inIframe: true }, opties || {});
    const klaar = knoop(code, html, css, opt);
    if (klaar.weigering) return "/* " + klaar.weigering.replace(/\*\//g, "") + " */";
    return "/* zandbak · deze omlijsting schrijf jij niet */\n(function () {\n" + klaar.bron + "\n})();";
  };
  /* Dezelfde motor, voor de checker buiten de zandbak: één whereidheid. */
  const __motor = new Function("return (function () {" + STIJL_BROEK + "\nreturn { stroken: __stroken, gewicht: __gewicht, past: __past, verdeel: __verdeelSel, verdeler: __verdeelReeks, decl: __declaraties, pas: __stijlPas, ketting: __pastKetting, echtkleur: __stijlEcht }; })();")();
  SANDBOX.stroken = __motor.stroken;
  SANDBOX.gewicht = __motor.gewicht;
  SANDBOX.past = __motor.past;
  SANDBOX.pastKetting = __motor.pastKetting;
  SANDBOX.verdeel = __motor.verdeel;
  SANDBOX.decl = __motor.decl;
  SANDBOX.pas = __motor.pas;
  SANDBOX.ketting = __motor.ketting;
  SANDBOX.stijlenVan = function (code, html, css) {
    return SANDBOX.uitvoerenNode(code || "", html || "", css || "", {});
  };
    SANDBOX.stijlVanIed = function (kaarten, sel) {
    const z = (x) => String(x == null ? "" : x).replace(/\s*([>,])\s*/g, " $1 ").replace(/\s+/g, " ").trim().toLowerCase();
    const gelijk = (kaarten || []).filter((k) => z(k.sel) === z(sel))[0];
    return gelijk ? gelijk.stijl : null;
  };

  /* De proxy maakt elk aangesproken label aan: `toJSON` en een leeg `body`
     zijn bijvangst van de omlijsting zelf. */
  function knopen(dom) {
    const uit = {};
    Object.keys(dom || {}).forEach((k) => {
      if (!/^(#|\.)?[A-Za-z][\w-]*$/.test(k)) return;
      if (k === "toJSON") return;
      if (k === "body" && !(dom[k] && dom[k].textContent)) return;
      uit[k] = dom[k];
    });
    return uit;
  }
  SANDBOX.knopen = knopen;

  function resultaat(uit) {
    const log = (uit.log || []).map((r) => (typeof r === "string" ? { soort: "log", tekst: r } : r));
    return {
      ok: !uit.fout,
      fout: uit.fout || null,
      log: log,
      regels: log.map((r) => r.tekst),
      geeft: uit.geeft,
      heeft: !!uit.heeft,
      roep: uit.roep || [],
      dom: knopen(uit.dom),
      stijl: uit.stijl || {},
      selectors: uit.selectors || [],
    };
  }
  SANDBOX.resultaat = resultaat;

  /* ---------- Node, synchroon ---------- */
  SANDBOX.uitvoerenNode = function (code, html, css, opties) {
    const opt = Object.assign({ modus: "" }, opties || {});
    const klaar = knoop(code, html, css, opt);
    if (klaar.weigering) return resultaat({ fout: klaar.weigering, log: [] });
    const uit = { log: [], geeft: null, heeft: false, fout: null, roep: [], dom: {}, stijl: {}, selectors: [] };
    try { new Function("__UIT", klaar.bron)(uit); }
    catch (e) { uit.fout = "SyntaxError: " + e.message; }
    return resultaat(uit);
  };

  /* ---------- Node, met wachten (modus "omlopen") ---------- */
  SANDBOX.uitvoerenNodeAsync = function (code, html, css, opties) {
    const opt = Object.assign({ modus: "omlopen" }, opties || {});
    const klaar = knoop(code, html, css, opt);
    if (klaar.weigering) return Promise.resolve(resultaat({ fout: klaar.weigering, log: [] }));
    const uit = { log: [], geeft: null, heeft: false, fout: null, roep: [], dom: {}, stijl: {}, stijlpunten: [], boom: [], selectors: [] };
    return new Promise((resolve) => {
      let klaar_met = false;
      const toe = (o) => {
        Object.assign(uit, { log: o.log, geeft: o.geeft, heeft: o.heeft, roep: o.roep, dom: o.dom, stijl: o.stijl, selectors: o.selectors, fout: o.fout || null });
      };
      uit.__bij = (o) => { if (klaar_met) return; klaar_met = true; toe(o); resolve(resultaat(uit)); };
      const bewaak = setTimeout(() => {
        if (klaar_met) return;
        klaar_met = true;
        resolve(resultaat({ fout: "De code blijft wachten op een belofte die nooit uitkomt.", log: uit.log }));
      }, 900);
      try { new Function("__UIT", klaar.bron)(uit); }
      catch (e) {
        clearTimeout(bewaak);
        if (!klaar_met) { klaar_met = true; resolve(resultaat({ fout: "SyntaxError: " + e.message, log: [] })); }
      }
    });
  };

  /* ---------- browser: iframe + postMessage ---------- */
  let frame = null, teller = 0, wacht = {};
  function kader() {
    if (frame) return frame;
    frame = document.createElement("iframe");
    frame.setAttribute("sandbox", "allow-scripts");
    frame.setAttribute("title", "zandbak: jouw code, jouw CSS");
    frame.style.cssText = "position:fixed;left:-9999px;top:0;width:640px;height:200px;border:0;";
    document.body.appendChild(frame);
    window.addEventListener("message", (ev) => {
      const d = ev.data;
      if (!d || d.__kuur !== 1 || d.__id === undefined) return;
      const bestel = wacht[d.__id];
      if (!bestel) return;
      delete wacht[d.__id];
      clearTimeout(bestel.timer);
      bestel.res(resultaat(d));
    });
    return frame;
  }

  SANDBOX.uitvoeren = function (code, html, ms, opties) {
    return new Promise((resolve) => {
      const f = kader();
      const id = ++teller;
      const opt = Object.assign({ inIframe: true, modus: (opties && opties.modus) || "" }, opties || {});
      const binnen = [
        "<!DOCTYPE html><html lang=\"nl\"><head><meta charset=\"utf-8\"></head><body>",
        "<script>window.__kuurId = " + id + ";",
        "window.__stuur = function (o) { o.__kuur = 1; o.__id = window.__kuurId; try { parent.postMessage(o, '*'); } catch (e) {} };<\/script>",
        "<script>" + SANDBOX.bouw(code, html, (opties && opties.css) || "", opt) + "<\/script>",
        "</body></html>",
      ].join("");
      const bestel = {
        id: id, res: resolve,
        timer: setTimeout(() => {
          if (!wacht[id]) return;
          delete wacht[id];
          /* het kader uit het blad halen: de browser kan het vastgelopen
             draadje zo zelf afbraaken */
          try { f.remove(); } catch (e) {}
          frame = null;
          resolve(resultaat({ fout: "Te lang bezig: deze code komt niet meer klaar — eindeloze lus? De zandbak is afgebroken.", log: [] }));
        }, ms || 4000),
      };
      wacht[id] = bestel;
      f.srcdoc = binnen;
    });
  };

  /* ---------- meten zonder leerlingen-js ----------
     Voor een loutere css-oefening schrijft de leerling géén code: de motor
     meet dan zélf. `meten` past de css toe op de opzet en noteert per strook
     uit het meetrapport wat er werkelijk staat; `rapport` zet die notering
     om in de regels die het meetvak toont. Zo blijft een `uitvoer:`-check ook
     zonder één letter javascript eerlijk: hij vergelijkt met wat gemeten is. */
  SANDBOX.meten = function (html, css) {
    const r = SANDBOX.uitvoerenNode("", html || "", css || "", {});
    r.regels = SANDBOX.rapport(r);
    r.log = r.regels.map((t) => ({ soort: "log", tekst: t }));
    r.geeft = null;
    r.heeft = false;
    r.roep = [];
    return r;
  };
  SANDBOX.rapport = function (r) {
    const stijl = (r && r.stijl) || {};
    const kaal = (x) => String(x).replace(/\s+/g, " ").trim().toLowerCase();
    const deel = (x) => kaal(x).split(/[\s>+~,]+/).filter(Boolean).pop();
    /* één strook per selector die in het stijlvak staat: de kaarten per
       knooppunt worden samengevat, een dubbele lijn telt één keer */
    const perSleutel = {};
    Object.keys(stijl).forEach(function (s) {
      const kaarten = Array.isArray(stijl[s]) ? stijl[s] : [stijl[s] || {}];
      const lijnen = [], kaal = [];
      kaarten.forEach(function (d) {
        const sloten = Object.keys(d || {}).filter((e) => !/^[A-Z]/.test(e));
        if (!sloten.length) return;
        const puur = sloten.map((e) => e + ": " + d[e]).join("; ");
        if (kaal.indexOf(puur) === -1) { kaal.push(puur); lijnen.push(s + " { " + puur + " }"); }
      });
      perSleutel[s] = { strook: lijnen, lijn: lijnen.slice(), puur: kaal, knopen: kaarten.length };
    });
    const out = [];
    Object.keys(perSleutel).forEach(function (s) {
      const mij = perSleutel[s];
      const lang = kaal(s).split(/[\s>+~,]+/).filter(Boolean).pop();
      for (const a of Object.keys(perSleutel)) {
        if (a === s || kaal(a).length <= kaal(s).length) continue;
        if (deel(a) !== lang && kaal(a).indexOf(kaal(s)) !== 0) continue;
        if (perSleutel[a].puur.join("|") === mij.puur.join("|")) return;   /* langer etiket, zelfde lade */
      }
      out.push(mij.lijn.length === 1 && mij.knopen > 1 ? mij.lijn[0] + "  (" + mij.knopen + " knooppunten)" : mij.lijn[0]);
      for (let i = 1; i < mij.lijn.length; i++) out.push(mij.lijn[i]);
    });
    return out;
  };

  /* ---------- live: het frame onder de tabbladen ----------
     Het oefenkader zélf, niet een nabootsing: dezelfde html, dezelfde css
     (opzet + wat de leerling typt) en dezelfde js. Het kader blijft staan en
     wordt telkens opnieuw volgeschreven, dus typen is direct zichtbaar.
     Geen enkele stylesheet van de site wordt erin geladen — de opzet-css van
     de oefening is de enige stijl die meetelt.  */
  const LIVE_GROND = "html{background:#f5f1e6;color:#0a0a0a;font:16px/1.55 system-ui,-apple-system,Segoe UI,sans-serif;}" +
    "body{margin:0;padding:0.85rem;}*,*::before,*::after{box-sizing:border-box;}";
  SANDBOX.live = function (kader, html, css, code) {
    if (!kader) return;
    const binnen = [
      "<!DOCTYPE html><html lang=\"nl\"><head><meta charset=\"utf-8\"><style>", LIVE_GROND, "</style>",
      css ? "<style>" + String(css).replace(/<\/style>/gi, "<\\/style>") + "</style>" : "",
      "</head><body>", String(html || ""),
      code ? "<scr" + "ipt>" + String(code)
        .replace(/<\/script>/gi, "<\\/script>")
        .replace(/(?:\w+\s*\.\s*)?\bfetch\s*\(/g, "(function(){throw new Error(\'fetch is geblokkeerd in de live-voorschou\');})()(")
        .replace(/\bXMLHttpRequest\b/g, "(function(){throw new Error('netwerk is geblokkeerd in de live-voorschou');})") + "</scr" + "ipt>"
        : "",
      "</body></html>",
    ].join("");
    try { kader.srcdoc = binnen; } catch (e) { /* weggegooid kader: niets aan te doen */ }
  };

  /* ---------- hulpjes die ook de checker gebruikt ---------- */
  SANDBOX.normaliseer = (x) => String(x == null ? "" : x).replace(/\s+/g, " ").trim();
  SANDBOX.gelijk = function (a, b) {
    if (a === b) return true;
    if (typeof a === "number" && typeof b === "number") return Math.abs(a - b) < 1e-9;
    if (a == null || b == null) return false;
    if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => SANDBOX.gelijk(x, b[i]));
    if (typeof a === "object" && typeof b === "object") {
      const ka = Object.keys(a), kb = Object.keys(b);
      return ka.length === kb.length && ka.every((k) => SANDBOX.gelijk(a[k], b[k]));
    }
    return String(a) === String(b);
  };
})();

/* ============================================================
   app.js · de cursusmolen (CSS)
   ------------------------------------------------------------
   Geen editor op deze site en geen opslag: leerlingen typen in hun
   eigen editor en plakken hier om te laten controleren. Er staat geen
   oplossing en geen startcode; theorie en praktijkvoorbeeld zijn leesstof.
   Twee toestellen naast de plakvelden:
     • de zandbak  → js/sandbox.js  (jouw code, gedraaid, console + DOM)
     • de terminal → js/fakegit.js  (commando's, nagebootst)
   ============================================================ */
(function () {
  "use strict";

  const D = (window.KLEI || window.JSB).data;
  const T = D.topics;
  const K = window.CHECKS;
  const LEVELS = { "Warm-up": "warmup", "Oefening": "oefening", "Bonus": "bonus" };

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  /* ---------- regelscompiler per oefening (één keer, dan klaar) ---------- */
  function checksVan(o, t) {
    if (!o.__checks) o.__checks = window.CHECKS.comp({ checks: o.checks }, { vragen: t.vragen });
    return o.__checks;
  }
  function vraagChecks(t) {
    if (!t.__vchecks) {
      t.__vchecks = t.vragen.map((v) => window.CHECKS.comp({ checks: [v.check] }, { vragen: t.vragen })[0]);
    }
    return t.__vchecks;
  }

  /* ---------- de meetfase: css-only of met leerlingen-js ---------- */
  /* Bij soortOef "css" schrijft de leerling géén javascript: de motor meet dan
     zélf en noteert per geraakte strook wat er werkelijk staat. Bij "klei" en
     "code" draait zijn code in de zandbak en is dat meetrapport het bijproduct.
     Beide paden eindigen met dezelfde res, dus élke stijl:-, vw:- en
     uitvoer:-check leest exact dezelfde waarheid. */
  const isCss = (o) => o.soortOef === "css";
  async function meetfase(block, o, v) {
    const stijlen = [(o.opzet && o.opzet.css) || "", v.css || ""].filter(Boolean).join("\n");
    const zaad = v.html || (o.opzet && o.opzet.html) || "";
    if (isCss(o)) {
      if (window.SANDBOX && window.SANDBOX.meten) return window.SANDBOX.meten(zaad, stijlen);
      return window.SANDBOX.uitvoerenNode("", zaad, stijlen, {});
    }
    const opt = { modus: o.modus || "" };
    return window.__KUUR_OMGEVING === "node"
      ? window.SANDBOX.uitvoerenNode(v.code || "", zaad, stijlen, opt)
      : await window.SANDBOX.uitvoeren(v.code || "", zaad, null, Object.assign({}, opt, { css: stijlen }));
  }
  function toonUitvoer(box, o, v, res) {
    toonConsole(box, res, isCss(o));
    toonDom(box, res);
    toonMeting(box, res);
    toonLive(box, o, v);
  }

  /* ---------- context uit de vakken ---------- */
  function veldwaarden(block) {
    const v = {};
    $$(".vlak", block).forEach((el) => { v[el.getAttribute("data-vlak")] = el.value; });
    return v;
  }
  function antwoorden(block) {
    const keuzes = [], teksten = [];
    $$("[data-vraag]", block).forEach((el) => {
      const i = Number(el.getAttribute("data-vraag"));
      if (el.tagName === "TEXTAREA") teksten[i] = el.value;
      else if (el.type === "radio") { if (el.checked) keuzes[i] = Number(el.value); }
    });
    return { keuzes: keuzes, teksten: teksten };
  }

  /* ---------- console- en DOM-tonen ---------- */
  function toonConsole(box, res, cssModus) {
    const bak = $(".console pre", box);
    if (!bak) return;
    if (res.fout) {
      bak.innerHTML = '<span class="regel type-fout">' + esc(res.fout) + "</span>";
      return;
    }
    if (!res.log.length) {
      bak.innerHTML = '<span class="regel leeg">' + (cssModus
        ? "(niets gemeten — de motor vindt voor jouw stijlvak geen enkele strook)"
        : "(je code print niets — console.log is je meetinstrument)") + "</span>";
      return;
    }
    bak.innerHTML = res.log.map((l) => '<span class="regel type-' + l.soort + '">' + esc(l.tekst) + "</span>").join("");
  }
  function toonMeting(box, res) {
    const bak = box.querySelector(".meting");
    if (!bak) return;
    const sel = Object.keys(res.stijl || {});
    if (!sel.length) { bak.innerHTML = ""; return; }
    const rijen = sel.map((k) => {
      /* per selector één kaart per geraakte knoop, in boomvolgorde */
      const kaarten = Array.isArray(res.stijl[k]) ? res.stijl[k] : [res.stijl[k] || {}];
      const cell = kaarten.map((d) => {
        const sloten = Object.keys(d || {});
        return sloten.length
          ? "<div class=meting-knoop>" + sloten.map((e) => "<code>" + esc(e) + "</code> " + esc(d[e])).join("<br>") + "</div>"
          : "<span class=leeg>geen regel raakt deze knoop</span>";
      }).join("");
      return "<tr><td><code>" + esc(k) + "</code></td><td>" + cell + "</td></tr>";
    }).join("");
    bak.innerHTML = '<div class="editor-bar">gemeten stijlen, ná de cascade</div><table><tr><th>selector</th><th>wat er werkelijk staat</th></tr>' + rijen + "</table>";
  }
  function toonDom(box, res) {
    const wrap = box.querySelector(".domspiegel");
    if (!wrap) return;
    const sleutels = Object.keys(res.dom || {});
    if (!sleutels.length) { wrap.innerHTML = ""; return; }
    const rijen = sleutels.map((k) => {
      const n = res.dom[k] || {};
      const at = Object.keys(n.atributen || {}).map((a) => a + "=" + n.atributen[a]).join(" ");
      return "<tr><td>&lt;" + esc(k) + "&gt;</td><td>" + esc((n.textContent || "").slice(0, 60)) + "</td><td>" +
        esc((n.classes || []).join(" ")) + "</td><td>" + esc(at) + "</td></tr>";
    }).join("");
    wrap.innerHTML = '<div class="editor-bar">document, zoals de zandbak het onthield</div><table><tr><th>knooppunt</th><th>textContent</th><th>klassen</th><th>attributen</th></tr>' + rijen + "</table>";
  }
  /* ---------- de live-voorschou: het kader dat onder de tabbladen staat ---------- */
  /* Eén iframe per oefening, die telkens opnieuw wordt volgeschreven. De pupil
     ziet dus zíjn pagina, niet een nabootsing ervan: dezelfde html, dezelfde
     css (opzet + wat hij zelf typte) en dezelfde js. In node (de kist) is er
     geen kader en gebeurt er niets — de meting loopt dan via de motor. */
  function toonLive(box, o, v) {
    const f = $(".voorschou", box);
    if (!f) return;
    if (window.__KUUR_OMGEVING === "node" || !window.SANDBOX || !window.SANDBOX.live) return;
    const stijlen = [(o.opzet && o.opzet.css) || "", v.css || ""].filter(Boolean).join("\n");
    const zaad = v.html || (o.opzet && o.opzet.html) || "";
    window.SANDBOX.live(f, zaad, stijlen, v.code || "");
    const vak = $(".live-rij", box);
    if (vak) vak.dataset.gevuld = "1";
  }
  function voorschou(box, o) {
    toonLive(box, o, veldwaarden(box));
    kiesTab(box, "live");
  }
  function kiesTab(box, naam) {
    $$(".tab", box).forEach((b) => {
      const aan = b.getAttribute("data-uitvoer") === naam;
      b.classList.toggle("aan", aan);
      b.setAttribute("aria-selected", aan ? "true" : "false");
    });
    $$("[data-paneel-uit]", box).forEach((rij) => {
      const aan = rij.getAttribute("data-paneel-uit") === naam;
      /* css [hidden] wint van .paneel-rij, dus het atribuut is de waarheid */
      if (aan) rij.removeAttribute("hidden"); else rij.setAttribute("hidden", "");
      rij.hidden = !aan;
    });
  }

  function toonTerminal(box, blokken) {

    const bak = box.querySelector(".term-out pre");
    if (!bak) return;
    if (!blokken.length) { bak.innerHTML = '<span class="leeg">(typ je commando\'s — één per regel, zonder $)</span>'; return; }
    bak.innerHTML = blokken.map((b) =>
      '<span class="regel type-log">$ ' + esc(b.cmd) + "</span>" +
      (b.uit || []).map((l) => '<span class="regel">' + esc(l) + "</span>").join("")
    ).join("");
  }

  /* ---------- één oefening blok: paneeltjes, codepen-achtig ---------- */
  /* Elk typvlak wordt een paneel met een eigen kleur aan de bovenkant: css
     blauw, vermoed geel, html oranje. Er is geen js-paneel: in dit onderdeel
     schrijft de leerling alleen CSS, de motor meet. Wat eronder gebeurt, staat
     in één uitvoervak met tabbladen: live (de pagina zelf), meten (de notering
     van de cascade) en vermoed (je eigen voorspelling). */
  const PANEEL = {
    html: { kop: "html", kleur: "warm", pleats: "<!DOCTYPE html>\n<section class=\"…\">\n  …\n</section>", rijen: 12 },
    css: { kop: "css", kleur: "blauw", pleats: ".selector {\n  eigenschap: waarde;\n}", rijen: 12 },
    code: { kop: "js", kleur: "groen", pleats: "__stijl(\".selector\")", rijen: 10 },
    term: { kop: "terminal", kleur: "donker", pleats: "git init\ngit add index.html", rijen: 12 },
    vermoed: { kop: "vermoed", kleur: "geel", pleats: "wat print de console of wat meet de browser, denk vóór je uitvoert", rijen: 8 },
  };
  function paneel(v, o) {
    const p = PANEEL[v.id] || PANEEL.code;
    const klasse = v.id === "term" ? "vlak terminal" : (v.id === "vermoed" ? "vlak vermoed" : (v.id === "css" ? "vlak css" : "vlak"));
    const kop = v.id === "css" ? "css — die mag je hier zélf schrijven" : (v.id === "term" ? "terminal — één commando per regel" : p.kop);
    const aanwijzing = v.label && v.label !== kop ? '<p class="paneel-eis">' + v.label + "</p>" : "";
    return '<div class="paneel ' + p.kleur + '" data-paneel="' + esc(v.id) + '">' +
      '<div class="paneel-kop"><span class="punt"></span><span>' + esc(kop) + "</span></div>" +
      '<div class="paneel-lijf">' +
      '<textarea class="' + klasse + '" data-vlak="' + esc(v.id) + '" spellcheck="false" rows="' + p.rijen + '"' +
      ' placeholder="' + esc(p.pleats) + '" aria-label="' + esc(kop) + '"></textarea>' + aanwijzing +
      "</div></div>";
  }
  function blokOefening(t, o, i) {
    /* volgorde zoals in codepen: html, css, js, dan de rest (terminal, vermoed) */
    const RANG = { html: 0, css: 1, code: 2, term: 3, vermoed: 4 };
    const v = o.velden.slice().sort((a, b) => (RANG[a.id] == null ? 5 : RANG[a.id]) - (RANG[b.id] == null ? 5 : RANG[b.id]))
      .map((x) => paneel(x, o)).join("");
    const knoppen =
      (o.soortOef !== "term" && !isCss(o) ? '<button class="btn btn-blue" data-action="run" type="button">Run · voer uit &amp; meet</button>' : "") +
      (isCss(o) ? '<button class="btn btn-blue" data-action="meet" type="button">Meet opnieuw</button>' : "") +
      '<button class="btn btn-primary" data-action="check" type="button">Check · klopt het?</button>' +
      '<button class="btn btn-sm" data-action="wis" type="button">Wis</button>' +
      '<span class="flex-push"></span>' +
      '<span class="no-save">niets wordt bewaard</span>';
    return '<div class="block oefening" data-ex="' + i + '">' +
      '<div class="block-head ' + (LEVELS[o.soort] || "oefening") + '"><span class="icon">' +
      (o.soort === "Bonus" ? "★" : "▸") + "</span><span>" + esc(o.soort) + " " + (i + 1) + " — " + esc(o.titel) + "</span>" +
      '<span class="stamp inorde">' + o.checks.length + " checks</span>" +
      (o.modus === "omlopen" ? '<span class="stamp klok">eigen klok · eindig met omlopen(ms)</span>' : "") +
      "</div>" +
      '<div class="block-body">' +
      '<div class="task-brief"><strong class="task-label">Opdracht — élke check moet groen worden</strong>' + o.brief + "</div>" +
      '<div class="baan">' + v + "</div>" +
      '<div class="uitvoer">' +
      '<div class="tabstriep" role="tablist">' +
      '<button class="tab" data-uitvoer="live" type="button" role="tab">live</button>' +
      '<button class="tab" data-uitvoer="meet" type="button" role="tab">meten</button>' +
      (o.velden.some((x) => x.id === "vermoed") ? '<button class="tab" data-uitvoer="vermoed" type="button" role="tab">vermoed</button>' : "") +
      '<span class="terugval">' + (o.soortOef !== "term" ? '<button class="btn btn-sm" data-action="live" type="button">Toon live</button>' : "") + "</span>" +
      "</div>" +
      '<div class="live-rij" data-paneel-uit="live"><iframe class="voorschou" title="live: jouw html, css en js" sandbox="allow-scripts"></iframe></div>' +
      '<div class="meet-rij" data-paneel-uit="meet">' +
      (o.soortOef !== "term" ? '<div class="console"><div class="editor-bar">' + (isCss(o) ? "meting — wat de motor noteerde" : "console") + '</div><pre></pre></div>' : "") +
      (o.soortOef === "term" || o.soortOef === "mix" ? '<div class="console term-out"><div class="editor-bar">terminal</div><pre></pre></div>' : "") +
      '<div class="domspiegel"></div>' +
      '<div class="meting"></div>' +
      "</div>" +
      '<div class="vermoed-rij" data-paneel-uit="vermoed"><p class="moet-nog">Het vermoed-vak staat bij de panelen hierboven: vul het in vóór je runt, en lees hier daarna wat er werkelijk gemeten werd.</p></div>' +
      "</div>" +
      '<div class="oefening-acties">' + knoppen + "</div>" +
      '<div class="feedback" hidden></div>' +
      "</div></div>";
  }

  /* ---------- vragenblok ---------- */
  function blokVragen(t) {
    if (!t.vragen || !t.vragen.length) return "";
    const vragen = t.vragen.map((v, i) => {
      const kop = '<div class="vraag-kop"><span class="vn">vraag ' + (i + 1) + "</span><span>" + v.vraag + "</span></div>";
      let lijf = "";
      if (v.kind === "mc") {
        lijf = '<div class="opties">' + v.opties.map((o, j) =>
          '<label><input type="radio" name="vraag-' + i + '" data-vraag="' + i + '" value="' + j + '"><span>' + o + "</span></label>"
        ).join("") + "</div>";
      } else {
        lijf = '<textarea data-vraag="' + i + '" spellcheck="false" rows="4" placeholder="jouw antwoord, in eigen woorden"></textarea>' +
          '<p class="must-note">Steekwoorden die ik lees: <code>' + (v.keywords || []).join("</code>, <code>") + "</code> — minstens " + v.minKeywords + ".</p>";
      }
      const bij = v.code ? '<pre class="code"><code>' + esc(v.code) + "</code></pre>" : "";
      const uitleg = v.kind === "mc" && v.uitleg ? '<div class="terug" data-terug hidden>' + esc(v.uitleg) + "</div>" : (v.terug ? '<div class="terug" data-terug hidden>' + esc(v.terug) + "</div>" : "");
      return '<div class="vraag" data-vblok="' + i + '">' + kop + '<div class="vraag-body">' + bij + lijf + uitleg + "</div></div>";
    }).join("");
    return '<div class="block oefening" data-ex="vragen">' +
      '<div class="block-head vraag"><span class="icon">?</span><span>Vragen bij dit onderdeel</span>' +
      '<span class="stamp inorde">' + t.vragen.length + " vragen</span></div>" +
      '<div class="block-body"><div class="task-brief"><strong class="task-label">Beantwoord eerst in je schrijfmap</strong>' +
      "De site nalaat is handig, eigen woorden zijn het doel. Bij een fout antwoord zie je hier wat er verwacht werd.</div>" +
      '<div class="vragen">' + vragen + "</div>" +
      '<div class="oefening-acties"><button class="btn btn-primary" data-action="vragen" type="button">Controleer de vragen</button>' +
      '<span class="flex-push"></span><span class="no-save">geen punten, geen teller</span></div>' +
      '<div class="feedback" hidden></div></div></div>';
  }

  function buildTopic(id) {
    const t = T.filter((x) => x.id === id)[0];
    if (!t) return null;
    let html = '<div class="topic-head"><div class="topic-kicker">topic ' + esc(t.num) + "</div><h1>" + esc(t.titel) + "</h1>" +
      '<p class="lead">' + esc(t.dots) + "</p></div>" +
      '<div class="block"><div class="block-head theory"><span class="icon">§</span><span>Theorie</span></div>' +
      '<div class="block-body">' + t.theorie + "</div></div>" +
      '<div class="block"><div class="block-head example"><span class="icon">▤</span><span>Uit de praktijk — ' + esc(t.voorbeeld.kop) + "</span></div>" +
      '<div class="block-body"><div class="code-wrap"><span class="code-label">praktijk</span><pre><code>' +
      esc(t.voorbeeld.code) + "</code></pre></div><p class=\"must-note\">" + t.voorbeeld.uitleg + "</p></div></div>" +
      t.oefeningen.map((o, i) => blokOefening(t, o, i)).join("") +
      blokVragen(t);
    const idx = T.indexOf(t);
    const vorige = T[idx - 1], volgende = T[idx + 1];
    html += '<div class="topic-nav nav-row">' +
      (vorige ? '<button class="btn btn-sm" data-go="' + vorige.id + '" type="button">← ' + esc(vorige.titel) + "</button>" : "") +
      (volgende ? '<button class="btn btn-sm" data-go="' + volgende.id + '" type="button">' + esc(volgende.titel) + " →</button>" : "") +
      "</div>";
    return html;
  }

  function buildHome() {
    const oef = T.reduce((a, t) => a + t.oefeningen.length, 0);
    const ch = T.reduce((a, t) => a + t.oefeningen.reduce((b, o) => b + o.checks.length, 0), 0);
    const vr = T.reduce((a, t) => a + t.vragen.length, 0);
    return '<div class="hero"><div class="hero-body"><p class="tagline">CSS · 5de jaar</p>' +
      "<h1>" + esc(D.meta.titel || "CSS opbouwen") + "<span> — </span>" + esc(D.meta.ondertitel || "selectors, cascade en lay-out") + "</h1>" +
      '<p class="lead">Van <code>p</code> en <code>.kaart</code> tot <code>&gt;</code>, <code>+</code> en het box model. ' +
      "Je typt CSS, de motor meet wat er werkelijk landt — " + ch + " controlepunten, geen startcode die het antwoord verklapt.</p>" +
      '<div class="hero-meta"><span class="chip hot">' + T.length + " onderdelen</span>" +
      '<span class="chip blue">' + oef + " oefeningen</span>" +
      '<span class="chip green">' + vr + " theorievragen</span></div>" +
      '<div class="hero-cta"><button class="btn btn-primary" data-go="' + T[0].id + '" type="button">Begin bij ' + esc(T[0].titel) + "</button>" +
      '<a class="btn btn-blue" href="#gooi">Wat is hier wel en niet</a></div></div></div>' +
      '<div class="topic-grid">' + T.map((t) =>
        '<button class="topic-card" data-go="' + t.id + '" type="button">' +
        '<div class="tc-num">topic ' + esc(t.num) + "</div>" +
        '<div class="tc-title">' + esc(t.titel) + "</div>" +
        '<div class="tc-dots">' + esc(t.dots) + "</div>" +
        '<span class="tc-meta">' + t.oefeningen.map((o) => o.soort).join(" · ") + "</span></button>"
      ).join("") + "</div>" +
      '<div class="block" id="gooi"><div class="block-head tip"><span class="icon">!</span><span>Hoe dit werkt</span></div>' +
      '<div class="block-body"><ul class="must-list">' +
      "<li>Typ in het blauwe paneel de CSS die de opdracht vraagt; de opzet van de pagina ligt er al bij. Je schrijft hier géén javascript — de motor meet voor jou. Deze site bewaart niets.</li>" +
      "<li>Klik <em>Check</em>. Je CSS wordt toegepast op een afgeschermde nabouwing van de pagina, en het meetrapport verschijnt in het tabblad <em>meten</em>: strook per strook.</li>" +
      "<li>Het tabblad <em>live</em> toont je eigen pagina, met jouw CSS erbovenop. Typen en <em>Meet opnieuw</em> vernieuwen beide.</li>" +
      "<li>Bij een <em>vermoed</em>-vak schrijf je eerst op welke eigenschappen er gaan staan; pas daarna laat je meten en vergelijk je wie er gelijk had.</li>" +
      "<li>Vragen = eigen woorden. Een fout antwoord toont wat er verwacht werd, zodat je het in je schrijfmap kunt afwerken.</li>" +
      "<li>Een oefening is af als élke check groen is. Geen punten, geen teller, geen opslag: herladen is proper beginnen.</li>" +
      "</ul><p class=\"must-note\">Geblokkeerd in de zandbak: <code>fetch</code>, <code>alert</code>, <code>localStorage</code>, <code>document.write</code> en lussen die nooit eindigen (na 2 000 000 ronden stopt de zandbak). Zo blijft het een meetopdracht en geen gokspel.</p></div></div>";
  }

  /* ---------- controleren ---------- */
  function feedbackLijst(items) {
    const open = items.filter((x) => x !== true).length;
    return '<strong>' + (open ? "Nog " + open + " van de " + items.length + " checks open." : "Mooi. Alles in orde.") + "</strong>" +
      '<ul class="check-list">' + items.map((r, i) =>
        '<li class="' + (r === true ? "pass" : "fail") + '"><span class="no">' + (i + 1) + "</span>" +
        '<span class="mk">' + (r === true ? "✓" : "✗") + '</span><span class="msg">' + esc(r === true ? "in orde" : r) + "</span></li>"
      ).join("") + "</ul>";
  }

  async function controleer(block, t, o) {
    const v = veldwaarden(block);
    const box = block;
    const antw = antwoorden(block);
    const nodig = window.CHECKS.behoeftes ? window.CHECKS.behoeftes(o.checks) : { code: true, terminal: true };
    let res = { ok: true, fout: null, log: [], regels: [], geeft: null, heeft: false, roep: [], dom: {} };
    if (o.soortOef !== "term" && (isCss(o) || nodig.code)) {
      res = await meetfase(block, o, v);
      toonUitvoer(box, o, v, res);
      kiesTab(box, "meet");
    }
    let blokken = [];
    if (o.soortOef !== "code" && nodig.terminal) {
      blokken = window.TERM.draait(v.term || "", (o.opzet && o.opzet.bestanden) || null);
      toonTerminal(box, blokken);
    }
    const ctx = {
      code: v.code || "", htmlInvoer: v.html || "", cssInvoer: v.css || "", termInvoer: v.term || "",
      vermoed: v.vermoed ? [v.vermoed] : [],
      uit: res, term: blokken, keuzes: antw.keuzes, teksten: antw.teksten,
    };
    const items = checksVan(o, t).map((fn) => {
      try { const r = fn(ctx); return r === true ? true : String(r); }
      catch (e) { return "crash in de check: " + e.message; }
    });
    const fb = $(".feedback", block);
    fb.hidden = false;
    fb.className = "feedback show " + (items.every((x) => x === true) ? "ok" : "bad");
    fb.innerHTML = feedbackLijst(items);
    const st = $(".stamp.inorde", block);
    st.className = "stamp inorde " + (items.every((x) => x === true) ? "yes" : "no");
    st.textContent = items.every((x) => x === true) ? "in orde" : items.filter((x) => x !== true).length + " open";
  }

  function controleerVragen(block, t) {
    const antw = antwoorden(block);
    const ctx = { keuzes: antw.keuzes, teksten: antw.teksten };
    const fns = vraagChecks(t);
    const items = fns.map((fn) => {
      try { const r = fn(ctx); return r === true ? true : String(r); }
      catch (e) { return "crash in de check: " + e.message; }
    });
    items.forEach((r, i) => {
      const el = $('[data-vblok="' + i + '"]', block);
      if (!el) return;
      el.className = "vraag " + (r === true ? "goed" : "fout");
      const t2 = $("[data-terug]", el);
      if (t2) t2.hidden = r === true ? true : false;   // bij fout: wat er verwacht werd
    });
    const fb = $(".feedback", block);
    fb.hidden = false;
    fb.className = "feedback show " + (items.every((x) => x === true) ? "ok" : "bad");
    fb.innerHTML = feedbackLijst(items);
  }

  /* ---------- rendering en routing ---------- */
  function render() {
    buildSidebar();
    const hash = (location.hash || "#").slice(1);
    const main = $("#main");
    if (!hash || !T.filter((t) => t.id === hash).length) {
      main.innerHTML = buildHome();
      document.title = (D.meta.titel || "CSS opbouwen") + " · " + (D.meta.ondertitel || "opbouwen met CSS");
    } else {
      main.innerHTML = buildTopic(hash);
      document.title = (D.meta.titel || "CSS opbouwen") + " · " + hash;
      const t = T.filter((x) => x.id === hash)[0];
      $("#sidebarNav [data-go=\"" + hash + "\"]").classList.add("active");
      wire(t);
    }
    $$("[data-go]").forEach((b) => b.addEventListener("click", (ev) => { ev.preventDefault(); location.hash = b.getAttribute("data-go"); window.scrollTo(0, 0); }));
  }

  function buildSidebar() {
    const nav = $("#sidebarNav");
    if (nav.dataset.bouwd === "1") {
      $$("#sidebarNav .nav-list li button").forEach((b) => b.classList.toggle("active", (location.hash || "#").slice(1) === b.getAttribute("data-go")));
      return;
    }
    nav.dataset.bouwd = "1";
    nav.innerHTML = '<ul class="nav-list">' + T.map((t) =>
      '<li><button data-go="' + t.id + '" type="button"><span class="num">' + esc(t.num) + "</span><span>" + esc(t.titel) + "</span></button></li>"
    ).join("") + "</ul>";
    $$("#sidebarNav [data-go]").forEach((b) => b.addEventListener("click", () => { location.hash = b.getAttribute("data-go"); window.scrollTo(0, 0); closeMobile(); }));
  }

  function wire(t) {
    $$(".block.oefening").forEach((block) => {
      const o0 = block.getAttribute("data-ex") === "vragen" ? null : t.oefeningen[Number(block.getAttribute("data-ex"))];
      if (o0) kiesTab(block, "live");
      $$(".tab", block).forEach((b) => {
        b.addEventListener("click", () => {
          const naam = b.getAttribute("data-uitvoer");
          if (naam === "live" && o0) toonLive(block, o0, veldwaarden(block));
          kiesTab(block, naam);
        });
      });
      /* tabblad-toets in een typvlak: inspringen, niet wegspringen naar de knoppen */
      $$(".vlak", block).forEach((el) => {
        el.addEventListener("keydown", (ev) => {
          if (ev.key !== "Tab" || ev.shiftKey || ev.ctrlKey || ev.metaKey) return;
          ev.preventDefault();
          const v = el.value, s = el.selectionStart, e = el.selectionEnd;
          el.value = v.slice(0, s) + "  " + v.slice(e);
          el.selectionStart = el.selectionEnd = s + 2;
        });
      });
      block.addEventListener("input", (ev) => {
        if (!o0 || !ev.target.classList || ev.target.classList.contains("vlak") === false) return;
        if (o0.velden.some((x) => x.id === "html" || x.id === "css") === false) return;
        clearTimeout(block.__live);
        block.__live = setTimeout(() => {
          if (window.__KUUR_OMGEVING === "node") return;
          const live = $(".live-rij", block);
          if (live && live.hasAttribute("hidden")) return;   /* niemand kijkt: niet hernummeren */
          toonLive(block, o0, veldwaarden(block));
        }, 400);
      });
      block.querySelectorAll("[data-action]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const da = btn.getAttribute("data-action");
          if (da === "wis") {
            const i2 = block.getAttribute("data-ex");
            const o2 = i2 === "vragen" ? null : t.oefeningen[Number(i2)];
            $$(".vlak", block).forEach((el) => { el.value = ""; });
            const fb = $(".feedback", block); if (fb) { fb.hidden = true; fb.className = "feedback"; fb.innerHTML = ""; }
            const c = $(".console pre", block); if (c) c.innerHTML = "";
            const d2 = $(".domspiegel", block); if (d2) d2.innerHTML = "";
            const m2 = $(".meting", block); if (m2) m2.innerHTML = "";
            const f2 = $(".voorschou", block);
            if (f2 && window.SANDBOX && window.SANDBOX.live) window.SANDBOX.live(f2, "", "", "");
            if (o2) kiesTab(block, "live");   /* terug naar het tabblad waarop je begon */
            const st = $(".stamp.inorde", block);
            if (st) { st.className = "stamp inorde"; st.textContent = (o2 ? o2.checks.length : t.vragen.length) + (o2 ? " checks" : " vragen"); }
            return;
          }
          if (block.getAttribute("data-ex") === "vragen") { controleerVragen(block, t); return; }
          const o = t.oefeningen[Number(block.getAttribute("data-ex"))];
          if (!o) return;
          if (da === "run" || da === "meet") {
            const v = veldwaarden(block);
            const res = await meetfase(block, o, v);
            toonUitvoer(block, o, v, res);
            const blokken = window.TERM.draait(v.term || "", (o.opzet && o.opzet.bestanden) || null);
            if (block.querySelector(".term-out")) toonTerminal(block, blokken);
            kiesTab(block, "meet");
            return;
          }
          btn.disabled = true;
          try { await controleer(block, t, o); } finally { btn.disabled = false; }
        });
      });
    });
  }

  function closeMobile() {
    const s = $("#sidebar"), o = $("#overlay");
    if (s) s.classList.remove("open");
    if (o) o.classList.remove("show");
  }

  function boot() {
    const mt = $("#menuToggle");
    if (mt) mt.addEventListener("click", () => {
      $("#sidebar").classList.toggle("open");
      $("#overlay").classList.toggle("show");
    });
    const ov = $("#overlay");
    if (ov) ov.addEventListener("click", closeMobile);
    $("#foot-count").textContent = T.length + " onderdelen, " + T.reduce((a, t) => a + t.oefeningen.length, 0) + " oefeningen";
    window.addEventListener("hashchange", render);
    render();
  }

  /* ---------- testhaakje voor de kist ---------- */
  window.__kuurCheck = function (topicId, index, velden, antwoorden) {
    const t = T.filter((x) => x.id === topicId)[0];
    if (!t) return ["onbekend topic"];
    if (index === "vragen") {
      const ctx = { keuzes: (antwoorden || {}).keuzes || [], teksten: (antwoorden || {}).teksten || [] };
      return vraagChecks(t).map((fn) => { try { return fn(ctx); } catch (e) { return "crash: " + e.message; } });
    }
    const o = t.oefeningen[index];
    if (!o) return ["onbekende oefening"];
    const zaad = velden.html || (o.opzet && o.opzet.html) || "";
    const stijlen = [(o.opzet && o.opzet.css) || "", velden.css || ""].filter(Boolean).join("\n");
    const res = isCss(o)
      ? window.SANDBOX.meten(zaad, stijlen)
      : window.SANDBOX.uitvoerenNode(velden.code || "", zaad, stijlen || (o.opzet && o.opzet.css) || "", { modus: o.modus || "" });
    const blokken = window.TERM.draait(velden.term || "", (o.opzet && o.opzet.bestanden) || null);
    const ctx = {
      code: velden.code || "", htmlInvoer: velden.html || "", cssInvoer: velden.css || "", termInvoer: velden.term || "",
      vermoed: velden.vermoed ? [velden.vermoed] : [],
      uit: res, term: blokken, keuzes: (antwoorden || {}).keuzes || [], teksten: (antwoorden || {}).teksten || [],
    };
    return checksVan(o, t).map((fn) => { try { return fn(ctx); } catch (e) { return "crash: " + e.message; } });
  };
  window.__kuurTopics = () => T.map((t) => ({ id: t.id, num: t.num, oefeningen: t.oefeningen.length, checks: t.oefeningen.reduce((a, o) => a + o.checks.length, 0), vragen: t.vragen.length }));

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

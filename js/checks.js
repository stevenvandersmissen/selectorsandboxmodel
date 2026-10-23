/* ============================================================
   checks.js · de toolkit van JS-BREUK
   Eén bron voor alles wat een regel nodig heeft: normaliseren,
   execute (via sandbox.js) en de terminal-simulator (via fakegit.js).
   ============================================================ */
(function () {
  const K = (window.CHECKS = {});

  K.norm = (x) => String(x == null ? "" : x).replace(/\s+/g, " ").trim();
  K.regeleks = (x) => String(x == null ? "" : x).replace(/\r/g, "").split("\n");
  K.esc = (x) => String(x).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  /* Veilige regex: een slechte regel mag de site niet laten crashen. */
  K.probeer = function (pat, vlaggen) {
    try { return new RegExp(pat, vlaggen || "i"); }
    catch (e) { return null; }
  };

  K.heeft = (tekst, re) => !!re && re.test(String(tekst == null ? "" : tekst));

  /* ---- stijlen en CSS uit de zandbak ontsluiten ---- */

  /* De meetregels per selector, als "eigenschap: waarde"-lijst. */
  /* Het rapport van de meetfase is per sleutel een raw-string; staat jouw
     selector ergens anders (bijv. .knop in plaats van #sitevoet .knop), dan meten
     we hem zelf na via dezelfde engine. Eén whereid, twee ingangen. */
  K.stijlRegels = function (r, sel) {
    const d = K.stijlObject(r, sel);
    const out = [];
    Object.keys(d || {}).forEach((k) => out.push(k + ": " + d[k]));
    return out;
  };
  K.stijlObject = function (r, sel) {
    const k = String(sel).replace(/\s+/g, " ").trim();
    const stijl = (r && r.stijl) || {};
    if (stijl[k]) { const v = stijl[k]; return Array.isArray(v) ? (v[0] || {}) : v; }
    const z = (x) => String(x).replace(/\s*([>,])\s*/g, " $1 ").replace(/\s+/g, " ").trim().toLowerCase();
    const kort = (x) => z(x).split(/[,>\s+]+/).filter(Boolean).pop() || "";
    for (const sleutel of Object.keys(stijl)) {
      if (z(sleutel) !== z(k) && kort(sleutel) !== z(k)) continue;
      const v = stijl[sleutel];
      return Array.isArray(v) ? (v[0] || {}) : v;
    }
    return null;
  };
  K.stijlKaarten = function (r, sel) {
    const d = K.stijlObject(r, sel);
    return d ? [d] : [];
  };
  K.stijlVan = function (r, sel, eig) {
    const d = K.stijlObject(r, sel);
    return d && d[eig] !== undefined ? String(d[eig]) : null;
  };
  /* Aantal regels in een CSS-tekst (commentaar en lege blokken niet meegeteld). */
  K.cssRegels = function (css) {
    if (!window.SANDBOX || !window.SANDBOX.stroken) return 0;
    try { return window.SANDBOX.stroken(css).length; } catch (e) { return 0; }
  };

  /* ---- uitvoer van de zandbak ontsluiten ---- */
  K.regelsVan = function (r) {
    return (r && r.regels ? r.regels : []).map((x) => K.norm(x));
  };

  /* Een verwachte lijn matcht een console-uitvoer als de regel exact gelijk
     is, óf als "naam: waarde" eindigt op de verwachte waarde. */
  K.lijnMatcht = function (lijn, verwacht) {
    const a = K.norm(lijn), b = K.norm(verwacht);
    if (!b) return false;
    if (a === b) return true;
    if (a.length > b.length && a.slice(-b.length) === b) {
      const vóór = a.slice(0, a.length - b.length);
      if (/[:>]$/.test(vóór.trim()) || /\s$/.test(vóór)) return true;
    }
    return false;
  };
  /* Een uitvoerverwachting is een woord: "aantal" vindt "aantal 4". */
  K.vindRegel = function (regels, verwacht) {
    const woord = String(verwacht == null ? "" : verwacht).trim();
    if (!woord) return false;
    const re = K.probeer("^(?:" + woord.replace(/\s+/g, "\\s+") + ")$|\\b" + K.esc(woord) + "\\b", "is");
    if (!re) return regels.some((l) => K.lijnMatcht(l, woord));
    return regels.some((l) => re.test(String(l)));
  };

  K.uitvoeren = function (code, html, css) {
    return window.SANDBOX.uitvoerenNode(code, html, css);
  };
  K.uitvoerenNet = function (code, html, css) {
    return window.SANDBOX.uitvoeren(code, html, 0, { css: css || "" });
  };

  K.terminal = function (invoer, bestanden) {
    return window.TERM.uitvoer(invoer, bestanden);
  };

  /* Diepe vergelijking: getallen tolerant voor 1e-9, objecten per sleutel. */
  K.gelijk = window.SANDBOX.gelijk;

  /* Slotjes: de antwoorden van de leerling op de theorievragen. */
  K.keuze = function (c, i) {
    const s = (c.keuzes || [])[i];
    return s === undefined || s === null ? null : Number(s);
  };
  K.tekst = function (c, i) {
    return String((c.teksten || [])[i] == null ? "" : (c.teksten || [])[i]);
  };

  /* Voorspelling: één voorspelde regel per console.log, in volgorde. */
  K.vermoed = function (c) {
    const ruw = (c.vermoed || []).slice();
    if (!ruw.length && c.vermoedTekst) ruw.push(c.vermoedTekst);
    return ruw
      .map((x) => String(x == null ? "" : x))
      .join("\n")
      .split("\n")
      .map((x) => K.norm(x))
      .filter((x) => x.length);
  };
})();

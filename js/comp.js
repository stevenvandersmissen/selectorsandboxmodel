/* ============================================================
   comp.js · de regeltaal van de cursus
   ----------------------------------------------------------
   In tools/curriculum.json staat élke check als één streng:

       "soortje:argumenten::boodschap"

   De boodschap staat ná de LAATSTE "::", dus zowel argumenten als de
   boodschap zelf mogen colons bevatten (en "je code crasht:" is geen
   probleem). Argumenten worden gescheiden door een pipe.
   Zonder boodschap gebruikt het soortje zijn eigen standaardtekst.

   REEKS   wat er gecontroleerd wordt
   ------  --------------------------------------------------------
   code    code:REGEX              staat dit patroon in je code?
           niet:REGEX              mag dit patroon er niet in staan?
           regels:N                minstens N niet-lege regels code
           commentaar:N            minstens N regels commentaar
   uitvoer geenFout                je code draait zonder fout
           fout:TEKST              deze foutmelding verwelkomen we wél
           uitvoer:TEKST           ergens staat deze uitvoer (of eindigt een regel op "…: TEKST")
           uitvoerNiet:TEKST       deze uitvoer mag er niet tussen staan
           telling:N               minstens N regels console.log
           geeft:JSON              wat jij geeft is dit (reeks: in deze volgorde)
           geeftStrikt:JSON        idem, maar ook exact even lang en in dezelfde volgorde
           geeftBevat:JSON         wat jij geeft bevat dit (diepe vergelijking)
           roep:NAAM|N             deze functie staat minstens N keer als aanroep in je code
           roepNiet:NAAM           deze functie mag je niet gebruiken
           codeZonder:RE           idem, maar commentaar telt níét mee
           nietZonder:RE           idem, maar commentaar telt níét mee
           htmlBevat:REGEX         in het nagebouwde document staat dit
   terminal term:REGEX             één van je commando's matcht dit patroon
           termNiet:REGEX          dit commando mag je niet gebruiken
           termUitvoer:REGEX       in de uitvoer van de simulator staat dit
           termAantal:REGEX|N      dit commando staat minstens N keer in je log
   vragen  mv:I                    vraag I: het juiste antwoord gekozen
           op:I|MIN                vraag I: minstens MIN steekwoorden uit de lijst
   stijl     css:REGEX             staat dit patroon in je stijlvak?
           stijl:SEL|EIG|WAARDE    na de cascade wint voor selector SEL deze waarde
          cssRegels:N              minstens N regels in je stijlvak
   voorspelling vw:N               je vermoedt N console-logregels; bij uitvoeren
                                   moeten exact die N regels uit de console komen
           vw:N|selector           idem, maar vergeleken met de gemeten stijlen van
                                   die selector ("display: flex", "margin: 0 auto", …)
   ------  --------------------------------------------------------
   Alles wat met code, uitvoer, terminal of html te maken heeft, faalt
   op een leeg vak: "leeg" is nooit "in orde".
   ============================================================ */
window.CHECKS.comp = function (spec, opties) {
  if (typeof spec === "string") spec = { checks: [spec] };
  const K = window.CHECKS;
  const opt = opties || {};
  const vragen = opt.vragen || [];

  function bouw(op, idx) {
    const s = String(op);
    const sn = s.lastIndexOf("::");
    const arg = sn === -1 ? s : s.slice(0, sn);
    const msg = sn === -1 ? "" : K.norm(s.slice(sn + 2));
    const k0 = arg.indexOf(":");
    const naam = k0 === -1 ? arg : arg.slice(0, k0);
    const body = k0 === -1 ? "" : arg.slice(k0 + 1);
    const pijpen = body.split("|");
    const zeggen = (standaard) => msg || standaard;
    const leeg = (c) => (K.norm(c.code) || K.norm(c.htmlInvoer) || K.norm(c.cssInvoer)
      ? null : "Er staat nog niets in je vakken: typ eerst je code en je stijlen.");

    switch (naam) {
      case "code": {
        const re = K.probeer(body, "sm");
        return (c) => {
          const ledig = leeg(c); if (ledig) return zeggen(ledig);
          if (!re) return "De opdracht is hier nog niet duidelijk (onleesbaar patroon).";
          return re.test(String(c.code)) ? true : zeggen("Dat staat nog niet in je code.");
        };
      }
      case "niet": {
        const re = K.probeer(body, "sm");
        return (c) => {
          const ledig = leeg(c); if (ledig) return zeggen(ledig);
          if (!re) return "De opdracht is hier nog niet duidelijk (onleesbaar patroon).";
          const alles = [c.code, c.cssInvoer, c.htmlInvoer].filter(Boolean).join("\n");
          return re.test(alles) ? zeggen("Dat moet er net níét in staan.") : true;
        };
      }
      case "regels": {
        const n = parseInt(pijpen[0], 10) || 1;
        return (c) => (K.regeleks(c.code).filter((x) => x.trim()).length >= n ? true : zeggen("Er staan nog te weinig regels in je vak."));
      }
      case "commentaar": {
        const n = parseInt(pijpen[0], 10) || 1;
        return (c) => {
          const ledig = leeg(c); if (ledig) return zeggen(ledig);
          const g = String(c.code).match(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g) || [];
          return g.length >= n ? true : zeggen("Schrijf je plan in commentaar: minstens " + n + " regel(s).");
        };
      }
      case "geenFout":
        return (c) => {
          const ledig = leeg(c); if (ledig) return zeggen(ledig);
          const r = c.uit;
          if (!r) return "Er is nog niets uitgevoerd.";
          return r.ok ? true : zeggen("Je code crasht: " + r.fout);
        };
      case "fout":
        return (c) => {
          const ledig = leeg(c); if (ledig) return zeggen(ledig);
          const r = c.uit;
          if (!r) return "Er is nog niets uitgevoerd.";
          if (!r.fout) return zeggen("Deze oefening hoort een fout op te leveren — je code loopt proper.");
          return K.norm(r.fout).toLowerCase().indexOf(K.norm(body).toLowerCase()) !== -1 ? true : zeggen("De fout is er, maar niet de verwachte: " + body);
        };
      case "uitvoer": {
        const r = K.probeer("^(" + body.replace(/\s+/g, "\\s+") + ")$|\\b" + K.esc(body) + "\\b", "is");
        return (c) => {
          const l = leeg(c); if (l) return zeggen(l);
          const res = c.uit;
          if (!res) return zeggen("Voer eerst uit: zonder meetrapport kan ik niets vergelijken.");
          if (res.fout) return zeggen("Je code of CSS loopt vast: " + res.fout);
          if (!res.regels.length) return zeggen("Je code print nog niets in de console.");
          return K.vindRegel(res.regels, body) ? true : zeggen("Die uitvoer ontbreekt: " + body);
        };
      }
      case "uitvoerNiet":
        return (c) => {
          const l = leeg(c); if (l) return zeggen(l);
          const res = c.uit;
          if (!res) return zeggen("Voer eerst uit: zonder meetrapport kan ik niets vergelijken.");
          if (res.fout) return zeggen("Je code of CSS loopt vast: " + res.fout);
          return (res.regels || []).some((x) => K.lijnMatcht(x, body)) ? zeggen("Haal die uitvoer weg: " + body) : true;
        };
      case "telling": {
        const n = parseInt(pijpen[0], 10) || 1;
        return (c) => {
          const l = leeg(c); if (l) return zeggen(l);
          const res = c.uit;
          if (!res) return zeggen("Voer eerst uit: zonder meetrapport kan ik niets vergelijken.");
          if (res.fout) return zeggen("Je code of CSS loopt vast: " + res.fout);
          return res.log.length >= n ? true : zeggen("Er staan " + res.log.length + " regels in de console; ik wil er minstens " + n + " zien.");
        };
      }
      case "geeft":
      case "geeftStrikt":
      case "geeftBevat": {
        let wenst;
        try { wenst = JSON.parse(body); } catch (e) { wenst = body; }
        const strict = naam !== "geeftBevat";
        return (c) => {
          const l = leeg(c); if (l) return zeggen(l);
          const res = c.uit;
          if (!res) return zeggen("Voer eerst uit: zonder meetrapport kan ik niets vergelijken.");
          if (res.fout) return zeggen("Je code of CSS loopt vast: " + res.fout);
          if (res.fout) return zeggen("Je code crasht: " + res.fout);
          if (!res.heeft) return zeggen("Roep geef(...) aan met het resultaat, dan kan ik het lezen.");
          if (strict) {
            if (Array.isArray(wenst) && Array.isArray(res.geeft)) {
              if (naam === "geeftStrikt") {
                return wenst.length === res.geeft.length && wenst.every((x, j) => K.gelijk(x, res.geeft[j]))
                  ? true : zeggen("geef(...) moet precies " + JSON.stringify(wenst) + " zijn, in deze volgorde.");
              }
              return wenst.every((x) => res.geeft.some((y) => K.gelijk(x, y))) && res.geeft.length >= wenst.length
                ? true : zeggen("geef(...) bevat niet precies: " + JSON.stringify(wenst));
            }
            return K.gelijk(res.geeft, wenst) ? true : zeggen("geef(...) moet " + JSON.stringify(wenst) + " zijn.");
          }
          if (Array.isArray(wenst)) return wenst.every((x) => res.geeft.some((y) => K.gelijk(x, y))) ? true : zeggen("In geef(...) ontbreekt: " + JSON.stringify(wenst));
          if (Array.isArray(res.geeft)) return res.geeft.some((y) => K.gelijk(y, wenst)) ? true : zeggen("In geef(...) ontbreekt " + JSON.stringify(wenst));
          return K.gelijk(res.geeft, wenst) ? true : zeggen("geef(...) moet " + JSON.stringify(wenst) + " zijn.");
        };
      }
      case "roep":
      case "roepNiet": {
        /* tellen op de bladzijde, niet op de vloer: een functie die pas ná de
           aanroep gedeclareerd wordt, kon een runtime-teller ontduiken */
        const n = K.norm(pijpen[0]);
        const wil = naam === "roep";
        const min = pijpen[1] ? parseInt(pijpen[1], 10) : 1;
        const re = new RegExp("(?<![A-Za-z0-9_$.])" + n + "\\s*\\(", "g");
        return (c) => {
          const l = leeg(c); if (l) return zeggen(l);
          const code = String(c.code);
          let keer = 0, m;
          while ((m = re.exec(code))) {
            const voor = code.slice(Math.max(0, m.index - 14), m.index);
            if (/\bfunction\s*$/.test(voor) || /\b(const|let|var)\s*$/.test(voor)) continue;
            keer += 1;
          }
          if (wil) return keer >= min ? true : zeggen("Roep " + n + " ook effectief aan (minstens " + min + " keer).");
          return keer ? zeggen("Gebruik " + n + " hier niet.") : true;
        };
      }
      case "codeZonder":
      case "nietZonder": {
        /* dezelfde twee, maar commentaar telt niet mee: "geen reduce" is dan
           ook géén reduce in een commentaar */
        const re = K.probeer(pijpen.join("|"), "sm");
        const wil = naam === "codeZonder";
        return (c) => {
          const l = leeg(c); if (l) return zeggen(l);
          const code = String(c.code).replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, " ");
          if (!re) return "De opdracht is hier nog niet duidelijk (onleesbaar patroon).";
          const raak = re.test(code);
          if (wil) return raak ? true : zeggen("Dat staat nog niet in je code (buiten commentaar).");
          return raak ? zeggen("Dat moet er net níét in staan — ook niet als commentaar.") : true;
        };
      }
      case "css": {
        const re = K.probeer(body, "sm");
        return (c) => {
          if (!K.norm(c.cssInvoer)) return zeggen("Typ eerst je CSS in het stijlvak.");
          if (!re) return "De opdracht is hier nog niet duidelijk (onleesbaar patroon).";
          return re.test(String(c.cssInvoer)) ? true : zeggen("Die regel staat nog niet in je stijlvak.");
        };
      }
      case "cssRegels": {
        const n = parseInt(pijpen[0], 10) || 1;
        return (c) => {
          if (!K.norm(c.cssInvoer)) return zeggen("Typ eerst je CSS in het stijlvak.");
          const got = K.cssRegels(c.cssInvoer);
          return got >= n ? true : zeggen("Er staan " + got + " regels in je stijlvak; ik wil er minstens " + n + " zien.");
        };
      }
      case "stijl": {
        /* wat er ná de cascade werkelijk staat, niet wat jij typte */
        const sel = K.norm(pijpen[0]);
        const eig = String(pijpen[1] || "").trim().toLowerCase();
        const wil = pijpen.slice(2).join("|");
        return (c) => {
          if (!K.norm(c.code) && !K.norm(c.cssInvoer)) return zeggen("Er staat nog niets in je vakken.");
          if (!K.norm(c.cssInvoer)) return zeggen("Het stijlvak is nog leeg: de meetfase heeft niets om toe te passen.");
          const res = c.uit;
          if (!res) return zeggen("Voer eerst uit: zonder meetrapport kan ik niets vergelijken.");
          if (res.fout) return zeggen("Je code of CSS loopt vast: " + res.fout);
          const echt = K.stijlVan(res, sel, eig);
          if (echt === null) return zeggen("Ik kan " + sel + " niet meten — voer uit en klik dan Controleer.");
          if (!wil) return true;
          const kn = (x) => String(x).replace(/\s+/g, " ").trim().toLowerCase();
          return kn(echt) === kn(wil) ? true : zeggen(sel + " is " + eig + ": " + echt + " — jij mikte op " + wil + ".");
        };
      }
      case "htmlBevat": {
        const re = K.probeer(body, "s");
        return (c) => {
          const l = leeg(c); if (l) return zeggen(l);
          const res = c.uit;
          if (!res) return zeggen("Voer eerst uit: zonder meetrapport kan ik niets vergelijken.");
          if (res.fout) return zeggen("Je code of CSS loopt vast: " + res.fout);
          if (!re) return "De opdracht is hier nog niet duidelijk (onleesbaar patroon).";
          const kno = Object.keys(res.dom || {}).map((k) => {
            const n = res.dom[k] || {};
            return k + " " + K.norm(n.textContent) + " " + JSON.stringify(n.atributen || {}) + " " + (n.classes || []).join(" ");
          }).join("\n");
          return re.test(kno) ? true : zeggen("In het document op je pagina staat dat nog niet.");
        };
      }
      case "term":
      case "termNiet":
      case "termAantal":
      case "termUitvoer": {
        const wil = naam !== "termNiet";
        const re = K.probeer(naam === "termAantal" ? pijpen[0] : body, "s");
        const min = naam === "termAantal" ? (parseInt(pijpen[1], 10) || 1) : 1;
        return (c) => {
          if (!K.norm(c.termInvoer)) return zeggen("Typ je commando's in het terminalvak.");
          if (!re) return "De opdracht is hier nog niet duidelijk (onleesbaar patroon).";
          const blokken = c.term || [];
          if (naam === "termUitvoer") {
            const regels = TERMregels(blokken);
            return regels.some((l) => re.test(l)) ? true : zeggen("Die uitvoer zag ik niet in de terminal.");
          }
          const hits = blokken.filter((b) => re.test(b.cmd));
          if (naam === "termAantal") return hits.length >= min ? true : zeggen("Dat commando staat er " + hits.length + " keer; minstens " + min + " verwacht.");
          if (wil) return hits.length ? true : zeggen("Dat commando ontbreekt in je terminal.");
          return hits.length ? zeggen("Dat commando moet je hier niet gebruiken.") : true;
        };
      }
      case "vw": {
        /* eerst vermoeden, dan pas uitvoeren: wie niet kijkt, raakt mis */
        const N = parseInt(pijpen[0], 10) || 0;
        const meet = pijpen[1] ? K.norm(pijpen[1]) : "";
        if (meet) {
          return (c) => {
            if (!K.norm(c.cssInvoer)) return zeggen("Typ eerst je CSS: zonder stijlen is er niets te meten.");
            const geraad = K.vermoed(c);
            if (!geraad.length) return zeggen("Vermoed eerst wat de meting zal zeggen: dat vak is nog leeg.");
            if (N && geraad.length !== N) return zeggen("Je vermoedt " + geraad.length + " meting(en); deze opdracht telt er " + N + ".");
            const res = c.uit;
            if (!res) return "Voer uit: de checker vergelijkt je vermoeden met de gemeten stijlen.";
            const echt = K.stijlRegels(res, meet);
            if (!echt.length) return zeggen("Voor " + meet + " meet ik niets — staat die selector wel in je stijlvak?");
            if (echt.length !== geraad.length) return zeggen("Ik meet " + echt.length + " eigenschap(pen) voor " + meet + ", jij vermoedde er " + geraad.length + ": " + echt.join(", ") + ".");
            const mis = [];
            echt.forEach((x, i) => { if (!K.lijnMatcht(x, geraad[i])) mis.push("regel " + (i + 1) + ": jij " + geraad[i] + " — gemeten " + x); });
            if (mis.length) return zeggen("Je vermoeden klopt niet — " + mis.join("; ") + ".");
            return true;
          };
        }
        return (c) => {
          if (!K.norm(c.code)) return zeggen("Typ eerst je code, dan vermag je wat er uitkomt.");
          const geraad = K.vermoed(c);
          if (!geraad.length) return zeggen("Vermoed eerst wat de console gaat printen: dat vak is nog leeg.");
          if (N && geraad.length !== N) return zeggen("Je vermoedt " + geraad.length + " regel(s); deze opdracht telt er " + N + ".");
          const res = c.uit;
          if (!res) return "Voer je code uit: de checker vergelijkt je vermoeden met de echte uitvoer.";
          const echt = K.regelsVan(res);
          if (!echt.length) return zeggen("De console print niets — met een ledige uitvoer kan ik je vermoeden niet vergelijken.");
          if (echt.length !== geraad.length) {
            return zeggen("Er kwamen " + echt.length + " regels uit de console, jij vermoedde er " + geraad.length + ": " +
              echt.map((x, i) => (geraad[i] === x ? null : "regel " + (i + 1) + " werd \"" + x + "\"")).filter(Boolean).join(", "));
          }
          const mis = [];
          echt.forEach((x, i) => { if (!K.lijnMatcht(x, geraad[i])) mis.push("regel " + (i + 1) + ": jij " + geraad[i] + " → echt " + x); });
          if (mis.length) return zeggen("Je vermoeden klopt niet overal — " + mis.join("; ") + ". Typ wat er wél stond niet over, maar denk na over wat er misliep.");
          return true;
        };
      }
      case "mv": {
        const i = parseInt(pijpen[0], 10);
        const goed = pijpen.length > 1 ? parseInt(pijpen[1], 10) : (vragen[i] && typeof vragen[i].goed === "number" ? vragen[i].goed : 0);
        return (c) => {
          const gek = K.keuze(c, i);
          if (gek === null || Number.isNaN(gek)) return zeggen("Beantwoord deze vraag: er is nog niets aangevinkt.");
          return gek === goed ? true : zeggen("Dat is niet het juiste antwoord — lees de theorie nog eens.");
        };
      }
      case "op": {
        const i = parseInt(pijpen[0], 10);
        const min = pijpen.length > 1 ? parseInt(pijpen[1], 10) : ((vragen[i] && vragen[i].minKeywords) || 3);
        return (c) => {
          const tekst = K.tekst(c, i);
          if (!tekst.trim()) return zeggen("Schrijf je antwoord neer: dit vak is nog leeg.");
          const lijst = (vragen[i] && vragen[i].keywords) || [];
          const klein = tekst.toLowerCase();
          const raak = lijst.filter((w) => klein.indexOf(String(w).toLowerCase()) !== -1).length;
          if (raak >= min) return true;
          return zeggen("Je antwoord bevat " + raak + " van de " + min + " vaste begrippen die ik zoek.");
        };
      }
      default:
        return () => "De opdracht is hier nog niet duidelijk (onbekend soortje: " + naam + ").";
    }
  }

  function TERMregels(blokken) {
    const out = [];
    (blokken || []).forEach((b) => (b.uit || []).forEach((l) => out.push(String(l))));
    return out;
  }

  return (spec.checks || []).map((c, i) => bouw(c, i));
};

/* Welke regels vragen om uitvoer of een terminal? De bouwparser gebruikt
   dit om te beslissen of de zandbak en de simulator moeten draaien. */
window.CHECKS.behoeftes = function (checks) {
  const nodig = { code: false, css: false, terminal: false, vraag: false };
  (checks || []).forEach((s) => {
    const arg = String(s).split("::")[0];
    const naam = arg.indexOf(":") === -1 ? arg : arg.slice(0, arg.indexOf(":"));
    if (/^(geenFout|fout|uitvoer|uitvoerNiet|telling|geeft|geeftBevat|roep|roepNiet|htmlBevat|stijl)$/.test(naam)) nodig.code = true;
    if (/^(css|cssRegels|stijl)$/.test(naam)) nodig.css = true;
    if (naam === "vw" && String(s).split("::")[0].indexOf("|") !== -1) { nodig.css = true; nodig.code = true; }
    if (/^term/.test(naam)) nodig.terminal = true;
    if (/^(mv|op)$/.test(naam)) nodig.vraag = true;
    if (/^(code|niet|regels|commentaar)$/.test(naam)) nodig.code = nodig.code || false;
  });
  return nodig;
};

/* Lijst van gekende soortjes — de molen gebruikt dit om een typfout in de
   curriculum te vangen voordat de site eromvalt. */
window.CHECKS.soortjes = ["code", "niet", "regels", "commentaar", "geenFout", "fout", "uitvoer", "uitvoerNiet", "vw",
  "telling", "geeft", "geeftStrikt", "geeftBevat", "roep", "roepNiet", "codeZonder", "nietZonder", "htmlBevat",
  "css", "cssRegels", "stijl", "term", "termNiet", "termAantal", "termUitvoer", "mv", "op"];

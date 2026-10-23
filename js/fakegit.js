/* ============================================================
   fakegit.js · een terminal die geen terminal is
   ----------------------------------------------------------
   De leerling typt commando's zoals in een echte console; deze
   simulator houdt een map, een git-status en een commitlijst bij.
   Bewust klein: wat er wél kan, is precies wat de oefening vraagt.

   Commando's:
     ls  cat <bestand>  echo <tekst> > <bestand>  touch <bestand>
     rm <bestand>  mkdir <map>  cd <map>  pwd  clear  help
     git init | status | add <best…> | commit -m "boodschap" | log
     git diff | diff --staged | branch [naam] | checkout -b <naam> |
     checkout <naam> | remote -v | remote add <naam> <url> | push <naam> <tak>
     node <bestand.js>   → jouw javascript draait in de zandbak
   ============================================================ */
(function () {
  const TERM = (window.TERM = {});
  const Prompt = "$ ";

  function nieuw(bestanden) {
    const st = {
      pad: "/",
      bestanden: Object.assign({ "index.html": "<!DOCTYPE html>\n<html lang=\"nl\">\n<body>\n  <h1>Lightnotes</h1>\n  <script src=\"app.js\"><\/script>\n</body>\n</html>", "app.js": "console.log(\"start\");\n", "lees.txt": "Dit is een oefening. Typ `ls` om te zien wat er staat.\n" }, bestanden || {}),
      git: false, index: [], tak: "main", branches: {}, commits: [], teller: 0,
    };
    st.branches.main = [];
    return st;
  }

  function split(lijn) {
    const out = [];
    const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
    let m;
    while ((m = re.exec(lijn))) out.push(m[1] !== undefined ? m[1] : m[2] !== undefined ? m[2] : m[3]);
    return out;
  }
  function pad(st, p) {
    if (!p) return st.pad;
    if (p[0] === "/") return p.replace(/\/+$/, "") || "/";
    if (p === ".") return st.pad;
    if (p === "..") { const stuk = st.pad.split("/").filter(Boolean); stuk.pop(); return "/" + stuk.join("/"); }
    const stuk = st.pad.split("/").filter(Boolean);
    return "/" + stuk.concat(p.replace(/\/+$/, "")).join("/");
  }
  function find(st, naam) {
    if (!naam) return null;
    const k = Object.keys(st.bestanden).filter((p) => p === naam || p.split("/").pop() === naam);
    return k.length ? k.sort((a, b) => a.length - b.length)[0] : null;
  }
  function toonPad(st) { return st.pad === "/" ? "~" : "~" + st.pad; }
  function lijinvoeg(s) { return s.replace(/\n+$/, "").split("\n"); }

  function gitStatus(st) {
    const out = [];
    if (!st.git) return ["fatal: not a git repository (or any of the parent directories): .git", "", "Tip: `git init` maakt er een repository van."];
    out.push("On branch " + st.tak);
    if (!st.commits.length && !st.index.length) { out.push(""); out.push("No commits yet"); }
    st.open = function () { return Object.keys(st.bestanden).filter((p) => st.index.indexOf(p) === -1 && !heeftVersie(st, p)); };
    const nieuwWerk = st.open();
    if (st.index.length) {
      out.push("");
      out.push("Changes to be committed:");
      st.index.forEach((p) => out.push("        new file:   " + p));
    }
    if (nieuwWerk.length) {
      out.push("");
      out.push("Untracked files:");
      nieuwWerk.forEach((p) => out.push("        " + p));
    }
    if (!st.index.length && !st.open().length) out.push("", "nothing to commit, working tree clean");
    return out;
  }
  function heeftVersie(st, p) {
    return st.commits.some((c) => c.bestanden.indexOf(p) !== -1);
  }

  function uitvoer(invoer, bestanden) {
    const st = nieuw(bestanden);
    return draait(invoer, st);
  }
  TERM.nieuw = nieuw;

  function draait(invoer, st) {
    const regels = String(invoer == null ? "" : invoer).replace(/\r/g, "").split("\n");
    const blokken = [];
    for (const ruw of regels) {
      let lijn = ruw.trim();
      if (!lijn) continue;
      if (/^\$\s/.test(lijn)) lijn = lijn.replace(/^\$\s+/, "");
      if (/^>\s/.test(lijn)) continue;
      if (lijn === "clear" || lijn === "cls") { blokken.length = 0; continue; }
      const stuk = split(lijn);
      const cmd = stuk[0];
      const rest = stuk.slice(1);
      let uit;
      try { uit = regel(cmd, rest, lijn, st); }
      catch (e) { uit = ["fatal (simulator): " + e.message]; }
      blokken.push({ cmd: lijn, uit: uit });
    }
    return blokken;
  }
  TERM.uitvoer = uitvoer;
  TERM.draait = draait;

  function regel(cmd, rest, lijn, st) {
    if (cmd === "help") {
      return ["Beschikbaar: ls, cat, echo X > bestand, touch, rm, mkdir, cd, pwd, clear,",
        "git init/add/status/commit/log/diff/branch/checkout/remote/push, node bestand.js."];
    }
    if (cmd === "pwd") return [toonPad(st)];
    if (cmd === "ls") {
      if (rest[0] === "-a" || rest[0] === "-la") rest = rest.slice(1);
      const namen = Object.keys(st.bestanden).filter((p) => { const d = pad(st, p).split("/").filter(Boolean); return d.length === 1; }).map((p) => p.split("/").pop());
      if (st.git) namen.unshift(".git");
      if (!namen.length) return [];
      return [namen.sort().join("   ")];
    }
    if (cmd === "cd") { st.pad = pad(st, rest[0] || "/"); return []; }
    if (cmd === "cat") {
      const k = find(st, rest[0]);
      if (!k) return ["cat: " + (rest[0] || "") + ": No such file or directory"];
      return lijinvoeg(st.bestanden[k]).map((x) => x);
    }
    if (cmd === "touch") {
      if (!rest[0]) return ["touch: bestandsnaam ontbreekt"];
      const k = pad(st, rest[0]).slice(1);
      if (!st.bestanden[k]) st.bestanden[k] = "";
      return [];
    }
    if (cmd === "mkdir") { return []; }
    if (cmd === "rm") {
      const k = find(st, rest[0]);
      if (!k) return ["rm: " + (rest[0] || "") + ": No such file or directory"];
      delete st.bestanden[k];
      st.index = st.index.filter((x) => x !== k);
      return [];
    }
    if (cmd === "echo") {
      const i = rest.indexOf(">");
      if (i === -1) return [rest.join(" ")];
      const tekst = rest.slice(0, i).join(" ");
      const k = rest.slice(i + 1).join("").trim();
      if (!k) return ["sh: syntax error nabij `>'"];
      const vol = pad(st, k).slice(1);
      st.bestanden[vol] = (st.bestanden[vol] || "") + tekst + "\n";
      return [];
    }
    if (cmd === "node") {
      const k = find(st, rest[0]);
      if (!k) return ["node: cannot find module '" + (rest[0] || "") + "'"];
      if (!window.SANDBOX) return ["node: geen zandbak beschikbaar in deze omgeving"];
      const r = window.SANDBOX.uitvoerenNode(st.bestanden[k], "");
      const out = r.regels ? r.regels.slice() : r.log.map((l) => l.tekst);
      if (r.fout) out.push(r.fout);
      return out.length ? out : ["(geen uitvoer)"];
    }
    if (cmd === "git") return git(rest, st);
    return ["command not found: " + cmd + " — typ `help` voor wat hier wél kan."];
  }

  function git(rest, st) {
    const sub = rest[0];
    const args = rest.slice(1);
    if (!sub) return ["usage: git <command>   (init, status, add, commit, log, diff, branch, checkout, remote, push)"];
    if (sub === "init") {
      if (st.git) return ["Reinitialized existing Git repository in " + toonPad(st) + "/.git/"];
      st.git = true;
      return ["Initialized empty Git repository in " + toonPad(st) + "/.git/"];
    }
    if (!st.git) return ["fatal: not a git repository (or any of the parent directories): .git", "", "Tip: `git init` maakt er een repository van."];
    if (sub === "status") return gitStatus(st);
    if (sub === "add") {
      if (!args.length) return ["Nothing specified, nothing added.", "Maybe you wanted to say 'git add .'?"];
      const patronen = args.filter((a) => a[0] !== "-");
      let n = 0;
      Object.keys(st.bestanden).forEach((p) => {
        const basis = p.split("/").pop();
        const raak = patronen.some((pat) => {
          if (pat === "." || pat === "-A" || pat === "--all") return true;
          if (pat.indexOf("*") !== -1) { const re = new RegExp("^" + pat.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$"); return re.test(basis) || re.test(p); }
          return pat === p || pat === basis;
        });
        if (raak && st.index.indexOf(p) === -1) { st.index.push(p); n += 1; }
      });
      if (!n) return ["fatal: pathspec '" + (patronen[0] || "") + "' did not match any files"];
      st.index.sort();
      return [];
    }
    if (sub === "commit") {
      const i = args.indexOf("-m");
      const boodschap = i !== -1 ? args.slice(i + 1).join(" ").trim() : "";
      if (i === -1) return ["Aborting commit due to empty commit message.", "Gebruik: git commit -m \"korte boodschap\""];
      if (!boodschap) return ["Aborting commit due to empty commit message."];
      if (!st.index.length) return ["no changes added to commit", "git status zegt wat er wél vrij is."];
      st.teller += 1;
      const hash = hashVan(st.teller);
      const commit = { hash: hash, boodschap: boodschap, tak: st.tak, bestanden: st.index.slice(), tijd: "nu zojuist" };
      st.commits.push(commit);
      st.branches[st.tak].push(hash);
      st.index = [];
      return ["[" + st.tak + " " + hash.slice(0, 7) + "] " + boodschap, " " + commit.bestanden.length + " file" + (commit.bestanden.length === 1 ? "" : "s") + " changed"];
    }
    if (sub === "log") {
      if (!st.commits.length) return ["fatal: your current branch '" + st.tak + "' does not have any commits yet"];
      const out = [];
      st.commits.slice().reverse().forEach((c) => {
        out.push("commit " + c.hash);
        out.push("Author: klas <klas@school.local>");
        out.push("Date:   " + c.tijd);
        out.push("");
        out.push("    " + c.boodschap);
        out.push("");
      });
      return out;
    }
    if (sub === "diff") {
      const gestaged = args.indexOf("--staged") !== -1 || args.indexOf("--cached") !== -1;
      const bron = gestaged ? st.index.map((p) => ["(nieuw) " + p, st.bestanden[p]]) : Object.keys(st.bestanden).map((p) => [p, st.bestanden[p]]);
      if (!bron.length) return ["(geen wijzigingen om te tonen)"];
      const uit = [];
      bron.slice(0, 3).forEach(([p, tekst]) => {
        uit.push("diff --git a/" + p + " b/" + p);
        uit.push("--- /dev/null");
        uit.push("+++ b/" + p);
        lijinvoeg(tekst).slice(0, 6).forEach((l) => uit.push("+" + l));
      });
      if (bron.length > 3) uit.push("… nog " + (bron.length - 3) + " bestand(en)");
      return uit;
    }
    if (sub === "branch") {
      const naam = args[0];
      if (!naam) return Object.keys(st.branches).map((b) => (b === st.tak ? "* " + b : "  " + b));
      if (st.branches[naam]) return ["fatal: a branch named '" + naam + "' already exists"];
      st.branches[naam] = [];
      return ["made branch " + naam];
    }
    if (sub === "checkout" || sub === "switch") {
      const i = args.indexOf("-b");
      if (i !== -1 && args[i + 1]) { const n = args[i + 1]; if (!st.branches[n]) st.branches[n] = []; st.tak = n; return ["Switched to a new branch '" + n + "'"]; }
      const n = args[0];
      if (!n) return ["You have to specify which branch you want to switch to."];
      if (!st.branches[n]) return ["error: pathspec '" + n + "' did not match any branch known to git"];
      st.tak = n;
      return ["Switched to branch '" + n + "'"];
    }
    if (sub === "remote") {
      if (args[0] === "add") { st.remote = args[1]; st.remoteUrl = args[2]; return []; }
      if (!st.remote) return [];
      return [st.remote + "\t" + st.remoteUrl + " (fetch)", st.remote + "\t" + st.remoteUrl + " (push)"];
    }
    if (sub === "push") {
      if (!st.remote) return ["fatal: No configured push destination.", "Voeg er een toe: git remote add origin <url>"];
      if (!st.commits.length) return ["Everything up-to-date (geen commits, dus niets te sturen)"];
      return ["To " + st.remoteUrl, "   " + (st.commits[st.commits.length - 1] ? st.commits[st.commits.length - 1].hash.slice(0, 7) + ".." + st.commits[st.commits.length - 1].hash.slice(0, 7) + "  " + st.tak + " -> " + st.tak : "")];
    }
    return ["git: '" + sub + "' is not a git command. See 'git --help' (or: help)."];
  }

  function hashVan(n) {
    let h = 2166136261 ^ n;
    for (let i = 0; i < 40; i++) { h = (h * 16777619 + i * 2654435761) >>> 0; }
    let s = "";
    let x = h;
    while (s.length < 40) { x = (x * 1103515245 + 12345) >>> 0; s += (x % 16).toString(16); }
    return s.slice(0, 40);
  }

  /* ---- voor de testkist: één blok uitvoer als platte tekst ---- */
  TERM.plat = function (blokken) {
    return (blokken || []).map((b) => b.cmd + "\n" + (b.uit || []).join("\n")).join("\n");
  };
  TERM.regelsVan = function (blokken) {
    const out = [];
    (blokken || []).forEach((b) => { out.push(b.cmd); (b.uit || []).forEach((l) => out.push(l)); });
    return out;
  };
  TERM.laatste = function (blokken, cmdRe) {
    const hit = (blokken || []).filter((b) => cmdRe.test(b.cmd));
    return hit.length ? hit[hit.length - 1] : null;
  };
})();

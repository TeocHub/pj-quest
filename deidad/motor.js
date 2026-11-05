/* =====================================================================
   Test "¿De qué dios serías hijo o hija?" — cálculo del resultado.
   Lo usan la página y las simulaciones, para que las reglas sean las mismas.

   1. Cada rasgo = promedio de sus afirmaciones (0 a 1, invertidas al revés),
      más un pequeño extra por cada par elegido.
   2. Afinidad con una deidad = correlación entre tu perfil de rasgos y el
      perfil de la deidad. Se compara la FORMA del perfil, no el nivel: así
      no importa si alguien responde todo alto o todo bajo.
   3. Progenitor = la deidad griega o romana con más afinidad. Griego y
      romano del mismo dios comparten casi todo el perfil: el rasgo Deber
      decide el aspecto. Lo egipcio (senda) se calcula aparte, sin Deber.
   4. Desempate: si las dos primeras quedan a menos de TIE_GAP, se hacen
      preguntas extra de los rasgos donde esas dos deidades más difieren.
   ===================================================================== */
window.DEI_ENGINE = (function(){
  const Q = window.DEI_Q, D = window.DEI;
  const { items: ITEMS, tie: TIE } = Q.build();
  const FACETS = Object.keys(Q.FACETS);
  const F_NO_RO = FACETS.filter(f => f !== "RO");
  const TIE_GAP = 0.08;      // diferencia de afinidad bajo la cual se desempata
  const TIE_FACETS = 3;      // rasgos que se repreguntan en el desempate
  const byId = {};
  ITEMS.forEach(it => byId[it.id] = it);
  Object.values(TIE).forEach(arr => arr.forEach(it => byId[it.id] = it));

  function corr(a, b){
    const n = a.length; let ma = 0, mb = 0;
    for (let i = 0; i < n; i++){ ma += a[i]; mb += b[i]; }
    ma /= n; mb /= n;
    let num = 0, da = 0, db = 0;
    for (let i = 0; i < n; i++){ const x = a[i] - ma, y = b[i] - mb; num += x * y; da += x * x; db += y * y; }
    return da && db ? num / Math.sqrt(da * db) : 0;
  }

  /* answers: { id: 1..5 | "a" | "b" } */
  function facets(answers){
    const sum = {}, cnt = {}, vals = {};
    Object.keys(answers).forEach(id => {
      const it = byId[id], v = answers[id];
      if (!it || it.t !== "l" || typeof v !== "number") return;
      let x = (v - 1) / 4; if (it.inv) x = 1 - x;
      sum[it.f] = (sum[it.f] || 0) + x; cnt[it.f] = (cnt[it.f] || 0) + 1;
      (vals[it.f] = vals[it.f] || []).push(x);
    });
    const fv = {};
    FACETS.forEach(f => fv[f] = cnt[f] ? sum[f] / cnt[f] : 0.5);
    ITEMS.forEach(it => {
      if (it.t !== "p") return;
      const v = answers[it.id]; if (v !== "a" && v !== "b") return;
      const f = it[v].f; fv[f] = Math.min(1, fv[f] + Q.PAIR_BONUS);
    });
    // coherencia: qué tan parecidas son las respuestas dentro de cada rasgo
    let dev = 0, n = 0;
    Object.values(vals).forEach(xs => { if (xs.length < 2) return; const m = xs.reduce((s, x) => s + x, 0) / xs.length; xs.forEach(x => { dev += Math.abs(x - m); n++; }); });
    const coherence = n ? Math.max(0, Math.min(1, 1 - (dev / n) / 0.42)) : 1;
    return { fv, coherence };
  }

  function rank(fv, pans){
    const out = [];
    Object.entries(D.GODS).forEach(([id, g]) => {
      if (!pans.includes(g.pan)) return;
      const fs = g.pan === "e" ? F_NO_RO : FACETS;
      out.push({ id, r: corr(fs.map(f => fv[f]), fs.map(f => g.p[f] || 0)) });
    });
    return out.sort((a, b) => b.r - a.r);
  }

  /* Preguntas de desempate para las dos primeras deidades (si hace falta). */
  function tieItems(answers){
    const { fv } = facets(answers);
    const top = rank(fv, ["g", "r"]);
    if (top[0].r - top[1].r >= TIE_GAP) return [];
    const a = D.GODS[top[0].id].p, b = D.GODS[top[1].id].p;
    const diff = FACETS.map(f => ({ f, d: Math.abs((a[f] || 0) - (b[f] || 0)) }))
                       .filter(x => x.d > 0).sort((x, y) => y.d - x.d).slice(0, TIE_FACETS);
    const out = [];
    diff.forEach(x => TIE[x.f].forEach(it => out.push(it)));
    return out;
  }

  function compute(answers){
    const { fv, coherence } = facets(answers);
    const gr = rank(fv, ["g", "r"]);
    const greek = rank(fv, ["g"]), roman = rank(fv, ["r"]), egypt = rank(fv, ["e"]);
    const parent = gr[0].id, runner = gr[1].id;
    const gap = gr[0].r - gr[1].r;
    const P = D.GODS[parent];
    // por qué: rasgos que más aportan a la afinidad con el progenitor
    const fs = FACETS;
    const mu = fs.reduce((s, f) => s + fv[f], 0) / fs.length;
    const why = fs.filter(f => f !== "RO" && (P.p[f] || 0) > 0)
                  .map(f => ({ f, c: (fv[f] - mu) * (P.p[f] || 0) }))
                  .filter(x => x.c > 0).sort((x, y) => y.c - x.c).slice(0, 3).map(x => x.f);
    const pct = r => Math.round((r + 1) / 2 * 100);
    return {
      fv, coherence, gap, parent, runner, why,
      aspect: P.pan,                                  // "g" o "r"
      duty: fv.RO,
      greek: greek[0].id, roman: roman[0].id, egypt: egypt[0].id,
      ranks: { gr, greek, roman, egypt },
      pct,
      clarity: gap >= 0.12 ? "high" : gap >= TIE_GAP ? "mid" : "low"
    };
  }

  return { ITEMS, TIE, FACETS, TIE_GAP, facets, rank, tieItems, compute, corr };
})();

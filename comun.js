/* Utilidades compartidas por la portada y todos los tests de Percy Jackson. */
(function(){
  // Trazos de cada símbolo de saga (viewBox 24x24). Sirven para SVG y para canvas.
  const PATHS = {
    // Percy Jackson y los dioses del Olimpo: tridente
    pjo:  ["M12 22V3", "M6 5v4a6 6 0 0 0 12 0V5", "M4.5 7 6 4.5 7.5 7", "M10.5 4.5 12 2l1.5 2.5", "M16.5 7 18 4.5 19.5 7"],
    // Héroes del Olimpo: corona de laurel
    hoo:  ["M8.5 20C4.5 16.5 3.5 10.5 6.5 5", "M15.5 20c4-3.5 5-9.5 2-15", "M5.3 15.5 3 14.8", "M4.7 11.6 2.5 10.4", "M5.6 8 4.3 5.9", "M18.7 15.5l2.3-.7", "M19.3 11.6l2.2-1.2", "M18.4 8l1.3-2.1"],
    // Las pruebas de Apolo: lira
    toa:  ["M7 4c-2.5 5-1 10 2.5 13h5c3.5-3 5-8 2.5-13", "M10 8v9", "M14 8v9", "M8 20.5h8", "M9.5 17v3.5", "M14.5 17v3.5"],
    // Las crónicas de Kane: anj
    kane: ["M12 12v10", "M7 14h10", "M12 12c-2.5-1.8-3.6-4.3-2.6-6.6a2.8 2.8 0 0 1 5.2 0c1 2.3-.1 4.8-2.6 6.6z"],
    // Magnus Chase: runa algiz
    mag:  ["M12 3v18", "M12 11 6.5 4.5", "M12 11l5.5-6.5"],
    // Cruces y otros: dos espadas cruzadas
    x:    ["M5 4l14 14", "M19 4 5 18", "M3.5 16.5l4 4", "M20.5 16.5l-4 4"],
    // Serie de Disney+: pantalla
    tv:   ["M3.5 6h17v11h-17z", "M9 20.5h6", "M10.3 9.3l4.2 2.2-4.2 2.2z"]
  };

  window.PJ = {
    PATHS,
    glyph(saga, extraClass){
      const k = PATHS[saga] ? saga : "pjo";
      const d = PATHS[k].map(p => `<path d="${p}"/>`).join("");
      return `<span class="glyph g-${k}${extraClass ? " " + extraClass : ""}" aria-hidden="true"><svg viewBox="0 0 24 24">${d}</svg></span>`;
    },
    // Dibuja un símbolo en un canvas: centro (x, y), tamaño del símbolo en px
    drawGlyph(g, saga, x, y, size, color){
      const k = PATHS[saga] ? saga : "pjo";
      const s = size / 24;
      g.save();
      g.translate(x - size / 2, y - size / 2); g.scale(s, s);
      g.strokeStyle = color; g.lineWidth = 1.8; g.lineCap = "round"; g.lineJoin = "round";
      PATHS[k].forEach(p => g.stroke(new Path2D(p)));
      g.restore();
    },
    // Idioma compartido entre la portada y los tests
    LANG_KEY: "pj-lang",
    pickLang(available){
      let saved = null;
      try { saved = localStorage.getItem(this.LANG_KEY); } catch(e) {}
      if (saved && available.includes(saved)) return saved;
      return (navigator.language || "es").toLowerCase().startsWith("es") ? "es" : "en";
    },
    saveLang(code){ try { localStorage.setItem(this.LANG_KEY, code); } catch(e) {} },
    // Nick compartido entre tests
    NICK_KEY: "pj-nick",
    readNick(){ try { return localStorage.getItem(this.NICK_KEY) || ""; } catch(e) { return ""; } },
    saveNick(n){ try { localStorage.setItem(this.NICK_KEY, n); } catch(e) {} }
  };
})();

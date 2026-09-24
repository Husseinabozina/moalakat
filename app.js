(() => {
  const data = window.MOALAKAT_DATA;
  const mount = document.getElementById("verses");

  const esc = (s) => String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

  const wordsHTML = (words) => `
    <div class="words">
      ${words.map(([term, desc]) => `
        <div class="word">
          <b>${esc(term)}</b>
          <span>${esc(desc)}</span>
        </div>`).join("")}
    </div>`;

  const syntaxHTML = (items) => `
    <div class="syntax">
      ${items.map(([term, desc]) => `
        <div class="syntax-line">
          <b>${esc(term)}</b>
          <span>${esc(desc)}</span>
        </div>`).join("")}
    </div>`;

  const sourcesHTML = (items) => items.map(([name, note]) => `
    <div class="source-note">
      <strong>${esc(name)}</strong>
      <div>${esc(note)}</div>
    </div>`).join("");

  const details = (title, body, open = false) => `
    <details ${open ? "open" : ""}>
      <summary>${esc(title)}</summary>
      <div class="detail-body">${body}</div>
    </details>`;

  mount.innerHTML = data.verses.map(v => `
    <article class="verse-card" id="verse-${v.n}">
      <div class="verse-top">
        <div class="verse-number">البيت ${v.n.toLocaleString("ar-EG")}</div>
        <div class="verse-text" aria-label="نص البيت">
          <span>${esc(v.a)}</span>
          <span>${esc(v.b)}</span>
        </div>
        <div class="verse-theme">${esc(v.theme)}</div>
      </div>

      <div class="quick-meaning">
        <b>المعنى السريع:</b>
        ${esc(v.quick)}
      </div>

      <div class="accordion">
        ${details("المفردات التي تحتاج شرحًا", wordsHTML(v.words), v.n === 1)}
        ${details("أعد ترتيب الجملة نثرًا", `<p>${esc(v.prose)}</p>`)}
        ${details("التركيب والنحو والإعراب المهم", syntaxHTML(v.syntax), v.n === 5)}
        ${details("البلاغة وعلم المعاني", `<p>${esc(v.rhetoric)}</p>`)}
        ${details("السياق الأدبي والثقافي", `<p>${esc(v.culture)}</p>`)}
        ${details("ماذا قال الشراح؟", sourcesHTML(v.sources))}
      </div>
    </article>
  `).join("");

  const allDetails = () => [...document.querySelectorAll(".accordion details")];

  document.getElementById("expandAll").addEventListener("click", () => {
    allDetails().forEach(d => d.open = true);
  });

  document.getElementById("collapseAll").addEventListener("click", () => {
    allDetails().forEach(d => d.open = false);
  });

  let scale = Number(localStorage.getItem("moalakat-font-scale") || 1);
  const applyScale = () => {
    document.documentElement.style.setProperty("--font-scale", scale.toFixed(2));
    localStorage.setItem("moalakat-font-scale", scale.toFixed(2));
  };
  applyScale();

  document.getElementById("fontUp").addEventListener("click", () => {
    scale = Math.min(1.25, scale + 0.05);
    applyScale();
  });

  document.getElementById("fontDown").addEventListener("click", () => {
    scale = Math.max(0.85, scale - 0.05);
    applyScale();
  });

  const savedTheme = localStorage.getItem("moalakat-theme");
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;

  const themeButton = document.getElementById("themeToggle");
  const syncThemeLabel = () => {
    themeButton.textContent = document.documentElement.dataset.theme === "dark"
      ? "الوضع الفاتح"
      : "الوضع الليلي";
  };
  syncThemeLabel();

  themeButton.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("moalakat-theme", next);
    syncThemeLabel();
  });

  document.getElementById("printBtn").addEventListener("click", () => {
    allDetails().forEach(d => d.open = true);
    setTimeout(() => window.print(), 80);
  });
})();

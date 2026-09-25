(() => {
  const data = window.MOALAKAT_DATA;
  const mount = document.getElementById("verses");

  const esc = (s) => String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

  const arNum = (n) => Number(n).toLocaleString("ar-EG");

  const refs = (s) => esc(s).replace(/\[\[(\d+)\]\]/g, (_, n) =>
    `<a class="ref" href="#source-${n}" title="انظر المصدر ${arNum(n)}">[${arNum(n)}]</a>`
  );

  const paragraph = (s) => `<p>${refs(s)}</p>`;

  const wordsHTML = (words) => `
    <div class="words">
      ${words.map(([term, desc]) => `
        <div class="word">
          <b>${esc(term)}</b>
          <span>${refs(desc)}</span>
        </div>`).join("")}
    </div>`;

  const syntaxHTML = (items) => `
    <div class="syntax">
      ${items.map(([term, desc]) => `
        <div class="syntax-line">
          <b>${esc(term)}</b>
          <span>${refs(desc)}</span>
        </div>`).join("")}
    </div>`;

  const issuesHTML = (items) => `
    <div class="issues">
      ${items.map(([question, answer]) => `
        <div class="issue">
          <h4>${esc(question)}</h4>
          <p>${refs(answer)}</p>
        </div>`).join("")}
    </div>`;

  const details = (title, body, open = false) => `
    <details ${open ? "open" : ""}>
      <summary>${esc(title)}</summary>
      <div class="detail-body">${body}</div>
    </details>`;

  mount.innerHTML = data.verses.map(v => `
    <article class="verse-card" id="verse-${v.n}">
      <div class="verse-top">
        <div class="verse-number">البيت ${arNum(v.n)}</div>
        <div class="verse-text" aria-label="نص البيت">
          <span>${esc(v.a)}</span>
          <span>${esc(v.b)}</span>
        </div>
        <div class="verse-theme">${esc(v.theme)}</div>
      </div>

      <div class="quick-meaning">
        <b>المعنى عند الشراح:</b>
        ${refs(v.quick)}
      </div>

      <div class="accordion">
        ${details("شرح الألفاظ", wordsHTML(v.words), v.n === 1)}
        ${details("المعنى بترتيب أوضح", paragraph(v.prose))}
        ${details("التركيب والإعراب", syntaxHTML(v.syntax), v.n === 5)}
        ${v.bayan?.length ? details("علم البيان والصورة", syntaxHTML(v.bayan), v.n === 3 || v.n === 4) : ""}
        ${details("مسائل تحتاج إلى تحرير", issuesHTML(v.issues), v.n === 5)}
        ${details("مصادر هذا البيت", `<p class="verse-sources">${refs(v.sourceView)}</p>`)}
      </div>
    </article>
  `).join("");

  const bibliography = document.getElementById("bibliography");
  if (bibliography && data.sources) {
    bibliography.innerHTML = data.sources.map(s => `
      <article class="bibliography-item" id="source-${s.id}">
        <div class="bibliography-id">[${arNum(s.id)}]</div>
        <div>
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.detail)}</p>
          <a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">فتح المصدر</a>
        </div>
      </article>
    `).join("");
  }

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

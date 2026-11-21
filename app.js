/* WearSahin vitrin — ürünler ve ayarlar admin panelinden (urunler.json) gelir.
   Bu dosyayı değiştirmene gerek yok; içerik için /admin panelini kullan. */
(function () {
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const TL = n => Number(n || 0).toLocaleString("tr-TR") + " ₺";
  const img = p => { p = String(p || ""); return /^https?:\/\//.test(p) ? p : p.replace(/^\/+/, ""); };
  const safeUrl = u => /^https?:\/\//i.test(String(u || "").trim()) ? String(u).trim() : "";

  const YASAL = [
    ["Mesafeli Satış Sözleşmesi", "sayfalar/mesafeli-satis-sozlesmesi.html"],
    ["İade ve Değişim Koşulları", "sayfalar/iade-ve-degisim.html"],
    ["KVKK Aydınlatma Metni", "sayfalar/kvkk-aydinlatma-metni.html"],
    ["Gizlilik Politikası", "sayfalar/gizlilik-politikasi.html"]
  ];
  const TIP = { "Tişört": "tee", "Gömlek": "tee", "Sweatshirt": "hoodie", "Hoodie": "hoodie", "Ceket": "hoodie", "Eşofman": "pants", "Pantolon": "pants", "Şort": "pants", "Aksesuar": "cap" };

  function garment(tip, renk, baski) {
    const s = 'stroke="#0d0d0d" stroke-width="3" stroke-linejoin="round"';
    if (tip === "hoodie") return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M62 50 L34 66 L20 152 L40 156 L56 98 L56 176 L144 176 L144 98 L160 156 L180 152 L166 66 L138 50 Z" fill="${renk}" ${s}/><path d="M70 52 Q70 20 100 18 Q130 20 130 52 Q116 66 100 66 Q84 66 70 52 Z" fill="${renk}" ${s}/><path d="M80 54 Q100 68 120 54" fill="none" ${s}/><path d="M94 66 L92 92 M106 66 L108 92" ${s} fill="none"/><path d="M72 140 L128 140 L136 166 L64 166 Z" fill="none" ${s}/><text x="100" y="124" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="22" fill="${baski}">WS</text></svg>`;
    if (tip === "pants") return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M62 20 L138 20 L150 182 L112 182 L100 74 L88 182 L50 182 Z" fill="${renk}" ${s}/><path d="M62 34 L138 34" ${s}/><rect x="50" y="98" width="22" height="28" rx="3" fill="${baski}" ${s}/><rect x="128" y="98" width="22" height="28" rx="3" fill="${baski}" ${s}/><path d="M100 34 L100 60" ${s}/></svg>`;
    if (tip === "cap") return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M40 120 Q40 50 104 48 Q160 50 162 118 Z" fill="${renk}" ${s}/><path d="M40 120 Q100 108 162 118 Q190 124 190 136 Q150 150 100 134 Q60 126 40 120 Z" fill="${renk}" ${s}/><circle cx="104" cy="49" r="5" fill="${renk}" ${s}/><text x="100" y="100" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="26" fill="${baski}">WS</text></svg>`;
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M70 34 L44 44 L14 76 L36 98 L52 86 L52 176 L148 176 L148 86 L164 98 L186 76 L156 44 L130 34 Q100 54 70 34 Z" fill="${renk}" ${s}/><path d="M70 34 Q100 54 130 34" fill="none" ${s}/><text x="100" y="118" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="17" fill="${baski}" letter-spacing="1">WEARSAHİN</text><text x="100" y="136" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-size="9" fill="${baski}" letter-spacing="3">STREET CLUB</text></svg>`;
  }
  const cover = u => (u.gorseller && u.gorseller.length)
    ? `<img src="${esc(img(u.gorseller[0]))}" alt="${esc(u.ad)}" loading="lazy">`
    : garment(TIP[u.kategori] || "tee", "#d6d2c4", "#0d0d0d");

  let URUNLER = [], AYAR = {}, aktif = "Tümü", kategoriler = [];

  /* ---------- Ayarlar ---------- */
  function applySettings() {
    const a = AYAR;
    const duy = (a.duyurular && a.duyurular.length ? a.duyurular : ["Shopier ile güvenli ödeme"]).map(d => `<span>${esc(d)}</span>`).join("");
    $("ticker").innerHTML = duy + duy + duy + duy;

    if (a.hero_baslik) {
      const parts = String(a.hero_baslik).split("|").map(esc);
      const last = parts.pop();
      $("heroTitle").innerHTML = (parts.length ? parts.join("<br>") + "<br>" : "") + `<span class="hl">${last}</span>`;
    }
    $("heroDesc").textContent = a.hero_aciklama || "";
    $("heroGarment").innerHTML = a.hero_gorsel ? `<img src="${esc(img(a.hero_gorsel))}" alt="">` : garment("hoodie", "#c8ff2e", "#0d0d0d");
    $("aboutText").textContent = a.hakkimizda || "";

    $("faq").innerHTML = (a.sss || []).map(x => `<details><summary>${esc(x.soru)}</summary><p>${esc(x.cevap)}</p></details>`).join("");
    if (!(a.sss || []).length) $("sss").hidden = true;

    const btn = [];
    const ig = safeUrl(a.instagram), tt = safeUrl(a.tiktok), sh = safeUrl(a.shopier_magaza);
    const wa = String(a.whatsapp || "").replace(/\D/g, "");
    if (ig) btn.push(`<a class="btn btn-dark" href="${esc(ig)}" target="_blank" rel="noopener">Instagram</a>`);
    if (tt) btn.push(`<a class="btn btn-light" href="${esc(tt)}" target="_blank" rel="noopener">TikTok</a>`);
    if (wa) btn.push(`<a class="btn btn-light" href="https://wa.me/${wa}" target="_blank" rel="noopener">WhatsApp</a>`);
    if (sh) btn.push(`<a class="btn btn-light" href="${esc(sh)}" target="_blank" rel="noopener">Shopier Mağazam</a>`);
    if (a.eposta) btn.push(`<a class="btn btn-light" href="mailto:${esc(a.eposta)}">${esc(a.eposta)}</a>`);
    $("social").innerHTML = btn.join("");
    $("soonBtns").innerHTML = (ig ? `<a class="btn btn-dark" href="${esc(ig)}" target="_blank" rel="noopener">Instagram'da Takip Et →</a>` : "") +
      (wa ? `<a class="btn btn-light" href="https://wa.me/${wa}" target="_blank" rel="noopener">WhatsApp</a>` : "");
    if (wa) $("wa").href = "https://wa.me/" + wa; else $("wa").hidden = true;

    $("legal").innerHTML = YASAL.map(([n, h]) => `<li><a href="${h}">${n}</a></li>`).join("");
    if (a.magaza_adi) document.title = a.magaza_adi + " — Sokak Stili Giyim";
  }

  /* ---------- Ürünler ---------- */
  function renderFilters() {
    $("filters").innerHTML = kategoriler.length > 2 ? kategoriler.map(k =>
      `<button class="chip ${k === aktif ? "active" : ""}" data-k="${esc(k)}">${esc(k)}</button>`).join("") : "";
  }
  function renderGrid() {
    const list = URUNLER.map((u, i) => ({ ...u, i })).filter(u => aktif === "Tümü" || u.kategori === aktif);
    $("grid").innerHTML = list.map(u => {
      const tag = u.tukendi ? `<span class="tag out">TÜKENDİ</span>` : (u.etiket ? `<span class="tag ${u.etiket === "İNDİRİM" ? "sale" : ""}">${esc(u.etiket)}</span>` : "");
      return `<button class="card ${u.tukendi ? "out" : ""}" data-i="${u.i}">
        <div class="card-img">${cover(u)}${tag}</div>
        <div class="card-body">
          <span class="card-cat">${esc(u.kategori)}</span>
          <span class="card-name">${esc(u.ad)}</span>
          <div class="card-foot">
            <span class="price">${TL(u.fiyat)}${u.eski_fiyat ? `<s>${TL(u.eski_fiyat)}</s>` : ""}</span>
            <span class="mini-buy">→</span>
          </div>
        </div></button>`;
    }).join("");
  }
  function renderCats() {
    const cats = kategoriler.slice(1, 4);
    if (cats.length < 2) { $("kategoriler").hidden = true; return; }
    $("kategoriler").hidden = false;
    $("cats").innerHTML = cats.map((k, idx) => {
      const n = URUNLER.filter(u => u.kategori === k).length;
      return `<button class="cat" data-k="${esc(k)}"><h3>${esc(k)}</h3><span>${n} ürün →</span>${garment(TIP[k] || "tee", ["#0d0d0d", "#c8ff2e", "#0d0d0d"][idx], idx === 1 ? "#0d0d0d" : "#c8ff2e")}</button>`;
    }).join("");
  }
  function renderProducts() {
    const has = URUNLER.length > 0;
    $("soon").hidden = has;
    $("filters").hidden = !has;
    $("grid").hidden = !has;
    if (!has) {
      $("prodTitle").innerHTML = "Koleksiyon";
      $("heroEyebrow").textContent = "Çok Yakında";
      $("heroBtn").textContent = "İlk Drop'u Bekle →";
      $("sticker").innerHTML = "Çok<br>Yakında<br>★";
      $("kategoriler").hidden = true;
      $("footCats").innerHTML = "<li>Yakında</li>";
      return;
    }
    kategoriler = ["Tümü", ...new Set(URUNLER.map(u => u.kategori).filter(Boolean))];
    renderFilters(); renderGrid(); renderCats();
    $("footCats").innerHTML = kategoriler.slice(1).map(k => `<li><a href="#urunler" data-k="${esc(k)}">${esc(k)}</a></li>`).join("");
  }
  function setCat(k) { aktif = k; renderFilters(); renderGrid(); }

  $("filters").addEventListener("click", e => { const b = e.target.closest(".chip"); if (b) setCat(b.dataset.k); });
  $("grid").addEventListener("click", e => { const c = e.target.closest(".card"); if (c) openProduct(+c.dataset.i); });
  $("cats").addEventListener("click", e => { const c = e.target.closest(".cat"); if (!c) return; setCat(c.dataset.k); $("urunler").scrollIntoView({ behavior: "smooth" }); });
  $("footCats").addEventListener("click", e => { const a = e.target.closest("a[data-k]"); if (a) setCat(a.dataset.k); });

  /* ---------- Ürün penceresi ---------- */
  const modal = $("modal");
  let secili = null, urun = null;
  function showImg(k) {
    const g = urun.gorseller || [];
    $("mImg").innerHTML = g.length ? `<img src="${esc(img(g[k]))}" alt="${esc(urun.ad)}">` : cover(urun);
    $("mThumbs").innerHTML = g.length > 1 ? g.map((p, j) => `<button class="${j === k ? "sel" : ""}" data-j="${j}"><img src="${esc(img(p))}" alt=""></button>`).join("") : "";
  }
  function drawSizes() {
    const b = urun.bedenler || [];
    $("mSizeWrap").hidden = !b.length;
    $("mSizes").innerHTML = b.map(x => `<button class="size ${x === secili ? "sel" : ""}" data-b="${esc(x)}">${esc(x)}</button>`).join("");
  }
  function openProduct(i) {
    urun = URUNLER[i];
    const b = urun.bedenler || [];
    secili = b.length <= 1 ? (b[0] || "-") : null;
    showImg(0);
    $("mCat").textContent = urun.kategori || "";
    $("mName").textContent = urun.ad;
    $("mPrice").innerHTML = TL(urun.fiyat) + (urun.eski_fiyat ? `<s>${TL(urun.eski_fiyat)}</s>` : "");
    $("mDesc").textContent = urun.aciklama || "";
    drawSizes();
    const buy = $("mBuy"), link = safeUrl(urun.shopier);
    const wa = String(AYAR.whatsapp || "").replace(/\D/g, "");
    buy.classList.toggle("disabled", !!urun.tukendi);
    $("mSecure").hidden = $("mNote").hidden = !link || !!urun.tukendi;
    if (urun.tukendi) { buy.textContent = "Tükendi"; buy.href = "#"; }
    else if (link) { buy.textContent = "Shopier ile Satın Al →"; buy.href = link; }
    else { buy.textContent = wa ? "WhatsApp'tan Sipariş Ver →" : "DM'den Sipariş Ver →"; buy.href = wa ? `https://wa.me/${wa}?text=${encodeURIComponent("Merhaba, " + urun.ad + " ürününü sipariş etmek istiyorum.")}` : (safeUrl(AYAR.instagram) || "#iletisim"); }
    modal.classList.add("open"); document.body.style.overflow = "hidden";
  }
  $("mThumbs").addEventListener("click", e => { const b = e.target.closest("button"); if (b) showImg(+b.dataset.j); });
  $("mSizes").addEventListener("click", e => { const b = e.target.closest(".size"); if (!b) return; secili = b.dataset.b; drawSizes(); });
  $("mBuy").addEventListener("click", e => {
    if (urun && urun.tukendi) { e.preventDefault(); return; }
    if (!secili) { e.preventDefault(); toast("Önce bedenini seç 👆"); return; }
    const wa = String(AYAR.whatsapp || "").replace(/\D/g, "");
    if (!safeUrl(urun.shopier) && wa && secili !== "-") {
      e.currentTarget.href = `https://wa.me/${wa}?text=${encodeURIComponent("Merhaba, " + urun.ad + " (" + secili + " beden) sipariş etmek istiyorum.")}`;
    }
  });
  function closeModal() { modal.classList.remove("open"); document.body.style.overflow = ""; }
  $("close").onclick = closeModal;
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  /* ---------- Menü, bildirim ---------- */
  const mm = $("mobileMenu");
  $("burger").onclick = () => mm.classList.toggle("open");
  mm.addEventListener("click", e => { if (e.target.tagName === "A") mm.classList.remove("open"); });
  let tt;
  function toast(m) { const el = $("toast"); el.textContent = m; el.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => el.classList.remove("show"), 2800); }
  $("yr").textContent = new Date().getFullYear();

  /* ---------- Veri yükleme ---------- */
  $("grid").innerHTML = `<div class="loading">Ürünler yükleniyor…</div>`;
  fetch("urunler.json?v=" + Date.now(), { cache: "no-store" })
    .then(r => r.json())
    .then(d => {
      AYAR = d.ayarlar || {};
      const raw = d.urunler ? (Array.isArray(d.urunler) ? d.urunler : Object.values(d.urunler)) : [];
      URUNLER = raw.filter(u => u && u.ad && u.aktif !== false).sort((a, b) => {
        const sa = a.sira == null || a.sira === "" ? 1e9 : +a.sira, sb = b.sira == null || b.sira === "" ? 1e9 : +b.sira;
        if (sa !== sb) return sa - sb;
        return String(b.eklenme || "").localeCompare(String(a.eklenme || ""));
      });
    })
    .catch(() => { URUNLER = []; })
    .finally(() => { applySettings(); renderProducts(); });
})();


const DEFAULT_BOOKS = [
  {
    id: "beit-algharib",
    title: "بيت الغريب — فخ الحياة",
    author: "ديوان دان",
    category: "رواية",
    description: "رواية أدبية من أعمال ديوان دان.",
    pdf: "بيت_الغريب_فخ_الحياة_النسخة_النهائية_بعد_المراجعة.pdf",
    favorite: false
  },
  {
    id: "siham-moussa",
    title: "سهام وموسى",
    author: "ديوان دان",
    category: "رواية",
    description: "الرواية الكاملة بدون صفحات فارغة.",
    pdf: "رواية_سهام_وموسى_الكاملة_بدون_صفحات_فارغة (1).pdf",
    favorite: false
  }
];

let books = JSON.parse(localStorage.getItem("diwanDanBooks") || "null") || DEFAULT_BOOKS;
let currentView = "home";

const $ = (id) => document.getElementById(id);

function save() {
  localStorage.setItem("diwanDanBooks", JSON.stringify(books));
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function bookCard(book) {
  const pdfButton = book.pdf
    ? `<a class="primary read-btn" href="${encodeURI(book.pdf)}" target="_blank">📖 قراءة PDF</a>`
    : `<button class="secondary" onclick="alert('لا يوجد ملف PDF لهذا الكتاب')">PDF غير متوفر</button>`;

  return `
    <article class="book-card">
      <div class="book-cover">د</div>
      <div class="book-info">
        <h3>${escapeHTML(book.title)}</h3>
        <p>${escapeHTML(book.author || "مؤلف غير محدد")}</p>
        <span class="tag">${escapeHTML(book.category || "أخرى")}</span>
        <p class="desc">${escapeHTML(book.description || "")}</p>
        <div class="book-actions">
          ${pdfButton}
          <button class="icon favorite ${book.favorite ? "selected" : ""}"
            onclick="toggleFavorite('${book.id}')">
            ${book.favorite ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderHome() {
  return `
    <section class="welcome">
      <div>
        <span class="eyebrow">مرحبًا بك في</span>
        <h2>مكتبة ديوان دان</h2>
        <p>مساحتك الرقمية للقراءة واكتشاف الكتب والروايات.</p>
      </div>
    </section>

    <div class="stats">
      <div><strong>${books.length}</strong><span>كتاب</span></div>
      <div><strong>${new Set(books.map(b => b.author)).size}</strong><span>مؤلف</span></div>
      <div><strong>${new Set(books.map(b => b.category)).size}</strong><span>تصنيف</span></div>
    </div>

    <section>
      <div class="section-head">
        <h2>أحدث الكتب</h2>
        <button class="secondary" onclick="showView('books')">عرض المكتبة</button>
      </div>
      <div class="books-grid">${books.slice(0, 6).map(bookCard).join("")}</div>
    </section>
  `;
}

function renderBooks() {
  return `
    <div class="toolbar">
      <input id="searchBooks" class="search-input"
        placeholder="🔎 ابحث عن كتاب أو مؤلف..." />
      <select id="filterCategory" class="filter">
        <option value="">كل التصنيفات</option>
        ${[...new Set(books.map(b => b.category))].map(c =>
          `<option>${escapeHTML(c)}</option>`).join("")}
      </select>
    </div>
    <div id="booksGrid" class="books-grid">
      ${books.map(bookCard).join("")}
    </div>
  `;
}

function renderAuthors() {
  const authors = [...new Set(books.map(b => b.author || "غير محدد"))];

  return `
    <div class="list-grid">
      ${authors.map(author => {
        const total = books.filter(b => b.author === author).length;
        return `
          <div class="list-card">
            <div class="avatar">♙</div>
            <div>
              <h3>${escapeHTML(author)}</h3>
              <p>${total} كتاب</p>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderCategories() {
  const categories = [...new Set(books.map(b => b.category || "أخرى"))];

  return `
    <div class="category-grid">
      ${categories.map(category => {
        const total = books.filter(b => b.category === category).length;
        return `
          <button class="category-card"
            onclick="showView('books'); setTimeout(()=>selectCategory('${escapeHTML(category)}'),100)">
            <span>◈</span>
            <strong>${escapeHTML(category)}</strong>
            <small>${total} كتاب</small>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function renderFavorites() {
  const favorites = books.filter(b => b.favorite);

  if (!favorites.length) {
    return `
      <div class="empty-state">
        <div>♡</div>
        <h2>لا توجد كتب مفضلة</h2>
        <p>اضغط على ♡ بجانب أي كتاب لإضافته إلى المفضلة.</p>
      </div>
    `;
  }

  return `<div class="books-grid">${favorites.map(bookCard).join("")}</div>`;
}

function renderAbout() {
  return `
    <section class="about-card">
      <span class="eyebrow">DIWAN DAN</span>
      <h2>عن مكتبة ديوان دان</h2>
      <p>
        مكتبة رقمية عربية تهدف إلى جمع الكتب والروايات والأعمال الأدبية
        في مساحة بسيطة وسهلة الاستخدام على الهاتف والحاسوب.
      </p>
      <p>الإصدار الحالي: <strong>1.0</strong></p>
    </section>
  `;
}

function showView(view) {
  currentView = view;

  document.querySelectorAll("#nav button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === view);
  });

  const titles = {
    home: "مساحتك الخاصة للقراءة",
    books: "المكتبة",
    authors: "المؤلفون",
    categories: "التصنيفات",
    favorites: "المفضلة",
    about: "عن مكتبة ديوان دان"
  };

  $("title").textContent = titles[view] || titles.home;

  const content = $("content");

  if (view === "home") content.innerHTML = renderHome();
  if (view === "books") content.innerHTML = renderBooks();
  if (view === "authors") content.innerHTML = renderAuthors();
  if (view === "categories") content.innerHTML = renderCategories();
  if (view === "favorites") content.innerHTML = renderFavorites();
  if (view === "about") content.innerHTML = renderAbout();

  if (view === "books") setupSearch();
  updateCount();
}

function updateCount() {
  $("sideCount").textContent = books.length;
}

function setupSearch() {
  const search = $("searchBooks");
  const filter = $("filterCategory");

  if (!search) return;

  function apply() {
    const q = search.value.toLowerCase().trim();
    const cat = filter.value;

    const result = books.filter(book => {
      const text = `${book.title} ${book.author} ${book.description}`.toLowerCase();
      return (!q || text.includes(q)) && (!cat || book.category === cat);
    });

    $("booksGrid").innerHTML = result.length
      ? result.map(bookCard).join("")
      : `<div class="empty-state"><h2>لا توجد نتائج</h2></div>`;
  }

  search.addEventListener("input", apply);
  filter.addEventListener("change", apply);
}

function selectCategory(category) {
  const filter = $("filterCategory");
  if (filter) {
    filter.value = category;
    filter.dispatchEvent(new Event("change"));
  }
}

function toggleFavorite(id) {
  books = books.map(book =>
    book.id === id ? {...book, favorite: !book.favorite} : book
  );

  save();
  showView(currentView);
}

$("nav").addEventListener("click", e => {
  const btn = e.target.closest("button[data-view]");
  if (btn) showView(btn.dataset.view);
});

$("theme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "diwanDanTheme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
});

if (localStorage.getItem("diwanDanTheme") === "dark") {
  document.body.classList.add("dark");
}

$("add").addEventListener("click", () => {
  $("bookForm").reset();
  $("dialogTitle").textContent = "إضافة كتاب جديد";
  $("bookDialog").showModal();
});

$("closeDialog").addEventListener("click", () => {
  $("bookDialog").close();
});

$("cancelDialog").addEventListener("click", () => {
  $("bookDialog").close();
});

$("bookForm").addEventListener("submit", async e => {
  e.preventDefault();

  const title = $("bookTitle").value.trim();
  const author = $("bookAuthor").value.trim() || "غير محدد";
  const category = $("bookCategory").value;
  const description = $("bookDesc").value.trim();
  const pdf = $("bookPdf").files[0];

  if (!title) return;

  let pdfName = "";

  if (pdf) {
    alert(
      "تم تسجيل الكتاب في هذه الجلسة. لإضافة PDF دائمًا إلى الموقع، ارفع ملف PDF إلى مستودع GitHub ثم ضع اسمه في بيانات الكتاب."
    );
    pdfName = pdf.name;
  }

  books.unshift({
    id: Date.now().toString(),
    title,
    author,
    category,
    description,
    pdf: pdfName,
    favorite: false
  });

  save();
  $("bookDialog").close();
  showView("books");

  showToast("تمت إضافة الكتاب بنجاح");
});

$("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(books, null, 2)], {
    type: "application/json"
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "diwan-dan-library.json";
  a.click();
  URL.revokeObjectURL(a.href);
});

$("importBtn").addEventListener("click", () => {
  $("importFile").click();
});

$("importFile").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);

      if (!Array.isArray(imported)) throw new Error();

      books = imported;
      save();
      showView(currentView);
      showToast("تم استيراد المكتبة");
    } catch {
      alert("ملف المكتبة غير صالح.");
    }
  };

  reader.readAsText(file);
});

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => toast.classList.remove("show"), 2500);
}

showView("home");

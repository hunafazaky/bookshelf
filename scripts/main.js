import { loadBooks, saveBooks } from "./storage.js";
import { addBook, updateBook, removeBook, toggleComplete, filterByTitle } from "./books.js";

let books = loadBooks();
let currentEditBookId = null;
let lastFocusedElement = null;
let statusTimeoutId = null;

// Elements
const bookCardTemplate = document.getElementById("bookCardTemplate");
const incompleteBookList = document.getElementById("incompleteBookList");
const completeBookList = document.getElementById("completeBookList");
const searchBookResultList = document.getElementById("searchBookResultList");

const bookForm = document.getElementById("bookForm");
const bookFormIsComplete = document.getElementById("bookFormIsComplete");
const isCompleteStatus = document.getElementById("isCompleteStatus");

const searchBookForm = document.getElementById("searchBook");
const searchBookTitleInput = document.getElementById("searchBookTitle");

const editModal = document.getElementById("editBookModal");
const editBookForm = document.getElementById("editBookForm");
const editBookFormTitle = document.getElementById("editBookFormTitle");
const editBookFormAuthor = document.getElementById("editBookFormAuthor");
const editBookFormYear = document.getElementById("editBookFormYear");
const editBookFormIsComplete = document.getElementById("editBookFormIsComplete");
const editModalCloseButton = document.getElementById("editModalCloseButton");
const editModalCancelButton = document.getElementById("editModalCancelButton");

const statusMessageEl = document.getElementById("status-message");

// --- Rendering ---

function createBookCard(book) {
  const content = bookCardTemplate.content.cloneNode(true);
  content.querySelector('[data-testid="bookItem"]').dataset.bookid = book.id;
  content.querySelector('[data-testid="bookItemTitle"]').textContent = book.title;
  content.querySelector(".book-author").textContent = book.author;
  content.querySelector(".book-year").textContent = book.year;

  const statusButton = content.querySelector('[data-testid="bookItemIsCompleteButton"]');
  statusButton.classList.toggle("book-status--complete", book.isComplete);
  content.querySelector(".book-status-text").textContent = book.isComplete
    ? "Selesai Dibaca"
    : "Belum Selesai Dibaca";

  return content;
}

function appendContent(listEl, bookArray) {
  listEl.innerHTML = "";
  bookArray.forEach((book) => listEl.appendChild(createBookCard(book)));
}

function renderBook() {
  appendContent(incompleteBookList, books.filter((book) => !book.isComplete));
  appendContent(completeBookList, books.filter((book) => book.isComplete));
  renderSearchResults();
}

function renderSearchResults() {
  const keyword = searchBookTitleInput.value;

  if (!keyword.trim()) {
    searchBookResultList.innerHTML = "";
    searchBookResultList.classList.remove("search-empty");
    return;
  }

  const results = filterByTitle(books, keyword);

  if (results.length === 0) {
    searchBookResultList.textContent = "Buku tidak ditemukan.";
    searchBookResultList.classList.add("search-empty");
    return;
  }

  searchBookResultList.classList.remove("search-empty");
  appendContent(searchBookResultList, results);
}

function persistAndRender() {
  saveBooks(books);
  renderBook();
}

function showStatus(message) {
  statusMessageEl.textContent = message;
  statusMessageEl.hidden = false;
  clearTimeout(statusTimeoutId);
  statusTimeoutId = setTimeout(() => {
    statusMessageEl.hidden = true;
  }, 2500);
}

// --- Edit modal (hand-rolled: no framework JS in the vanilla tier) ---

function openEditModal(book, triggerElement) {
  currentEditBookId = book.id;
  lastFocusedElement = triggerElement;

  editBookFormTitle.value = book.title;
  editBookFormAuthor.value = book.author;
  editBookFormYear.value = book.year;
  editBookFormIsComplete.checked = book.isComplete === true;

  editModal.hidden = false;
  editBookFormTitle.focus();
  document.addEventListener("keydown", handleModalKeydown);
}

function closeEditModal() {
  editModal.hidden = true;
  currentEditBookId = null;
  document.removeEventListener("keydown", handleModalKeydown);
  lastFocusedElement?.focus();
}

function handleModalKeydown(event) {
  if (event.key === "Escape") closeEditModal();
}

// --- Event handlers ---

function handleAddBookSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  const newBook = {
    id: crypto.randomUUID(),
    title: data.title,
    author: data.author,
    year: parseInt(data.year, 10),
    isComplete: data.isComplete === "on",
  };

  books = addBook(books, newBook);
  event.target.reset();
  isCompleteStatus.textContent = "Belum Selesai Dibaca";
  persistAndRender();
  showStatus("Buku berhasil disimpan.");
}

function handleEditBookSubmit(event) {
  event.preventDefault();
  if (!currentEditBookId) return;

  books = updateBook(books, currentEditBookId, {
    title: editBookFormTitle.value,
    author: editBookFormAuthor.value,
    year: parseInt(editBookFormYear.value, 10),
    isComplete: editBookFormIsComplete.checked,
  });

  persistAndRender();
  closeEditModal();
  showStatus("Data buku berhasil diperbarui.");
}

function handleSearchSubmit(event) {
  event.preventDefault();
  renderSearchResults();
}

function handleIsCompleteChange(event) {
  isCompleteStatus.textContent = event.target.checked ? "Selesai Dibaca" : "Belum Selesai Dibaca";
}

function handleListClick(event) {
  const bookArticle = event.target.closest('[data-testid="bookItem"]');
  if (!bookArticle) return;

  const bookId = bookArticle.dataset.bookid;
  const book = books.find((candidate) => candidate.id === bookId);
  if (!book) return;

  if (event.target.closest('[data-testid="bookItemIsCompleteButton"]')) {
    books = toggleComplete(books, bookId);
    persistAndRender();
    return;
  }

  if (event.target.closest('[data-testid="bookItemDeleteButton"]')) {
    if (confirm(`Hapus buku berjudul "${book.title}" dari rak?`)) {
      books = removeBook(books, bookId);
      persistAndRender();
    }
    return;
  }

  const editButton = event.target.closest('[data-testid="bookItemEditButton"]');
  if (editButton) {
    openEditModal(book, editButton);
  }
}

// --- Wire up ---

bookForm.addEventListener("submit", handleAddBookSubmit);
bookFormIsComplete.addEventListener("change", handleIsCompleteChange);
searchBookForm.addEventListener("submit", handleSearchSubmit);
editBookForm.addEventListener("submit", handleEditBookSubmit);
editModalCloseButton.addEventListener("click", closeEditModal);
editModalCancelButton.addEventListener("click", closeEditModal);
editModal.addEventListener("click", (event) => {
  if (event.target === editModal) closeEditModal();
});
document.addEventListener("click", handleListClick);

renderBook();

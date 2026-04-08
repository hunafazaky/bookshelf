// Prepare Local Storage
const STORAGE_KEY = "BOOK_DATA";
const savedDataString = localStorage.getItem(STORAGE_KEY);
const bookList = savedDataString ? JSON.parse(savedDataString) : [];

// Template
const bookCardTemplate = document.getElementById("bookCardTemplate");

// Book List
const searchBookResultList = document.getElementById("searchBookResultList");
const incompleteBookList = document.getElementById("incompleteBookList");
const completeBookList = document.getElementById("completeBookList");

// Append Content
const appendContent = (list, data) => {
  list.innerHTML = "";
  data.forEach((element) => {
    const content = bookCardTemplate.content.cloneNode(true);
    content.querySelector(".book-article").dataset.bookid = element.id;
    content.querySelector(".book-title").textContent = element.title;
    content.querySelector(".book-author").textContent = element.author;
    content.querySelector(".book-year").textContent = element.year;
    element.is_complete
      ? content.querySelector(".book-status").classList.add("btn-info")
      : content.querySelector(".book-status").classList.add("btn-secondary");
    list.appendChild(content);
  });
};

// Search Book
const searchBook = (books, keyword) => {
  const searchBookResult = books.filter((book) =>
    book.title.toLowerCase().includes(keyword.toLowerCase()),
  );
  searchBookResult.length === 0
    ? (searchBookResultList.textContent = "Buku Tidak Ditemukan.")
    : appendContent(searchBookResultList, searchBookResult);
};

// Render Book
const renderBook = (books) => {
  // Render Incomplete book
  const incompleteBooks = books.filter((book) => !book.is_complete);
  appendContent(incompleteBookList, incompleteBooks);

  // Render Complete book
  const completeBooks = books.filter((book) => book.is_complete);
  appendContent(completeBookList, completeBooks);
};

// Toggle Status
const toggleBookStatus = (id) => {
  const book = bookList.find((book) => book.id === id);
  if (book) {
    book.is_complete = !book.is_complete;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookList));
    renderBook(bookList);
  }
};
const deleteBook = (id) => {
  const book = bookList.find((book) => book.id === id);
  if (confirm(`Hapus Buku Berjudul "${book.title}" dari Rak?`)) {
    const index = bookList.findIndex((book) => book.id === id);
    if (index !== -1) {
      bookList.splice(index, 1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookList));
      renderBook(bookList);
    }
  }
};
const editBook = (id) => {
  const book = bookList.find((book) => book.id === id);
  document.getElementById("editBookFormTitle").value = book.title;
  document.getElementById("editBookFormAuthor").value = book.author;
  document.getElementById("editBookFormYear").value = book.year;
  document.getElementById("editBookFormIsComplete").checked =
    book.is_complete === true;
};

// Add book
document
  .getElementById("bookForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    // Prepare the Object from the Form
    const formData = new FormData(event.target);
    const dataObj = Object.fromEntries(formData.entries());
    // Prepare and Transform the Additional Data
    dataObj.year = parseInt(dataObj.year);
    dataObj.is_complete = dataObj.is_complete === "on";
    dataObj.id = crypto.randomUUID();
    // Prepare the New JSON String
    bookList.push(dataObj);
    const dataJSON = JSON.stringify(bookList);
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, dataJSON);
    // Post-proccess
    event.target.reset();
    console.log(bookList);
    renderBook(bookList);
    alert("Buku Berhasil Disimpan.");
  });

// Edit Book
let currentEditBookId = null;
document
  .getElementById("editBookFormSubmit")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const index = bookList.findIndex((data) => data.id === currentEditBookId);
    if (index !== -1) {
      // Timpa data lama dengan data baru dari form (mengubah tipe data tahun jadi Number)
      bookList[index].title =
        document.getElementById("editBookFormTitle").value;
      bookList[index].author =
        document.getElementById("editBookFormAuthor").value;
      bookList[index].year = parseInt(
        document.getElementById("editBookFormYear").value,
      );
      bookList[index].is_complete = document.getElementById(
        "editBookFormIsComplete",
      ).checked;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookList));
      renderBook(bookList);
      currentEditBookId = null;
      alert("Data Buku Berhasil Diperbarui!");
    }
  });

// Checkbox change status
document
  .getElementById("bookFormIsComplete")
  .addEventListener("change", function (event) {
    const isChecked = event.target.checked;
    document.getElementById("isCompleteStatus").textContent = isChecked
      ? "Selesai Dibaca"
      : "Belum Selesai Dibaca";
  });

// Search Book
document
  .getElementById("searchBook")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const keyword = document.getElementById("searchBookTitle").value;
    keyword
      ? searchBook(bookList, keyword)
      : (searchBookResultList.innerHTML = "");
  });

// Click Action
document.addEventListener("click", function (event) {
  const bookItem = event.target.closest('[data-testid="bookItem"]');
  if (!bookItem) return;

  const bookId = bookItem.dataset.bookid;

  // Change Status Action
  if (event.target.closest('[data-testid="bookItemIsCompleteButton"]')) {
    toggleBookStatus(bookId);
  }

  // Delete Action
  if (event.target.closest('[data-testid="bookItemDeleteButton"]')) {
    deleteBook(bookId);
  }

  // Delete Action
  if (event.target.closest('[data-testid="bookItemEditButton"]')) {
    currentEditBookId = bookId;
    editBook(bookId);
  }
});

renderBook(bookList);

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
    content.querySelector(".book-author").textContent =
      `Penulis: ${element.author}`;
    content.querySelector(".book-year").textContent = `Tahun: ${element.year}`;
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
  appendContent(searchBookResultList, searchBookResult);
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
    alert("Buku berhasil disimpan ke rak!");
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
    searchBook(bookList, keyword);
  });

renderBook(bookList);

// Prepare Local Storage
const STORAGE_KEY = "BOOK_DATA";
const savedDataString = localStorage.getItem(STORAGE_KEY);
const bookList = savedDataString ? JSON.parse(savedDataString) : [];

// Filtered Book
const searchBookResult = document.getElementById("searchBookResult");
const filteredBookList = document.getElementById("filteredBookList");
const filteredBookTemp = document.getElementById("filteredBookTemp");

// Incomplete Book
const incompleteBookList = document.getElementById("incompleteBookList");
const incompleteBookTemp = document.getElementById("incompleteBookTemp");

// Complete Book
const completeBookList = document.getElementById("completeBookList");
const completeBookTemp = document.getElementById("completeBookTemp");

// Search Book
function searchBook(books, keyword) {
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(keyword.toLowerCase()),
  );
  filteredBookList.innerHTML = "";
  filteredBooks.forEach((element) => {
    const filteredBookElement = filteredBookTemp.content.cloneNode(true);
    filteredBookElement.querySelector(".book-article").dataset.bookid =
      element.id;
    filteredBookElement.querySelector(".title").textContent = element.title;
    filteredBookElement.querySelector(".author").textContent =
      `Penulis: ${element.author}`;
    filteredBookElement.querySelector(".year").textContent =
      `Tahun: ${element.year}`;

    filteredBookList.appendChild(filteredBookElement);
  });
}

// Render Book
function renderBook(books) {
  // Render Incomplete book
  const incompleteBooks = books.filter((book) => !book.isComplete);
  incompleteBookList.innerHTML = "";
  incompleteBooks.forEach((element) => {
    const incompleteBookElement = incompleteBookTemp.content.cloneNode(true);
    incompleteBookElement.querySelector(".book-article").dataset.bookid =
      element.id;
    incompleteBookElement.querySelector(".title").textContent = element.title;
    incompleteBookElement.querySelector(".author").textContent =
      `Penulis: ${element.author}`;
    incompleteBookElement.querySelector(".year").textContent =
      `Tahun: ${element.year}`;

    incompleteBookList.appendChild(incompleteBookElement);
  });

  // Render Complete book
  const completeBooks = books.filter((book) => book.isComplete);
  completeBookList.innerHTML = "";
  completeBooks.forEach((element) => {
    const completeBookElement = completeBookTemp.content.cloneNode(true);
    completeBookElement.querySelector(".book-article").dataset.bookid =
      element.id;
    completeBookElement.querySelector(".title").textContent = element.title;
    completeBookElement.querySelector(".author").textContent =
      `Penulis: ${element.author}`;
    completeBookElement.querySelector(".year").textContent =
      `Tahun: ${element.year}`;

    completeBookList.appendChild(completeBookElement);
  });
}

// Add book
document
  .getElementById("bookForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    // Prepare the Object from the Form
    const formData = new FormData(event.target);
    let dataObject = Object.fromEntries(formData.entries());
    // Prepare and Transform the Additional Data
    dataObject.year = parseInt(dataObject.year);
    dataObject.isComplete = dataObject.isComplete === "on";
    dataObject.id = crypto.randomUUID();
    // Prepare the New JSON String
    bookList.push(dataObject);
    const dataJSON = JSON.stringify(bookList);
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, dataJSON);
    // Post-proccess
    event.target.reset();
    console.log(bookList);
    renderBook(bookList);
    alert("Buku berhasil disimpan ke rak!");
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

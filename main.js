// Do your work here...
// console.log("Hello, world!");
// localStorage.removeItem("BOOK_DATA");
const STORAGE_KEY = "BOOK_DATA";
const savedDataString = localStorage.getItem(STORAGE_KEY);
const bookList = savedDataString ? JSON.parse(savedDataString) : [];
console.log(bookList);
const incompleteBook = bookList.filter((book) => !book.isComplete);
const incompleteBookTemp = document.getElementById("incompleteBookTemp");
const incompleteBookList = document.getElementById("incompleteBookList");
const completeBook = bookList.filter((book) => book.isComplete);
const completeBookTemp = document.getElementById("completeBookTemp");
const completeBookList = document.getElementById("completeBookList");

document
  .getElementById("bookForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    let dataObject = Object.fromEntries(formData.entries());
    // isComplete on or off
    dataObject.year = parseInt(dataObject.year);
    dataObject.isComplete = dataObject.isComplete === "on";
    // push to bookList
    bookList.push(dataObject);
    // save to localStorage
    const dataJSON = JSON.stringify(bookList);
    localStorage.setItem(STORAGE_KEY, dataJSON);
    // reset form
    event.target.reset();
    // alert
    // savedDataString = localStorage.getItem(STORAGE_KEY);
    renderBookList();
    alert("Buku berhasil disimpan ke rak!");
  });

function renderBookList() {
  completeBook.forEach((element) => {
    const completeBookElement = completeBookTemp.content.cloneNode(true);

    completeBookElement.querySelector(".title").textContent = element.title;
    completeBookElement.querySelector(".author").textContent =
      `Penulis: ${element.author}`;
    completeBookElement.querySelector(".year").textContent =
      `Tahun: ${element.year}`;

    completeBookList.appendChild(completeBookElement);
  });

  incompleteBook.forEach((element) => {
    const incompleteBookElement = incompleteBookTemp.content.cloneNode(true);

    incompleteBookElement.querySelector(".title").textContent = element.title;
    incompleteBookElement.querySelector(".author").textContent =
      `Penulis: ${element.author}`;
    incompleteBookElement.querySelector(".year").textContent =
      `Tahun: ${element.year}`;

    incompleteBookList.appendChild(incompleteBookElement);
  });
}

renderBookList();

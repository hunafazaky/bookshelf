// Do your work here...
// console.log("Hello, world!");
const STORAGE_KEY = "BOOK_DATA";
const savedDataString = localStorage.getItem(STORAGE_KEY);
const bookList = savedDataString ? JSON.parse(savedDataString) : [];

document
  .getElementById("bookForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const dataObject = Object.fromEntries(formData.entries());
    // isComplete on or off
    dataObject.year = parseInt(dataObject.year);
    dataObject.isComplete = dataObject.isComplete === "on";
    // push to bookList
    bookList.push(dataObject);
    // save to localStorage
    const dataJSON = JSON.stringify(dataObject);
    localStorage.setItem(STORAGE_KEY, dataJSON);
    // reset form
    event.target.reset();
    // alert
    alert("Buku berhasil disimpan ke rak!");
  });

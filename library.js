let bookForm = document.getElementById("book-form");
let bookTitle = document.getElementById("book-title");
let bookAuthor= document.getElementById("book-author");
let bookPages = document.getElementById("book-pages");
let bookStatus = document.getElementById("book-status");
let bookFave = document.getElementById("book-fave");
let addBookBtn = document.getElementById("add-book-button");
let bookList = document.getElementById("book-list");
let sortMenu = document.getElementById("sort-by");
let myLibrary = [];

function Book(title, author, pages, status, fave){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
    this.fave = fave;
  }
  
/*Book.prototype.info = function() {
      return `${this.title} by ${this.author}, ${this.pages} pages, ${this.status}`;
}*/

function addBookToLibrary(book) {
  myLibrary.push(book);
  createRow(book);
  window.localStorage.setItem("library",JSON.stringify(myLibrary));
}

function populateFromStorage(){
  var library = JSON.parse(window.localStorage.getItem("library"));
  for (var book of library) {
    addBookToLibrary(book);
  }
}

let removeBook = function(e) {
  var books = Array.from(bookList.childNodes);
  books.splice(0,2); // remove header
  var bookRow = e.target.parentNode.parentNode;
  var index = Array.prototype.indexOf.call(books, bookRow);
  bookList.removeChild(bookRow);
  myLibrary.splice(index, 1);
  window.localStorage.setItem("library",JSON.stringify(myLibrary));
}

let toggleStatus = function(e){
  var books = Array.from(bookList.childNodes);
  books.splice(0,2); // remove header
  var bookRow = e.target.parentNode.parentNode;
  var index = Array.prototype.indexOf.call(books, bookRow);
  var book = myLibrary[index];
  book.status = !book.status;
  e.target.innerHTML = book.status ? "Completed" : "In progress";
  window.localStorage.setItem("library",JSON.stringify(myLibrary));
}

let toggleFave = function(e){
  var books = Array.from(bookList.childNodes);
  books.shift();
  var bookRow = e.target.parentNode.parentNode;
  var index = Array.prototype.indexOf.call(books, bookRow);
  var book = myLibrary[index-1];
  book.fave = !book.fave;
  e.target.innerHTML = book.fave;
  window.localStorage.setItem("library",JSON.stringify(myLibrary));
}

function createRow(book) {
    var newRow = document.createElement("tr");
    newRow.classList.add(`${myLibrary.length}-1`);

    var title = document.createElement("td");
    title.innerHTML = book.title;

    var author = document.createElement("td");
    author.innerHTML = book.author;

    var pages = document.createElement("td");
    pages.innerHTML = book.pages;

    var status = document.createElement("td");
    var statusBtn = document.createElement("BUTTON");
    statusBtn.innerHTML = book.status ? "Completed" : "In progress";
    statusBtn.addEventListener("click", toggleStatus);

    var fave = document.createElement("td");
    var faveBtn = document.createElement("BUTTON");
    faveBtn.innerHTML = book.fave;
    faveBtn.addEventListener("click", toggleFave);

    var remove = document.createElement("td");
    var removeBtn = document.createElement("BUTTON");
    removeBtn.innerHTML = "Remove";
    removeBtn.addEventListener("click",removeBook);

    bookList.appendChild(newRow);
    newRow.appendChild(title);
    newRow.appendChild(author);
    newRow.appendChild(pages);
    newRow.appendChild(status);
    newRow.lastChild.appendChild(statusBtn);
    newRow.appendChild(fave)
    newRow.lastChild.appendChild(faveBtn);
    newRow.appendChild(remove)
    newRow.lastChild.appendChild(removeBtn);
}

function filter(names, index, letter) {
  var filteredNames = names.filter(function(word) {
     return word.charAt(index) === letter;
  });
  return filteredNames;
}

function sortBy(type) {
  var types = ["title","author","pages","status","fave"];
  if (!types.includes(type)) return;
  var books = Array.from(bookList.childNodes);
  books.splice(0,2);
  var sortedBooks = myLibrary.sort(function(a, b) {
    var indexA = myLibrary.indexOf(a);
    var indexB = myLibrary.indexOf(b);
    if (type === "status" || type === "fave") {
      return myLibrary[indexA][type] < myLibrary[indexB][type] ? 1 : -1;  
    } else {
      return myLibrary[indexA][type] > myLibrary[indexB][type] ? 1 : -1;  
    }
    });
  // refresh list
  myLibrary = sortedBooks;
  books.forEach(book => bookList.removeChild(book));
  for (var book of sortedBooks) {
    createRow(book);
  }
  window.localStorage.setItem("library",JSON.stringify(myLibrary));
}

function searchBooks(){
  var books = Array.from(bookList.childNodes);
  books.splice(0,2);
  var input, filter, title;
  input = document.getElementById('myInput');
  filter = input.value.toUpperCase();
  for (i = 0; i < books.length; i++) {
    title = myLibrary[i].title;
    if (title.toUpperCase().indexOf(filter) > -1) {
      books[i].style.display = "";
    } else {
      books[i].style.display = "none";
    }
  }
}

bookForm.addEventListener("submit", function() {
  let newBook = new Book(bookTitle.value, bookAuthor.value, bookPages.value, bookStatus.checked, bookFave.checked);
  addBookToLibrary(newBook);
});

sortMenu.addEventListener("change",function(e){
  sortBy(e.target.value);
})

populateFromStorage();

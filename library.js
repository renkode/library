let bookWindow = document.querySelector(".book-window");
let bookForm = document.getElementById("book-form");
let bookTitle = document.getElementById("book-title");
let bookAuthor= document.getElementById("book-author");
let bookPages = document.getElementById("book-pages");
let bookStatus = document.getElementById("book-status");
let bookFave = document.getElementById("book-fave");
let addBookBtn = document.getElementById("add-book-button");
let bookList = document.getElementById("book-list");
let sortMenu = document.getElementById("sort-by");
let newBookBtn = document.getElementById("new-book-button");
let exitBtn = document.getElementById("exit-window");
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
  books.splice(0,2);
  var bookRow = e.target.parentNode.parentNode;
  var index = Array.prototype.indexOf.call(books, bookRow);
  bookList.removeChild(bookRow);
  myLibrary.splice(index, 1);
  window.localStorage.setItem("library",JSON.stringify(myLibrary));
}

let toggleStatus = function(e){
  var books = Array.from(bookList.childNodes);
  books.splice(0,2);
  var bookRow = e.target.parentNode.parentNode;
  var index = Array.prototype.indexOf.call(books, bookRow);
  var book = myLibrary[index];
  book.status = !book.status;
  e.target.innerHTML = book.status ? "Completed" : "In progress";
  book.status ? e.target.className = "completed": e.target.className = "in-progress";
  window.localStorage.setItem("library",JSON.stringify(myLibrary));
}

let toggleFave = function(e){
  var books = Array.from(bookList.childNodes);
  books.splice(0,2);
  var bookRow = e.target.parentNode.parentNode;
  var index = Array.prototype.indexOf.call(books, bookRow);
  var book = myLibrary[index];
  book.fave = !book.fave;
  book.fave ? e.target.lastChild.className = "fas fa-heart faved" : e.target.lastChild.className = "far fa-heart faved";
  e.target.lastChild.addEventListener('transitionend', removeTransition);
  window.localStorage.setItem("library",JSON.stringify(myLibrary));
}

function removeTransition (e) {
  if (e.propertyName !== 'transform') return; // skip it if it's not a transform
  this.classList.remove('faved');
}

function createRow(book) {
    var newRow = document.createElement("tr");

    var title = document.createElement("td");
    title.innerHTML = book.title;

    var author = document.createElement("td");
    author.innerHTML = book.author;

    var pages = document.createElement("td");
    pages.innerHTML = book.pages;

    var status = document.createElement("td");
    var statusBtn = document.createElement("BUTTON");
    statusBtn.innerHTML = book.status ? "Completed" : "In progress";
    book.status ? statusBtn.className = "completed" : statusBtn.className = "in-progress";
    statusBtn.addEventListener("click", toggleStatus);

    var fave = document.createElement("td");
    var faveBtn = document.createElement("BUTTON");
    var heart = document.createElement("i");
    faveBtn.className = "fave-button";
    faveBtn.addEventListener("click", toggleFave);
    book.fave ? heart.className = "fas fa-heart" : heart.className = "far fa-heart";

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
    newRow.lastChild.lastChild.appendChild(heart);
    newRow.appendChild(remove)
    newRow.lastChild.appendChild(removeBtn);
}

function filter(names, index, letter) {
  var filteredNames = names.filter(function(word) {
     return word.charAt(index) === letter;
  });
  return filteredNames;
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

function sortBy(type) {
  var books = Array.from(bookList.childNodes);
  books.splice(0,2);
  var sortedBooks = myLibrary.sort(function(a, b) {
    var indexA = myLibrary.indexOf(a);
    var indexB = myLibrary.indexOf(b);
    if (type === "status" || type === "fave" || type === "pages") {
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

bookForm.addEventListener("submit", function() {
  let newBook = new Book(bookTitle.value, bookAuthor.value, bookPages.value, bookStatus.checked, bookFave.checked);
  addBookToLibrary(newBook);
});

sortMenu.addEventListener("change",function(e){
  sortBy(e.target.value);
})

newBookBtn.addEventListener("click",function(){
  bookWindow.style.visibility = "visible";
})

exitBtn.addEventListener("click",function(){
  bookWindow.style.visibility = "hidden";
})

populateFromStorage();

let bookWindow = document.querySelector(".book-window");
let bookWindowTitle = document.querySelector(".book-window-title");
let bookForm = document.getElementById("book-form");
let bookTitle = document.getElementById("book-title");
let bookAuthor= document.getElementById("book-author");
let bookPages = document.getElementById("book-pages");
let bookStatus = document.getElementById("book-status");
let bookFave = document.getElementById("book-fave");
let submitBtn = document.getElementById("add-book-button");
let bookList = document.getElementById("book-list");
let sortMenu = document.getElementById("sort-by");
let newBookBtn = document.getElementById("new-book-button");
let exitBtn = document.getElementById("exit-button");
let targetIndex;

class Book {
  constructor (title, author, pages, status, fave){
    this.title = title;
    this.author = author;
    this.pages = parseInt(pages);
    this.status = status;
    this.fave = fave;
  }
}

class Library {
  constructor () {
    this.books = [];
  }

  populateFromStorage(){
    var library = JSON.parse(window.localStorage.getItem("library"));
    for (var book of library) {
      // dunno a better way of preserving prototype functions lol
      // ^ not necessary now that I've refactored this code, but I'll keep it for personal ref
      let cloneBook = new Book(book.title,book.author,book.pages,book.status,book.fave);
      this.addBook(cloneBook);
    }
  }

  addBook(book) {
    this.books.push(book);
    createRow(book);
    window.localStorage.setItem("library",JSON.stringify(this.books));
  }

  removeBook(book) {
    this.books.splice(this.books.indexOf(book), 1);
    window.localStorage.setItem("library",JSON.stringify(this.books));
  }

  updateBook = function(book, title, author, pages, status, fave){
    book.title = title;
    book.author = author;
    book.pages = pages;
    book.status = status;
    book.fave = fave;
    window.localStorage.setItem("library",JSON.stringify(this.books));
  }
}

// DOM functions

const toggleStatus = function(e){
  var books = Array.from(bookList.childNodes);
  books.splice(0,2);
  var bookRow = e.target.parentNode.parentNode;
  var index = Array.prototype.indexOf.call(books, bookRow);
  var book = library.books[index];
  book.status = !book.status;
  e.target.innerHTML = book.status ? "Completed" : "In progress";
  book.status ? e.target.className = "completed": e.target.className = "in-progress";
  window.localStorage.setItem("library",JSON.stringify(library.books));
}

const toggleFave = function(e){
  var books = Array.from(bookList.childNodes);
  books.splice(0,2);
  var bookRow = e.target.parentNode.parentNode;
  var index = Array.prototype.indexOf.call(books, bookRow);
  var book = library.books[index];
  book.fave = !book.fave;
  book.fave ? e.target.lastChild.className = "fas fa-heart faved" : e.target.lastChild.className = "far fa-heart faved";
  e.target.lastChild.addEventListener('transitionend', function(e) {
    if (e.propertyName !== 'transform') return;
    this.classList.remove('faved');
  });
  window.localStorage.setItem("library",JSON.stringify(library.books));
}

function disableButtons(bool) {
  var buttons = document.querySelectorAll("button");
  for (var button of buttons) {
    if (button.id === "add-book-button" || button.id === "exit-button") continue;
    bool ? button.disabled = true : button.disabled = false;
  }
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

    var actions = document.createElement("td");
    var editBtn = document.createElement("BUTTON");
    editBtn.innerHTML = "Edit";
    editBtn.className = "edit-button";
    editBtn.addEventListener("click",function(e){
      bookWindowTitle.innerHTML = "Edit Book";
      bookWindow.style.visibility = "visible";
      bookWindow.classList.add("fade-in");
      var books = Array.from(bookList.childNodes);
      books.splice(0,2);
      var bookRow = e.target.parentNode.parentNode;
      targetIndex = Array.prototype.indexOf.call(books, bookRow);
      bookTitle.value = library.books[targetIndex].title;
      bookAuthor.value = library.books[targetIndex].author;
      bookPages.value = library.books[targetIndex].pages;
      bookStatus.checked = library.books[targetIndex].status;
      bookFave.checked = library.books[targetIndex].fave;
      disableButtons(true);
    })

    var removeBtn = document.createElement("BUTTON");
    var trash = document.createElement("i");
    removeBtn.className = "remove-button";
    removeBtn.addEventListener("click",removeRow);
    trash.className = "fas fa-trash-alt";

    bookList.appendChild(newRow);
    newRow.appendChild(title);
    newRow.appendChild(author);
    newRow.appendChild(pages);
    newRow.appendChild(status);
    newRow.lastChild.appendChild(statusBtn);
    newRow.appendChild(fave)
    newRow.lastChild.appendChild(faveBtn);
    newRow.lastChild.lastChild.appendChild(heart);
    newRow.appendChild(actions)
    newRow.lastChild.appendChild(editBtn);
    newRow.lastChild.appendChild(removeBtn);
    newRow.lastChild.lastChild.appendChild(trash);
}

const removeRow = function(e) {
  var books = Array.from(bookList.childNodes);
  books.splice(0,2);
  var bookRow = e.target.parentNode.parentNode;
  var index = Array.prototype.indexOf.call(books, bookRow);
  bookList.removeChild(bookRow);
  library.removeBook(library.books[index]);
}

function updateRow(index) {
  // ugliest code I've ever written
  var books = Array.from(bookList.childNodes);
  books.splice(0,2);
  books[index].childNodes[0].innerHTML = library.books[index].title;
  books[index].childNodes[1].innerHTML = library.books[index].author;
  books[index].childNodes[2].innerHTML = library.books[index].pages;
  books[index].childNodes[3].lastChild.innerHTML = library.books[index].status ? "Completed" : "In progress";
  library.books[index].status ? books[index].childNodes[3].lastChild.className = "completed": books[index].childNodes[3].lastChild.className = "in-progress";
  library.books[index].fave ? books[index].childNodes[4].lastChild.lastChild.className = "fas fa-heart": books[index].childNodes[4].lastChild.lastChild.className = "far fa-heart";
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
  input = document.getElementById('search-bar');
  filter = input.value.toUpperCase();
  for (i = 0; i < books.length; i++) {
    title = library.books[i].title;
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
  var sortedBooks = library.books.sort(function(a, b) {
    var indexA = library.books.indexOf(a);
    var indexB = library.books.indexOf(b);
    if (type === "status" || type === "fave" || type === "pages") {
      return library.books[indexA][type] < library.books[indexB][type] ? 1 : -1;  
    } else {
      return library.books[indexA][type] > library.books[indexB][type] ? 1 : -1;  
    }
    });
  // refresh list
  library.books = sortedBooks;
  books.forEach(book => bookList.removeChild(book));
  for (var book of sortedBooks) {
    createRow(book);
  }
  window.localStorage.setItem("library",JSON.stringify(library.books));
}

// event listeners

bookWindow.addEventListener('animationend', function() {
  bookWindow.classList.remove('fade-in');
  if (bookWindow.classList.contains("fade-out")) {
    bookWindow.classList.remove('fade-out');
    bookWindow.style.visibility = "hidden";
  }
});

bookForm.addEventListener("submit", function() {
  if (bookWindowTitle.innerHTML === "Add Book") {
    let newBook = new Book(bookTitle.value, bookAuthor.value, bookPages.value, bookStatus.checked, bookFave.checked);
    library.addBook(newBook);
  } else {
    library.updateBook(library.books[targetIndex], bookTitle.value, bookAuthor.value, bookPages.value, bookStatus.checked, bookFave.checked);
    updateRow(targetIndex);
  }
  bookWindow.classList.add("fade-out");
  disableButtons(false);
});

sortMenu.addEventListener("change",function(e){
  sortBy(e.target.value);
})

newBookBtn.addEventListener("click",function(){
  bookWindowTitle.innerHTML = "Add Book";
  bookTitle.value = "";
  bookAuthor.value = "";
  bookPages.value = 0;
  bookStatus.checked = false;
  bookFave.checked = false;
  bookWindow.style.visibility = "visible";
  bookWindow.classList.add("fade-in");
  disableButtons(true);
})

exitBtn.addEventListener("click",function(){
  bookWindow.classList.add("fade-out");
  disableButtons(false);
})

let library = new Library();
library.populateFromStorage();
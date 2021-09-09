let bookForm = document.getElementById("book-form");
let bookTitle = document.getElementById("book-title");
let bookAuthor= document.getElementById("book-author");
let bookPages = document.getElementById("book-pages");
let bookStatus = document.getElementById("book-status");
let bookFave = document.getElementById("book-fave");
let addBookBtn = document.getElementById("add-book-button");
let bookList = document.getElementById("book-list");
let myLibrary = [];

function Book(title, author, pages, status, fave){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
    this.fave = fave;
  }
  
Book.prototype.info = function() {
      return `${this.title} by ${this.author}, ${this.pages} pages, ${this.status}`;
}

function addBookToLibrary() {
  let newBook = new Book(bookTitle.value, bookAuthor.value, bookPages.value, bookStatus.checked, bookFave.checked);
  myLibrary.push(newBook);
  createRow(newBook);
  console.table(myLibrary);
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

    var fave = document.createElement("td");
    var faveBtn = document.createElement("BUTTON");
    faveBtn.innerHTML = book.fave;

    var remove = document.createElement("td");
    var removeBtn = document.createElement("BUTTON");
    removeBtn.innerHTML = "Remove";

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

//addBookBtn.addEventListener("click", addBookToLibrary);

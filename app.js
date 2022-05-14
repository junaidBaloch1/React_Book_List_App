// Book class: Represents a book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI class: Handle UI tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();
    // const StoredBooks = [
    //   {
    //     title: "Pakistan Affairs",
    //     author: "Mohammad Ikram Rabbani",
    //     isbn: "9789696640028",
    //   },
    //   {
    //     title: "Current Affairs",
    //     author: "Mohammad Junaid Khan",
    //     isbn: "978969612345",
    //   },
    // ];
    //const Book = StoredBooks;
    // console.log(Book);
    books.forEach((book) => {
      console.log(book);
      UI.addBookToList(book);
    });
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href='#' class='btn btn-danger btn-sm delete'>X</a></td>
    `;

    list.appendChild(row);
  }
  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);

    //vanish in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }
}

// Store class: Handle Storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (books.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event: Display Book
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Add a Book

document.querySelector("#book-form").addEventListener("submit", (e) => {
  //Prevent actual submit
  e.preventDefault();
  //Get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  //validate book
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("please enter the data", "danger");
  } else {
    // instantiate Book
    const book = new Book(title, author, isbn);
    // add book to list
    UI.addBookToList(book);
    // add book to store
    Store.addBook(book);
    // show success message
    UI.showAlert("Book Added", "success");

    UI.clearFields();
  }
});

// Event: Remove a Book
document.querySelector("#book-list").addEventListener("click", (e) => {
  //Remove book from UI
  UI.deleteBook(e.target);
  //Remove book from Store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  e.preventDefault();
  // localStorage.clear();

  // console.log(e.target.parentElement.parentElementSibling.textContent);
  UI.showAlert("Book Removed from List", "success");
});

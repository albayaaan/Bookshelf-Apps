// primary const
const books = [];
const BOOKS_SELF = "books-self";
const SAVED_EVENT = "saved-book";
const RENDER_EVENT = "render-book"

// generate id
function generateId() {
    return +new Date();
}

// generate book object
function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
      }
}

// find a book
function findBook(bookId) {
    for (let book of books) {
        if (book.id === bookId) {
            return book;
        }
    }
    return null;
}

// find index book
function findBookIndex(bookId) {
    for (index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

// check local storage availability
function isStorageExist() {
    if (typeof(Storage) === undefined) {
        alert("Browser anda tidak mendukung local storage!");
        return false;
    }
    return true;
}

// save data
function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(BOOKS_SELF, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

// load data
function loadDataFromStorage() {
    const serializedData = localStorage.getItem(BOOKS_SELF);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for(book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

// add book
function addBook() {
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const isChecked = document.getElementById("inputBookIsComplete").checked;

    const generateBookId = generateId();
    const generatedBook = generateBookObject(generateBookId, bookTitle, bookAuthor, bookYear, isChecked);
    books.push(generatedBook);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();    
}

// display book 
function displayBook(bookObject) {
    const {id, title, author, year, isComplete} = bookObject;

    const textTitle = document.createElement("h5");
    textTitle.classList.add("card-title");
    textTitle.innerText = title;
    
    const textAuthor = document.createElement("p");
    textAuthor.classList.add("card-text");
    textAuthor.innerHTML = `Ditulis oleh ${author} pada tahun ${year}`;

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    cardBody.append(textTitle, textAuthor);
    
    const card = document.createElement("div");
    card.classList.add("card");
    card.append(cardBody);
    
    const cardItem = document.createElement("div");
    cardItem.classList.add("col-4","book-item");
    cardItem.append(card);
    cardItem.setAttribute("id", `book-${id}`);

    const action = document.createElement("div");
    action.classList.add("action");

    if (isComplete) {
        const unreadButton = document.createElement("button");
        unreadButton.classList.add("btn","btn-success");
        unreadButton.innerText = "Belum selesai dibaca";
        unreadButton.addEventListener("click", function () {
            addUnreadBook(id);
        })
        
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("btn","btn-danger");
        deleteButton.setAttribute("data-bs-toggle","modal");
        deleteButton.setAttribute("data-bs-target","#deleteModal");
        deleteButton.innerText = "Hapus buku";
        deleteButton.addEventListener("click", function () {
            deleteBook(id);
        })

        action.append(unreadButton, deleteButton);
        cardBody.append(action);
    } else {
        const readButton = document.createElement("button");
        readButton.classList.add("btn","btn-success");
        readButton.innerText = "Selesai dibaca";
        readButton.addEventListener("click", function () {
            addReadBook(id);
        })
        
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("btn","btn-danger");
        deleteButton.setAttribute("data-bs-toggle","modal");
        deleteButton.setAttribute("data-bs-target","#deleteModal");
        deleteButton.innerText = "Hapus buku";
        deleteButton.addEventListener("click", function () {
            deleteBook(id);
        })

        action.append(readButton, deleteButton);
        cardBody.append(action);
    }

    return cardItem;
}

// book is readed
function addReadBook(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();    
}

// book is unreaded
function addUnreadBook(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();    
}

// delete a book
function deleteBook(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget == -1) return;
    
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();    
}

// looking for some books
function searchBook() {
    const bookTitle = document.getElementById("searchBook").value;
    const listTitle = document.querySelectorAll(".card");

    for(let title of listTitle) {
        if (title.childNodes[0].childNodes[0].innerText.toLowerCase().includes(bookTitle.toLowerCase())) {
            title.style.display = "";
        } else {
            title.style.display = "none";
        }
    }
}

// event content loaded
document.addEventListener("DOMContentLoaded", function () {
    const inputBook = document.getElementById("inputBook");
    inputBook.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    })
    
    const searchButton = document.getElementById("btnSearch");
    searchButton.addEventListener("click", function () {
        searchBook();
    })

    if (isStorageExist()) {
        loadDataFromStorage();
    }
})

// save data alert to console
document.addEventListener(SAVED_EVENT, () => {
    console.log("Data telah diupdate");
})

// event render item in bookshelf
document.addEventListener(RENDER_EVENT, function () {
    const inCompleteBook = document.getElementById("incompleteBookshelfList");
    const completeBook = document.getElementById("completeBookshelfList");

    inCompleteBook.innerHTML = ""
    completeBook.innerHTML = ""

    for (bookItem of books) {
        const book = displayBook(bookItem);
        if (bookItem.isComplete) {
            completeBook.append(book);
        } else {
            inCompleteBook.append(book);
        }
    }
})

if (typeof Storage !== "undefined") {
  // Browser support storage
} else {
  alert("Browser did'nt support Storage feature");
  throw new Error("Browser did'nt support Storage feature");
}

const RENDER_EVENT = "render_booklist";
const STORAGE_KEY = "book_list";

document.addEventListener(RENDER_EVENT, function () {
  const unreadList = document.getElementById("unread");
  unreadList.innerHTML = "";

  const readList = document.getElementById("read");
  readList.innerHTML = "";

  setBookList(STORAGE_KEY, bookList);

  for (const item of bookList) {
    const bookElement = makeBookElement(item);
    if (!item.isComplete) {
      unreadList.append(bookElement);
    } else {
      readList.append(bookElement);
    }
  }

  if (unreadList.innerHTML.length == 0) {
    unreadList.innerHTML = "Tidak ada data";
  }
  if (readList.innerHTML.length == 0) {
    readList.innerHTML = "Tidak ada data";
  }
});

const bookList = getBookList(STORAGE_KEY);

document.dispatchEvent(new Event(RENDER_EVENT));

document.addEventListener("DOMContentLoaded", function () {
  const bookForm = document.getElementById("formBook");
  bookForm.addEventListener("submit", function (ev) {
    ev.preventDefault();
    addBook();
  });
});

function getBookList(storageKey) {
  const jsonString = localStorage.getItem(storageKey);

  if (jsonString !== null) {
    return JSON.parse(jsonString);
  } else {
    return [];
  }
}

function setBookList(storageKey, bookList) {
  const jsonString = JSON.stringify(bookList);

  localStorage.setItem(STORAGE_KEY, jsonString);
}

function addBook() {
  const generatedId = generateId();
  const inputTitle = document.getElementById("inputBookTitle").value;
  const inputAuthor = document.getElementById("inputBookAuthor").value;
  const inputYear = document.getElementById("inputBookYear").value;
  const inputIsComplete = document.getElementById(
    "inputBookIsComplete"
  ).checked;
  const bookObject = generateBookObject(
    generatedId,
    inputTitle,
    inputAuthor,
    inputYear,
    inputIsComplete
  );

  bookList.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function makeBookElement(bookObject) {
  const container = document.createElement("article");
  container.classList.add("book-item");

  const title = document.createElement("h2");
  title.innerText = bookObject.title;

  const author = document.createElement("p");
  author.innerText = `Penulis: ${bookObject.author}`;

  const year = document.createElement("p");
  year.innerText = `Tahun terbit: ${bookObject.year}`;

  const actions = document.createElement("div");
  actions.classList.add("flex-row");

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-btn");
  deleteButton.innerText = "Hapus dari daftar".toUpperCase();

  deleteButton.addEventListener("click", function () {
    removeBookFromList(bookObject.id);
  });

  if (bookObject.isComplete) {
    const unreadButton = document.createElement("button");
    unreadButton.classList.add("unread-btn");
    unreadButton.innerText = "Belum dibaca?".toUpperCase();

    unreadButton.addEventListener("click", function () {
      addBookToUnread(bookObject.id);
    });

    actions.append(unreadButton, deleteButton);
  } else {
    const readButton = document.createElement("button");
    readButton.classList.add("read-btn");
    readButton.innerText = "Sudah dibaca?".toUpperCase();

    readButton.addEventListener("click", function () {
      addBookToRead(bookObject.id);
    });

    actions.append(readButton, deleteButton);
  }

  container.append(title, author, year, actions);
  return container;
}

function addBookToRead(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBookToUnread(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeBookFromList(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  bookList.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBook(bookId) {
  for (const item of bookList) {
    if (item.id === bookId) {
      return item;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in bookList) {
    if (bookList[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

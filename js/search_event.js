const SEARCH_EVENT = "search_book";

var searchList = [];

document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.getElementById("formSearch");
  searchForm.addEventListener("submit", function (ev) {
    ev.preventDefault();
    searchBook();
  });
});

document.addEventListener(SEARCH_EVENT, function () {
  const unreadList = document.getElementById("unread");
  unreadList.innerHTML = "";

  const readList = document.getElementById("read");
  readList.innerHTML = "";

  for (const item of searchList) {
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

function searchBook() {
  const query = document.getElementById("inputSearch").value;
  searchList = [];

  for (const item of bookList) {
    const titleToCompare = item.title.toLowerCase();

    if (titleToCompare.includes(query.toLowerCase())) {
      searchList.push(item);
    }
  }
  document.dispatchEvent(new Event(SEARCH_EVENT));
}

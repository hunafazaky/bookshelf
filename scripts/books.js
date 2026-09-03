// Pure array transforms — each returns a new array rather than mutating
// the one passed in.

export function addBook(books, book) {
  return [...books, book];
}

export function updateBook(books, id, updates) {
  return books.map((book) => (book.id === id ? { ...book, ...updates } : book));
}

export function removeBook(books, id) {
  return books.filter((book) => book.id !== id);
}

export function toggleComplete(books, id) {
  return books.map((book) => (book.id === id ? { ...book, isComplete: !book.isComplete } : book));
}

export function filterByTitle(books, keyword) {
  const normalized = keyword.trim().toLowerCase();
  if (!normalized) return [];
  return books.filter((book) => book.title.toLowerCase().includes(normalized));
}

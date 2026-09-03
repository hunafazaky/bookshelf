const STORAGE_KEY = "BOOK_DATA";

/**
 * Loads the saved book list, falling back to an empty list if nothing is
 * saved yet or the saved JSON is somehow corrupted.
 * @returns {Array}
 */
export function loadBooks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];

  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error("Could not parse saved book data:", error);
    return [];
  }
}

/**
 * @param {Array} books
 */
export function saveBooks(books) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

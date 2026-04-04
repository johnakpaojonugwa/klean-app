export const createPageUrl = (pageName) => {
  return '/' + pageName
    .toLowerCase()            // URLs are usually lowercase
    .trim()                   // Remove accidental trailing spaces
    .replace(/\s+/g, '-');    // Replaces one or more spaces with a single dash
};
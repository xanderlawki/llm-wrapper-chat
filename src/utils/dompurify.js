import DOMPurify from "dompurify";

export const cleanResponse = (rawHtml) => {
  const cleanHtml = DOMPurify.sanitize(rawHtml); // This will remove unwanted tags/attributes
  return cleanHtml;
};

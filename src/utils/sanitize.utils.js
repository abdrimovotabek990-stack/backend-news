import sanitizeHtml from "sanitize-html";

export const sanitizeTitle = (title = "") => {
    return sanitizeHtml(title, {
        allowedTags: [],
        allowedAttributes: {},
    }).trim();
};

export const sanitizeDescription = (description = "") => {
    return sanitizeHtml(description, {
        allowedTags: [
            "p", "br", "b", "i", "em", "strong",
            "u", "ul", "ol", "li", "blockquote",
            "h2", "h3", "a"
        ],
        allowedAttributes: {
            a: ["href", "target", "rel"],
        },
        allowedSchemes: ["http", "https"],
    }).trim();
};
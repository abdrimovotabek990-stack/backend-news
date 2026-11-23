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


export const parseArrayField = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) return parsed.filter(Boolean);
        } catch {
        }
        return value.split(',').map((item) => item.trim()).filter(Boolean);
    }
    return [];
};
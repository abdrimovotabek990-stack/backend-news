import slugify from "slugify";
import sanitizeHtml from "sanitize-html";

/**
 * UnikalSlug yaratish uchun funksiya
 * @param {string} title - Tag uchun
 * @param {Object} Model - Mg db uchun
 * @returns {Promise<string>} - Unikal slug
 */

export const generateUniqueSlug = async (title, Model) => {
    if (!title) return "";

    const cleanTitle = sanitizeHtml(title, {
        allowedTags: [],
        allowedAttribures: {},
    });

    let slug = slugify(cleanTitle, {
        lower: true, strict: true, trim:true
    })

    while (isSlugExists) {
        const randomCode = Math.floor(1000 + Math.random() * 9000)
        const tempSlug = '${slug}-${randomCode}';

        isSlugExists = await Model.findone({ slug: tempSlug})

        if (!isSlugExists){
            slug = tempSlug;
        }
    }
    return slug

};

import fs from "fs/promises";
import path from "path";

const UPLOAD_NEWS_DIR = path.resolve(process.env.UPLOAD_DIR || "uploads", "news");

export const formatUploadedFiles = (files = []) => {
    return files.map((file) => ({
        url: `/uploads/news/${file.filename}`,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
    }));
};

export const deleteFiles = async (files = []) => {
    if (!Array.isArray(files) || files.length === 0) return;

    await Promise.all(
        files.map(async (file) => {
            try {
                let filePath;

                if (typeof file === "string") {
                    filePath = path.join(UPLOAD_NEWS_DIR, file);
                } else if (file?.path) {
                    filePath = file.path;
                } else if (file?.filename) {
                    filePath = path.join(UPLOAD_NEWS_DIR, file.filename);
                }

                if (filePath) {
                    await fs.unlink(filePath);
                }
            } catch (error) {
                if (error.code !== "ENOENT") {
                    console.error("Faylni o'chirishda xatolik:", error.message);
                }
            }
        })
    );
};


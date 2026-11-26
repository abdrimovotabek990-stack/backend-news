import fs from "fs/promises";
import multer from "multer";
import { fileTypeFromFile } from "file-type";
import { uploadNewsMulter } from "../config/multer.js";
import ApiError from "../utils/ApiError.utils.js";
// ***
const ALLOWED_MAGIC_MIMES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
]);

const removeTempFiles = async (files = []) => {
    await Promise.allSettled(
        files.map((file) => fs.unlink(file.path))
    );
};

export const uploadNewsImages = (req, res, next) => {
    uploadNewsMulter.array("images", 5)(req, res, async (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === "LIMIT_FILE_SIZE") {
                    return next(new ApiError(413, "Har bir rasm hajmi 5 MB dan oshmasligi kerak"));
                }
                if (err.code === "LIMIT_FILE_COUNT") {
                    return next(new ApiError(400, "Bitta so'rovda ko'pi bilan 5 ta rasm yuklash mumkin"));
                }
                if (err.code === "LIMIT_UNEXPECTED_FILE") {
                    return next(new ApiError(400, "Rasmlar faqat 'images' maydoni orqali yuborilishi kerak"));
                }
                return next(new ApiError(400, err.message));
            }
            return next(err);
        }

        const files = req.files || [];

        try {
            for (const file of files) {
                const detected = await fileTypeFromFile(file.path);
                if (!detected || !ALLOWED_MAGIC_MIMES.has(detected.mime)) {
                    await removeTempFiles(files);
                    return next(
                        new ApiError(415, "Yuklangan fayl haqiqiy rasm emas (faqat JPEG, PNG, WEBP)")
                    );
                }
            }
            next();
        } catch (checkError) {
            await removeTempFiles(files);
            next(checkError);
        }
    });
};

export const parseNewsBody = (req, _res, next) => {
    if (!req.body) {
        req.body = {};
    }

    if (typeof req.body.tags === "string") {
        const trimmed = req.body.tags.trim();
        if (!trimmed) {
            req.body.tags = [];
        } else if (trimmed.startsWith("[")) {
            try {
                const parsed = JSON.parse(trimmed);
                req.body.tags = Array.isArray(parsed) ? parsed : [parsed];
            } catch {
                return next(new ApiError(400, "tags maydoni noto'g'ri JSON formatda"));
            }
        } else {
            req.body.tags = trimmed.split(",").map((id) => id.trim()).filter(Boolean);
        }
    } else if (!req.body.tags) {
        req.body.tags = [];
    }

    next();
};
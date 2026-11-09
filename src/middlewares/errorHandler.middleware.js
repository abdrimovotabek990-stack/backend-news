import multer from 'multer';

const errorHandler = (err, req, res, next) => {
    console.log("2. errorHandler xatoni qabul qildi!");
    
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Serverda xatolik yuz berdi';
    let errors = err.errors || [];

    // 1. MULTER XATOLIKLARI
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            statusCode = 413;
            message = 'Fayl hajmi ruxsat etilgan limitdan oshib ketdi (Maksimal: 5MB)';
        } else if (err.code === 'LIMIT_FILE_COUNT') {
            statusCode = 400;
            message = 'Fayl soni ruxsat etilgan limitdan oshib ketdi (Maksimal: 10ta)';
        } else {
            statusCode = 400;
            message = `Fayl yuklashda xatolik yuz berdi: ${err.message}`;
        }
    } // <-- MANA SHU QAVS TUSHIB QOLGAN EDI (Multer bloki yopildi)


    // 2. JOI / MONGOOSE VALIDATSIYA XATOLIKLARI 
    if (err.name === 'ValidationError' || err.isJoi) {
        statusCode = 400;
        message = 'Ma\'lumotlarni tekshirishda xatolik yuz berdi';
        
        if (err.isJoi) {
            errors = err.details.map((item) => ({
                field: item.context.key || item.path.join('.'),
                message: item.message,
            }));
        } else if (err.errors) {
            errors = Object.values(err.errors).map((item) => ({
                field: item.path,
                message: item.message,
            }));
        }
    }

    // 3. JWT XATOLIKLARI 
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Token yaroqsiz, qayta kiring';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token muddati tugagan yoki yaroqsiz, tizimga qaytadan kiring';
    }

    // 4. MONGODB XATOLIKLARI
    if (err.name === 'CastError') { 
        statusCode = 400;
        message = `Noto'g'ri ${err.path} qiymati: ${err.value}`;
    }

    if (err.code === 11000) { 
        statusCode = 409;
        const field = Object.keys(err.keyValue)[0];
        message = `Ushbu ${field} qiymati allaqachon mavjud`;
    }

    // 5. JAVOB QAYTARISH
    const isProduction = process.env.NODE_ENV === 'production';

    if (statusCode === 500) {
        console.error(`[ERROR 500]:`, err);
        if (!isProduction) {
            message = "Serverda xatolik yuz berdi";
            errors = [];
        }
    }


    res.status(statusCode).json({
        success: false,
        message,
        ...(errors.length > 0 && { errors }),
        ...(!isProduction && statusCode === 500 && { stack: err.stack }),
    });
};


export default errorHandler;
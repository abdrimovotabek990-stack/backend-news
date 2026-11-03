import multer from 'multer';

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Serverda xatolik yuz berdi';
    let errors = err.errors || [];

    if (err instanceof multer.MulterError) {
        
        if (err.name === 'ValidationError') {
             statusCode = 400;
             message = 'Ma\'lumotlarni tekshirishdaxatolik yuz berdi';
             errors = Object.values(err.errors).map((item) =>({
                  field: item.path,
                  message: item.message,
              }));
        }

        if (err.code === 'LIMIT_FILE_SIZE') {
            statusCode = 400;
            message = 'Fayl hajmi ruxsat etilgan limitdan oshib ketdi';
        } else if (err.code === 'LIMIT_FILE_COUNT') {
            statusCode = 400;
            message = 'Fayl soni ruxsat etilgan limitdan oshib ketdi';
        } else {
            statusCode = 400;
            message = `Fayl yuklashda xatolik yuz berdi ${err.message}`;
        }


        if (err.name === 'JsonWebTokenError') {
            statusCode = 401;
            message = 'Token yaroqsiz, qayta kiring '
        } else if (err.name === 'TokenExpiredError') {
            statusCode = 401;
            message = 'Token muddati tugagan yoki yaroqsiz'
        }


        if (err.name === 'CastError') { // resurs yo'qligi uchun (yoki rusat berilmagan ko'rishfa)
            statusCode = 400;
            message = `Noto'g'ri ${err.path} qiymati: ${err.value}`;
        }

        if (err.code === 11000) { // duplication
            statusCode = 409;
            const field = Object.keys(err.keyValue)[0];
            message = `Ushbu ${field} qiymati allaqachon mavjud`;
        }

        const isProduction = process.env.NODE_ENV === 'production';

        if (statusCode === 500) {
            console.error(`[ERROR 500]: ${err.stack || err}'`);
            if (!isProduction) {
                message = "serverda xatolik yuz berdi";
                errors =[];
            }
        }
        res.status(statusCode).json({
            success: false,
            message,
            ...(errors.length > 0 && { errors }),
        ...(!isProduction && statusCode === 500 && { stack: err.stack }),
        });
    };


}    
    


export default errorHandler;
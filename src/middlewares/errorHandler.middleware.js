import multer from 'multer';

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Serverda xatolik yuz berdi';
    let errors = err.errors || [];

    if (err instanceof multer.MulterError) {
        
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

        if (err.name === 'ValidationError') {
             statusCode = 400;
             message = 'Ma\'lumotlarni tekshirishdaxatolik yuz berdi';
             errors = Object.values(err.errors).map((item) =>({
                  field: item.path,
                  message: item.message,
              }));
        }


        if (err.name === 'JsonWebTokenError') {
            statusCode = 401;
            message = 'Token yaroqsiz, qayta kiring '
        } else if (err.name === 'TokenExpiredError') {
            statusCode = 401;
            message = 'Token muddati tugagan yoki yaroqsiz'
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
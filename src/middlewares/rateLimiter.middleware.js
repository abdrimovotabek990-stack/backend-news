import {rateLimit} from 'express-rate-limit';

const rateLimiter = rateLimit({ 
    windowMs: 5 * 60 * 1000, 
    limit: 10,
    message: "Siz juda ko'p so'rov yubordingiz, iltimos 5 daqiqa kuting va qayta urinib ko'ring",
});

export default rateLimiter;
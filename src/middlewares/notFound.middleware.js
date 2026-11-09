import ApiError from "../utils/ApiError.utils.js";


const notFound = (req, res, next) => {
  next(new ApiError(404, `Bunday endpoint mavjud emas: ${req.originalUrl}`));
};

export default notFound;

export const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => {
            console.log("1. asyncHandler xatoni ushladi:", err.message || err); // <-- SHU QATOR QO'SHILDI
            next(err);
        });
    };
};
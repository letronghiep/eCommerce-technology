const catchAsync = (f) => {
    return async (req, res, next) => {
        try {
            await f(req, res, next);
        } catch (err) {
            next(err);
        }
    };
};

module.exports = catchAsync;

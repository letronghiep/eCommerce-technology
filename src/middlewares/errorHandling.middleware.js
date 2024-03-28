const StatusCodes = require('http-status-codes');

// Middleware xử lý lỗi tập trung trong ứng dụng Back-end NodeJS (ExpressJS)
exports.errorHandlingMiddleware = (err, req, res, next) => {
    // Nếu dev không cẩn thận thiếu statusCode thì mặc định sẽ để code 500 INTERNAL_SERVER_ERROR
    if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

    // Tạo ra một biến responseError để kiểm soát những gì muốn trả về
    const responseError = {
        statusCode: err.statusCode,
        message: err.message || StatusCodes[err.statusCode], // Nếu lỗi mà không có message thì lấy ReasonPhrases chuẩn theo mã Status Code
        stack: err.stack,
    };
    // console.error(responseError)

    // Chỉ khi môi trường là DEV thì mới trả về Stack Trace để debug dễ dàng hơn, còn không thì xóa đi. (Muốn hiểu rõ hơn hãy xem video 55 trong bộ MERN Stack trên kênh Youtube: https://www.youtube.com/@trungquandev)
    // if (env.BUILD_MODE !== 'dev') delete responseError.stack

    // Trả responseError về phía Front-end
    return res.status(responseError.statusCode).json(responseError);
};

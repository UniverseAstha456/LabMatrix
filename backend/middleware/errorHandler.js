module.exports = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal server error";

    if (err.code === "ER_DUP_ENTRY") {
        statusCode = 409;
        message = "A record with this value already exists";
    }

    if (err.code === "ER_NO_REFERENCED_ROW_2") {
        statusCode = 400;
        message = "A referenced record does not exist";
    }

    if (statusCode >= 500) {
        console.error(err);
    }

    res.status(statusCode).json({
        success: false,
        message
    });
};
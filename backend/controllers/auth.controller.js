const asyncHandler = require("../utils/asyncHandler");

const authService = require("../services/auth.service");
const userModel = require("../models/user.model");

exports.register = asyncHandler(async (req, res) => {
    const data = await authService.register(req.body);

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data
    });
});

exports.login = asyncHandler(async (req, res) => {
    const data = await authService.login(
        req.body.email,
        req.body.password
    );

    res.status(200).json({
        success: true,
        message: "Login successful",
        data
    });
});

exports.me = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.user.user_id);

    if (!user) {
        const AppError = require("../utils/AppError");
        throw new AppError("User not found", 404);
    }

    res.status(200).json({
        success: true,
        data: user
    });
});
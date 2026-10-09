const router = require("express").Router();
const { z } = require("zod");

const controller = require("../controllers/auth.controller");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const validate = require("../middleware/validate");

const base = {
    full_name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(120),
    password: z.string().min(8).max(72),
    phone: z.string().max(15).optional()
};

const registerSchema = z.discriminatedUnion("role", [
    z.object({
        ...base,
        role: z.literal("Admin")
    }),

    z.object({
        ...base,
        role: z.literal("Student"),
        enrollment_no: z.string().min(1).max(20),
        batch_id: z.number().int().positive()
    }),

    z.object({
        ...base,
        role: z.literal("Faculty"),
        employee_id: z.string().min(1).max(20),
        department: z.string().min(1).max(60),
        designation: z.string().max(50).optional()
    }),

    z.object({
        ...base,
        role: z.literal("Technician"),
        employee_id: z.string().min(1).max(20),
        specialization: z.string().max(60).optional()
    })
]);

const loginSchema = z.object({
    email: z.string().trim().email(),
    password: z.string().min(1)
});

// Public endpoint
router.post(
    "/login",
    validate(loginSchema),
    controller.login
);

// Admin-only endpoint
router.post(
    "/register",
    auth,
    role("Admin"),
    validate(registerSchema),
    controller.register
);

// Authenticated users can view their own profile
router.get(
    "/me",
    auth,
    controller.me
);

module.exports = router;
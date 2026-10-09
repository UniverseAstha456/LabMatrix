require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "LabMatrix backend is healthy"
    });
});

// Root
app.get("/", (req, res) => {
    res.json({
        message: "LabMatrix API is running"
    });
});

// Database test
app.get("/api/test-db", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT 1 AS result");

        res.status(200).json({
            success: true,
            message: "MySQL connected successfully!",
            data: rows
        });
    } catch (error) {
        console.error("MYSQL ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: error.message
        });
    }
});

// Register application routes
app.use("/api", require("./routes"));

// Error-handling middleware must come after routes
app.use(require("./middleware/errorHandler"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
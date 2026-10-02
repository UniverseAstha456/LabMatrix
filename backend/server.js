require("dotenv").config();

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "LabMatrix API is running" });
});

require("dotenv").config();

app.get("/api/test-db", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT 1 AS result");

        res.json({
            success: true,
            message: "MySQL connected successfully!",
            data: rows
        });
    } 
    catch (error) {
    console.error("MYSQL ERROR:", error);

    res.status(500).json({
        success: false,
        message: "Database connection failed",
        error: error.message
    });
}
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
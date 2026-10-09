const pool = require("../config/db");

exports.findByEmail = async (email) => {
    const [rows] = await pool.execute(
        "SELECT * FROM app_user WHERE email = ?",
        [email]
    );

    return rows[0];
};

exports.findById = async (id) => {
    const [rows] = await pool.execute(
        `SELECT
            user_id,
            full_name,
            email,
            role,
            phone,
            is_active,
            created_at
         FROM app_user
         WHERE user_id = ?`,
        [id]
    );

    return rows[0];
};
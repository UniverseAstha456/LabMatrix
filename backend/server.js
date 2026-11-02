   require('dotenv').config();
   const app = require('./app');
   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

   app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "LabMatrix API is running"
    });
});
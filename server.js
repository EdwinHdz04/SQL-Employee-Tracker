//import and require mysql2
const express = require ('express');
const mysql = require ('mysql2');

const PORT = process.env.PORT || 3001;
const app = express ();

//Express middleware
app.use



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
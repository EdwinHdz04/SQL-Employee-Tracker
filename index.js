//require mysql2 
const mysql = require ('mysql2');
const ctable = require ('console.table');


//Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        //MySQL username,
        user: 'root',
        //MySQL password
        password: '338186',
        database: 'company_db'
    },
    console.log(`connected to the company_db database`)
);



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
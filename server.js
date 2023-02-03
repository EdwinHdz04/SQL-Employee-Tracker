//require mysql2,inquirer and console table
const mysql = require('mysql2');
const inquirer = require('inquirer');
const Connection = require('mysql2/typings/mysql/lib/Connection');
require ('console.table');

//declaring menu prompts 

const menuMessages={
    viewAllemployees: "View All Employees",

}
  

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


//This function will create menu prompts
function prompt(){
    inquirer
     .prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            promptMessages.viewAllemployees,
            promptMessages.viewBydepartment,
            promptMessages.viewBymanager,
            promptMessages.viewAllroles,
            promptMessages.addEmployee,
            promptMessages.removeEmployee,
            promptMessages.updateRole,
            promptMessages.exit
        
        ]
     })
     .then(answer => {
        console.log('answer', answer);
            switch ( answer.action){
                case promptMessages.viewAllemployees:
                    viewAllemployees();
                    break
                
                case promptMessages.viewBydepartment:
                    viewBydepartment();
                    break

                case promptMessages.viewBymanager:
                    viewBymanager();
                    break

                case promptMessages.addEmployee:
                    addEmployee();
                    break

                case promptMessages.removeEmployee:
                    removeEmployee();
                    break

                case promptMessages.updateRole:
                    updateRole();
                    break

                case promptMessages.viewAllroles:
                    viewAllroles();
                    break

                case promptMessages.exit:
                Connection.end()
                break;

            }    
    });
};








const addEmployee = () =>{
    inquirer
  .prompt([
    {
      type: 'list',
      name: 'addEmployee',
      message: 'What type of employee do you want to create?',
      choices: ['sales Lead','Sales Person ','Lead Engineer','Software Engineer','Account Manager','Accountant','Legal Team Lead','Lawyer'],
    }

])
.then(answers => {
    switch (answers.addEmployee) {
        case "sales Lead" : 
             makeSaleslead();
            break;
    
        case "Sales Person" : 
            makeSalesperson();
            break;

        case "Lead Engineer " :
            makeLeadEngineer();
            break;

        case "Software Engineer" :
            makeSoftwareengineer();
             break;

        case "Account Manager" :
            makeAccountmanager();
            break;  

        case "Accountant" :
            makeAccountant();
            break;
                  
        case "Legal Team Lead" :
            makeLegalteamlead();
            break;
        
        case "Legal Team Lead" :
            makeLegalteamlead();
            break;    

        let htmlPageContent = generateHTML(answers)
        createFile('./src/barebones.html', htmlPageContent);
    }  
}) 
}


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
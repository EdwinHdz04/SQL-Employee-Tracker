//require mysql2,inquirer and console table
const mysql = require('mysql2');
const inquirer = require('inquirer');
const Connection = require('mysql2/typings/mysql/lib/Connection');

require ('console.table');

//declaring menu prompts 

const menuMessages = {
    viewAllemployees: "View All Employees",
    viewBydepartment: "View All Employees By Department",
    viewBymanager: "View All Employees By Manager",
    addEmployee: "add An Employee",
    removeEmployee: "Remove An Employee",
    updateRole: "Update Employee Role",
    updateEmployeeManager : " Update Employee Manger",
    viewAllroles: "View All Roles",
    exit: "exit"
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
    });
    
db.connect(err => {
    if(err) throw err;
    prompt();
});

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

function viewAllemployees() {
    const query = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS departments, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employees
    LEFT JOIN employees manager ON (roles.id = employees.roles_id) 
    INNER JOIN roles ON (roles.id = employees.roles_id)
    INNER JOIN departments ON (departments.id = roles.departments_id)
    ORDER BY employees.id;`;

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW ALL EMPLOYEES');
        console.log('\n');
        console.table(res);
        prompt();
    });
}
function viewBydepartment(){
    const query = `SELECT departments.name AS departments, roles.title, employees.id, employees.first_name, employees.last_name
    FROM employees
    LEFT JOIN roles ON (roles.id = employees.roles_id)
    LEFT JOIN departments ON (departments.id = role.departments_id)
    ORDER by departments.name;`;

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW EMPLOYEES BY DEPARTMENT');
        console.log('\n');
        console.table(res);
        prompt();

    });
}

function viewBymanager(){
    const query = `SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, departments.name AS departments, employees.id, employees.first_name, employees.last_name, roles.title
    FROM employees
    LEFT JOIN employees manager ON manager.id = employees.manager_id
    INNER JOIN roles ON (roles.id = employees.roles_id && employees.manager_id != 'NULL')
    INNER JOIN departments ON (departments.id = roles.departments_id) 
    ORDER BY manager;`;

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW EMPLOYEES BY MANAGER');
        console.log('\n');
        console.table(res);
        prompt();

    });
}

function viewAllroles(){
    const query = `SELECT roles.title, employees.id,  employees.first_name, employees.last_name, departments.name AS departments
    FROM employees
    LEFT JOIN roles ON (roles.id = employees.roles_id)
    LEFT JOIN departments ON (departments.id = roles.departments_id)
    ORDER BY roles.title;`;

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW EMPLOYEES BY ROLES');
        console.log('\n');
        console.table(res);
        prompt();

    });

}

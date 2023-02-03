//require mysql2,inquirer and console table
const mysql = require('mysql2');
const inquirer = require('inquirer');
const conTable = require('console.table');

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
            viewAllemployees,
            viewBydepartment,
            viewBymanager,
            viewAllroles,
            addEmployee,
            removeEmployee,
            updateRole,
            'exit' ]
     })
     .then(answer => {
  
            switch ( answer.action){
                case "viewAllemployees":
                    viewAllemployees();
                    break
                
                case "viewBydepartment":
                    viewBydepartment();
                    break

                case "viewBymanager":
                    viewBymanager();
                    break

                case "addEmployee":
                    addEmployee();
                    break

                case "removeEmployee":
                    removeEmployee();
                    break

                case "updateRole":
                    updateRole();
                    break

                case "viewAllroles":
                    viewAllroles();
                    break

                case 'exit':
                    db.end()
                break;

            }    
    });
};

function viewAllemployees() {
    const query = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS departments, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employees
    LEFT JOIN employees manager on manager.id = employees.manager_id
    INNER JOIN roles ON (roles.id = employees.roles_id)
    INNER JOIN departments ON (departments.id = roles.departments_id)
    ORDER BY employees.id;`;

    db.query(query, (err, res) => {
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
    LEFT JOIN departments ON (departments.id = roles.departments_id)
    ORDER by departments.name;`;

    db.query(query, (err, res) => {
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

    db.query(query, (err, res) => {
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

    db.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW EMPLOYEES BY ROLES');
        console.log('\n');
        console.table(res);
        prompt();

    });

}

async function addEmployee() {
    const addname = await inquirer.prompt(askName());
    db.query('SELECT roles.id, roles.title FROM roles ORDER BY roles.id;', async (err, res) => {
        if (err) throw err;
        const { roles } = await inquirer.prompt([
            {
                name: 'roles',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: 'What is the employee role?: '
            }
        ]);
        let rolesId;
        for (const row of res) {
            if (row.title === roles) {
                rolesId = row.id;
                continue;
            }
        }
        db.query('SELECT * FROM employees', async (err, res) => {
            if (err) throw err;
            let choices = res.map(res => `${res.first_name} ${res.last_name}`);
            choices.push('none');
            let { manager } = await inquirer.prompt([
                {
                    name: 'manager',
                    type: 'list',
                    choices: choices,
                    message: 'Choose the employee Manager: '
                }
            ]);
            let managerId;
            let managerName;
            if (manager === 'none') {
                managerId = null;
            } else {
                for (const data of res) {
                    data.fullName = `${data.first_name} ${data.last_name}`;
                    if (data.fullName === manager) {
                        managerId = data.id;
                        managerName = data.fullName;
                        console.log(managerId);
                        console.log(managerName);
                        continue;
                    }
                }
            }
            console.log('Employee has been added. Please view all employee to verify...');
            db.query(
                'INSERT INTO employees SET ?',
                {
                    first_name: addname.first,
                    last_name: addname.last,
                    roles_id: rolesId,
                    manager_id: parseInt(managerId)
                },
                (err, res) => {
                    if (err) throw err;
                    prompt();

                }
            );
        });
    });

}
function remove(input) {
    const promptQ = {
        yes: "yes",
        no: "no I don't (view all employees on the main option)"
    };
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "In order to proceed an employee, an ID must be entered. View all employees to get" +
                " the employee ID. Do you know the employee ID?",
            choices: [promptQ.yes, promptQ.no]
        }
    ]).then(answer => {
        if (input === 'delete' && answer.action === "yes") removeEmployee();
        else if (input === 'roles' && answer.action === "yes") updateRole();
        else viewAllEmployees();



    });
};

async function removeEmployee() {

    const answer = await inquirer.prompt([
        {
            name: "first",
            type: "input",
            message: "Enter the employee ID you want to remove:  "
        }
    ]);

    db.query('DELETE FROM employees WHERE ?',
        {
            id: answer.first
        },
        function (err) {
            if (err) throw err;
        }
    )
    console.log('Employee has been removed on the system!');
    prompt();

};

function askId() {
    return ([
        {
            name: "name",
            type: "input",
            message: "What is the employee ID?:  "
        }
    ]);
}


async function updateRole() {
    const employeeId = await inquirer.prompt(askId());

    db.query('SELECT roles.id, roles.title FROM roles ORDER BY roles.id;', async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: 'What is the new employee role?: '
            }
        ]);
        let roleId;
        for (const row of res) {
            if (row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        db.query(`UPDATE employees 
        SET roles_id = ${roleId}
        WHERE employees.id = ${employeeId.name}`, async (err, res) => {
            if (err) throw err;
            console.log('Role has been updated..')
            prompt();
        });
    });
}

function askName() {
    return ([
        {
            name: "first",
            type: "input",
            message: "Enter the first name: "
        },
        {
            name: "last",
            type: "input",
            message: "Enter the last name: "
        }
    ]);
}



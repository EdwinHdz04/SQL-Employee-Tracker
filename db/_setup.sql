SELECT roles.id, roles.title, roles.salary FROM roles ORDER BY roles.id
SELECT roles.id, roles.title, FROM  roles ORDER BY roles.id
SELECT * FROM employees;

SELECT departments.id, departments,name FROM departments ORDER by departments_id;

SELECT departments.name AS departments, roles.title, employees.id, employees.first_name, employees.last_name
    FROM employees
    LEFT JOIN roles ON (roles.id = employees.roles_id)
    LEFT JOIN departments ON (departments.id = role.departments_id)
    ORDER by departments.name;

SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, departments.name AS departments, employees.id, employees.first_name, employees.last_name, roles.title
    FROM employees
    LEFT JOIN employees manager ON manager.id = employees.manager_id
    INNER JOIN roles ON (roles.id = employees.roles_id && employees.manager_id != 'NULL')
    INNER JOIN departments ON (departments.id = roles.departments_id) 
    ORDER BY manager;

SELECT roles.title, employees.id,  employees.first_name, employees.last_name, departments.name AS departments
    FROM employees
    LEFT JOIN roles ON (roles.id = employees.roles_id)
    LEFT JOIN departments ON (departments.id = roles.departments_id)
    ORDER BY roles.title;

SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS departments, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employees
    LEFT JOIN employees manager ON (roles.id = employees.roles_id) 
    INNER JOIN roles ON (roles.id = employees.roles_id)
    INNER JOIN departments ON (departments.id = roles.departments_id)
    ORDER BY employees.id;

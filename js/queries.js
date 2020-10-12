// Class to hold sql strings and a method to run them as a query
class Query {
    constructor(sqlString) {
        this.sqlString = sqlString;
    };
    runQuery(connection, values) {
        // Binding this to that so it can be referenced within the promise
        const that = this;
        // Wrapped connection.query in a Promise so calling function can wait for a Promise
        return new Promise(function (resolve, reject) {
            connection.query(that.sqlString, values, (err, data) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(data)
                }
            })
        })
    }
}

// Return all employees
const viewEmployees = new Query(`SELECT employee.id AS id, 
    CONCAT(employee.first_name, " ", employee.last_name) as name, 
    title, 
    name as department, 
    salary, 
    CONCAT(managers.first_name, " ", managers.last_name) AS manager
    FROM department
    INNER JOIN role ON department.id = role.department_id
    INNER JOIN employee ON role.id = employee.role_id
    LEFT JOIN employee managers ON managers.id = employee.manager_id`)

// Return all departments
const viewDepartments = new Query('SELECT id, name AS department FROM department');
// Return all roles
const viewRoles = new Query('SELECT id, title FROM role');
// Return all roles that meet supplied condition
const viewRolesBy = new Query('SELECT id, title FROM role WHERE ?');
// Return all employees that meet supplied condition
const viewEmployeesBy = new Query(viewEmployees.sqlString + " WHERE ?")
// Add an employee with supplied values
const addEmployee = new Query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) 
    VALUES (?, ?, ?, ?);`);
// Add department with supplied value
const addDepartment = new Query(`INSERT INTO department (name) 
    VALUES (?);`)
// Add role with supplied values
const addRole = new Query(`INSERT INTO role (title, salary, department_id) 
    VALUES (?, ?, ?);`);
// Return all managers
const viewManagers = new Query(`SELECT DISTINCT manager.id AS id, 
    CONCAT(manager.first_name, " ", manager.last_name) AS name,
    title,
    name AS department
    FROM department
    INNER JOIN role ON department.id = role.department_id
    INNER JOIN employee manager ON role.id = manager.role_id
    INNER JOIN employee ON manager.id = employee.manager_id;`)
// Assign a new manager id for a specified employee id
const updateManagerForEmployee = new Query(`UPDATE employee SET manager_id = ? WHERE id = ?;
`)
// Delete from a supplied table where a supplied condition is met
const deleteRowFrom = new Query(`DELETE FROM ?? WHERE ?`)
// Return a sum of all salaries of a supplied department id
const budgetByDepartment = new Query(`SELECT SUM(salary) budget FROM role 
JOIN employee ON employee.role_id = role.id
WHERE department_id = ? GROUP BY department_id`)

// Exporting all above objects
module.exports = {
    viewEmployees: viewEmployees,
    viewDepartments: viewDepartments,
    viewRoles: viewRoles,
    viewRolesBy: viewRolesBy,
    viewEmployeesBy: viewEmployeesBy,
    addEmployee: addEmployee,
    addDepartment: addDepartment,
    addRole: addRole,
    viewManagers: viewManagers,
    updateManagerForEmployee: updateManagerForEmployee,
    deleteRowFrom: deleteRowFrom,
    budgetByDepartment: budgetByDepartment
}
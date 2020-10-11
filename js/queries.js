// const mysql = require("mysql");
// const connection = require("./connection")
const { promisify } = require("util")


class Query {
    constructor(sqlString) {
        this.sqlString = sqlString;
    };
    runQuery(connection, values) {
        const that = this;
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


const viewEmployees = new Query(`SELECT employee.id AS id, 
    CONCAT(employee.first_name, " ", employee.last_name) as name, 
    title, 
    name as department, 
    salary, 
    CONCAT(managers.first_name, " ", managers.last_name) AS manager
    FROM department
    INNER JOIN role ON department.id = role.department_id
    INNER JOIN employee ON role.id = employee.role_id
    LEFT JOIN employee managers ON managers.id = employee.manager_id;`)

const viewDepartments = new Query('SELECT id, name AS department FROM department');

const viewRoles = new Query('SELECT id, title FROM role');

const viewEmployeesBy = new Query(`SELECT employee.id AS id, 
    CONCAT(employee.first_name, " ", employee.last_name) as name, 
    name as department, 
    title, 
    salary, 
    CONCAT(managers.first_name, " ", managers.last_name) AS manager
    FROM department
    INNER JOIN role ON department.id = role.department_id
    INNER JOIN employee ON role.id = employee.role_id
    LEFT JOIN employee managers ON managers.id = employee.manager_id
    WHERE ?;`)

const addEmployee = new Query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) 
    VALUES (?, ?, ?, ?);`);

const addDepartment = new Query(`INSERT INTO department (name) 
    VALUES (?);`)

const addRole = new Query(`INSERT INTO role (title, salary, department_id) 
    VALUES (?, ?, ?);`);

const viewManagers = new Query(`SELECT DISTINCT manager.id AS id, 
    CONCAT(manager.first_name, " ", manager.last_name) AS name,
    title,
    name AS department
    FROM department
    INNER JOIN role ON department.id = role.department_id
    INNER JOIN employee manager ON role.id = manager.role_id
    INNER JOIN employee ON manager.id = employee.manager_id;`)

const updateManagerForEmployee = new Query(`UPDATE employee SET manager_id = ? WHERE id = ?;
`)

module.exports = {
    viewEmployees: viewEmployees,
    viewDepartments: viewDepartments,
    viewRoles: viewRoles,
    viewEmployeesBy: viewEmployeesBy,
    addEmployee: addEmployee,
    addDepartment: addDepartment,
    addRole: addRole,
    viewManagers: viewManagers,
    updateManagerForEmployee: updateManagerForEmployee
}
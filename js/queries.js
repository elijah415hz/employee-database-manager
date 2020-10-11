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

const viewEmployeesByDepartment = new Query(`SELECT employee.id AS id, 
    CONCAT(employee.first_name, " ", employee.last_name) as name, 
    name as department, 
    title, 
    salary, 
    CONCAT(managers.first_name, " ", managers.last_name) AS manager
    FROM department
    INNER JOIN role ON department.id = role.department_id
    INNER JOIN employee ON role.id = employee.role_id
    LEFT JOIN employee managers ON managers.id = employee.manager_id
    WHERE department.id = ?;`);

const viewRoles = new Query('SELECT id, title FROM role');

const viewEmployeesByRole = new Query(`SELECT employee.id AS id, 
    CONCAT(employee.first_name, " ", employee.last_name) as Name, 
    name as department, 
    title, 
    salary, 
    CONCAT(managers.first_name, " ", managers.last_name) AS manager
    FROM department
    INNER JOIN role ON department.id = role.department_id
    INNER JOIN employee ON role.id = employee.role_id
    LEFT JOIN employee managers ON managers.id = employee.manager_id
    WHERE role.id = ?;`)

const addEmployee = new Query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) 
    VALUES (?, ?, ?, ?);`);

const addDepartment = new Query(`INSERT INTO department (name) 
    VALUES (?);`)

const addRole = new Query(`INSERT INTO role (title, salary, department_id) 
    VALUES (?, ?, ?);`)

module.exports = {
    viewEmployees: viewEmployees,
    viewDepartments: viewDepartments,
    viewEmployeesByDepartment: viewEmployeesByDepartment,
    viewRoles: viewRoles,
    viewEmployeesByRole: viewEmployeesByRole,
    addEmployee: addEmployee,
    addDepartment: addDepartment,
    addRole: addRole
}
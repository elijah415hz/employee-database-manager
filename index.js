const inquirer = require("inquirer");
const cTable = require("console.table");
const queries = require("./js/queries");

const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_tracker"
});

connection.connect(function (err) {
    if (err) throw err;
    init();
    // console.log("connected as id " + connection.threadId + "\n");
});

//TODO: Inquirer Questions - Do with Async/Await
// View all Employees *
// View Employees by department *
// View Employees by roles *
// Add Employee *?
// Add Department *
// Add role *
// Bonus:
// Update Manager by employee *
// View employees by manager 
// Delete department 
// Delete role
// Delete employee
// View total salary by department


//TODO: Create queries for each question. How to store them?

async function init() {
    const answers = await inquirer.prompt({
        type: "list",
        message: "What would you like to do?",
        name: "initQuestion",
        choices: [
            "View all Employees",
            "View Employees by Department",
            "View Employees by Role",
            "Add Employee",
            "Add Department",
            "Add Role",
            "Quit"
        ]
    })
    switch (answers.initQuestion) {
        case "View all Employees":
            viewAllEmployees();
            break;
        case "View Employees by Department":
            employeesByDepartment();
            break;
        case "View Employees by Role":
            employeesByRole();
            break;
        case "Add Employee":
            addEmployee();
            break;
        case "Add Department":
            addDepartment();
            break;
        case "Add Role":
            addRole();
            break;
        case "Quit":
            connection.end();
    }
}

async function viewAllEmployees() {
    try {
        const employeesTable = await queries.viewEmployees.runQuery(connection)
        console.table(employeesTable);
    } catch (err) {
        console.error(err);
    }
    setTimeout(() => init(), 500);
}

async function employeesByDepartment() {
    try {
        const departmentTable = await queries.viewDepartments.runQuery(connection);
        let choices = departmentTable.map(row => { return { name: row.department, value: row.id } });
        const answers = await inquirer.prompt(
            {
                type: "list",
                message: "Select Department",
                name: "departmentId",
                choices: choices
            }
        );
        const employeesTable = await queries.viewEmployeesByDepartment.runQuery(connection, answers.departmentId)
        if (employeesTable.length > 0) {
        console.log(employeesTable);
        } else {
            console.log("No employees in this department")
        }
    } catch (err) {
        console.error(err);
    }
    setTimeout(() => init(), 500);
}

async function employeesByRole() {
    try {
        const rolesTable = await queries.viewRoles.runQuery(connection);
        let choices = rolesTable.map(row => { return { name: row.title, value: row.id } });
        const answers = await inquirer.prompt(
            {
                type: "list",
                message: "Select Title",
                name: "roleId",
                choices: choices
            }
        );
        const employeesTable = await queries.viewEmployeesByRole.runQuery(connection, answers.roleId)
        if (employeesTable.length > 0) {
            console.table(employeesTable);
            } else {
                console.log("No employees in this role")
            }
    } catch (err) {
        console.error(err);
    }
    setTimeout(() => init(), 500);
}

async function addEmployee() {
    try {
        const rolesTable = await queries.viewRoles.runQuery(connection);
        let roleChoices = rolesTable.map(row => { return { name: row.title, value: row.id } });
        const managerTable = await queries.viewEmployees.runQuery(connection);
        let managerChoices = managerTable.map(row => { return { name: row.name, value: row.id } });
        managerChoices.unshift({ name: "none", value: null })
        const answers = await inquirer.prompt([
            {
                type: "input",
                message: "First name",
                name: "firstName",

            },
            {
                type: "input",
                message: "Last name",
                name: "lastName"
            },
            {
                type: "list",
                message: "Title",
                name: "titleId",
                choices: roleChoices
            },
            {
                type: "list",
                message: "Manager",
                name: "managerId",
                choices: managerChoices
            }
        ]);
        const successful = queries.addEmployee.runQuery(connection, [answers.firstName, answers.lastName, answers.titleId, answers.managerId]);
        if (successful) console.log("Employee Added")

    } catch (err) {
        console.error(err);
    }
    setTimeout(() => init(), 500);
}

async function addDepartment() {
    try {
        const answers = await inquirer.prompt({
            type: "input",
            message: "Department name:",
            name: "departmentName"
        });
        const successful = queries.addDepartment.runQuery(connection, answers.departmentName);
        if (successful) console.log("Department Added")

    } catch (err) {
        console.error(error)
    }
    setTimeout(() => init(), 500);
}

async function addRole() {
    try {
        const departmentTable = await queries.viewDepartments.runQuery(connection);
        let departmentChoices = departmentTable.map(row => { return { name: row.department, value: row.id } });

        const answers = await inquirer.prompt([
            {
                type: "list",
                message: "Department:",
                name: "departmentId",
                choices: departmentChoices
            },
            {
                type: "input",
                message: "Title",
                name: "title"
            },
            {
                type: "number",
                message: "salary",
                name: "salary"
            }
        ]);
        const successful = queries.addRole.runQuery(connection, [answers.title, answers.salary, answers.departmentId]);
        if (successful) console.log("Role Added")
    } catch (err) {
        console.error(error)
    }
    setTimeout(() => init(), 500);
}


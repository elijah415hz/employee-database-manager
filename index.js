const inquirer = require("inquirer");
const cTable = require("console.table");
const queries = require("./js/queries");
const figlet = require("figlet");
const chalk = require("chalk")

const mysql = require("mysql");

console.log(figlet.textSync('Employee Tracker', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'full',
    width: 80,
    whitespaceBreak: true
}));

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
// View employees by manager *
// Delete department *
// Delete role *
// Delete employee *
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
            "View Employees by Manager",
            "Add Employee",
            "Add Department",
            "Add Role",
            "Remove Department",
            "Remove Role",
            "Remove Employee",
            "View Total Salary Budget by Department",
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
        case "View Employees by Manager":
            employeesByManager();
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
        case "Remove Department":
            removeDepartment();
            break;
        case "Remove Role":
            removeRole();
            break;
        case "Remove Employee":
            removeEmployee();
            break;
        case "View Total Salary Budget by Department":
            totalBudgetByDepartment();
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
        const employeesTable = await queries.viewEmployeesBy.runQuery(connection, { "department.id": answers.departmentId })
        if (employeesTable.length > 0) {
            console.table(employeesTable);
        } else {
            console.log(chalk.red("No employees in this department"))
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
        const employeesTable = await queries.viewEmployeesBy.runQuery(connection, { "role.id": answers.roleId })
        if (employeesTable.length > 0) {
            console.table(employeesTable);
        } else {
            console.log(chalk.red("No employees in this role"))
        }
    } catch (err) {
        console.error(err);
    }
    setTimeout(() => init(), 500);
}

async function employeesByManager() {
    try {
        const managers = await queries.viewManagers.runQuery(connection);
        let managerChoices = managers.map(row => { return { name: row.name, value: row.id } });
        const answers = await inquirer.prompt({
            type: "list",
            message: "Select Manager:",
            name: "managerId",
            choices: managerChoices
        })
        const employeesByManager = await queries.viewEmployeesBy.runQuery(connection, { "employee.manager_id": answers.managerId })
        console.table(employeesByManager);
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
        const successful = await queries.addEmployee.runQuery(connection, [answers.firstName, answers.lastName, answers.titleId, answers.managerId]);
        if (successful.affectedRows > 0) {
            console.log(chalk.green("Employee Added"))
        } else {
            console.log(chalk.red("Add Failed"))
        }

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
        const successful = await queries.addDepartment.runQuery(connection, answers.departmentName);
        if (successful.affectedRows > 0) {
            console.log(chalk.green("Department Added"))
        } else {
            console.log(chalk.red("Add Failed"))
        }

    } catch (err) {
        console.error(err)
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
        const successful = await queries.addRole.runQuery(connection, [answers.title, answers.salary, answers.departmentId]);
        if (successful.affectedRows > 0) {
            console.log(chalk.green("Role Added"));
        } else {
            console.log(chalk.red("Add Failed"))
        }
    } catch (err) {
        console.error(error)
    }
    setTimeout(() => init(), 500);
}

async function removeDepartment() {
    try {
        const departmentTable = await queries.viewDepartments.runQuery(connection);
        let departmentChoices = departmentTable.map(row => { return { name: row.department, value: row.id } });
        var answers = await inquirer.prompt([
            {
                type: "list",
                message: "Department:",
                name: "departmentId",
                choices: departmentChoices
            }
        ]);
        const successful = await queries.deleteRowFrom.runQuery(connection, [`department`, { id: answers.departmentId }]);
        if (successful.affectedRows > 0) {
            console.log(chalk.green("Department Deleted"));
        } else {
            console.log(chalk.red("Delete Failed"))
        }
    } catch (err) {
        if (/ER_ROW_IS_REFERENCED/.test(err.message)) {
            console.log(chalk.red("You cannot delete departments containing active roles and employees. \nTo delete this department, first delete all employees and roles within this department."));
        } else {
            console.error(err)
        }
    }
    setTimeout(() => init(), 500);
}

async function removeRole() {
    try {
        const roleTable = await queries.viewRoles.runQuery(connection);
        let roleChoices = roleTable.map(row => { return { name: row.title, value: row.id } });
        const answers = await inquirer.prompt([
            {
                type: "list",
                message: "Role:",
                name: "roleId",
                choices: roleChoices
            }
        ]);
        const successful = await queries.deleteRowFrom.runQuery(connection, [`role`, { id: answers.roleId }]);
        console.log(successful)
        if (successful.affectedRows > 0) {
            console.log(chalk.green("Role Deleted"));
        } else {
            console.log(chalk.red("Delete Failed"))
        }
    } catch (err) {
        if (/ER_ROW_IS_REFERENCED/.test(err.message)) {
            console.log(chalk.red("You cannot delete roles containing active employees. \nTo delete this role, first delete all employees within this role."));
        } else {
            console.error(err)
        }
    }
    setTimeout(() => init(), 500);
}

async function removeEmployee() {
    try {
        const employeeTable = await queries.viewEmployees.runQuery(connection);
        let employeeChoices = employeeTable.map(row => { return { name: row.name, value: row.id } });
        const answers = await inquirer.prompt([
            {
                type: "list",
                message: "Employee:",
                name: "employeeId",
                choices: employeeChoices
            }
        ]);
        const successful = await queries.deleteRowFrom.runQuery(connection, [`employee`, { id: answers.employeeId }]);
        if (successful) {
            console.log(chalk.green("Employee Deleted"));
        }
    } catch (err) {
        if (/ER_ROW_IS_REFERENCED/.test(err.message)) {
            console.log(chalk.red("You cannot delete managers with subordinates. \nTo delete this manager, first assign all of their subordinates to different manager."));
        } else {
            console.error(err)
        }
    }
    setTimeout(() => init(), 500);
}

async function totalBudgetByDepartment() {
    try {
        const departmentTable = await queries.viewDepartments.runQuery(connection);
        let departmentChoices = departmentTable.map(row => { return { name: row.department, value: row.id } });
        const answers = await inquirer.prompt([
            {
                type: "list",
                message: "Department:",
                name: "departmentId",
                choices: departmentChoices
            }
        ]);
        const totalBudget = await queries.budgetByDepartment.runQuery(connection, answers.departmentId);
        console.log(chalk.green("Total Budget: $" + totalBudget[0].budget))
    } catch (err) {
        console.error(err);
    }
    setTimeout(() => init(), 500);
}






// Import all required packages
const inquirer = require("inquirer");
require("console.table");
const queries = require("./js/queries");
const figlet = require("figlet");
const chalk = require("chalk")
const mysql = require("mysql");

// Display banner on launch
console.log(figlet.textSync('Employee Tracker', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'full',
    width: 80,
    whitespaceBreak: true
}));

// Connect to database
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

// Function called recursively until 'Quit' is selected
async function init() {
    // Ask what the user wants to do
    const answers = await inquirer.prompt({
        type: "list",
        message: "What would you like to do?",
        name: "initQuestion",
        choices: [
            "View All Employees",
            "View All Employees by Department",
            "View All Employees by Role",
            "View All Employees by Manager",
            "Add Employee",
            "Add Department",
            "Add Role",
            "Remove Employee",
            "Remove Department",
            "Remove Role",
            "View Total Salary Budget by Department",
            "Quit"
        ]
    })
    // Switch to process the user's selection
    switch (answers.initQuestion) {
        case "View All Employees":
            viewAllEmployees();
            break;
        case "View All Employees by Department":
            employeesByDepartment();
            break;
        case "View All Employees by Role":
            employeesByRole();
            break;
        case "View All Employees by Manager":
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
            // Break connection to the database, lets the program end.
            connection.end();
    }
}

// Logs all employees in the database
async function viewAllEmployees() {
    try {
        // Get the data by running 'runQuery' method on the Query object
        const employeesTable = await queries.viewEmployees.runQuery(connection);
        // Log the table
        console.table(employeesTable);
    } catch (err) {
        console.error(err);
    }
    // Wait half a second before presenting the init questions again
    setTimeout(() => init(), 500);
}

// Ask which department, then print employees within that department
async function employeesByDepartment() {
    try {
        const departmentTable = await queries.viewDepartments.runQuery(connection);
        // Create a list of objects to be used by inquirer as the list of choices
        // .name is displayed to the user .value is stored for our use
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
        // If the query returned any employees, log them
        if (employeesTable.length > 0) {
            console.table(employeesTable);
        // Otherwise, let the user know that the department is empty
        } else {
            console.log(chalk.red("No employees in this department"))
        }
    } catch (err) {
        console.error(err);
    }
    setTimeout(() => init(), 500);
}

// Ask which role, then print employees within that department
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

// Ask which manager, then return employees with that manager
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

// Gather all information about the employee from the user, then insert it into the database
async function addEmployee() {
    try {
        // Generate list of roles for user to select
        const rolesTable = await queries.viewRoles.runQuery(connection);
        let roleChoices = rolesTable.map(row => { return { name: row.title, value: row.id } });
        // Generate list of managers for user to select
        const managerTable = await queries.viewEmployees.runQuery(connection);
        let managerChoices = managerTable.map(row => { return { name: row.name, value: row.id } });
        // Add a 'none' option for employees that have no manager
        managerChoices.unshift({ name: "none", value: null })
        // Gather inputs from user
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
        // Run the insert query
        const successful = await queries.addEmployee.runQuery(connection, [answers.firstName, answers.lastName, answers.titleId, answers.managerId]);
        // If the query succesfully inserted values, let the user know
        if (successful.affectedRows > 0) {
            console.log(chalk.green("Employee Added"))
        // Otherwise, let the user know that it failed
        } else {
            console.log(chalk.red("Add Failed"))
        }
    } catch (err) {
        console.error(err);
    }
    setTimeout(() => init(), 500);
}

// Add department with name supplied by user
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

// Add role with user inputs
async function addRole() {
    try {
        // Get list of departments for user to choose from
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
        // Run query to add role
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

// Ask user which department, then attempt to delete it
async function removeDepartment() {
    try {
        // Get a list of departments
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
        // Attempt to delete department. Delete will fail if there are any roles or employees within the department
        const successful = await queries.deleteRowFrom.runQuery(connection, [`department`, { id: answers.departmentId }]);
        if (successful.affectedRows > 0) {
            console.log(chalk.green("Department Deleted"));
        } else {
            console.log(chalk.red("Delete Failed"))
        }
    } catch (err) {
        // If MYSQL throws an error containing 'ER_ROW_IS_REFERENCED' let the user know that the department can't be deleted
        if (/ER_ROW_IS_REFERENCED/.test(err.message)) {
            console.log(chalk.red("You cannot delete departments containing active roles and employees. \nTo delete this department, first delete all employees and roles within this department."));
        // If there is any other type of error thrown, just log the error
        } else {
            console.error(err)
        }
    }
    setTimeout(() => init(), 500);
}

// Ask user which role to remove, then attempt to remove the role
async function removeRole() {
    try {
        // Get a list of roles
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
        // Attempt to delete role
        const successful = await queries.deleteRowFrom.runQuery(connection, [`role`, { id: answers.roleId }]);
        if (successful.affectedRows > 0) {
            console.log(chalk.green("Role Deleted"));
        } else {
            console.log(chalk.red("Delete Failed"))
        }
    } catch (err) {
        // If MYSQL throws a 'ROW_IS_REFERENCED' error, let the user know that they can't delete the role
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
        // Get a list of employees
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
        // Attempt to deleted the employee
        const successful = await queries.deleteRowFrom.runQuery(connection, [`employee`, { id: answers.employeeId }]);
        if (successful.affectedRows > 0) {
            console.log(chalk.green("Employee Deleted"));
        } else {
            console.log(chalk.red("Delete Failed"))
        }
    } catch (err) {
        // If MYSQL throws a 'ROW_IS_REFERENCED' error, let the user know that the employee is a manager with subordinates that can't be deleted
        if (/ER_ROW_IS_REFERENCED/.test(err.message)) {
            console.log(chalk.red("You cannot delete managers with subordinates. \nTo delete this manager, first assign all of their subordinates to different manager."));
        } else {
            console.error(err)
        }
    }
    setTimeout(() => init(), 500);
}

// Ask user which department, then print the sum of all the salaries in that department
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






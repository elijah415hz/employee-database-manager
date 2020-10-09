DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;
USE employee_tracker;

CREATE TABLE department(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);


-- ===================================================
-- SEEDS

INSERT INTO department(name) VALUES("Accounting");
INSERT INTO department(name) VALUES("Payroll");
INSERT INTO role(title, salary, department_id) VALUES("Accounting Manager", 25000, 1);
INSERT INTO role(title, salary, department_id) VALUES("Payroll Manager", 50000, 2);
INSERT INTO role(title, salary, department_id) VALUES("Accounting Overling", 30000, 1);
INSERT INTO role(title, salary, department_id) VALUES("Payroll Overling", 30000, 2);
INSERT INTO role(title, salary, department_id) VALUES("Accounting Underling", 10000, 1);
INSERT INTO role(title, salary, department_id) VALUES("Payroll Underling", 10000, 2);
INSERT INTO employee(first_name, last_name, role_id) VALUES("Mr.", "Manager", 1);
INSERT INTO employee(first_name, last_name, role_id) VALUES("Mrs.", "Manager", 2);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("John", "George", 3, 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("John", "John", 4, 2);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Jim", "Bob", 5, 3);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Jim", "Bean", 6, 4);


SELECT name, title, salary, employee.first_name AS first_name, employee.last_name AS last_name, managers.first_name AS manager_first, managers.last_name AS manager_last
FROM department
INNER JOIN role ON department.id = role.department_id
INNER JOIN employee ON role.id = employee.role_id
LEFT JOIN employee managers ON managers.id = employee.manager_id;


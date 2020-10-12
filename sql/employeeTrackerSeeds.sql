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

INSERT INTO department(name) VALUES("Sales"), ("Production"), ("Human Resources");
INSERT INTO role(title, salary, department_id) 
VALUES("Sales Manager", 90000, 1),
    ("Production Manager", 80000, 2), 
    ("Human Resources Manager", 80000, 3),
    ("Sales Representative", 40000, 1),
    ("Assembler", 30000, 2),
    ("Quality Control Inspector ", 30000, 2),
    ("Human Resources Representative", 30000, 3);
INSERT INTO employee(first_name, last_name, role_id)
VALUES("Ashley", "Trueblood", 1),
    ("Margaret", "Lippold", 2),
    ("Jennifer", "Sprawls", 3);
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES("John", "Doe", 4, 1),
("Thomas", "Sutherland", 5, 2),
("Ellie", "Reese", 6, 2),
("Sergei", "Rodriguez", 7, 3),
("Egbert", "Meyers", 5, 2),
("Alexi", "Lagasca", 1, 1);



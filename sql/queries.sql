USE employee_tracker;

-- View all Employees
-- =======================================================================
-- SELECT employee.id AS id, 
--         employee.first_name AS first_name, 
--         employee.last_name AS last_name, 
--         name as department, 
--         title, 
--         salary, 
--         CONCAT(managers.first_name, " ", managers.last_name) AS manager
-- FROM department
-- INNER JOIN role ON department.id = role.department_id
-- INNER JOIN employee ON role.id = employee.role_id
-- LEFT JOIN employee managers ON managers.id = employee.manager_id;
-- ==========================================================================


-- View Employees by department
-- ============================
-- Show departments
-- SELECT id, name AS department FROM department;
-- View employees by selected department
-- SELECT employee.id AS id, 
--         employee.first_name AS first_name, 
--         employee.last_name AS last_name, 
--         name as department, 
--         title, 
--         salary, 
--         CONCAT(managers.first_name, " ", managers.last_name) AS manager
-- FROM department
-- INNER JOIN role ON department.id = role.department_id
-- INNER JOIN employee ON role.id = employee.role_id
-- LEFT JOIN employee managers ON managers.id = employee.manager_id
-- WHERE department.id = ${departmentId};
-- ============================

-- View Employees by role
-- ============================
-- Show roles
-- SELECT id, title FROM role;
-- View employees by selected role
-- SELECT employee.id AS id, 
--         employee.first_name AS first_name, 
--         employee.last_name AS last_name, 
--         name as department, 
--         title, 
--         salary, 
--         CONCAT(managers.first_name, " ", managers.last_name) AS manager
-- FROM department
-- INNER JOIN role ON department.id = role.department_id
-- INNER JOIN employee ON role.id = employee.role_id
-- LEFT JOIN employee managers ON managers.id = employee.manager_id
-- WHERE role.id = ${roleId};
-- ============================

-- Add Employee
-- ================================
-- Use dropdowns for department, manager, role. Once selected...
-- TODO: Figure out how to only add manager column if manager selected
-- INSERT INTO employee (first_name, last_name, role_id, null) 
--     VALUES ("Kathy", "Birmble", 4, null);
-- ====================================
-- source sql/queries.sql
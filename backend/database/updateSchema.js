const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Add your MySQL password here
  database: "medcare",
  multipleStatements: true,
});

const sqlFile = path.join(__dirname, "update_appointment_status.sql");
const sql = fs.readFileSync(sqlFile, "utf8");

const medicalSqlFile = path.join(__dirname, "create_medical_tables.sql");
const medicalSql = fs.readFileSync(medicalSqlFile, "utf8");

const updateUsersTableFile = path.join(__dirname, "update_users_table.sql");
const updateUsersTableSql = fs.readFileSync(updateUsersTableFile, "utf8");

connection.query(sql, (err, results) => {
  if (err) {
    console.error("Error updating database schema:", err);
    process.exit(1);
  }
  console.log("Database schema updated successfully");
  connection.end();
});

connection.query(medicalSql, (err, results) => {
  if (err) {
    console.error("Error creating medical tables:", err);
    process.exit(1);
  }
  console.log("Medical tables created successfully");
  connection.end();
});

connection.query(updateUsersTableSql, (err, results) => {
  if (err) {
    console.error("Error updating users table:", err);
    process.exit(1);
  }
  console.log("Users table updated successfully");
  connection.end();
});

const { Sequelize } = require("sequelize");
var sequelize = new Sequelize("myproject", "username", "password", {
  host: "localhost",
  dialect: "mysql" | "mariadb" | "sqlite" | "postgres" | "mssql",

  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },

  storage: "path/to/database.sqlite", // Chỉ dùng khi MS là SQLite
});

const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "031218",
  host: "localhost",
  port: 5432,
  database: "navi"
})

module.exports = pool;
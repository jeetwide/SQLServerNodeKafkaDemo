var sql = require("mssql");
var connect = function () {
    var conn = new sql.ConnectionPool({
        user: 'sa',
        password: 'pass@1234',
        server: 'DTC209\\SQLEXPRESS2017',
        database: 'test1DB'
    });

    return conn;
};

module.exports = connect;
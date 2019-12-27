var express = require('express');
var router = express.Router();
var sql = require("mssql");
var conn = require("../node-kafka-producer/connection/connect")();


module.exports = (app, producer, kafka_topic) => {

    app.post("/hello", (req, res) => {
        console.log("done")
        res.send("post hello from producer")

    })

    app.get("/api/students/", (req, res) => {
        conn.connect().then(function () {
            var sqlQuery = "Select * from Student";
            var req = new sql.Request(conn);
            req.query(sqlQuery).then(function (recordset) {
                res.json(recordset.recordset);
                conn.close();
            }).catch(function (err) {
                conn.close();
                res.send(err);
                console.log(err);
                res.status(400).send("Error while inserting data");
            });
        }).catch(function (err) {
            conn.close();
            res.send(err);
            console.log(err);
            res.status(400).send("Error while inserting data");
        });
    })


    app.post("/api/students/", (req, res) => {
        conn.connect().then(function () {
            var transaction = new sql.Transaction(conn);
            transaction.begin().then(function () {
                var request = new sql.Request(transaction);
                request.input("StudentID", sql.VarChar, req.body.StudentID)
                request.input("StudentName", sql.VarChar, req.body.StudentName)
                request.input("StandardID", sql.VarChar, req.body.StandardID)

                request.execute("[SP_InsertStudent1]").then(function () {
                    transaction.commit().then(function (recordSet) {
                        conn.close();
                        res.status(200).send(req.body);
                    }).catch(function (err) {
                        conn.close();
                        res.status(400).send("Error while inserting data");
                    });
                }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while inserting data");
                });
            }).catch(function (err) {
                conn.close();
                res.status(400).send("Error while inserting data");
            });
        }).catch(function (err) {
            conn.close();
            res.status(400).send("Error while inserting data");
        });

    })

    app.put("/api/students/:id", (req, res) => {
        var _StudentID = req.params.id;
        conn.connect().then(function () {
            var transaction = new sql.Transaction(conn);
            transaction.begin().then(function () {
                var request = new sql.Request(transaction);
                request.input("StudentID", sql.nvarchar, _StudentID)
                request.input("StudentName", sql.nvarchar, req.body.StudentName)
                request.input("StandardID", sql.nvarchar, req.body.StandardID)
                request.execute("SP_UpdateStudent").then(function () {
                    transaction.commit().then(function (recordSet) {
                        conn.close();
                        res.status(200).send(req.body);
                    }).catch(function (err) {
                        conn.close();
                        console.log(err)
                        res.status(400).send("Error while updating data");
                    });
                }).catch(function (err) {
                    conn.close();
                    console.log(err)
                    res.status(400).send("Error while updating data");
                });
            }).catch(function (err) {
                conn.close();
                console.log(err)
                res.status(400).send("Error while updating data");
            });
        }).catch(function (err) {
            conn.close();
            console.log(err)
            res.status(400).send("Error while updating data");
        });


    })

    app.delete("/api/students/:id", (req, res) => {
        var _StudentID = req.params.id;
        conn.connect().then(function () {
            var transaction = new sql.Transaction(conn);
            transaction.begin().then(function () {
                var request = new sql.Request(transaction);
                request.input("StudentID", sql.nvarchar, _StudentID)
                request.execute("SP_DeleteStudent1").then(function () {
                    transaction.commit().then(function (recordSet) {
                        conn.close();
                        res.status(200).json("StudentID:" + _StudentID);
                    }).catch(function (err) {
                        conn.close();
						console.log(err);
                        res.status(400).send("Error while Deleting data");
                    });
                }).catch(function (err) {
                    conn.close();
					console.log(err);
                    res.status(400).send("Error while Deleting data");
                });
            }).catch(function (err) {
                conn.close();
				console.log(err);
                res.status(400).send("Error while Deleting data");
            });
        })

    })


}
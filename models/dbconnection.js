var mysql = require("mysql");

var connection = mysql.createConnection({
    host    :"localhost",
    port    :"3306",
    user    :"root",
    password:"library",
    database:"map_app"
});

connection.connect(function(err){
    if(err){
        console.log("Error connecting: " + err.stack);
        return;
    }
    console.log("Connected as id " + connection.threadId);
});
    
module.exports = connection;
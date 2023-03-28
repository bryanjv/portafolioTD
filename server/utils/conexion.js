import mysql from "mysql";

const connection = mysql.createPool({
    connectionLimit: 10,
	host     : 'localhost',
	user     : 'root',
	password : '1234',
	database : 'nodelogin'
});

connection.getConnection( (err, connection)=> {
    if (err) throw (err)
    console.log ("DB connected successful: " + connection.threadId)
})

export default connection;
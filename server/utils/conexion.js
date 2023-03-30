import mysql from "mysql";

export default class DBase {
    constructor(dbname, dbpassword) {
        this.establishedConnection = null;
        this.dbname = dbname;
        this.dbpassword = dbpassword;
    };

    createConnection(){
        const connection = exportConnection();

        return connection;
    };

    getConnection(){
        this.createConnection.getConnection( (err, connection)=> {
            if (err) throw (err)
            console.log ("DB connected successful: " + connection.threadId)
        })
    };
};

function exportConnection(){

    const connection = mysql.createPool({
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        password: '1234',
        database: 'nodelogin'
    });

    return connection;
};

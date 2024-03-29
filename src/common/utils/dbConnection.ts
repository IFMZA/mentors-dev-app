/* eslint-disable prettier/prettier */

export class dbConnection {
    static getConnection() {
        const db_cred = {
            connection: '',
            dbName: ''
        };
        if (process.env.NODE_ENV == 'development') {
            db_cred.connection = "mongodb://localhost:27017";
            db_cred.dbName = "Mentors"
        }
        else if (process.env.NODE_ENV == "production") {
            db_cred.connection = "mongodb://localhost:27017";
            db_cred.dbName = "Mentors";
        }
        else {
            db_cred.connection = "mongodb://localhost:27017";
            db_cred.dbName = "Mentors";
        }
        return db_cred;
    }
}
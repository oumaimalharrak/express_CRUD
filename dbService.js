import './addRequire.js';


const mysql = require('mysql2');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
        host : 'localhost',
        user : 'superuser',
        password: 'express',
        database : 'express_crud',
        port : 3306
});


connection.connect((err)=>{
    if (err) {
        console.log(err.message)
    }else{
        console.log('db connected' )

    }
})

export default class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }
//Read data
    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM names;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    //Insert data
    async insertNewName(name) {
        try {
            const dateAdded = new Date();
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO names (name, date_added) VALUES (?,?);";

                connection.query(query, [name, dateAdded] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            return {
                id : insertId,
                name : name,
                dateAdded : dateAdded
            };
        } catch (error) {
            console.log(error);
        }
    }

    // data delete function 
    async deleteRowById(id){
    
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM names WHERE id = ?;"

                connection.query(query , [id], (err, result)=>{
                    if(err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            })
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error)
            return false;
        }
    }
}


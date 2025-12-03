import mysql from 'mysql2/promise'

let db = ""

export const connectDB = async ()=>{
    try{
        db = mysql.createPool({
            host: "localhost",
            user: "root",
            password: "",
            database: "db_start"
        })
        console.log("connected db")

    }catch(error){
        console.error("connect db error", error)
    }
}
export const getDB = ()=>db
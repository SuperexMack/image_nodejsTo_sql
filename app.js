const express = require("express")
const app = express()
const path = require("path")
const fileUpload = require("express-fileupload")
const mysql = require("mysql")
const { connected } = require("process")

const port = 5000


app.use(fileUpload())


app.use(express.urlencoded({extended:true}))
app.set("view engine" , "ejs")
app.set("views")
app.set(path.join(__dirname , "views"))
app.use(express.static(path.join(__dirname,"public")))
app.use(express.static(path.join(__dirname,"upload")))

const pool = mysql.createPool({

connectionLimit : 10,
host: "localhost",
user:"root",
password:"06062003",
database:"userprofile",

})


pool.getConnection((err,connection) =>{


if(err) throw err;
console.log("connected")


})



//static file 


app.get("" , (req,res)=>{


    pool.getConnection((err,connection) =>{


        if(err) throw err;
        console.log("connected")
        
connection.query('select * from  userprofile where id = "33" ' ,(err, rows) =>{ // using rows we can get data as an object


// once done , release connection

if(!err){

res.render("index.ejs" , {rows})

}


}) 


})

})


app.post("" , (req,res)=>{

let samplefile
let uploadPath

if(!req. files || Object.keys(req.files).length === 0 ){

return res.status(400).send("no file had been uploaded")


}


// name of the input is sample file
samplefile = req.files.samplefile
uploadPath = __dirname + "/upload/" + samplefile.name
console.log(samplefile)

// use mv() to place file on the server

samplefile.mv(uploadPath , function(err){


if(err) return res.status(500).send(err)

pool.getConnection((err,connection) =>{


    if(err) throw err;
    console.log("connected")
    
connection.query('UPDATE userprofile SET profile_image = ? where id = "33" ' , [samplefile.name] ,(err, rows) =>{ // using rows we can get data as an object


// once done , release connection

if(!err){

res.redirect("/")

}

else{

console.log(err)

}

}) 


})



// res.send("file uploaded ")


})




})


app.listen(port , (req,res)=>{


console.log(`your port is running on the port ${port }`)



    
})












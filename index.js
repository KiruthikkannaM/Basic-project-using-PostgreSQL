import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
const app=express();
const db=new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "project",
    password: "kiruthik_7275",
    port: 5432,

});
db.connect();
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
app.get("/",(req,res)=>{
    res.render("index.ejs");
});
app.post("/login",async (req,res)=>{
    const username = req.body.Username;
    const password = req.body.Password;
    try{
        const result= await db.query("select * from authentication where username=$1",[username]);
        const storedPassword=result.rows[0].password;
        const passwordMatch=await bcrypt.compare(password,storedPassword);
        if(passwordMatch){
            res.render("table.ejs");
            console.log(result.rows);
        }
        else{
            res.render("index.ejs");
        }
    }catch(err){
        console.error("there is a error in the code.pls rectify it.",err.stack);
    }
});
app.post("/create", async (req, res) => {
    try {
        const inputQuery = req.body.createQuery;
        await db.query(inputQuery);
        res.redirect("/");
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("An error occurred while processing your request.");
    }
});
app.post("/insert", async (req, res) => {
    try {
        const inputQuery = req.body.insertQuery;
        await db.query(inputQuery);
        res.redirect("/");
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("An error occurred while processing your request.");
    }
});
app.get("/signup",(req,res)=>{
    res.render("register.ejs");
});
app.post("/register", async (req, res) => {
    try {
        const username = req.body.Username;
        const password = req.body.Password;
        const passwordag = req.body.Passwordag;
        if(password===passwordag){
            const hashedPassword=await bcrypt.hash(password,10);
            await db.query("INSERT INTO authentication (username,password) VALUES($1,$2);",[username,hashedPassword]);

        }
        else{
            console.error("Passwords do not match");
            return res.status(400).send("Passwords do not match");
        }
        
        // if (password !== passwordag) {
        //     console.error("Passwords do not match");
        //     return res.status(400).send("Passwords do not match");
        // }
        // const hashedPassword=await bcrypt.hash(password,10);
        // await db.query("INSERT INTO authentication (usernname,password) VALUES($1,$2);",[username,hashedPassword]);
        res.redirect("/");
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("An error occurred while processing your request.");
    }
});
app.post("/select", async (req, res) => {
    try {
        const selectQuery = req.body.selectQuery;
        const result = await db.query(selectQuery);
        res.render("table.ejs", { data: result.rows });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("An error occurred while processing your request.");
    }
});
app.post("/delete", async (req, res) => {
    try {
        const inputQuery = req.body.deleteQuery;
        await db.query(inputQuery);
        res.redirect("/");
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("An error occurred while processing your request.");
    }
});
app.post("/logout",(req,res)=>{
    res.redirect("/");
});
app.listen(process.env.PORT || 3001,(req,res)=>{
    console.log(`running in http://localhost:3001`);
});
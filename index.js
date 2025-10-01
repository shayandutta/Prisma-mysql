import express from "express"

const app = express();

app.get("/", (req, res)=>{
    res.send("home route working!");
})

app.listen(5050, ()=>{
    console.log("app listening on port 5050");
})
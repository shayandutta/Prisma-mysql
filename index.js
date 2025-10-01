import express from "express";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";

const app = express();

const prisma = new PrismaClient({
    log:["query"] //we can add configurations like this inside the prismaClient. This particular config will log the sql querry whenever a req is hit
});

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("home route working!");
});

app.post("/articles", async (req, res) => {
//   await prisma.article.create({
//     data: req.body,
//   });
//   res.json({
//     success: true,
//   });

    await prisma.article.createMany({
        data:req.body
    })
    res.json({
        succees:true
    })
});



//1. retrieve all articles
app.get("/articles", async(req, res)=>{
    const articles = await prisma.article.findMany();
    res.json(articles);
})


//2. retrieve a particular articles
app.get("/articles/:id", async(req, res)=>{
    const article = await prisma.article.findFirst({
        where:{
            id: +req.params.id  //+ -> req.params.id is a string and a '+' in front will typecast it to number
        }
    })
    res.json(article);
})


//3. retrieve all articles based on some condition(only DRAFTS)
app.get("/articless", async (req, res)=>{
    const articles = await prisma.article.findMany({
        where:{
            state: "DRAFT "
        }
    })
    res.json(articles);
})


app.listen(5050, () => {
  console.log("app listening on port 5050");
});

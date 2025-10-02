import express from "express";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";

const app = express();

const prisma = new PrismaClient({
  log: ["query"], //we can add configurations like this inside the prismaClient. This particular config will log the sql querry whenever a req is hit
});

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("home route working!");
});


//nested write operations(creating user with articles)

app.post("/users", async(req, res)=>{
    await prisma.user.create({
        data: {
            email: req.body.email,
            articles:{
                create: req.body.articles
            }
        }
    })
    res.json({
        success : true
    })
})

//raw sql query
//fetching all the articles of a userId
app.get('/users/:userId/articles', async(req, res)=>{
    const result = await prisma.$queryRaw`SELECT * FROM articles INNER JOIN User On articles.userId=User.id WHERE articles.userId = ${req.params.userId}` //passing raw sql query
    res.json(result);
})

// app.post("/articles", async (req, res) => {
//   //   await prisma.article.create({
//   //     data: req.body,
//   //   });
//   //   res.json({
//   //     success: true,
//   //   });

//   await prisma.article.createMany({
//     data: req.body,
//   });
//   res.json({
//     succees: true,
//   });
// });

//1. retrieve all articles
app.get("/articles", async (req, res) => {
  const articles = await prisma.article.findMany();
  res.json(articles);
});

// //2. retrieve a particular articles
// app.get("/articles/:id", async (req, res) => {
//   const article = await prisma.article.findFirst({
//     where: {
//       id: +req.params.id, //+ -> req.params.id is a string and a '+' in front will typecast it to number
//     },
//   });
//   res.json(article);
// });

// //3. retrieve all articles based on some condition(only DRAFTS)
// app.get("/articless", async (req, res) => {
//   const articles = await prisma.article.findMany({
//     where: {
//       state: "DRAFT ",
//     },
//   });
//   res.json(articles);
// });

// //4. update many articles (put this first to avoid route conflicts)
// app.put("/articles/:ids", async (req, res) => {
//   const ids = req.params.ids.split(",").map((id) => +id); //splitting the ids string into an array of ids and mapping each id to a number
//   const articles = await prisma.article.updateMany({
//     where: {
//       id: { in: ids },
//     },
//     data: req.body,
//   });
//   res.json(articles);
// });

// //5. update a single article
// app.put("/articles/:id", async (req, res) => {
//   const article = await prisma.article.update({
//     where: {
//       id: +req.params.id,
//     },
//     data: req.body,
//   });
//   res.json(article);
// });

//delete an article
app.delete("/articles/:id", async(req, res)=>{
    const article = await prisma.article.delete({
        where:{
            id : +req.params.id
        }
    })
    res.json(article)
    //prisma.article.deleteMany({}) //->dangerous operation, as it will empty the entire table(all columns will get deleted)
})

app.listen(5050, () => {
  console.log("app listening on port 5050");
});

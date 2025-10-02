import express from "express";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";

const app = express();


//$extends -> to generated computed fields
//computed fields -> to get a particular field as response from the already existing entities and not creating another table in the db
//here full address is a computed field under profile section which is made of the name, addr and pno entities of the profile section
const prisma = new PrismaClient({
  log: ["query"], //we can add configurations like this inside the prismaClient. This particular config will log the sql querry whenever a req is hit
}).$extends({
  result: {
    profile: {
      fullAddress: {
        needs: {
          name: true,
          addr: true,
          pno: true,
        },
        compute(profile) {
          return `${profile.name}
                    ${profile.addr}
                    ${profile.pno}`;
        },
      },
    },
  },
});

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("home route working!");
});

//nested write operations(creating user with articles)

app.post("/users", async (req, res) => {
  await prisma.user.create({
    data: {
      email: req.body.email,
      articles: {
        create: req.body.articles,
      },
    },
  });
  res.json({
    success: true,
  });
});

// Create a profile
app.post("/profiles", async (req, res) => {
  const profile = await prisma.profile.create({
    data: {
      name: req.body.name,
      addr: req.body.addr,
      pno: req.body.pno,
      userId: req.body.userId,
    },
  });
  res.json(profile);
});

app.get("/users", async (req, res) => {
  const profile = await prisma.profile.findFirst();
  res.json(profile);
});

// Get all profiles to see what data exists
app.get("/profiles", async (req, res) => {
  const profiles = await prisma.profile.findMany();
  res.json(profiles);
});

//raw sql query
//fetching all the articles of a userId
app.get("/users/:userId/articles", async (req, res) => {
  const result =
    await prisma.$queryRaw`SELECT * FROM articles INNER JOIN User On articles.userId=User.id WHERE articles.userId = ${req.params.userId}`; //passing raw sql query
  res.json(result);
});

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

//1. retrieve all articles(paginated)
//pagination:    1. Skip     2. Take
//limit offset pagination
//skip ->  how many columns to skip from top
//take -> how many columns to take per page
//for first page skip = 0, second page skip=5
//fot all pages take = 5.
//http://localhost:5050/articles?skip=0&take=2  -> page1
//http://localhost:5050/articles?skip=2&take=2  -> page2
//http://localhost:5050/articles?skip=4&take=2  -> page3
app.get("/articles", async (req, res) => {
  const articles = await prisma.article.findMany({
    skip: +req.query.skip,
    take: +req.query.take,
  });
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
app.delete("/articles/:id", async (req, res) => {
  const article = await prisma.article.delete({
    where: {
      id: +req.params.id,
    },
  });
  res.json(article);
  //prisma.article.deleteMany({}) //->dangerous operation, as it will empty the entire table(all columns will get deleted)
});

app.listen(5050, () => {
  console.log("app listening on port 5050");
});

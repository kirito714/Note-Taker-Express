// Dependencies

const express = require("express");
const path = require("path");
const fs = require("fs");
// Sets up the Express App

const app = express();
const PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const dbFilePath = path.join(__dirname, "./db/db.json");

app.use(express.static("public"));

// basic route that sends the user first to the AJAX page.
app.get(`/`, (req, res) =>
  res.sendFile(path.join(__dirname + `/public/index.html`))
);

app.get(`/notes`, (req, res) =>
  res.sendFile(path.join(__dirname + `/public/notes.html`))
);

// GET - /api/notes
app.get("/api/notes", (req, res) => {
  // Read the data from disk.
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    try {
      let db = JSON.parse(data);
      res.send(db);
    } catch (err) {
      let obj = JSON.parse(`{${data}}`);
      res.send(obj);
    }
  });
});
app.post("/api/notes", (req, res) => {
  console.log(`notes post`);
  // Read the data from disk.
  if (req.body === undefined) {
    res.send(`body is empty`);
    return;
  }
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    let db = JSON.parse(data);
    console.log(`creating new note`);
    req.body.id = db.length;
    db.push(req.body);
    fs.writeFile(`./db/db.json`, `utf-8`, JSON.stringify(db), (err) => {
      if (err) {
        throw err;
      } else {
        res.send(`ok`);
      }
    });
  });
});
// app.get("/api/notes", function (req,res){
//   res.json([
//     {
//       title: "stuff",
//       text:"lalalala",
//     }
//   ])
// })
//
app.delete("/api/notes/:id", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    let db = JSON.parse(data);
    db.splice(req.params.id, 1);
    let reindexDb = db.map((currentElement, index) => {
      currentElement = { ...currentElement, id: index };
      return currentElement;
    });

    fs.writeFile(`./db/db.json`, `utf-8`, JSON.stringify(reindexDb), (err) => {
      if (err) {
        throw err;
      } else {
        res.send(`ok`);
      }
    });
  });
});
//Post /api/notes
// app.post("/api/notes", async (req, res) => {
//   // store notes in variable
//   const notes = req.body;
//   // Read the data from disk.
//   const content = await fs.readFile(dbFilePath, "utf8");
//   // parse out the data using JSON.parse
//   const data = JSON.parse(content);
//   // add notes to parsed array
//   data.push(notes);
//   // Save notes to our db.json file
//   await fs.writeFile(dbFilePath, JSON.stringify(data));
//   // respond to front end
//   res.json(true);
// });

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));

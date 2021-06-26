// Dependencies

const express = require("express");
const path = require("path");

// Sets up the Express App

const app = express();
const PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const dbFilePath = path.join(__dirname, "db/db.json");

app.use(express.static("public"));

// basic route that sends the user first to the AJAX page.
app.get(`/`, (req, res) => res.sendFile(path.join(__dirname + `/public/index.html`)));

app.get(`/notes`, (req, res) => res.sendFile(path.join(__dirname + `/public/notes.html`)));



// GET - /api/notes
// app.get("/api/notes", (req, res) => {
//     // Read the data from disk.
//     fs.readFile(dbFilePath, "utf8").then((content) => {
//       // parse out the data using JSON.parse
//       const data = JSON.parse(content);
//       // send the data to the front end
//       res.json(data);
//     });
//   });
app.get("/api/notes", function (req,res){
  res.json([
    {
      title: "stuff",
      text:"lalalala",
    }
  ])
})



//Post /api/notes
app.post("/api/notes", async (req, res) => {
    // store notes in variable
    const notes = req.body;
    // Read the data from disk.
    const content = await fs.readFile(dbFilePath, "utf8");
    // parse out the data using JSON.parse
    const data = JSON.parse(content);
    // add notes to parsed array
    data.push(notes);
    // Save notes to our db.json file
    await fs.writeFile(dbFilePath, JSON.stringify(data));
    // respond to front end
    res.json(true);
  });
  










app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
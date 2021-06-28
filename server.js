// Dependencies

const fs = require("fs/promises");
const express = require("express");

// Sets up the Express App

const app = express();
const PORT = 3000;
// parses the body of the request
//places the data on the `req body`
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// servers all of our files in public assets
app.use(express.static("public"));


// basic route that sends the user first to the AJAX page.
app.get(`/`, (req, res) => res.sendFile(__dirname + `/public/index.html`));

app.get(`/notes`, (req, res) => res.sendFile(__dirname + `/public/notes.html`));

// GET - /api/notes
app.get("/api/notes", async function (req, res) {
  // Read the data from disk.
  try {
    const data = await fs.readFile("./db/db.json", "utf8");
    //response then parse the data
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).end("server failed");
    console.log(err);
  }
});
// Post - /api/notes
app.post("/api/notes", async function (req, res) {
  const savedData = req.body;
  // Read the data from disk.
  try {
    const data = await fs.readFile("./db/db.json", "utf8");
    //response then parse the data
    
    // pushes the the request data to the body(text)
    // parse out the data using JSON.parse
    const newData = JSON.parse(data);
    newData.push(savedData);
    await fs.writeFile((__dirname + `/db/db.json`),JSON.stringify(data))
    // add table to parsed array
    res.json(data);
  } catch (err) {
    res.status(500).end("server failed");
    console.log(err);
  }
});


app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));

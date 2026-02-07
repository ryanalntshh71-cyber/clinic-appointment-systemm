const express = require("express");
const path = require("path");
const db = require("./database");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    db.prepare(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
    ).run(name, email, password);

    res.json({ message: "User registered successfully" });
  } catch {
    res.status(400).json({ message: "Email already exists" });
  }
});


app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare(
    "SELECT * FROM users WHERE email = ? AND password = ?"
  ).get(email, password);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({ message: "Login successful" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


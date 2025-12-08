import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.get("/", (req, res) => {
  res.send("Backend starter running. Edit src/server.js to begin!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

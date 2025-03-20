import express from "express";
import cors from "cors";

// app config
const app = express();
const port = process.env.PORT || 4000;

app.get("/api", (req, res) => {
  res.send("API is running");
});

app.listen(port, () => console.log(`Server started on PORT:${port}`));

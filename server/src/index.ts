import express from "express";
import cors from "cors";
import streamRoutes from "./routes/streamRoutes";

import searchRoutes from "./routes/searchRoutes";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    message: "Lumina Audio Backend Running",
  });
});

app.use("/api/search", searchRoutes);
app.use("/api/stream", streamRoutes);

const PORT = 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Server running on port ${PORT}`
  );
});
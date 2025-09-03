import express from "express";
import cors from "cors";
import tasksRoutes from "./routes/tasks.js";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use(tasksRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

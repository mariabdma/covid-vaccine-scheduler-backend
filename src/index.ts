import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import appointmentRoutes from "./routes/appointments";

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.use("/api/appointments", appointmentRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

import { Router } from "express";
import {
  createAppointment,
  getAppointments,
} from "../controllers/appointments";

const router = Router();

router.post("/", createAppointment);

router.get("/", getAppointments);

export default router;

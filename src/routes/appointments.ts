import { Router } from "express";
import {
  createAppointment,
  getAppointments,
  getAvailableHours,
} from "../controllers/appointments";

const router = Router();

router.post("/", createAppointment);
router.get("/", getAppointments);
router.get("/available-hours", getAvailableHours);

export default router;

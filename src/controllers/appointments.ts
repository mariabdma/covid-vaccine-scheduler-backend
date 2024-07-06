import { Request, Response } from "express";

interface Appointment {
  id: number;
  name: string;
  birthDate: string;
  scheduleDate: string;
}

let appointments: Appointment[] = [];

export const createAppointment = (req: Request, res: Response) => {
  const { name, birthDate, scheduleDate } = req.body;
  const appointmentDate = new Date(scheduleDate);
  const appointmentHour = appointmentDate.getHours();
  const appointmentDay = appointmentDate.toISOString().split("T")[0];
  /* 
  console.log("helloo");
  console.log(appointments); */
  const existingAppointments = appointments.filter((appointment) => {
    const existingAppointmentDate = new Date(appointment.scheduleDate);
    const existingAppointmentHour = existingAppointmentDate.getHours();
    const existingAppointmentDay = existingAppointmentDate
      .toISOString()
      .split("T")[0];
    return (
      existingAppointmentHour === appointmentHour &&
      existingAppointmentDay === appointmentDay
    );
  });

  if (existingAppointments.length >= 2) {
    return res
      .status(400)
      .json({ message: "Não temos vagas para este horário." });
  }

  const newAppointment: Appointment = {
    id: Date.now(),
    name,
    birthDate,
    scheduleDate,
  };

  appointments.push(newAppointment);

  res.status(201).json(newAppointment);
};

export const getAppointments = (req: Request, res: Response) => {
  res.status(200).json(appointments);
};

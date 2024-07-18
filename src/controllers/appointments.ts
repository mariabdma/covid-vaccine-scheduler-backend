import { Request, Response } from "express";

interface Appointment {
  id: number;
  name: string;
  birthDate: string;
  scheduleDate: string;
  scheduleTime: string; // Added scheduleTime field
}

let appointments: Appointment[] = [];

const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

export const createAppointment = (req: Request, res: Response) => {
  const { name, birthDate, scheduleDate, scheduleTime } = req.body;

  const formattedScheduleTime =
    scheduleTime.length === 5 ? `${scheduleTime}:00` : scheduleTime;
  const [hours, minutes] = formattedScheduleTime.split(":").map(Number);
  const [year, month, day] = scheduleDate.split("-").map(Number);
  const appointmentDateTime = new Date(year, month - 1, day, hours, minutes);

  const localAppointmentHour = appointmentDateTime.getHours();
  const localAppointmentDay = appointmentDateTime.toISOString().split("T")[0];

  // Filter existing appointments by date and time
  const existingAppointments = appointments.filter((appointment) => {
    const [apptHours, apptMinutes] = appointment.scheduleTime
      .split(":")
      .map(Number);
    const [apptYear, apptMonth, apptDay] = appointment.scheduleDate
      .split("-")
      .map(Number);
    const existingAppointmentDateTime = new Date(
      apptYear,
      apptMonth - 1,
      apptDay,
      apptHours,
      apptMinutes
    );
    const localExistingAppointmentHour = existingAppointmentDateTime.getHours();
    const localExistingAppointmentDay = existingAppointmentDateTime
      .toISOString()
      .split("T")[0];
    return (
      localExistingAppointmentHour === localAppointmentHour &&
      localExistingAppointmentDay === localAppointmentDay
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
    scheduleTime: formattedScheduleTime,
  };
  console.log(newAppointment);
  appointments.push(newAppointment);

  res.status(201).json(newAppointment);
};

export const getAppointments = (req: Request, res: Response) => {
  res.status(200).json(appointments);
};

export const getAvailableHours = (req: Request, res: Response) => {
  const { date } = req.query;

  if (!date || typeof date !== "string") {
    return res.status(400).json({ message: "Invalid date parameter." });
  }

  const targetDate = new Date(date);

  const allHours = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  // Count appointments for each hour
  const appointmentCounts: Record<string, number> = {};
  console.log(appointments);
  console.log(date);
  appointments
    .filter((appointment) => appointment.scheduleDate === date)
    .forEach((appointment) => {
      // Remove seconds from scheduleTime
      const scheduledTime = appointment.scheduleTime.slice(0, 5); // '08:00' format
      if (appointmentCounts[scheduledTime]) {
        appointmentCounts[scheduledTime]++;
      } else {
        appointmentCounts[scheduledTime] = 1;
      }
    });

  const availableHours = allHours.map((hour) => ({
    hour,
    count: appointmentCounts[hour] || 0,
  }));

  res.status(200).json(availableHours);
  console.log(availableHours);
};

import request from "supertest";
import { app, server } from "../src/index";
import { appointments } from "../src/controllers/appointments";

describe("Appointments API", () => {
  beforeEach(() => {
    appointments.length = 0;
  });

  afterAll((done) => {
    server.close(done);
  });

  it("should create an appointment successfully", async () => {
    const response = await request(app).post("/api/appointments").send({
      name: "Haley",
      birthDate: "1990-01-01",
      scheduleDate: "2024-07-20",
      scheduleTime: "10:00",
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: "Haley",
      birthDate: "1990-01-01",
      scheduleDate: "2024-07-20",
      scheduleTime: "10:00:00",
    });
  });

  it("should return error if trying to book more than 2 appointments for the same time", async () => {
    await request(app).post("/api/appointments").send({
      name: "Linus",
      birthDate: "1990-01-01",
      scheduleDate: "2024-07-20",
      scheduleTime: "10:00",
    });

    await request(app).post("/api/appointments").send({
      name: "Farmer Maria",
      birthDate: "1985-05-05",
      scheduleDate: "2024-07-20",
      scheduleTime: "10:00",
    });

    const response = await request(app).post("/api/appointments").send({
      name: "Reinhardt",
      birthDate: "1995-03-03",
      scheduleDate: "2024-07-20",
      scheduleTime: "10:00",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Não temos vagas para este horário.");
  });

  it("should get all appointments", async () => {
    const response = await request(app).get("/api/appointments");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("should return available hours for a given date", async () => {
    await request(app).post("/api/appointments").send({
      name: "Robin",
      birthDate: "1990-01-01",
      scheduleDate: "2024-07-20",
      scheduleTime: "10:00",
    });

    const response = await request(app)
      .get("/api/appointments/available-hours")
      .query({ date: "2024-07-20" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ hour: "10:00", count: 1 }),
      ])
    );
  });
});

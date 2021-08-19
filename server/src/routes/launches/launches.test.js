const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");
const { loadPlanetsData } = require("../../models/planets.model");

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test GET /launches", () => {
    test("it should respond with 200 success", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test POST /launches", () => {
    const completeLaunchData = {
      mission: "ZTM155",
      rocket: "ZTM Experimental IS1",
      target: "Kepler-1649 b",
      launchDate: "January 17, 2022",
    };
    const launchDataWithoutDate = {
      mission: "ZTM155",
      rocket: "ZTM Experimental IS1",
      target: "Kepler-1649 b",
    };
    const launchDataWithInvalideDate = {
      ...launchDataWithoutDate,
      launchDate: "hello",
    };
    test("it should respond with 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);
      const reqDate = new Date(completeLaunchData.launchDate).valueOf();
      const respDate = new Date(response.body.launchDate).valueOf();
      expect(reqDate).toBe(respDate);
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("it should catch missing properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });

    test("it should catch missing invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithInvalideDate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        error: "Invalid date launch time",
      });
    });
  });
});

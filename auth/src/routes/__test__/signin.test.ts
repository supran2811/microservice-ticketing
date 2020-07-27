import request from "supertest";

import { app } from "../../app";

it("fails when email that does not exist", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "122334",
    })
    .expect(400);
});

it("fails when incorrect password is sent", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "122234",
    })
    .expect(201);

  await request(app)
    .post("api/users/signin")
    .send({
      email: "test@test.com",
      password: "122235",
    })
    .expect(400);
});

it("responds with cookie when valid credentials are send", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "122234",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "122234",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});

const { test, describe, before, after } = require("node:test");
const assert = require("node:assert");
const { startTestServer, stopTestServer } = require("./helpers");

describe("Authentication & Authorization Module", () => {
  let baseUrl;

  before(async () => {
    const res = await startTestServer();
    baseUrl = res.baseUrl;
  });

  after(async () => {
    await stopTestServer();
  });

  test("1. Login succeeds with seeded Learner credentials", async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "learner@codepath.com",
        password: "password123",
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.data.token, "Token should be returned");
    assert.strictEqual(data.data.user.role, "learner");
    assert.strictEqual(data.data.user.email, "learner@codepath.com");
  });

  test("2. Login succeeds with seeded Mentor credentials", async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "mentor@codepath.com",
        password: "password123",
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.user.role, "mentor");
  });

  test("3. Login succeeds with seeded Admin credentials", async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@codepath.com",
        password: "password123",
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.user.role, "admin");
  });

  test("4. Login fails with incorrect password", async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "learner@codepath.com",
        password: "wrongPassword999",
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.message, "Invalid email or password");
  });

  test("5. Registration of a new learner with full onboarding data", async () => {
    const randomEmail = `testuser_${Date.now()}@example.com`;
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Learner",
        email: randomEmail,
        password: "password123",
        role: "learner",
        learningPath: "backend",
        skillLevel: "intermediate",
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(data.success, true);
    assert.ok(data.data.token);
    assert.strictEqual(data.data.user.learningPath, "backend");
  });

  test("6. Registration rejects duplicate email", async () => {
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Duplicate User",
        email: "learner@codepath.com",
        password: "password123",
        role: "learner",
        learningPath: "frontend",
        skillLevel: "beginner",
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.message, "Email already exists");
  });

  test("7. GET /api/auth/me requires valid JWT token", async () => {
    const unauthRes = await fetch(`${baseUrl}/auth/me`);
    assert.strictEqual(unauthRes.status, 401);

    // Now with token
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "learner@codepath.com",
        password: "password123",
      }),
    });
    const { token } = (await loginRes.json()).data;

    const authRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const authData = await authRes.json();
    assert.strictEqual(authRes.status, 200);
    assert.strictEqual(authData.data.email, "learner@codepath.com");
  });
});

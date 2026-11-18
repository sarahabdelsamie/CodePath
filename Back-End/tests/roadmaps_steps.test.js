const { test, describe, before, after } = require("node:test");
const assert = require("node:assert");
const { startTestServer, stopTestServer } = require("./helpers");

describe("Roadmap & Learning Step Module", () => {
  let baseUrl;
  let learnerToken;
  let adminToken;
  let seededRoadmapId;

  before(async () => {
    const res = await startTestServer();
    baseUrl = res.baseUrl;

    // Learner token
    const lRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "learner@codepath.com", password: "password123" }),
    });
    learnerToken = (await lRes.json()).data.token;

    // Admin token
    const aRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@codepath.com", password: "password123" }),
    });
    adminToken = (await aRes.json()).data.token;
  });

  after(async () => {
    await stopTestServer();
  });

  test("1. GET /api/roadmaps returns all tracks with populated steps", async () => {
    const res = await fetch(`${baseUrl}/roadmaps`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.data));
    assert.ok(data.data.length >= 4, "Should have at least 4 seeded roadmaps");

    seededRoadmapId = data.data[0]._id;
  });

  test("2. Category and difficulty filtering on /api/roadmaps", async () => {
    const res = await fetch(`${baseUrl}/roadmaps?category=frontend&difficultyLevel=beginner`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.ok(data.data.length >= 1);
    data.data.forEach((r) => {
      assert.strictEqual(r.category, "frontend");
      assert.strictEqual(r.difficultyLevel, "beginner");
    });
  });

  test("3. GET /api/roadmaps/:id returns detailed track with lessons", async () => {
    const res = await fetch(`${baseUrl}/roadmaps/${seededRoadmapId}`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.data._id, seededRoadmapId);
    assert.ok(Array.isArray(data.data.steps));
    assert.ok(data.data.steps.length > 0);
  });

  test("4. Non-admin cannot create a roadmap (protected & restricted)", async () => {
    const res = await fetch(`${baseUrl}/roadmaps`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${learnerToken}`,
      },
      body: JSON.stringify({
        title: "Unauthorized Track",
        description: "Should fail",
        category: "ai",
        difficultyLevel: "intermediate",
      }),
    });

    assert.strictEqual(res.status, 403, "Learner must be forbidden from creating roadmaps");
  });

  test("5. Admin can create, update, and delete a custom roadmap and step", async () => {
    // 5a. Create Roadmap
    const createRes = await fetch(`${baseUrl}/roadmaps`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: "Cloud Infrastructure Devops",
        description: "Master Terraform, Docker, and Kubernetes",
        category: "backend",
        difficultyLevel: "advanced",
      }),
    });
    const createData = await createRes.json();
    assert.strictEqual(createRes.status, 201);
    const newRoadmapId = createData.data._id;

    // 5b. Add Step to new Roadmap
    const stepRes = await fetch(`${baseUrl}/steps`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: "Containerization with Docker",
        content: "Build and containerize scalable microservices",
        resources: ["https://docker.com"],
        exercises: ["Write a Dockerfile for a Node Express API"],
        order: 1,
        roadmapId: newRoadmapId,
      }),
    });
    const stepData = await stepRes.json();
    assert.strictEqual(stepRes.status, 201);
    assert.strictEqual(stepData.data.title, "Containerization with Docker");

    // 5c. Update Roadmap
    const updateRes = await fetch(`${baseUrl}/roadmaps/${newRoadmapId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: "Cloud Infrastructure & DevOps Mastery",
      }),
    });
    assert.strictEqual(updateRes.status, 200);

    // 5d. Clean up / Delete Roadmap
    const delRes = await fetch(`${baseUrl}/roadmaps/${newRoadmapId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(delRes.status, 200);
  });
});

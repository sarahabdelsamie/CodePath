const { test, describe, before, after } = require("node:test");
const assert = require("node:assert");
const { startTestServer, stopTestServer } = require("./helpers");

describe("Progress, Profile, Dashboard & Admin Modules", () => {
  let baseUrl;
  let learnerToken;
  let mentorToken;
  let adminToken;
  let frontendRoadmap;
  let feStep2;

  before(async () => {
    const res = await startTestServer();
    baseUrl = res.baseUrl;

    // Login Learner
    const lRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "learner@codepath.com", password: "password123" }),
    });
    learnerToken = (await lRes.json()).data.token;

    // Login Mentor
    const mRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "mentor@codepath.com", password: "password123" }),
    });
    mentorToken = (await mRes.json()).data.token;

    // Login Admin
    const aRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@codepath.com", password: "password123" }),
    });
    adminToken = (await aRes.json()).data.token;

    // Fetch Frontend roadmap
    const rRes = await fetch(`${baseUrl}/roadmaps?category=frontend`);
    const rData = await rRes.json();
    frontendRoadmap = rData.data[0];
    feStep2 = frontendRoadmap.steps[1];
  });

  after(async () => {
    await stopTestServer();
  });

  test("1. GET /api/dashboard returns active roadmap, progress, and recommendations", async () => {
    const res = await fetch(`${baseUrl}/dashboard`, {
      headers: { Authorization: `Bearer ${learnerToken}` },
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.data.activeRoadmap, "Should have active roadmap data");
    assert.ok(data.data.totalCompletedStepsCount >= 1, "Should have at least 1 completed step");
  });

  test("2. POST /api/progress/:roadmapId/complete/:stepId completes lesson and updates progress", async () => {
    const res = await fetch(
      `${baseUrl}/progress/${frontendRoadmap._id}/complete/${feStep2._id}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${learnerToken}` },
      }
    );
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.data.completedSteps.length >= 2);
    assert.strictEqual(data.data.progressPercentage, 67);
  });

  test("3. GET /api/profile returns user details and populated learning history", async () => {
    const res = await fetch(`${baseUrl}/profile`, {
      headers: { Authorization: `Bearer ${learnerToken}` },
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.user.email, "learner@codepath.com");
    assert.ok(Array.isArray(data.data.learningHistory));
  });

  test("4. PUT /api/profile updates user profile info", async () => {
    const res = await fetch(`${baseUrl}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${learnerToken}`,
      },
      body: JSON.stringify({
        name: "Alex J. Updated",
        skillLevel: "advanced",
      }),
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.data.name, "Alex J. Updated");
    assert.strictEqual(data.data.skillLevel, "advanced");
  });

  test("5. PUT /api/profile/password successfully changes password and validates", async () => {
    // 5a. Wrong current password fails
    const failRes = await fetch(`${baseUrl}/profile/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${learnerToken}`,
      },
      body: JSON.stringify({
        currentPassword: "wrongPassword",
        newPassword: "newpassword123",
      }),
    });
    assert.strictEqual(failRes.status, 400);

    // 5b. Correct current password updates password
    const succRes = await fetch(`${baseUrl}/profile/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${learnerToken}`,
      },
      body: JSON.stringify({
        currentPassword: "password123",
        newPassword: "newpassword123",
      }),
    });
    assert.strictEqual(succRes.status, 200);

    // 5c. Revert password back so demo credentials remain intact
    await fetch(`${baseUrl}/profile/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${learnerToken}`,
      },
      body: JSON.stringify({
        currentPassword: "newpassword123",
        newPassword: "password123",
      }),
    });
  });

  test("6. GET /api/admin/stats restricts regular learners (403)", async () => {
    const res = await fetch(`${baseUrl}/admin/stats`, {
      headers: { Authorization: `Bearer ${learnerToken}` },
    });
    assert.strictEqual(res.status, 403);
  });

  test("7. GET /api/admin/stats succeeds for Admin with KPI metrics", async () => {
    const res = await fetch(`${baseUrl}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.data.totalUsers >= 3);
    assert.ok(data.data.totalRoadmaps >= 4);
    assert.ok(data.data.totalSteps >= 12);
  });

  test("8. Admin can manage system settings and moderation reports", async () => {
    // 8a. Get settings
    const sGet = await fetch(`${baseUrl}/admin/settings`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const sData = await sGet.json();
    assert.strictEqual(sGet.status, 200);
    assert.ok(sData.data.platformName);

    // 8b. Update settings
    const sPut = await fetch(`${baseUrl}/admin/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        platformName: "CodePath Career Accelerator v2",
      }),
    });
    assert.strictEqual(sPut.status, 200);

    // 8c. Get reports
    const repRes = await fetch(`${baseUrl}/admin/reports`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const repData = await repRes.json();
    assert.strictEqual(repRes.status, 200);
    assert.ok(Array.isArray(repData.data));
  });
});

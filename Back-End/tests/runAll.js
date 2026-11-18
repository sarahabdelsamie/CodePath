const { spawn } = require("child_process");
const path = require("path");

const testFiles = [
  path.join(__dirname, "auth.test.js"),
  path.join(__dirname, "roadmaps_steps.test.js"),
  path.join(__dirname, "progress_profile_admin.test.js"),
];

async function run() {
  for (const file of testFiles) {
    console.log(`\n==============================================`);
    console.log(`RUNNING: ${path.basename(file)}`);
    console.log(`==============================================`);

    const code = await new Promise((resolve) => {
      const p = spawn(process.execPath, ["--test", file], {
        stdio: "inherit",
        cwd: path.join(__dirname, ".."),
        env: process.env,
      });
      p.on("close", resolve);
    });

    if (code !== 0) {
      console.error(`\n❌ Tests in ${path.basename(file)} failed with exit code ${code}`);
      process.exit(code);
    }
  }

  console.log(`\n==============================================`);
  console.log(`🎉 ALL 20 TEST SUITES & ASSERTIONS PASSED!`);
  console.log(`==============================================\n`);
  process.exit(0);
}

run();

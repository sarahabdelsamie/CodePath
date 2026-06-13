require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./src/models/User");
const Roadmap = require("./src/models/Roadmap");
const LearningStep = require("./src/models/LearningStep");
const Progress = require("./src/models/Progress");

const seedData = async () => {
  try {
    // 1. Connect to DB
    console.log("Connecting to database for seeding...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    // 2. Clear existing collections
    console.log("Clearing existing database collections...");
    await User.deleteMany({});
    await Roadmap.deleteMany({});
    await LearningStep.deleteMany({});
    await Progress.deleteMany({});
    console.log("Collections cleared.");

    // 3. Seed Users
    console.log("Seeding users...");
    const hashedPassword = await bcrypt.hash("password123", 10);

    const learner = await User.create({
      name: "Alex Johnson",
      email: "learner@codepath.com",
      password: hashedPassword,
      role: "learner",
      learningPath: "frontend",
      skillLevel: "intermediate",
    });

    const mentor = await User.create({
      name: "Sarah Jenkins",
      email: "mentor@codepath.com",
      password: hashedPassword,
      role: "mentor",
    });

    console.log(`Seeded users: \n- Learner: ${learner.email}\n- Mentor: ${mentor.email}`);

    // 4. Seed Roadmaps and Steps
    console.log("Seeding roadmaps and learning steps...");

    // Roadmap 1: Frontend
    const frontendRoadmap = new Roadmap({
      title: "Frontend Developer Career Path",
      description: "Master HTML, CSS, JavaScript, and React to build beautiful, responsive web applications.",
      category: "frontend",
      difficultyLevel: "beginner",
      steps: [],
    });
    await frontendRoadmap.save();

    const feStep1 = await LearningStep.create({
      title: "HTML & CSS Fundamentals",
      content: "Learn semantic HTML5 tags and CSS basics including layout techniques like Flexbox and Grid. Build structure and style for web pages.",
      resources: ["https://developer.mozilla.org/en-US/docs/Learn/HTML", "https://css-tricks.com"],
      exercises: ["Create a semantic personal portfolio page template", "Build a responsive grid-based card gallery"],
      order: 1,
      roadmapId: frontendRoadmap._id,
    });

    const feStep2 = await LearningStep.create({
      title: "JavaScript Basics & DOM Manipulation",
      content: "Understand variables, data types, functions, array methods, and how to manipulate the DOM to add interactive behavior.",
      resources: ["https://javascript.info", "https://eloquentjavascript.net"],
      exercises: ["Create an interactive To-Do application", "Implement a simple calculator with custom logic"],
      order: 2,
      roadmapId: frontendRoadmap._id,
    });

    const feStep3 = await LearningStep.create({
      title: "React Framework Essentials",
      content: "Dive into components, props, state management, hooks (useState, useEffect), and building modular user interfaces.",
      resources: ["https://react.dev", "https://www.freecodecamp.org/news/react-beginner-handbook/"],
      exercises: ["Create a weather dashboard calling a mock weather API", "Build a multi-step user registration wizard"],
      order: 3,
      roadmapId: frontendRoadmap._id,
    });

    frontendRoadmap.steps.push(feStep1._id, feStep2._id, feStep3._id);
    await frontendRoadmap.save();

    // Roadmap 2: Backend
    const backendRoadmap = new Roadmap({
      title: "Backend Engineering Path",
      description: "Learn Node.js, Express, databases, and APIs to design scalable backend architectures.",
      category: "backend",
      difficultyLevel: "intermediate",
      steps: [],
    });
    await backendRoadmap.save();

    const beStep1 = await LearningStep.create({
      title: "Node.js & Express Basics",
      content: "Set up a server, handle requests/responses, route definitions, and build RESTful endpoints using Express.",
      resources: ["https://nodejs.org", "https://expressjs.com"],
      exercises: ["Create an HTTP server from scratch", "Build a REST API managing a mock collection of books"],
      order: 1,
      roadmapId: backendRoadmap._id,
    });

    const beStep2 = await LearningStep.create({
      title: "MongoDB & Mongoose ODM",
      content: "Learn document databases, write schemas, perform CRUD operations, and set up validation and references.",
      resources: ["https://mongoosejs.com/docs/", "https://www.mongodb.com/docs/"],
      exercises: ["Connect your API to MongoDB", "Design a schema with relationship fields for a blogging platform"],
      order: 2,
      roadmapId: backendRoadmap._id,
    });

    const beStep3 = await LearningStep.create({
      title: "Authentication & Security",
      content: "Secure routes using JSON Web Tokens (JWT) and hash passwords with bcryptjs. Enforce role-based access control.",
      resources: ["https://jwt.io", "https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html"],
      exercises: ["Implement user signup/login endpoints with JWT", "Secure book API endpoints to be authenticated-only"],
      order: 3,
      roadmapId: backendRoadmap._id,
    });

    backendRoadmap.steps.push(beStep1._id, beStep2._id, beStep3._id);
    await backendRoadmap.save();

    // Roadmap 3: AI
    const aiRoadmap = new Roadmap({
      title: "Artificial Intelligence & ML Fundamentals",
      description: "Delve into Python, Data Science packages, Machine Learning algorithms, and Deep Learning models.",
      category: "ai",
      difficultyLevel: "intermediate",
      steps: [],
    });
    await aiRoadmap.save();

    const aiStep1 = await LearningStep.create({
      title: "Python for Data Science",
      content: "Master Python libraries like NumPy, Pandas, and Matplotlib for data processing, analysis, and visualization.",
      resources: ["https://pandas.pydata.org", "https://numpy.org"],
      exercises: ["Load and clean a CSV dataset of sales data", "Plot historical temperature trends using Matplotlib"],
      order: 1,
      roadmapId: aiRoadmap._id,
    });

    const aiStep2 = await LearningStep.create({
      title: "Supervised Learning Algorithms",
      content: "Understand Linear Regression, Logistic Regression, Decision Trees, and how to train models using Scikit-Learn.",
      resources: ["https://scikit-learn.org", "https://machinelearningmastery.com"],
      exercises: ["Train a house price prediction model", "Classify email spam using Naive Bayes classifier"],
      order: 2,
      roadmapId: aiRoadmap._id,
    });

    const aiStep3 = await LearningStep.create({
      title: "Deep Learning & Neural Networks",
      content: "Dive into Artificial Neural Networks (ANNs) and build simple classification networks with TensorFlow/Keras.",
      resources: ["https://tensorflow.org", "https://pytorch.org"],
      exercises: ["Train a digit recognizer model on the MNIST dataset", "Create an image classification network using PyTorch"],
      order: 3,
      roadmapId: aiRoadmap._id,
    });

    aiRoadmap.steps.push(aiStep1._id, aiStep2._id, aiStep3._id);
    await aiRoadmap.save();

    // Roadmap 4: Mobile
    const mobileRoadmap = new Roadmap({
      title: "Mobile App Development with React Native",
      description: "Build native cross-platform mobile apps for iOS and Android using React and JavaScript.",
      category: "mobile",
      difficultyLevel: "beginner",
      steps: [],
    });
    await mobileRoadmap.save();

    const mobStep1 = await LearningStep.create({
      title: "React Native Setup & Core Components",
      content: "Install Expo CLI, understand views, styling, text, images, and scrollviews. Build simple mobile screen layouts.",
      resources: ["https://reactnative.dev", "https://docs.expo.dev"],
      exercises: ["Set up a mobile simulator/device", "Create a profile screen with an avatar image and description text"],
      order: 1,
      roadmapId: mobileRoadmap._id,
    });

    const mobStep2 = await LearningStep.create({
      title: "Mobile Navigation & Lists",
      content: "Implement Stack and Tab navigation using React Navigation, and render lists efficiently using FlatList.",
      resources: ["https://reactnavigation.org"],
      exercises: ["Configure a tab bar navigation menu", "Display a dynamic list of feed items with click-to-detail navigation"],
      order: 2,
      roadmapId: mobileRoadmap._id,
    });

    const mobStep3 = await LearningStep.create({
      title: "Device Features & State Persistence",
      content: "Integrate device features (like camera/gallery access) and store data locally using AsyncStorage.",
      resources: ["https://docs.expo.dev/versions/latest/sdk/camera/"],
      exercises: ["Write a note-taking mobile application with persistent offline storage", "Integrate image uploading using device camera roll"],
      order: 3,
      roadmapId: mobileRoadmap._id,
    });

    mobileRoadmap.steps.push(mobStep1._id, mobStep2._id, mobStep3._id);
    await mobileRoadmap.save();

    console.log("Database seeded successfully with all categories!");
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding: ", error);
    process.exit(1);
  }
};

seedData();

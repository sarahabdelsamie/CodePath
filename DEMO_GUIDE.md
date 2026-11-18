# CodePath — Live Demo Script & Step-by-Step Evaluator Scenario

> **Use this scenario during project demonstrations, technical evaluations, or graduation reviews.**

---

## Demo Credentials Overview

| Role | Email | Password | What to Show |
| :--- | :--- | :--- | :--- |
| **Learner** | `learner@codepath.com` | `password123` | Active Dashboard, progress percentage, roadmap navigation, marking lesson complete |
| **Mentor** | `mentor@codepath.com` | `password123` | Dynamic mentee overview, track breakdown, broadcasting announcements |
| **Admin** | `admin@codepath.com` | `password123` | Platform KPIs, user role moderation, content management, resolving reports |

*(Tip: You can click the "Learner", "Mentor", or "Admin" quick-fill buttons directly on the Login page for one-click login!)*

---

## Scenario 1: The Learner Experience (Core Learning Loop)

1. **Visit Landing Page (`/`)**:
   - Show the hero banner and explore the pathways in the **Explore Core Pathways** section.
   - Click on the **Frontend** pathway card — notice it takes you directly to the Frontend Roadmap page (`/roadmaps/frontend`).

2. **Login as Learner**:
   - Go to `/login` and click the **Learner** demo button (or enter `learner@codepath.com` / `password123`).
   - Click **Log In** — you will be redirected to the **Learner Dashboard (`/dashboard`)**.

3. **Inspect the Dynamic Dashboard**:
   - Review the **Current Track** card (Frontend Developer Career Path).
   - Point out the **Completion Percentage** (e.g. 33%).
   - Show the **Recommended Next Step** card dynamically calculated based on uncompleted steps.
   - Show the **Recently Completed Steps** list displaying past completed lessons.

4. **Complete a Step**:
   - Click **"Continue Learning"** on the recommended step (or navigate to `/roadmaps` -> Frontend Developer Career Path -> select Step 2: "JavaScript Basics & DOM Manipulation").
   - Review the step content, external resource links, and interactive exercise checkboxes.
   - Click the green **"Mark Step as Completed"** button.
   - Notice the success feedback and automatic redirect back to the roadmap view.
   - Return to the **Dashboard** — observe that the progress percentage has dynamically increased from 33% to 67%, and the next recommended step has updated to Step 3 (React Framework Essentials)!

5. **Profile & Learning History (`/profile`)**:
   - Click on your avatar or **Profile** in the navbar.
   - Show the user details and the populated **Learning History** card showing real progress stored in MongoDB.
   - Click **"Edit Profile"**, change your name or skill level, and click **"Save Changes"** — verify changes persist immediately.

---

## Scenario 2: The Mentor Experience (Oversight & Guidance)

1. **Log in as Mentor**:
   - Click **Sign Out** in the navbar.
   - Go to `/login` and click the **Mentor** button (`mentor@codepath.com` / `password123`).
   - You are redirected to `/mentor-dashboard`.

2. **Inspect Mentee Progress**:
   - Review the KPI metrics at the top: **Active Mentees**, **Frontend & Backend**, and **AI & Mobile Specialists**.
   - Review the **Your Mentees** list — point out **Alex Johnson** with their live progress percentage synced from the database.
   - Click **"View Track"** on Alex Johnson to inspect the curriculum they are working on.

3. **Mentor Tools**:
   - Click **"Open Direct Connect"** under Mentor Tools.
   - Type an announcement in the modal (e.g. *"Review session on async JS this Friday at 4 PM"*) and click **"Send Broadcast"**.
   - Click **"Open Scheduler"** to demonstrate setting available office hour slots.

---

## Scenario 3: The Administrator Experience (Platform Governance)

1. **Log in as Admin**:
   - Sign out and go to `/login`.
   - Click the **Admin** button (`admin@codepath.com` / `password123`).
   - You are redirected to `/admin`.

2. **Admin Overview & Statistics**:
   - Show the live system counters: **Total Users**, **Learner Count**, **Mentor Count**, **Total Roadmaps**, **Total Learning Steps**, and **Completed Steps Across Platform**.
   - Show the **Roadmaps by Category** visual bars and **Recent Registrations** list.

3. **User Management**:
   - Click the **"Users"** tab.
   - Search for a user or filter by role (`Learner`, `Mentor`, `Admin`).
   - Click the role dropdown on a user to demonstrate instant role changes (e.g. promoting a learner to mentor).

4. **Content Management**:
   - Click the **"Content"** tab.
   - View the active roadmaps.
   - Show the **"New Roadmap"** and **"Add Step"** modals to demonstrate full administrative content control.

5. **Moderation Reports**:
   - Click the **"Reports"** tab.
   - Review reported content tickets.
   - Change a ticket status from `Pending` to `Resolved` and add resolution notes.

6. **System Settings**:
   - Click the **"Settings"** tab.
   - Review the platform settings (Platform Name, Maintenance Mode toggle, Support Email, Announcement Banner).
   - Edit the announcement banner and click **"Save Platform Settings"** — verify success response from the backend.

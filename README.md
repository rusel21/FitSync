## FitSync Collaboration Guide

Welcome to the **FitSync** project! 👋  
This guide explains how to collaborate smoothly using GitHub.

---

## 🧩 Step 1: Accept the Invitation

You’ll receive an **email** or **GitHub notification** saying:

> “You’ve been invited to collaborate on rusel21/FitSync.”

Click **“View Invitation”** → then **“Accept invitation.”**  
Once accepted, you can visit the repository at:

👉 https://github.com/ruselportes/FitSync

---

## 💻 Step 2: Clone the Repository

Open your terminal or VS Code and run:

```bash
git clone https://github.com/ruselportes/FitSync.git
cd FitSync
This downloads the project to your local computer.

🌱 Step 3: Create a Branch for Your Work
Always create a new branch before making changes:

bash
Always show details

Copy code
git checkout -b feature-branch-name
Example:

bash
Always show details


git checkout -b feature-add-member-form
✏️ Step 4: Make and Commit Your Changes
Edit the files as needed. Then save and run:

bash
Always show details


git add .
git commit -m "Describe what you changed here"
🚀 Step 5: Push Your Branch to GitHub
Upload your work to the shared repository:

bash
Always show details


git push origin feature-branch-name
🔁 Step 6: Open a Pull Request (PR)
Go to the GitHub repo page: https://github.com/ruselportes/FitSync

Click “Compare & pull request.”

Add a short description.

Click “Create pull request.”

The project owner (ruselportes) will review and merge it.

👥 Collaborator Example
If the collaborator is MarcHael-28, their steps are:

bash
Always show details


git clone https://github.com/ruselportes/FitSync.git
cd FitSync
git checkout -b marc-feature-branch
git add .
git commit -m "Marc: Added new feature"
git push origin marc-feature-branch
Then they’ll open a Pull Request to request merging their updates.

♻️ Step 7: Stay Updated
Always pull the latest version before starting new work:

bash
Always show details


git pull origin main
🧠 Quick Reference
Action	Command
Clone repo	git clone <repo-url>
Create branch	git checkout -b branch-name
Stage files	git add .
Commit changes	git commit -m "message"
Push to GitHub	git push origin branch-name
Get latest updates	git pull origin main

💬 Notes
Don’t push directly to the main branch.

Commit often with clear messages.

Use branches for features or fixes.

Happy coding! 🚀

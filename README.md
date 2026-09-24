**PocketPilot - Student Finance Tracker**

Track. Plan. Save.

A personal finance management web application designed to help students track their income, manage expenses, set budgets, monitor savings goals, and understand their spending habits.

PocketPilot is a real-time personal finance management application that helps students track expenses, manage savings goals, and monitor spending budgets with cloud synchronization.


**I. Problem**

Students struggle to manage finances effectively across multiple devices without a unified platform to track allowance, expenses, and savings goals.


**II. Overview**

This project is a web-based finance management system that syncs financial data in real-time using Firebase, allowing students to track income/expenses, visualize spending patterns, set budgets with alerts, and monitor progress toward savings goals.


**III. Solution**

Our system provides a user-friendly interface to add and categorize transactions, automatically calculates balance, generates pie charts for spending visualization, and stores all data in Firebase for cross-device synchronization. Users can set savings goals with progress tracking, define category budgets with status alerts, and view month-over-month financial comparisons.


**IV. Features**

User authentication with Gmail login

Add income and expense transactions

Real-time balance calculation

Spending visualization with pie charts

Filter transactions by date and category

Create and track savings goals with progress bars

Set category budgets with status alerts (Within Budget / Approaching / Over Budget)

Monthly comparison with spending insights

Low balance alerts

Data persistence across devices via Firebase


**V. Tech Stack**

HTML5

CSS3

Vanilla JavaScript

Firebase (Authentication + Firestore)

Chart.js


**VI. System Architecture**

<img width="822" height="657" alt="image" src="https://github.com/user-attachments/assets/997a2322-d00e-453a-8979-65905868bf24" />


**VII. How to Run the Project**

**1. Prerequisites**

Modern web browser (Chrome, Firefox, Safari, Edge)

Firebase account (create at firebase.google.com)

**2. Installation**

**2.1. Clone repository**

git clone https://github.com/YOUR_USERNAME/student-finance-tracker.git

cd student-finance-tracker

**2.2. Set up Firebase**

Create Firebase project: StudentFinanceTracker

Enable Google Authentication

Create Firestore Database (asia-south2 region)

Add authorized domains: localhost, 127.0.0.1

**2.3. Update Firebase configuration**

Open app.js

Replace Firebase config with your credentials from Firebase Console

**2.4. Run locally**

Option 1: VS Code Live Server

  Right-click index.html → Open with Live Server

Option 2: Terminal

  live-server
  
or

  python -m http.server 5500

**2.5. Access app**

Open browser to http://127.0.0.1:5500


**VIII. Output**

The system returns:

**1. Dashboard:** Current balance, total income, total spent, total saved, save percentage

**2. Transactions:** List of all income/expense entries with delete option

**3. Charts:** Pie chart showing spending distribution by category

**4. Goals:** Savings goals with progress bars and achievement status

**5. Budgets:** Category budgets with status (Green/Yellow/Red) and spending percentage

**6. Comparison:** Month-over-month analysis with spending trends and insights

**7. Alerts:** Low balance notifications when balance drops below ₹100


**# PocketPilot - Student Finance Tracker **

Track. Plan. Save.

A personal finance management web application designed to help students track their income, manage expenses, set budgets, monitor savings goals, and understand their spending habits.

PocketPilot is a real-time personal finance management application that helps students track expenses, manage savings goals, and monitor spending budgets with cloud synchronization.


**Problem**

Students struggle to manage finances effectively across multiple devices without a unified platform to track allowance, expenses, and savings goals.


**Overview**

This project is a web-based finance management system that syncs financial data in real-time using Firebase, allowing students to track income/expenses, visualize spending patterns, set budgets with alerts, and monitor progress toward savings goals.


**Solution**

Our system provides a user-friendly interface to add and categorize transactions, automatically calculates balance, generates pie charts for spending visualization, and stores all data in Firebase for cross-device synchronization. Users can set savings goals with progress tracking, define category budgets with status alerts, and view month-over-month financial comparisons.


**Features**

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


**Tech Stack**

HTML5

CSS3

Vanilla JavaScript

Firebase (Authentication + Firestore)

Chart.js


**System Architecture**

User Login (Gmail OAuth)
       ↓
   Firebase Auth
       ↓
   Dashboard (Real-time data from Firestore)
       ↓
   ┌─────────────────────┬──────────────┬──────────────┬──────────────┐
   ↓                     ↓              ↓              ↓              ↓
Transactions Tab    Goals Tab      Budgets Tab   Comparison Tab   Profile
   ↓                     ↓              ↓              ↓
Add/Filter Trans.   Create Goals    Set Budgets  Monthly Analysis
   ↓                     ↓              ↓              ↓
Sync to Firestore → Store in DB → Calculate Alerts → Generate Insights
   ↓
Real-time Display


**How to Run the Project**

**Prerequisites**

Modern web browser (Chrome, Firefox, Safari, Edge)

Firebase account (create at firebase.google.com)

**Installation**

**1. Clone repository**

git clone https://github.com/YOUR_USERNAME/student-finance-tracker.git
cd student-finance-tracker

**2. Set up Firebase**

Create Firebase project: StudentFinanceTracker
Enable Google Authentication
Create Firestore Database (asia-south2 region)
Add authorized domains: localhost, 127.0.0.1

**3. Update Firebase configuration**

Open app.js
Replace Firebase config with your credentials from Firebase Console

**4. Run locally**

# Option 1: VS Code Live Server
# Right-click index.html → Open with Live Server

# Option 2: Terminal
live-server
# or
python -m http.server 5500

**5. Access app**

Open browser to http://127.0.0.1:5500


**Output**

The system returns:

**Dashboard:** Current balance, total income, total spent, total saved, save percentage

**Transactions:** List of all income/expense entries with delete option

**Charts:** Pie chart showing spending distribution by category

**Goals:** Savings goals with progress bars and achievement status

**Budgets:** Category budgets with status (Green/Yellow/Red) and spending percentage

**Comparison:** Month-over-month analysis with spending trends and insights

**Alerts:** Low balance notifications when balance drops below ₹100


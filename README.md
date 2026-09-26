# 💰 PocketPilot - Student Finance Tracker

Track. Plan. Save.

A personal finance management app designed for students to track income, manage expenses, set budgets, and monitor savings goals with real-time cloud synchronization.

---

## 📋 Overview

PocketPilot is a web-based finance management system that helps students take control of their money. Track every rupee, visualize spending patterns, set budget alerts, and watch your savings goals grow — all synced across your devices instantly.

---

## ✨ Features

- 🔐 **Gmail Login** — Secure authentication with Google
- 💳 **Income & Expense Tracking** — Add transactions with categories
- 💹 **Real-Time Balance** — Auto-calculated balance updates instantly
- 📊 **Spending Charts** — Pie charts showing where your money goes
- 🎯 **Savings Goals** — Track progress with visual progress bars
- 💰 **Budget Alerts** — Set category limits, get status alerts (Within / Approaching / Over Budget)
- 📅 **Date Filtering** — View transactions by date range
- 📈 **Monthly Comparison** — See spending trends month-over-month
- 🔔 **Low Balance Alerts** — Get notified when balance drops below ₹100
- ☁️ **Cloud Sync** — All data synced across devices via Firebase

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Authentication | Firebase Google Auth |
| Database | Firebase Firestore |
| Charts | Chart.js |
| Real-Time Sync | Firebase Cloud |

---

**VI. System Architecture**

<img width="822" height="657" alt="image" src="https://github.com/user-attachments/assets/997a2322-d00e-453a-8979-65905868bf24" />

---

## 🚀 How to Run

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Firebase account (free at firebase.google.com)

### Step 1: Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project: **StudentFinanceTracker**
3. Enable **Google Authentication**
4. Create **Firestore Database** (region: asia-south2)
5. Add authorized domains: `localhost`, `127.0.0.1`
6. Copy Firebase config from Project Settings

### Step 2: Configure App

1. Clone repository:

git clone https://github.com/YOUR_USERNAME/pocketpilot.git
cd pocketpilot

2. Open `app.js`
3. Replace Firebase config with your credentials:
javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

### Step 3: Run Locally

**Option 1: VS Code Live Server**
- Right-click `index.html` → Open with Live Server

**Option 2: Terminal**

live-server

or

python -m http.server 5500


### Step 4: Access App

Open browser: `http://127.0.0.1:5500`

---

## 📤 Output

### Dashboard
- Current balance
- Total income (month)
- Total spent (month)
- Total saved
- Save percentage

### Transactions
- Complete list of income/expense entries
- Delete button for each transaction
- Filterable by date and category

### Spending Charts
- Pie chart showing spending by category
- Visual breakdown of where money goes
- Color-coded categories

### Savings Goals
- Goal name, target amount, current saved
- Progress bar for each goal
- Achievement percentage

### Budget Management
- Category-wise budget limits
- Spending percentage per category

### Monthly Comparison
- Month-over-month spending trends
- Income vs expense analysis
- Spending insights and patterns

### Alerts
- Low balance notification (when < ₹100)
- Budget status alerts
- Real-time updates

---

## 🎯 Example Workflow

1. **Sign in** with Gmail
2. **Add income** — Record allowance/earnings
3. **Track expenses** — Log purchases by category
4. **View dashboard** — See balance and totals
5. **Set goals** — Define savings targets
6. **Create budgets** — Set spending limits
7. **Review charts** — Visualize spending patterns
8. **Compare months** — Track progress over time

---

## ✅ What's Included

✓ Gmail authentication  
✓ Add/delete transactions  
✓ Real-time balance calculation  
✓ Spending visualization  
✓ Category-based filtering  
✓ Savings goal tracking  
✓ Budget management with alerts  
✓ Monthly spending comparison  
✓ Low balance notifications  
✓ Cloud data synchronization  
✓ Mobile-friendly interface  

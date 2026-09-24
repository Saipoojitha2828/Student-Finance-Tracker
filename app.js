const firebaseConfig = {
  apiKey: "AIzaSyAH35iemZy0KKQoe5G4kBfRrXS2_9Zech8",
  authDomain: "studentfinancetracker-f454b.firebaseapp.com",
  projectId: "studentfinancetracker-f454b",
  storageBucket: "studentfinancetracker-f454b.firebasestorage.app",
  messagingSenderId: "893106439762",
  appId: "1:893106439762:web:9e64474cfa5abd395dc18b",
  measurementId: "G-ZYFN5R42D3"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;
let allTransactions = [];
let allGoals = [];
let allBudgets = [];
let chart = null;
let filteredTransactions = [];

document.getElementById('googleLoginBtn').addEventListener('click', function() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(result => {
            currentUser = result.user;
            showAppScreen();
            loadTransactions();
            loadGoals();
            loadBudgets();
        })
        .catch(error => alert('Login failed: ' + error.message));
});

document.getElementById('logoutBtn').addEventListener('click', function() {
    auth.signOut().then(() => {
        currentUser = null;
        allTransactions = [];
        allGoals = [];
        allBudgets = [];
        showLoginScreen();
        resetForms();
    });
});

function showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('appScreen').classList.add('hidden');
}

function showAppScreen() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('appScreen').classList.remove('hidden');
    document.getElementById('userEmail').textContent = currentUser.email;
}

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    event.target.classList.add('active');
    
    if (tabName === 'comparison') {
        displayComparison();
    }
}

function addIncome() {
    const amount = parseFloat(document.getElementById('incomeAmount').value);
    const date = document.getElementById('incomeDate').value;
    const source = document.getElementById('incomeSource').value;

    if (!amount || !date || !source) {
        alert('Please fill all fields!');
        return;
    }

    if (amount <= 0) {
        alert('Amount must be greater than 0!');
        return;
    }

    const transaction = {
        type: 'income',
        amount: amount,
        date: date,
        source: source,
        timestamp: new Date(),
        description: source
    };

    db.collection('users').doc(currentUser.uid).collection('transactions').add(transaction)
        .then(() => {
            resetIncomeForm();
            loadTransactions();
        })
        .catch(error => alert('Error adding income: ' + error.message));
}

function addExpense() {
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const date = document.getElementById('expenseDate').value;
    const category = document.getElementById('expenseCategory').value;
    const description = document.getElementById('expenseDescription').value;

    if (!amount || !date || !category) {
        alert('Please fill all required fields!');
        return;
    }

    if (amount <= 0) {
        alert('Amount must be greater than 0!');
        return;
    }

    const transaction = {
        type: 'expense',
        amount: amount,
        date: date,
        category: category,
        description: description || category,
        timestamp: new Date()
    };

    db.collection('users').doc(currentUser.uid).collection('transactions').add(transaction)
        .then(() => {
            resetExpenseForm();
            loadTransactions();
            checkBudgetAlerts();
        })
        .catch(error => alert('Error adding expense: ' + error.message));
}

function loadTransactions() {
    db.collection('users').doc(currentUser.uid).collection('transactions')
        .orderBy('timestamp', 'desc')
        .onSnapshot(snapshot => {
            allTransactions = [];
            snapshot.forEach(doc => {
                allTransactions.push({ id: doc.id, ...doc.data() });
            });
            filteredTransactions = allTransactions;
            displayTransactions();
            updateSummary();
            updateChart();
            checkLowBalance();
        });
}

function displayTransactions() {
    const listDiv = document.getElementById('transactionsList');
    listDiv.innerHTML = '';

    if (filteredTransactions.length === 0) {
        listDiv.innerHTML = '<p style="text-align: center; color: #999;">No transactions found</p>';
        return;
    }

    filteredTransactions.forEach(transaction => {
        const div = document.createElement('div');
        div.className = `transaction-item ${transaction.type}`;
        
        const sign = transaction.type === 'income' ? '+' : '-';
        const amountClass = transaction.type === 'income' ? 'income' : 'expense';

        div.innerHTML = `
            <div class="transaction-info">
                <div class="transaction-description">${transaction.description}</div>
                <div class="transaction-date">${transaction.date}</div>
            </div>
            <div class="transaction-amount ${amountClass}">${sign}₹${transaction.amount}</div>
            <button class="btn-delete" onclick="deleteTransaction('${transaction.id}')">Delete</button>
        `;

        listDiv.appendChild(div);
    });
}

function deleteTransaction(transactionId) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        db.collection('users').doc(currentUser.uid).collection('transactions').doc(transactionId).delete()
            .then(() => {
                loadTransactions();
            })
            .catch(error => alert('Error deleting transaction: ' + error.message));
    }
}

function applyFilters() {
    const startDate = document.getElementById('filterStartDate').value;
    const endDate = document.getElementById('filterEndDate').value;
    const category = document.getElementById('filterCategory').value;

    filteredTransactions = allTransactions.filter(transaction => {
        let matches = true;

        if (startDate && transaction.date < startDate) {
            matches = false;
        }

        if (endDate && transaction.date > endDate) {
            matches = false;
        }

        if (category && transaction.type === 'expense' && transaction.category !== category) {
            matches = false;
        }

        return matches;
    });

    displayTransactions();
    updateChart();
}

function clearFilters() {
    document.getElementById('filterStartDate').value = '';
    document.getElementById('filterEndDate').value = '';
    document.getElementById('filterCategory').value = '';
    filteredTransactions = allTransactions;
    displayTransactions();
    updateChart();
}

function updateSummary() {
    let totalIncome = 0;
    let totalExpense = 0;

    allTransactions.forEach(transaction => {
        if (transaction.type === 'income') {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }
    });

    const balance = totalIncome - totalExpense;
    const savePercentage = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

    document.getElementById('currentBalance').textContent = '₹' + balance;
    document.getElementById('totalIncome').textContent = '₹' + totalIncome;
    document.getElementById('totalSpent').textContent = '₹' + totalExpense;
    document.getElementById('totalSaved').textContent = '₹' + balance;
    document.getElementById('savePercentage').textContent = savePercentage + '%';
}

function updateChart() {
    const categorySpending = {};

    filteredTransactions.forEach(transaction => {
        if (transaction.type === 'expense') {
            const category = transaction.category;
            categorySpending[category] = (categorySpending[category] || 0) + transaction.amount;
        }
    });

    const categories = Object.keys(categorySpending);
    const amounts = Object.values(categorySpending);

    const colors = [
        '#FF6B6B',
        '#4ECDC4',
        '#45B7D1',
        '#FFA07A',
        '#98D8C8',
        '#F7DC6F',
        '#BB8FCE'
    ];

    const ctx = document.getElementById('spendingChart').getContext('2d');

    if (chart) {
        chart.destroy();
    }

    if (categories.length === 0) {
        ctx.fillStyle = '#999';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No expenses yet', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }

    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: colors.slice(0, categories.length),
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 12
                        },
                        padding: 15
                    }
                }
            }
        }
    });
}

function checkLowBalance() {
    let totalIncome = 0;
    let totalExpense = 0;

    allTransactions.forEach(transaction => {
        if (transaction.type === 'income') {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }
    });

    const balance = totalIncome - totalExpense;
    const alertDiv = document.getElementById('lowBalanceAlert');

    if (balance < 100) {
        alertDiv.classList.remove('hidden');
    } else {
        alertDiv.classList.add('hidden');
    }
}

function addGoal() {

    let name;
    let amount;

    if (allGoals.length === 0) {

        name = document.getElementById('goalName').value.trim();

        amount = parseFloat(
            document.getElementById('goalAmount').value
        );

    } else {

        name = document.getElementById('goalNamePopulated').value.trim();

        amount = parseFloat(
            document.getElementById('goalAmountPopulated').value
        );
    }


    if (!name || !amount || amount <= 0) {

        alert('Please fill all fields with valid amounts!');

        return;
    }


    const goal = {

        name: name,

        targetAmount: amount,

        createdAt: new Date(),

        timestamp: new Date()
    };


    db.collection('users')
        .doc(currentUser.uid)
        .collection('goals')
        .add(goal)

        .then(() => {

            document.getElementById('goalName').value = '';
            document.getElementById('goalAmount').value = '';

            document.getElementById('goalNamePopulated').value = '';
            document.getElementById('goalAmountPopulated').value = '';

            hideGoalsForm();

            loadGoals();

        })

        .catch(error => {

            alert('Error adding goal: ' + error.message);

        });
}

function loadGoals() {
    db.collection('users').doc(currentUser.uid).collection('goals')
        .onSnapshot(snapshot => {
            allGoals = [];
            snapshot.forEach(doc => {
                allGoals.push({ id: doc.id, ...doc.data() });
            });
            displayGoals();
        });
}

function displayGoals() {
    updateGoalsDisplay();
    
    const listDiv = document.getElementById('goalsList');
    listDiv.innerHTML = '';

    if (allGoals.length === 0) {
        return;
    }

    allGoals.forEach(goal => {
        let totalIncome = 0;
        let totalExpense = 0;

        allTransactions.forEach(transaction => {
            if (transaction.type === 'income') {
                totalIncome += transaction.amount;
            } else {
                totalExpense += transaction.amount;
            }
        });

        const saved = totalIncome - totalExpense;
        const percentage = (saved / goal.targetAmount * 100).toFixed(1);
        const progressWidth = Math.min(percentage, 100);

        const div = document.createElement('div');
        div.className = 'goal-card';

        div.innerHTML = `
            <h3>${goal.name}</h3>
            <div class="goal-progress">
                <div class="goal-progress-bar" style="width: ${progressWidth}%">
                    ${progressWidth}%
                </div>
            </div>
            <div class="goal-stats">
                <p><strong>Target:</strong> ${goal.targetAmount}</p>
                <p><strong>Saved:</strong> ${saved}</p>
                <p><strong>Remaining:</strong> ${Math.max(0, goal.targetAmount - saved)}</p>
                ${percentage >= 100 ? '<p style="color: #51cf66; font-weight: bold;">Goal Achieved!</p>' : ''}
            </div>
            <button class="btn-delete-goal" onclick="deleteGoal('${goal.id}')">Delete Goal</button>
        `;

        listDiv.appendChild(div);
    });
}

function deleteGoal(goalId) {
    if (confirm('Delete this goal?')) {
        db.collection('users').doc(currentUser.uid).collection('goals').doc(goalId).delete()
            .then(() => {
                loadGoals();
            })
            .catch(error => alert('Error deleting goal: ' + error.message));
    }
}

function addBudget() {

    let category;
    let amount;


    if (allBudgets.length === 0) {

        category = document.getElementById('budgetCategory').value;

        amount = parseFloat(
            document.getElementById('budgetAmount').value
        );

    } else {

        category = document.getElementById('budgetCategoryPopulated').value;

        amount = parseFloat(
            document.getElementById('budgetAmountPopulated').value
        );
    }


    if (!category || !amount || amount <= 0) {

        alert('Please select category and enter valid amount!');

        return;
    }


    const budget = {

        category: category,

        limitAmount: amount,

        createdAt: new Date(),

        timestamp: new Date()
    };


    db.collection('users')
        .doc(currentUser.uid)
        .collection('budgets')
        .add(budget)

        .then(() => {

            document.getElementById('budgetCategory').value = '';
            document.getElementById('budgetAmount').value = '';

            document.getElementById('budgetCategoryPopulated').value = '';
            document.getElementById('budgetAmountPopulated').value = '';

            hideBudgetsForm();

            loadBudgets();

            checkBudgetAlerts();

        })

        .catch(error => {

            alert('Error adding budget: ' + error.message);

        });
}

function loadBudgets() {
    db.collection('users').doc(currentUser.uid).collection('budgets')
        .onSnapshot(snapshot => {
            allBudgets = [];
            snapshot.forEach(doc => {
                allBudgets.push({ id: doc.id, ...doc.data() });
            });
            displayBudgets();
        });
}

function displayBudgets() {
    updateBudgetsDisplay();
    
    const listDiv = document.getElementById('budgetsList');
    listDiv.innerHTML = '';

    if (allBudgets.length === 0) {
        return;
    }

    allBudgets.forEach(budget => {
        let spent = 0;
        allTransactions.forEach(transaction => {
            if (transaction.type === 'expense' && transaction.category === budget.category) {
                spent += transaction.amount;
            }
        });

        const remaining = budget.limitAmount - spent;
        const percentage = (spent / budget.limitAmount * 100).toFixed(1);
        const progressWidth = Math.min(percentage, 100);

        let statusClass = 'ok';
        let statusText = 'Within Budget';

        if (percentage >= 100) {
            statusClass = 'danger';
            statusText = 'Over Budget!';
        } else if (percentage >= 80) {
            statusClass = 'warning';
            statusText = 'Approaching Limit!';
        }

        let progressClass = '';
        if (percentage >= 100) {
            progressClass = 'danger';
        } else if (percentage >= 80) {
            progressClass = 'warning';
        }

        const div = document.createElement('div');
        div.className = 'budget-card';

        div.innerHTML = `
            <h3>${budget.category}</h3>
            <div class="budget-status ${statusClass}">
                ${statusText}
            </div>
            <div class="budget-progress">
                <div class="budget-progress-bar ${progressClass}" style="width: ${progressWidth}%"></div>
            </div>
            <div class="budget-stats">
                <p><strong>Limit:</strong> ${budget.limitAmount}</p>
                <p><strong>Spent:</strong> ${spent} (${percentage}%)</p>
                <p><strong>Remaining:</strong> ${Math.max(0, remaining)}</p>
            </div>
            <button class="btn-delete-budget" onclick="deleteBudget('${budget.id}')">Delete Budget</button>
        `;

        listDiv.appendChild(div);
    });
}

function deleteBudget(budgetId) {
    if (confirm('Delete this budget?')) {
        db.collection('users').doc(currentUser.uid).collection('budgets').doc(budgetId).delete()
            .then(() => {
                loadBudgets();
            })
            .catch(error => alert('Error deleting budget: ' + error.message));
    }
}

function checkBudgetAlerts() {
    allBudgets.forEach(budget => {
        let spent = 0;
        allTransactions.forEach(transaction => {
            if (transaction.type === 'expense' && transaction.category === budget.category) {
                spent += transaction.amount;
            }
        });

        const percentage = (spent / budget.limitAmount * 100);

        if (percentage >= 80 && percentage < 100) {
            console.log(`⚠️ Warning: ${budget.category} budget is at ${percentage.toFixed(1)}%`);
        } else if (percentage >= 100) {
            console.log(`❌ Alert: ${budget.category} budget exceeded by ₹${(spent - budget.limitAmount).toFixed(0)}`);
        }
    });
}

function displayComparison() {
    const currentMonth = new Date();
    const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);

    const currentMonthStr = currentMonth.toISOString().slice(0, 7);
    const lastMonthStr = lastMonth.toISOString().slice(0, 7);

    let thisMonthIncome = 0;
    let thisMonthExpense = 0;

    allTransactions.forEach(transaction => {
        const transDate = transaction.date.slice(0, 7);
        if (transDate === currentMonthStr) {
            if (transaction.type === 'income') {
                thisMonthIncome += transaction.amount;
            } else {
                thisMonthExpense += transaction.amount;
            }
        }
    });

    let lastMonthIncome = 0;
    let lastMonthExpense = 0;

    allTransactions.forEach(transaction => {
        const transDate = transaction.date.slice(0, 7);
        if (transDate === lastMonthStr) {
            if (transaction.type === 'income') {
                lastMonthIncome += transaction.amount;
            } else {
                lastMonthExpense += transaction.amount;
            }
        }
    });

    const thisMonthSaved = thisMonthIncome - thisMonthExpense;
    const lastMonthSaved = lastMonthIncome - lastMonthExpense;

    const spendingChange = thisMonthExpense - lastMonthExpense;
    const savingsChange = thisMonthSaved - lastMonthSaved;

    const div = document.getElementById('comparisonStats');
    div.innerHTML = '';

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthName = monthNames[currentMonth.getMonth()];
    const lastMonthName = monthNames[lastMonth.getMonth()];

    const thisMonthCard = document.createElement('div');
    thisMonthCard.className = 'comparison-month';
    thisMonthCard.innerHTML = `
        <h3>${currentMonthName} (Current)</h3>
        <div class="comparison-stat">
            <span>Income:</span>
            <div class="comparison-stat-value">₹${thisMonthIncome}</div>
        </div>
        <div class="comparison-stat">
            <span>Spent:</span>
            <div class="comparison-stat-value">₹${thisMonthExpense}</div>
        </div>
        <div class="comparison-stat">
            <span>Saved:</span>
            <div class="comparison-stat-value">₹${thisMonthSaved}</div>
        </div>
    `;
    div.appendChild(thisMonthCard);

    const lastMonthCard = document.createElement('div');
    lastMonthCard.className = 'comparison-month';
    lastMonthCard.innerHTML = `
        <h3>${lastMonthName} (Previous)</h3>
        <div class="comparison-stat">
            <span>Income:</span>
            <div class="comparison-stat-value">₹${lastMonthIncome}</div>
        </div>
        <div class="comparison-stat">
            <span>Spent:</span>
            <div class="comparison-stat-value">₹${lastMonthExpense}</div>
        </div>
        <div class="comparison-stat">
            <span>Saved:</span>
            <div class="comparison-stat-value">₹${lastMonthSaved}</div>
        </div>
    `;
    div.appendChild(lastMonthCard);

    const comparisonCard = document.createElement('div');
    comparisonCard.className = 'comparison-month';

    let improvementHTML = '';
    if (savingsChange > 0) {
        improvementHTML = `<div class="comparison-improvement">You're saving ₹${savingsChange.toFixed(0)} more than last month! Great job!</div>`;
    } else if (savingsChange < 0) {
        improvementHTML = `<div class="comparison-decline">You're saving ₹${Math.abs(savingsChange).toFixed(0)} less than last month. Try to reduce spending!</div>`;
    } else {
        improvementHTML = `<div class="comparison-improvement">Same savings as last month. Keep it up!</div>`;
    }

    comparisonCard.innerHTML = `
        <h3>Analysis</h3>
        <div class="comparison-stat">
            <span>Spending Change:</span>
            <div class="comparison-stat-value" style="color: ${spendingChange > 0 ? '#ff6b6b' : '#51cf66'}">
                ${spendingChange > 0 ? '+' : ''}₹${spendingChange.toFixed(0)}
            </div>
        </div>
        <div class="comparison-stat">
            <span>Savings Change:</span>
            <div class="comparison-stat-value" style="color: ${savingsChange > 0 ? '#51cf66' : '#ff6b6b'}">
                ${savingsChange > 0 ? '+' : ''}₹${savingsChange.toFixed(0)}
            </div>
        </div>
        ${improvementHTML}
    `;
    div.appendChild(comparisonCard);
}

function resetIncomeForm() {
    document.getElementById('incomeAmount').value = '';
    document.getElementById('incomeDate').value = '';
    document.getElementById('incomeSource').value = '';
}

function resetExpenseForm() {
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseDate').value = '';
    document.getElementById('expenseCategory').value = '';
    document.getElementById('expenseDescription').value = '';
}

function resetForms() {
    resetIncomeForm();
    resetExpenseForm();
}

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('incomeDate').value = today;
    document.getElementById('expenseDate').value = today;
}

setDefaultDate();

function showGoalsForm() {

    if (allGoals.length === 0) {

        // First goal → show form in empty state
        document.getElementById('goalsFormContainer')
            .classList.remove('hidden');

    } else {

        // Additional goal → show form in populated state
        document.getElementById('goalsPopulatedForm')
            .classList.remove('hidden');

    }
}

function hideGoalsForm() {

    document.getElementById('goalsFormContainer')
        .classList.add('hidden');

    document.getElementById('goalsPopulatedForm')
        .classList.add('hidden');

    document.getElementById('goalName').value = '';
    document.getElementById('goalAmount').value = '';

    document.getElementById('goalNamePopulated').value = '';
    document.getElementById('goalAmountPopulated').value = '';
}

function showBudgetsForm() {

    if (allBudgets.length === 0) {

        // First budget → show form in empty state
        document.getElementById('budgetsFormContainer')
            .classList.remove('hidden');

    } else {

        // Additional budget → show form in populated state
        document.getElementById('budgetsPopulatedForm')
            .classList.remove('hidden');

    }
}

function hideBudgetsForm() {

    document.getElementById('budgetsFormContainer')
        .classList.add('hidden');

    document.getElementById('budgetsPopulatedForm')
        .classList.add('hidden');

    document.getElementById('budgetCategory').value = '';
    document.getElementById('budgetAmount').value = '';

    document.getElementById('budgetCategoryPopulated').value = '';
    document.getElementById('budgetAmountPopulated').value = '';
}

function updateGoalsDisplay() {
    if (allGoals.length === 0) {
        document.getElementById('goalsEmptyState').classList.remove('hidden');
        document.getElementById('goalsPopulatedState').classList.add('hidden');
    } else {
        document.getElementById('goalsEmptyState').classList.add('hidden');
        document.getElementById('goalsPopulatedState').classList.remove('hidden');
    }
}

function updateBudgetsDisplay() {
    if (allBudgets.length === 0) {
        document.getElementById('budgetsEmptyState').classList.remove('hidden');
        document.getElementById('budgetsPopulatedState').classList.add('hidden');
    } else {
        document.getElementById('budgetsEmptyState').classList.add('hidden');
        document.getElementById('budgetsPopulatedState').classList.remove('hidden');
    }
}
// Expense Tracker Logic
let expenses = [];
const expenseInput = document.getElementById('expense-input');
const expenseList = document.getElementById('expense-list');
const progressBar = document.getElementById('progress-bar');

function addExpense() {
    const input = expenseInput.value.trim();
    if (!input) return;

    const parts = input.split(' ');
    const amount = parseFloat(parts.pop().replace(/[^0-9.]/g, ''));
    const description = parts.join(' ');

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid expense with amount.');
        return;
    }

    expenses.push({ description, amount });

    const li = document.createElement('li');
    li.textContent = `${description} - ₹${amount}`;
    expenseList.appendChild(li);

    updateProgress();
    expenseInput.value = '';
}

function updateProgress() {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    progressBar.value = total;
    progressBar.max = 1000;

    if (total >= progressBar.max) {
        alert("You've reached your expense limit!");
    }
}

// Chatbot Logic (Backend Connected)
const chatWindow = document.getElementById('chat-window');
const chatInput = document.getElementById('chat-input');

function sendMessage() {
    const msg = chatInput.value.trim();
    if (!msg) return;

    appendMessage(msg, 'user-msg');
    getBotResponse(msg);
    chatInput.value = '';
}

function appendMessage(text, className) {
    const div = document.createElement('div');
    div.textContent = text;
    div.className = `message ${className}`;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function getBotResponse(msg) {
    try {
        const res = await fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg })
        });
        const data = await res.json();
        appendMessage(data.reply, 'ai-msg');
    } catch (err) {
        console.error(err);
        appendMessage("Sorry, I couldn't contact AI right now.", 'ai-msg');
    }
}

// Allow Enter key for chat input
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
});

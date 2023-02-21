"use strict";

// Simply Bank App

const account1 = {
  userName: "Cecil Ireland",
  transactions: [500, 250, -300, 5000, -850, -110, -170, 1100],
  interest: 1.5,
  pin: 1111,
};

const account2 = {
  userName: "Amani Salt",
  transactions: [2000, 6400, -1350, -70, -210, -2000, 5500, -30],
  interest: 1.3,
  pin: 2222,
};

const account3 = {
  userName: "Corey Martinez",
  transactions: [900, -200, 280, 300, -200, 150, 1400, -400],
  interest: 0.8,
  pin: 3333,
};

const account4 = {
  userName: "Kamile Searle",
  transactions: [530, 1300, 500, 40, 190],
  interest: 1,
  pin: 4444,
};

const account5 = {
  userName: "Oliver Avila",
  transactions: [630, 800, 300, 50, 120],
  interest: 1.1,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".total__value--in");
const labelSumOut = document.querySelector(".total__value--out");
const labelSumInterest = document.querySelector(".total__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerTransactions = document.querySelector(".transactions");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayTransactions = function (transactions, sort = false) {
  containerTransactions.innerHTML = "";

  const tranascs = sort
    ? transactions.slice().sort((x, y) => x - y)
    : transactions;

  tranascs.forEach(function (value, key) {
    const transType = value > 0 ? "deposit" : "withdrawal";
    const trans = `
        <div class="transactions__row">
          <div class="transactions__type transactions__type--${transType}">
            ${key + 1} ${transType}
          </div>
          <div class="transactions__date">2 дня назад</div>
          <div class="transactions__value">${value}$</div>
        </div>
    `;
    containerTransactions.insertAdjacentHTML("afterbegin", trans);
  });
};

//A function that erases the entire account balance
const displayBalance = function (account) {
  const balanceValue = account.transactions.reduce(
    (acc, number) => acc + number
  );
  account.balance = balanceValue;
  labelBalance.textContent = `${balanceValue}$`;
};

//A function that calculates transactions made from the account.
const displayTotal = function (account) {
  // Calculate sum depisites.
  const totalIn = account.transactions
    .filter((transaction) => transaction > 0)
    .reduce((acc, transaction) => acc + transaction, 0);
  labelSumIn.textContent = `${totalIn}$`;
  // Calculate sum withdrawal.
  const totalOut = account.transactions
    .filter((transaction) => transaction < 0)
    .reduce((acc, transaction) => acc + transaction, 0);
  labelSumOut.textContent = `${totalOut}$`;
  // Calculate percent from deposites.
  const totalPercent = account.transactions
    .filter((transaction) => transaction > 0)
    .map((transaction) => (transaction * account.interest) / 100)
    .reduce((acc, transaction) => acc + transaction, 0);
  labelSumInterest.textContent = `${totalPercent.toFixed(1)}$`;
};

//A function that adds a property to an object nickName.
const createNickNames = function (accounts) {
  accounts.forEach(function (account) {
    account.nickName = account.userName
      .toLowerCase()
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  });
};
createNickNames(accounts);

// Variable that records the selected object.
let currentAccount;
// A function that shows all data about your account when logging in.
const login = function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (account) => account.nickName === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount && currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Вітаємо Вас, ${
      currentAccount.userName.split(" ")[0]
    }!`;
    containerApp.style.opacity = 100;
    updateUi(currentAccount);
  }
  inputLoginUsername.value = "";
  inputLoginPin.value = "";
};

btnLogin.addEventListener("click", login);

//The function that updates UI.
const updateUi = function (currentAccount) {
  displayTransactions(currentAccount.transactions);
  displayBalance(currentAccount);
  displayTotal(currentAccount);
};

//A function that transfers funds between user accounts.
const transfer = function (e) {
  e.preventDefault();
  const transferAmount = Number(inputTransferAmount.value);
  const transferRecipient = inputTransferTo.value;
  const recipientAccount = accounts.find(
    (account) => account.nickName === transferRecipient
  );

  if (
    transferAmount > 0 &&
    transferAmount < currentAccount.balance &&
    recipientAccount &&
    currentAccount.nickName !== recipientAccount.nickName
  ) {
    recipientAccount.transactions.push(transferAmount);
    currentAccount.transactions.push(transferAmount * -1);
  }
  updateUi(currentAccount);
  inputTransferAmount.value = "";
  inputTransferTo.value = "";
};

btnTransfer.addEventListener("click", transfer);

// A function that deletes the current account.
const closeWallet = function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.nickName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const currentAccountIndex = accounts.findIndex(
      (account) => account.nickName === currentAccount.nickName
    );
    accounts.splice(currentAccountIndex, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Увійдіть до свого кабінету`;
  }
  console.log(accounts);
};

btnClose.addEventListener("click", closeWallet);

// A function that borrows money from the bank.
const takeInLoan = function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  const loanCheck = currentAccount.transactions.some(
    (transaction) => transaction > (loanAmount * 10) / 100
  );
  if (loanCheck) {
    currentAccount.transactions.push(loanAmount);
    updateUi(currentAccount);
  }
  inputLoanAmount.value = "";
};

btnLoan.addEventListener("click", takeInLoan);

// A function that sorting all transactions.

let areTransactionsSorted = false;

const sortTransactions = function (e) {
  e.preventDefault();
  displayTransactions(currentAccount.transactions, !areTransactionsSorted);
  areTransactionsSorted = !areTransactionsSorted;
};

btnSort.addEventListener("click", sortTransactions);

"use strict";

//SECTION ------------------------------------------------------------------------------------------
//ACCOUNT DATA

const account1 = {
  owner: "Ghazi Imran",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
};

const account2 = {
  owner: "John Smith",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2024-08-01T10:51:36.790Z",
  ],
};

const account4 = {
  owner: "Sarah Frank",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
  ],
};

const accounts = [account1, account2, account3, account4];

//SECTION ------------------------------------------------------------------------------------------
//ELEMENTS

//PART - LABEL
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");
const labelTransferMoney = document.querySelector(".operation--transfer h2");

//PART -- CONTAINER
const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

//PART -- BTN
const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");
const btnLogOut = document.querySelector(".logout__btn");

//PART -- INPUT -- LOG IN
const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");

//PART -- INPUT -- LOG OUT
const inputLogOutUsername = document.querySelector(".logout__input--user");
const inputLogOutPin = document.querySelector(".logout__input--pin");

//PART -- INPUT -- AMOUNT/PIN
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputLoanPin = document.querySelector(".form__input--loan-pin");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//PART -- INPUT -- TRANSFER FORM
const transferForm = document.querySelector(".form--transfer");
const pinConfirmationDiv = document.querySelector(
  ".operation--pin-confirmation"
);

//PART -- PIN
const pinInput = document.querySelector(".form__PinConfirmation");
const pinConfirmationButton = document.querySelector(
  ".form__btn--transfer-PinConfirmation"
);

//SECTION ------------------------------------------------------------------------------------------
//TIMEOUT

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //PART -- PRINT REMAINING TIME TO UI
    labelTimer.textContent = `${min}:${sec}`;

    // PART -- LOG OUT USER WHEN TIME RUNS OUT
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }

    //PART -- DECREASE BY 1 SECOND
    time--;
  };
  //PART -- SET TIMER TO 5 MINUTES
  let time = 300;

  //PART -- CALL TIMER EVERY SECOND
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//SECTION ------------------------------------------------------------------------------------------
//MOVEMENTS

//PART -- DATES
const formatMovementsDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();

  if (daysPassed === 0) return `${day}/${month}/${year}` + " - Today";
  if (daysPassed === 1) return `${day}/${month}/${year}` + " - Yesterday";
  if (daysPassed <= 7)
    return `${day}/${month}/${year}` + ` - ${daysPassed} days ago`;
  else {
    return `${day}/${month}/${year}`;
  }
};

//PART -- MOVEMENTS -- DISPLAY

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    //PART -- TRANSACTION DATES

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDate(date);

    //PART -- ADJUST HTML

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">£${mov.toFixed(2)}</div>
    </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

//SECTION ------------------------------------------------------------------------------------------
//CALC DISPLAY

//PART -- DISPLAY -- BALANCE
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `£${acc.balance.toFixed(2)}💷`;
};

//PART -- DISPLAY -- SUMMARY
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = ` £${incomes.toFixed(2)}`;

  const outgoings = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `£${Math.abs(outgoings).toFixed(2)}`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `£${interest.toFixed(2)}`;
};

//PART -- USERNAMES
const createUsernames = function (accounts) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

createUsernames(accounts);

//PART -- UPDATE UI
const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

//SECTION

//SECTION ------------------------------------------------------------------------------------------
//CURRENT ACCOUNT / TIMER

let currentAccount, timer;

//PART -- ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

//PART -- API DATES
const now = new Date();
const options = {
  hour: "numeric",
  minute: "numeric",
  day: "numeric",
  month: "long",
  year: "numeric",
  weekday: "long",
};

labelDate.textContent = new Intl.DateTimeFormat("en-GB", options).format(now);

//PART --LOG IN

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;

    containerApp.style.opacity = 100;

    //PART -- DATES

    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    };

    //DAY//MONTH//YEAR , HOUR:MINUTE
    labelDate.textContent = new Intl.DateTimeFormat("en-GB", options).format(
      now
    );

    //PART -- CLEAR INPUT FIELDS
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    //PART -- TIMER
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    //PART -- UPDATE UI
    updateUI(currentAccount);
  }
});

//SECTION ------------------------------------------------------------------------------------------
//TRANSFER

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    transferForm.style.display = "none";
    pinConfirmationDiv.style.display = "block";
    pinInput.value = "";
    labelTransferMoney.style.display = "none";
    console.log("Transfer initiated. Please confirm with PIN.");
  }
});

//PART -- PIN CONFIRMATION
pinConfirmationButton.addEventListener("click", function (e) {
  e.preventDefault();
  const pinEntered = +pinInput.value;

  const senderAccount = accounts.find(
    (acc) => acc.username === currentAccount.username
  );

  // PART -- CHECK IF PIN IS CORRECT
  if (pinEntered === senderAccount.pin) {
    console.log("PIN confirmed. Transfer processed successfully.");

    const amount = +inputTransferAmount.value;
    const receiverAcc = accounts.find(
      (acc) => acc.username === inputTransferTo.value
    );

    if (
      amount > 0 &&
      receiverAcc &&
      senderAccount.balance >= amount &&
      receiverAcc?.username !== senderAccount.username
    ) {
      //PART -- PREFORM TRANSFER
      senderAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);

      //PART -- ADD TRANSFER DATE
      currentAccount.movementsDates.push(new Date().toISOString());
      receiverAcc.movementsDates.push(new Date().toISOString());

      //PART -- RESET TRANSFER FORM
      transferForm.reset();
      transferForm.style.display = "grid";

      //PART -- HIDE PIN CONFIRMATION FORM
      pinConfirmationDiv.style.display = "none";

      //PART -- DISPLAY 'TRANSFER MONEY' HEADING
      labelTransferMoney.style.display = "block";
    } else {
      alert("Transfer failed. Invalid input or insufficient balance.");
    }
  } else {
    alert("PIN entered is incorrect. Please try again.");
  }
  //PART -- UPDATE UI
  updateUI(currentAccount);

  //PART -- RESET TIMER
  clearInterval(timer);
  timer = startLogOutTimer();
});

//SECTION ------------------------------------------------------------------------------------------
//REQUEST LOAN

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const pinEntered = +inputLoanPin.value;
  if (pinEntered === currentAccount.pin) {
    const amount = Math.floor(inputLoanAmount.value);

    if (
      amount > 0 &&
      currentAccount.movements.some((mov) => mov >= amount * 0.1)
    ) {
      setTimeout(function () {
        //PART -- ADD MOVEMENT
        currentAccount.movements.push(amount);

        //PART -- ADD LOAN DATE
        currentAccount.movementsDates.push(new Date().toISOString());

        //PART -- UPDATE UI
        updateUI(currentAccount);

        //PART -- RESET TIMER
        clearInterval(timer);
        timer = startLogOutTimer();
      }, 2500);
    }
    inputLoanAmount.value = "";
    inputLoanPin.value = "";
  } else {
    alert("PIN entered is INCORRECT. Please try again");
    inputLoanAmount.value = "";
    inputLoanPin.value = "";
  }
});

//SECTION ------------------------------------------------------------------------------------------
//CLOSE ACCOUNT

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  // console.log('Delete');

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);

    //PART -- DELETE ACCOUNT
    accounts.splice(index, 1);

    //PART -- HIDE UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

//SECTION ------------------------------------------------------------------------------------------
//SORT BUTTON

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

//SECTION ------------------------------------------------------------------------------------------
//LOG OUT

//PART -- LOG OUT BUTTON
btnLogOut.addEventListener("click", function (e) {
  e.preventDefault();

  //PART -- CHECK IF USERNAME AND PIN ARE CORRECT
  if (
    inputLogOutUsername.value === currentAccount.username &&
    +inputLogOutPin.value === currentAccount.pin
  ) {
    //PART -- CLEAR CURRENT ACCOUNT
    currentAccount = undefined;

    // PART -- HIDE UI
    containerApp.style.opacity = 0;

    //PART -- SET WELCOME MESSAGE TO "Log in to get started"
    labelWelcome.textContent = "Log in to get started";
    labelWelcome.style.opacity = 1;
  } else {
    alert("Username or PIN entered is incorrect. Please try again.");
  }

  //PART -- CLEAR INPUT FIELDS
  inputLogOutUsername.value = inputLogOutPin.value = "";
});

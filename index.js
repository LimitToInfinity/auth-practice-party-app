const baseURL = 'http://localhost:7000';
const loginURL = `${baseURL}/login`;
const usersURL = `${baseURL}/users`;
const beveragesURL = `${baseURL}/beverages`;

let isLoggedIn = false;

const loginButton = document.querySelector('.login');
const logoutButton = document.querySelector('.logout');
const loginForm = document.querySelector('.login-form');
const getBeverages = document.querySelector('.get-beverages');

document.addEventListener('DOMContentLoaded', getMeThemBeverages);
logoutButton.addEventListener('click', logout);
loginForm.addEventListener('submit', login);
getBeverages.addEventListener('click', getMeThemBeverages);

function login(event) {
  event.preventDefault();

  const loginFormData = new FormData(event.target);
  const username = loginFormData.get('username');
  const password = loginFormData.get('password');

  const userData = { username, password };

  fetch(loginURL, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  })
    .then(handleResponse)
    .then(result => {
      console.log(result);
      localStorage.setItem('token', result.token)
      isLoggedIn = true;
      handleIsLoggedIn();
    })
    .catch(error => {
      console.error(error)
      logout();
    });
}

function logout(event) {
  localStorage.clear();
  isLoggedIn = false;
  handleIsLoggedIn();
}

function getMeThemBeverages(event) {
  fetch(beveragesURL, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    }
  })
    .then(handleResponse)
    .then(beverages => {
      console.log(beverages);
      isLoggedIn = true;
      handleIsLoggedIn();
    });
}

function handleIsLoggedIn() {
  if (isLoggedIn) {
    handleLogin();
  } else {
    handleLogout();
  }
}

function handleLogin() {
  loginButton.classList.add('hidden');
  logoutButton.classList.remove('hidden');
}

function handleLogout() {
  loginButton.classList.remove('hidden');
  logoutButton.classList.add('hidden');
}

function handleResponse(response) {
  if (response.status.toString()[0] === "2") { 
    return response.json();
  } else {
    throw new Error("you done flubbed");
  }
}

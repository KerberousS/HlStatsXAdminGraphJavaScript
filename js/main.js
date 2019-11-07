//Requires
const $ = require('jquery');

//Elements
var loginButton = document.getElementById('loginButton');
var usernameInput = document.getElementById('inputUsername');
var passwordInput = document.getElementById('inputPassword');

animateLogin();

//Listeners
loginButton.addEventListener("click", (event) => {
  event.preventDefault();
  postLogin();
});


//Post functions
async function postLogin() {
  const username = usernameInput.value;
  const password = passwordInput.value;

  const data = { username, password };
  
  function saveCredentialCookies() {
    const cookieLogin = "username=" + username;
    const cookiePassword = "password=" + password;

    document.cookie = cookieLogin;
    document.cookie = cookiePassword;
  }

  saveCredentialCookies();
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  await fetch('/login', options).then(response => response.json())
  .then(json => {
    console.log(json);
    if (json.status=='failure') {
      showErrorMessage(json.message);
    } else if (json.status=='success') {
      hideLogin();
      setTimeout(function(){
        self.location = '/chart.html';
    }, 1000);
    } else {
      showErrorMessage('Unknown error');
    }
  });
}

//Animation functions
function animateLogin() {
  $(".form-signin").fadeIn();
  $(".form-control").fadeIn();
}

//Animation functions
function hideLogin() {
  $(".form-signin").fadeOut();
  $(".form-control").fadeOut();
}

function showErrorMessage(text) {
  $(".ds-alert").text(text);
  $(".ds-alert").animate({
    opacity: 1
  }, 1000);

  setTimeout(function(){
    $(".ds-alert").animate({
      opacity: 0
    }, 1000);
}, 8000);

  setTimeout(function(){
    $(".ds-alert").text("");
}, 9000);
}
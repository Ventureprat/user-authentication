const submit = document.querySelector(".form-btn-submit");

submit.addEventListener("click", submitOnclick);

function submitOnclick(e) {
  e.preventDefault();
  const emailText = document.querySelector("#form-emailID").value;
  const passwordText = document.querySelector("#form-password").value;

  if (emailText !== "" && passwordText !== "") {
    postData(emailText, passwordText);
  } else {
    alert("Check if all the fields are filled");
  }
}

async function postData(email, password) {
  const userData = { email, password };

  try {
    await axios
      .post("http://localhost:3000/auth/login", userData)
      .then(function (response) {
        if (response.status === 200) {
          alert("Login Successful");
          window.location.replace("http://localhost:3000/dashboard");
        } else {
          alert("Try Again...");
        }
      });
  } catch (error) {
    if (error.response.status === 404) {
      alert("User Not Found");
      location.reload();
    } else if (error.response.status === 401) {
      alert("Invalid Password");
    }
  }
}

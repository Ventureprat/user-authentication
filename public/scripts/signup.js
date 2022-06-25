const submit = document.querySelector(".form-btn-submit");

submit.addEventListener("click", submitOnclick);

function submitOnclick(e) {
  e.preventDefault();
  const emailText = document.querySelector("#form-emailID").value;
  const passwordText = document.querySelector("#form-password").value;
  const checkBox = document.querySelector(
    'input[name="checkBox"]:checked'
  ).value;

  if (emailText !== "" && passwordText !== "" && checkBox !== "") {
    postData(emailText, passwordText, checkBox);
  } else {
    alert("Check if all the fields are filled");
  }
}

async function postData(email, password, role) {
  const userData = { email, password, role };

  try {
    await axios
      .post("http://localhost:3000/auth/signup", userData)
      .then(function (response) {
        if (response.status === 200) {
          alert("Signup Successful");
          location.reload();
        } else {
          alert("Try Again...");
        }
      });
  } catch (error) {
    if (error.response.status == 403) {
      alert("User already Exists. Go To Login Page.");
      window.location.replace("http://localhost:3000/login");
    }
  }
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "./ServerConnection";

const Register = () => {
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [disabledFlag, setDisabledFlag] = useState(true);
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();

  let passwordMatch = password === confirmPassword ? true : false;

  const handleNameChange = (input) => {
    setName(input.target.value);
  };

  const handleUserNameChange = (input) => {
    setUserName(input.target.value);
  };
  const handleEmailChange = (input) => {
    setEmail(input.target.value);
  };

  const handlePasswordChange = (input) => {
    setPassword(input.target.value);
  };

  const handleConfirmPasswordChange = (input) => {
    setConfirmPassword(input.target.value);
  };

  useEffect(() => {
    passwordMatch = password === confirmPassword ? true : false;

    setDisabledFlag(false);
    if (
      name === "" ||
      username === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      setDisabledFlag(true);
    }
  }, [name, username, email, password, confirmPassword, disabledFlag]);

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    setisLoading(true);
    if (!passwordMatch) {
      alert("Password and current password not matched");
    }
    else{
        registerUser(username, password, email)
        .then((statusCode)=>{
            if(statusCode===200){
              navigate("/login");
            } 
            else{
              alert("error");
            }
        })
    }
  };
  return (
    <>
      <div className="login-page">
        <div className="form">
          <div className="login">
            <div className="login-header">
              <h3>Register</h3>
              <p>Please enter your credentials to register.</p>
            </div>
            <form className="login-form">
              <div>
                <label for="name">
                  <b>Name</b>
                </label>
                <input
                  type="text"
                  placeholder="name"
                  value={name}
                  onChange={handleNameChange}
                  name="name"
                  required
                />
                <label for="username">
                  <b>UserName</b>
                </label>
                <input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={handleUserNameChange}
                  name="username"
                  required
                />
                <label for="email">
                  <b>EMail</b>
                </label>
                <input
                  type="text"
                  placeholder="email"
                  value={email}
                  onChange={handleEmailChange}
                  name="email"
                  required
                />
                <label for="password">
                  <b>Password</b>
                </label>
                <input
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={handlePasswordChange}
                  name="password"
                  required
                />
                <label for="confirmpassword">
                  <b>Confirm Password</b>
                </label>
                <input
                  type="password"
                  placeholder="confirm password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  name="confirmpassword"
                  required
                />
                <button
                  className="signup-btn"
                  disabled={disabledFlag}
                  onClick={handleRegisterSubmit}
                >
                  {isLoading ? "Loading": "Sign Up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export { Register };
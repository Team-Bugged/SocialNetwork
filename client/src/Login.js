import { useState, useEffect } from "react";
import { loginUser } from "./ServerConnection";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const Login = () => {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [disabledFlag, setDisabledFlag] = useState(true);
  const cookies = new Cookies();

  const navigate = useNavigate();

  const handleusernameChange = (input) => {
    setusername(input.target.value);
  };

  const handlePasswordChange = (input) => {
    setPassword(input.target.value);
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    loginUser(username, password).then((response) => {
      if (response.status === 200) {
        cookies.set("token", response.data.token, { maxAge: 3600 });
      }
      navigate("/home");
    });
  };

  useEffect(() => {
    setDisabledFlag(false);
    if (username === "" || password === "") {
      setDisabledFlag(true);
    }
  }, [username, password]);

  return (
    <>
      <div className="login-header">
        <h3>Sign In</h3>
        <p>Please enter your credentials to signin.</p>
      </div>
      <form className="login-form">
        <div>
          <label for="username">
            <b>username</b>
          </label>
          <br />
          <input
            type="text"
            placeholder="username"
            name="username"
            onChange={handleusernameChange}
            required
          />
          <br />
          <label for="password">
            <b>Password</b>
          </label>
          <br />
          <input
            type="password"
            placeholder="password"
            name="password"
            onChange={handlePasswordChange}
            required
          />
          <br />
          <button
            className="signin-btn"
            disabled={disabledFlag}
            onClick={handleLoginSubmit}
          >
            Login
          </button>
        </div>
      </form>
    </>
  );
};

export { Login };

import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";

function Login() {
  const [details, setDetails] = useState({});
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(details);
    axios
      .post("/users/login/", {
        email: details.email,
        password: details.password,
      })
      .then((resp) => {
        const data = resp.data;
        console.log(data);
        if (data.status == 1) {
          if (details.save_password) {
            localStorage.setItem("user", JSON.stringify(data.user));
          }
          window.location = "/";
          navigate("/");
        } else {
          alert(data.msg);
        }
      });
  };

  return (
    <div className="container bg-dark mb-4 mt-4">
      <div className="row">
        <div
          className="col-sm-10 col-md-10 col-lg-5 mx-auto"
          style={{ borderRadius: "15px" }}
        >
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
              <h5 className="card-title text-center mb-5 fw-light fs-5">
                Sign In
              </h5>
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    placeholder="name@example.com"
                    onChange={(data) =>
                      setDetails({ ...details, email: data.target.value })
                    }
                  ></input>
                  <label for="floatingInput">Email address</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    onChange={(data) =>
                      setDetails({ ...details, password: data.target.value })
                    }
                  ></input>
                  <label for="floatingPassword">Password</label>
                </div>

                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="rememberPasswordCheck"
                    onChange={(data) =>
                      setDetails({
                        ...details,
                        save_password: data.target.checked,
                      })
                    }
                  ></input>
                  <label
                    className="form-check-label"
                    for="rememberPasswordCheck"
                  >
                    Remember password
                  </label>
                </div>
                <div className="d-grid">
                  <button
                    className="btn btn-primary btn-login text-uppercase fw-bold"
                    type="submit"
                  >
                    Sign in
                  </button>
                </div>
                <hr className="my-4"></hr>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

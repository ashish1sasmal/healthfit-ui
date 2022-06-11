import axios from "axios";
import React, { useState } from "react";
import "../css/signup.css";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [details, setDetails] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      details.password1 &&
      details.password2 &&
      details.password1 !== details.password2
    ) {
      alert("Password mismatched!");
      return false;
    } else {
      const data = {
        full_name: details.full_name,
        email: details.email,
        password: details.password1,
      };
      axios.post("/users/signup/", data).then((resp) => {
        const data = resp.data;
        if (data.status === 1) {
          navigate("/users/login");
        }
        else {
          navigate("/error", {state: {"message" : data.msg}})
        }
      });
    }
  };

  return (
    <div className="container bg-dark mb-4 mt-4">
      <div className="row">
        <div className="col-lg-8 col-xl-8 mx-auto">
          <div className="card flex-row my-5 border-0 shadow rounded-3 overflow-hidden">
            <div className="card-img-left d-none d-md-flex"></div>
            <div className="card-body p-4 p-sm-5">
              <h5 className="card-title text-center mb-5 fw-light fs-5">
                Register
              </h5>
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInputUsername"
                    placeholder="myusername"
                    required
                    autofocus
                    onChange={(data) =>
                      setDetails({ ...details, full_name: data.target.value })
                    }
                  ></input>
                  <label for="floatingInputUsername">Full Name</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingInputEmail"
                    placeholder="name@example.com"
                    onChange={(data) =>
                      setDetails({ ...details, email: data.target.value })
                    }
                  ></input>
                  <label for="floatingInputEmail">Email address</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    onChange={(data) =>
                      setDetails({ ...details, password1: data.target.value })
                    }
                  ></input>
                  <label for="floatingPassword">Password</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPasswordConfirm"
                    placeholder="Confirm Password"
                    onChange={(data) =>
                      setDetails({ ...details, password2: data.target.value })
                    }
                  ></input>
                  <label for="floatingPasswordConfirm">Confirm Password</label>
                </div>

                <div className="d-grid mb-2">
                  <button
                    className="btn btn-lg btn-primary btn-login fw-bold text-uppercase"
                    type="submit"
                  >
                    Register
                  </button>
                </div>

                <a className="d-block text-center mt-2 small" href="#">
                  Have an account? Sign In
                </a>

                <hr className="my-4"></hr>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;

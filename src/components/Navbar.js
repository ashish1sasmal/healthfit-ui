import React, { Component, useContext, useEffect } from "react";
import { NavDropdown } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context.js";

function Navbar() {
  let { user } = useContext(AppContext);
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    if (!user){
      user = JSON.parse(localStorage.getItem("user"));
    }

  }, []);

  return (
    <nav
      className="shadow navbar navbar-expand-lg"
      style={{ backgroundColor: "#f5f6f7" }}
    >
      <div className="container px-5">
        <NavLink
          className="navbar-brand"
          to=""
          style={{ fontSize: "30px", color: "#3cba6e" }}
        >
          <b>
            <i class="fa-solid fa-heart-pulse"></i> Health.Fit
          </b>
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"><i class="fa-solid fa-bars"></i></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#!">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#!">
                About
              </a>
            </li>
            {user && user.type !== 'doctor' && 
            <li className="nav-item">
            <NavLink className="nav-link" to={"/doctors"}>
              Doctors
            </NavLink>
          </li>
            }
            {!user && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to={"/users/login"}>
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to={"/users/signup"}>
                    Signup
                  </NavLink>
                </li>
              </>
            )}
            {user && user.type === 'doctor' && 
            <>
              <li className="nav-item">
            <NavLink className="nav-link" to={"/doctor/dashboard"}>
              Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
          <NavLink className="nav-link" to={"/doctors/" + user._id}>
              Profile
            </NavLink>
            </li>
            </>
            
            }
            {user && (
              <li className="nav-item">
                <a className="nav-link" role={"button"} onClick={logout}>
                  Logout
                </a>
              </li>
            )}
            
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

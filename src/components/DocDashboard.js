import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context";
import request from "../utils/makeRequest";

function DocDashboard() {
  let { user } = useContext(AppContext);
  const [consult, setConsult] = useState([]);
  const [details, setDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      user = JSON.parse(localStorage.getItem("user"));
    }
    request.get("/doctor/dashboard/" + user._id).then((response) => {
      if (response.data.status === 1) {
        console.log(response.data);
        setConsult(response.data.consult);
        setDetails(response.data);
      } else if (response.data.status === 403) {
        navigate("/error", { state: { msg: response.data.msg } });
      }
    });
  }, []);

  return (
    <div className="container px-2 px-lg-5 border mt-4 mb-4 bg-light rounded-3 shadow pt-3">
      <div className="card my-3 py-4 bg-secondary text-light text-center mb-4 shadow">
        <h5>
          This dashboard will help you to manage video consultations and view
          ratings and reviews given by users.
        </h5>
      </div>
      <div className="row shadow mb-5 p-3 rounded-3 border">
        <div className="col-md-4">
          <div
            class="card text-white bg-primary mb-3"
            style={{ minHeight: "175px" }}
          >
            <div class="card-header">Overall Rating</div>
            <div class="card-body">
              <h1 class="card-title fw-bolder">{details.overall_rating} / 10</h1>
              <h5>Rating given by : {details.all_ratings} Users</h5>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            class="card text-white bg-success mb-3"
            style={{ minHeight: "175px" }}
          >
            <div class="card-header">Total Consultations</div>
            <div class="card-body">
              <h1 class="card-title fw-bolder">{details.all_consult}</h1>
              <h5>Active Since : 25 Jan 2021</h5>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            class="card text-white bg-warning mb-3"
            style={{ minHeight: "175px" }}
          >
            <div class="card-header">Positive Reviews</div>
            <div class="card-body">
              <h1 class="card-title fw-bolder">{details.positive_reviews_perc}%</h1>
              <h5>Positive reviews given by : {details.positive_reviews} Users</h5>
            </div>
          </div>
        </div>
      </div>
      <div className="row pt-3 border shadow">
        <div className="col-md-12" style={{ minHeight: "80vh" }}>
          <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link active"
                id="pills-home-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-home"
                type="button"
                role="tab"
                aria-controls="pills-home"
                aria-selected="true"
              >
                Appointments
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="pills-profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-profile"
                type="button"
                role="tab"
                aria-controls="pills-profile"
                aria-selected="false"
              >
                All
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="pills-contact-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-contact"
                type="button"
                role="tab"
                aria-controls="pills-contact"
                aria-selected="false"
              >
                Reviews
              </button>
            </li>
          </ul>
          <div class="tab-content" id="pills-tabContent">
            <div
              class="tab-pane fade show active"
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
            >
              <div class="card" style={{ minHeight: "70vh" }}>
                <div class="card-header">Current Appointments</div>
                <div class="card-body">
                  <div className="row">
                    {(consult !== []) ? (
                      consult.map((item, idx) => {
                        return item.current ? (
                          <div className="col-md-4">
                            <p>9:00 AM - 9:30 AM</p>
                            <div class="card border-success mb-3">
                              <div class="card-header row">
                                <p className="col-md-6">
                                  <b>Current</b>
                                </p>
                                <a
                                  className="col-md-4 btn btn-sm btn-success text-light"
                                  style={{ width: "60px" }}
                                  role="button"
                                  href={"/consult/video/" + item._id}
                                  target="_b"
                                >
                                  Join
                                </a>
                              </div>
                              <div class="card-body">
                                <p class="card-text mb-1">
                                  Patient Name : {item.p_name}
                                </p>
                                <p class="card-text mb-1">
                                  Symptoms : {item.symptoms}
                                </p>
                                <p class="card-text mb-1">
                                  Mobile Number : +91 {item.p_mobile}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="col-md-4">
                            <p>9:30 AM - 10:00 AM</p>
                            <div class="card border-primary mb-3">
                              <div class="card-header row">
                                <p className="col-md-6">
                                  <b>Upcoming</b>
                                </p>
                              </div>
                              <div class="card-body">
                                <p class="card-text mb-1">
                                  Patient Name : {item.p_name}
                                </p>
                                <p class="card-text mb-1">
                                  Symptoms : {item.symptoms}
                                </p>
                                <p class="card-text mb-1">
                                  Mobile Number : +91 {item.p_mobile}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })) : (
                        <img src="https://e7.pngegg.com/pngimages/435/63/png-clipart-doctor-illustration-%E8%AA%BF%E5%89%A4-pharmacist-physician-pharmacy-medical-prescription-pharmacist-face-text.png"></img>
                      )}
                  </div>
                </div>
              </div>
            </div>
            <div
              class="tab-pane fade"
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
            >
              <hr></hr>
              <h2 class="mb-3 text-center">All Past Appointments</h2>
              <table id="dtBasicExample" class="table" width="100%">
                <thead>
                  <tr>
                    <th class="th-sm">Appointment Id</th>
                    <th class="th-sm">Patient Name</th>
                    <th class="th-sm">Symptoms</th>
                    <th class="th-sm">Date/ Time</th>
                    <th class="th-sm">Mobile</th>
                    <th class="th-sm">Call Duration</th>
                    <th class="th-sm">User Id</th>
                  </tr>
                </thead>
                <tbody>
                  { details.consults && details.consults.map((item) => {
                    return <tr>
                    <td>
                      <NavLink to="/asdasd21">{item._id}</NavLink>
                    </td>
                    <td>{item.p_name}</td>
                    <td>{item.symptoms}</td>
                    <td>{item.start_time}</td>
                    <td>+91 9123456789</td>
                    <td>18 min</td>
                    <td>{item.user}</td>
                  </tr>
                  }) }
                  
                </tbody>
              </table>
            </div>
            <div
              class="tab-pane fade"
              id="pills-contact"
              role="tabpanel"
              aria-labelledby="pills-contact-tab"
            >
              <hr></hr>
              <table id="dtBasicExample" class="table" width="100%">
                <thead>
                  <tr>
                    <th class="th-sm">Appointment Id</th>
                    <th class="th-sm">User</th>
                    <th class="th-sm" style={{"maxWidth" : "150px"}}>Comment</th>
                    <th class="th-sm">Date/ Time</th>
                    <th class="th-sm">Ratings</th>
                  </tr>
                </thead>
                <tbody>
                  {details.ratings && details.ratings.map((item) => {
                    return <tr>
                    <td>
                      <NavLink to="/asdasd21">{item._id}</NavLink>
                    </td>
                    <td>{item.user_name}</td>
                    <td style={{"maxWidth" : "650px"}}>
                      {item.review}
                    </td>
                    <td>12 June 2022</td>
                    <td>{item.rating}/10</td>
                  </tr>;
                  })}
                  
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocDashboard;

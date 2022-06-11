import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context";

function Home4() {

  let { user } = useContext(AppContext);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [allConsult, setAllConsult] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
      if (!user){
        user = JSON.parse(localStorage.getItem("user"));
      }
      if (user) {
        axios.get("/consult/get/all?user_id="+user._id)
        .then((response) => {
            if (response.data.status === 1){
                setAllConsult(response.data.data)
                console.log(response.data.data)
            }
            else {
              navigate("/error", {state: {"message" : response.data.msg}})
            }
      })
      }
      
  }, []);

  return (
    <div>
      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        data-keyboard="false"
      >
          <Modal.Header closeButton>
            <Modal.Title>All Consultations</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <table id="dtBasicExample" class="table" width="100%">
                <thead>
                  <tr>
                    <th class="th-sm">Id</th>
                    <th class="th-sm">Doctor</th>
                    <th class="th-sm">Patient Name</th>
                    <th class="th-sm">Symptoms</th>
                    <th class="th-sm">Date/ Time</th>
                    <th class="th-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allConsult &&
                    allConsult.map((item, idx) => {
                      return (<tr>
                        <td>
                          <NavLink to="/asdasd21">{item._id}</NavLink>
                        </td>
                        <td>{item.doctor.name}</td>
                        <td>{item.p_name}</td>
                        <td>{item.symptoms}</td>
                        <td>{item.created_at}</td>
                        <td>{item.completed ? <p>Finished</p> : <p ><b><a style={{"color" : "#02d91f"}} target="_blank" href={"/consult/video/"+item._id}>Live Now</a></b></p> }</td>
                      </tr>)
                    })
                  }
                  
                </tbody>
              </table>
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
      </Modal>
      <div className="container px-2 px-lg-5">
        <div className="row gx-4 gx-lg-5 align-items-center my-3 border p-4 shadow bg-dark text-light rounded-3">
          <div className="col-lg-6">
            <img
              className="img-fluid rounded mb-4 mb-lg-0 border"
              src="https://images.news18.com/ibnlive/uploads/2021/06/1625075977_doctors-day-history-new.jpg?im=Resize,width=360,aspect=fit,type=normal?im=Resize,width=280,aspect=fit,type=normal"
              alt="..."
              width={540}
               style={{"float" : "right"}}
            />
          </div>
          <div className="col-lg-6">
            <h1 className="font-weight-bold">
              Health.Fit{" "}
              <i
                class="fa-solid fa-heart-pulse"
                style={{ color: "#3cba6e" }}
              ></i>
            </h1>
            <h5>
              Get the best healthcare experience, without having to leave home.{" "}
              <br></br>
            </h5>
            <ul>
              <li>• No extra charges</li>
              <li>• Find nearby doctors</li>
              <li>• Get Consultation Anywhere</li>
            </ul>
            <a className="btn btn-primary" href="/users/signup">
              Start Here
            </a>
          </div>
        </div>
        <div className="card my-3 border border-primary py-4 text-center">
          <div className="card-body row p-1">
            <div className="col-md-4">
              <h4 style={{ color: "#0f27a3" }}>
                <b className="shadow">Better Outcomes.</b>
              </h4>
            </div>
            <div className="col-md-4">
              <h4 style={{ color: "#0f27a3" }}>
                <b className="shadow">Better Care.</b>
              </h4>
            </div>
            <div className="col-md-4">
              <h4 style={{ color: "#0f27a3" }}>
                <b className="shadow">A Healthier You.</b>
              </h4>
            </div>
          </div>
        </div>
        <div className="row gx-4 gx-lg-5 border p-3 bg-light">
          <div className="col-md-4 mb-5">
            <div className="card h-100 shadow">
              <div className="card-body">
                <h4 className="card-title fw-bold">Get Instant Consultation</h4>
                <p className="card-text">
                  Connect with expert doctors and get consultation from ease of
                  home.
                </p>
              </div>
              <div className="card-footer">
                <NavLink
                  role="button"
                  className="btn btn-primary btn-sm"
                  to="consult"
                >
                  More Info
                </NavLink>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-5">
            <div className="card h-100 shadow">
              <div className="card-body">
                <h4 className="card-title fw-bold">Find Nearby Doctors</h4>
                <p className="card-text">
                  Search for nearby doctors and check for their availability.
                </p>
              </div>
              <div className="card-footer">
                <NavLink className="btn btn-primary btn-sm" to="doctors">
                  More Info
                </NavLink>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-5">
            <div className="card h-100 shadow">
              <div className="card-body">
                <h4 className="card-title fw-bold">Past Consultations</h4>
                <p className="card-text">
                  List of all yours past online consultations.
                </p>
              </div>
              <div className="card-footer">
                <a className="btn btn-primary btn-sm text-light" role="button" onClick={handleShow}>
                  More Info
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home4;

import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context";
import DoctorsCard from "./DoctorsCard";

function DoctorProfile() {
  const params = useParams();
  const navigate = useNavigate();
  let  {user} = useContext(AppContext);
  // console.log(params.docId)
  const [docDetail, setDocDetail] = useState(null);

  useEffect(() => {
    console.log(params.docId);
    console.log("/doctor/" + params.docId);
    console.log(!user, user)
    if (!user){
      console.log(JSON.parse(localStorage.getItem("user")), "after")
      user = JSON.parse(localStorage.getItem("user"));
    }
    if (!user) {
        window.location ='users/login'
    }
    axios
      .get("/doctor/" + params.docId+"/")
      .then((response) => {
        const resp = response.data;
        console.log(resp);
        if (resp.status === -1){
            navigate("/error", {state: {"msg" : resp.msg}})
        }
        else{
          setDocDetail(resp.data);
          console.log(docDetail ,user)
        }
        
        // docDetail.services.forEach(element => {console.log(element)})
      });
  }, []);

  const updateStatus = (online, active) => {
      axios.post("/doctor/update/"+docDetail._id+"/", {active, online});
      setDocDetail({...docDetail, online, active})
  }

  return (
    docDetail && (
      <div
        className="container"
        style={{
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "15px",
          marginBottom: "10px",
          width: "75%",
        }}
      >
        <div id="content" className="content p-0">

        {user && docDetail.user === user._id && 
          <div className="ms-5 row">
          <div className="col-md-3">
            <label class="switch">
                <input type="checkbox" checked={docDetail.online} onClick={() => updateStatus(!docDetail.online, docDetail.active)} ></input>
                <span class="slider"></span>
            </label> Online
          </div>

          <div className="col-md-3">
            <label class="switch">
                <input type="checkbox" checked={docDetail.active} onClick={() => updateStatus(docDetail.online, !docDetail.active)}></input>
                <span class="slider"></span>
            </label> Active for Consultations
          </div>
          </div>}
       


          <DoctorsCard item={docDetail} />
          <div className="container-fluid mt-4 mb-4">
            <div
              className="counter"
              style={{
                border: "2px solid #0217a1",
                borderRadius: "15px",
                paddingTop: "15px",
              }}
            >
              <div className="row">
              <div className="col-6 col-lg-3">
                  <div className="count-data text-center">
                    <h1 className="count h2" data-to="850" data-speed="850">
                      9+ Yrs
                    </h1>
                    <p className="m-0px font-w-600">Experience</p>
                  </div>
                </div>
                <div className="col-6 col-lg-3">
                  <div className="count-data text-center">
                    <h1 className="count h2" data-to="500" data-speed="500">
                      500
                    </h1>
                    <p className="m-0px font-w-600">Happy Patients</p>
                  </div>
                </div>
                <div className="col-6 col-lg-3">
                  <div className="count-data text-center">
                    <h1 className="count h2" data-to="150" data-speed="150">
                      150
                    </h1>
                    <p className="m-0px font-w-600">Consultations</p>
                  </div>
                </div>
                
                <div className="col-6 col-lg-3">
                  <div className="count-data text-center">
                    <h1 className="count h2" data-to="190" data-speed="190">
                      95%
                    </h1>
                    <p className="m-0px font-w-600">Recommended By</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container-fluid mt-3">
            <div
              style={{
                padding: "10px",
                border: "1px solid #dcdedc",
                borderRadius: "15px",
              }}
            >
              <ul
                className="nav nav-pills mb-3 ps-3"
                id="pills-tab"
                role="tablist"
              >
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active btn-sm"
                    id="pills-home-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-home"
                    type="button"
                    role="tab"
                    aria-controls="pills-home"
                    aria-selected="true"
                  >
                    Clinic Details
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link btn-sm"
                    id="pills-services-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-services"
                    type="button"
                    role="tab"
                    aria-controls="pills-services"
                    aria-selected="false"
                  >
                    Services
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link btn-sm"
                    id="pills-contact-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-contact"
                    type="button"
                    role="tab"
                    aria-controls="pills-contact"
                    aria-selected="false"
                  >
                    Contact
                  </button>
                </li>
              </ul>
              <hr></hr>
              <div className="tab-content" id="pills-tabContent">
                <div
                  className="tab-pane ps-5 fade show active ps-5"
                  id="pills-home"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab"
                >
                  <div className="row">
                    <div className="col-md-4">
                      <p>Clinic Details</p>
                      <h3>{docDetail.clinic_details.name}</h3>
                      <p>
                        {docDetail.clinic_details.address_line_1},{" "}
                        {docDetail.clinic_details.city},{" "}
                        {docDetail.clinic_details.state}
                      </p>
                    </div>
                    <div className="col-md-4" style={{ paddingLeft: "7.5rem" }}>
                      <p>Clinic Timings</p>
                      <h5>Mon - Sat</h5>
                      <h5 style={{ marginBottom: "0", color: "#616361" }}>
                        9:00 AM - 2:00 PM
                      </h5>
                      <h5 style={{ marginBottom: "0", color: "#616361" }}>
                        9:00 PM - 11:00 PM
                      </h5>
                    </div>
                    <div className="col-md-4"></div>
                  </div>
                </div>
                <div
                  className="tab-pane ps-4 fade"
                  id="pills-services"
                  role="tabpanel"
                  aria-labelledby="pills-services-tab"
                >
                  <div className="row ps-4">
                    {docDetail.services && 
                    docDetail.services.map((item, idx) => {
                      return <div className="col-md-4">• {item}</div>
                    })
                    }
                    
                    
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-contact"
                  role="tabpanel"
                  aria-labelledby="pills-contact-tab"
                >
                  ...
                </div>
              </div>
            </div>
          </div>

          <div className="profile-container">
            <div className="row row-space-20">
              <div className="col-md-8">
                <div className="tab-content p-0">
                  <div className="tab-pane active show" id="profile-about">
                    <hr></hr>
                    <table className="table table-profile">
                      <thead>
                        <tr>
                          <th colspan="2">WORK AND EDUCATION</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="field">Experience</td>
                          <td className="value">
                            {docDetail.work_experience && 
                            docDetail.work_experience.map((item, idx) => {
                                return (<div className="m-b-5">
                                <b>{item}</b>{" "}
                                <a href="#" className="m-l-10">
                                  Edit
                                </a>
                                <br />
                                <span className="text-muted">PHP Programmer</span>
                              </div>)
                            })
                            }
                          </td>
                        </tr>
                        <tr>
                          <td className="field">Education</td>
                          <td className="value">
                          {docDetail.education && 
                            docDetail.education.map((item, idx) => {
                                return (<div className="m-b-5">
                                <b>{item}</b>{" "}
                                <a href="#" className="m-l-10">
                                  Edit
                                </a>
                                <br />
                                <span className="text-muted">PHP Programmer</span>
                              </div>)
                            })
                            }
                          </td>
                        </tr>
                        <tr>
                          <td className="field">Awards & Recognition</td>
                          <td className="value">
                          {docDetail.awards_recognitions && 
                            docDetail.awards_recognitions.map((item, idx) => {
                                return (<div className="m-b-5">
                                <b>{item}</b>{" "}
                                <a href="#" className="m-l-10">
                                  Edit
                                </a>
                                <br />
                              </div>)
                            })
                            }
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table className="table table-profile">
                      <thead>
                        <tr>
                          <th colspan="2">CONTACT INFORMATION</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="field">Mobile Phones</td>
                          <td className="value">
                            +44 7700 900860
                            <a href="#" className="m-l-10">
                              Edit
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td className="field">Email</td>
                          <td className="value">
                            admin@infinite.com
                            <a href="#" className="m-l-10">
                              Edit
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td className="field">Facebook</td>
                          <td className="value">
                            http://facebook.com/infinite.admin
                            <a href="#" className="m-l-10">
                              Edit
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td className="field">Website</td>
                          <td className="value">
                            http://seantheme.com
                            <a href="#" className="m-l-10">
                              Edit
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td className="field">Address</td>
                          <td className="value">
                            Twitter, Inc.{" "}
                            <a href="#" className="m-l-10">
                              Edit
                            </a>
                            <br />
                            1355 Market Street, Suite 900
                            <br />
                            San Francisco, CA 94103
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table className="table table-profile">
                      <thead>
                        <tr>
                          <th colspan="2">BASIC INFORMATION</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="field">Birth of Date</td>
                          <td className="value">
                            November 4, 1989
                            <a href="#" className="m-l-10">
                              Edit
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td className="field">Gender</td>
                          <td className="value">
                            Male
                            <a href="#" className="m-l-10">
                              Edit
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td className="field">Facebook</td>
                          <td className="value">
                            http://facebook.com/infinite.admin
                            <a href="#" className="m-l-10">
                              Edit
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td className="field">Website</td>
                          <td className="value">
                            http://seantheme.com
                            <a href="#" className="m-l-10">
                              Edit
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default DoctorProfile;

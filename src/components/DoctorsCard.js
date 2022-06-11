import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";

function DoctorsCard(props) {
  const {
    item: { _id, name, main_specialization, clinic_details, yoe },
    startApmt = null,
  } = props;

  const [show1, setShow1] = useState(false);

  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    document.getElementById("consult-btn").disabled = !startApmt;
  }, []);

  const getReviews = () => {
      axios.get("/doctor/reviews/"+_id+"/")
      .then((response) => {
          const data = response.data;
          if (data.status === 1) {
              setReviews(data.data);
              setShow1(true);
          }
      })
  }

  return (
    <div className="container-fluid">
      <Modal show={show} onHide={handleClose} size = "lg">
        <Modal.Header closeButton>
          <Modal.Title>Location on Google Maps</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3499.729056063562!2d77.10722881540845!3d28.697750482392017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d03e360813367%3A0x9cbff34c9c86e40b!2sJaipur%20Golden%20Hospital!5e0!3m2!1sen!2sin!4v1654959035303!5m2!1sen!2sin" width="770" height="450" style={{"border":"0"}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </Modal.Body>
      </Modal>

      <Modal
        show={show1}
        onHide={() => setShow1(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Patient Stories
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{"backgroundColor" : "#f2f5f2"}}>
        <div class="container">
          <div class="row">
              <div class="col-md-12">
                { reviews.map((item) => {
                    return (<div class="media media-comment p-2" style={{"backgroundColor" : "white"}}>
                    <img class="d-flex rounded-circle m-3" style={{width: "40px"}} src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Image Description"/>
                    <div class="media-body u-shadow-v18">
                      <div >
                        <h5 class="h5 mb-0">{item.user_name}</h5>
                        <span>5 days ago</span>
                      </div>
                
                      <p>{item.review}</p>
                
                      <ul class="list-inline d-sm-flex my-0">
                        <li class="list-inline-item">
                          <a class="u-link-v5" href="#!">
                            <i class="fa fa-thumbs-up"></i>
                            178
                          </a>
                        </li>
                        <li class="list-inline-item">
                          <a class="u-link-v5" href="#!">
                            <i class="fa fa-thumbs-down"></i>
                            34
                          </a>
                        </li>
                      </ul>
                    </div>
                          </div>);
                }) }
                  
              </div>
          </div>
          </div>
        </Modal.Body>
      </Modal>
      <div className="row">
        <div className="col-md-11 mt-3" style={{ margin: "auto" }}>
          <div
            className="card shadow"
          >
            <div className="row" style={{ padding: "5px 20px" }}>
              <div className="col-md-7">
                <div className="doctor-card card-horizontal">
                  <img
                    className="doctor-pic rounded-circle"
                    src="https://cdn4.iconfinder.com/data/icons/professions-1-2/151/3-512.png"
                    alt="Card image cap"
                  ></img>
                  <div className="card-body">
                    <h4 className="card-title">
                      <Link
                        to={{ pathname: `/doctors/${_id}`, state: props.item }}
                        target="_blank"
                      >
                        Dr. {name}
                      </Link>
                    </h4>
                    <p className="med-text">{main_specialization}</p>
                    <p className="med-text">
                      {yoe} years of experience overall
                    </p>
                    <p className="med-text">
                      {clinic_details.city} | {clinic_details.name}
                    </p>
                    <p className="med-text">₹400 Consultation fee at clinic</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 m-2 mt-4">
                <p style={{ textAlign: "center" }}>
                  <i class="fa-solid fa-calendar-days"></i> Available Today
                </p>
                <button
                  id="consult-btn"
                  className="btn btn-primary full-btn"
                  onClick={() => startApmt(_id)}
                >
                  Video Consultation
                </button>

                <button
                  className="btn btn-outline-success full-btn mt-2"
                  onClick={handleShow}
                >
                  Show on map <i class="fa-solid fa-location-dot"></i>
                </button>
              </div>
            </div>

            <div></div>
            <div className="card-footer">
              <button type="button" class="btn  btn-sm btn-success">
                <i class="fa-solid fa-thumbs-up"></i> 100%
              </button>
              {}
              <button type="button" class="btn btn-sm btn-outline-primary ms-1">
                Online
              </button>
              <a style={{ marginLeft: "10px" }} role={'button'}  onClick={getReviews}>
                Patient Stories
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorsCard;

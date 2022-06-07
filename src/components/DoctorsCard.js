import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";

function DoctorsCard(props) {
  const {
    item: { _id, name, main_specialization, clinic_details, yoe },
    startConsult = null,
  } = props;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    document.getElementById("consult-btn").disabled = !startConsult;
  }, []);

  return (
    <div className="container-fluid">
      <Modal show={show} onHide={handleClose} dialogClassName={"modal-80w"}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
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
                        to={{ pathname: `${_id}`, state: props.item }}
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
                  onClick={() => startConsult(_id)}
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
              <a style={{ marginLeft: "10px" }} href="">
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

import axios from "axios";

import React, { Component, useEffect, useRef, useState } from "react";
import DoctorsCard from "./DoctorsCard";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { getAmptDetails, startConsult, updateAmptDetails } from "../utils/consultUtils";
import Select from 'react-select';


function Search() {
  const navigate = useNavigate();
  const { state = null } = useLocation();
  const apmt_id = useRef(state?.apmt_id);
  const apmt_details = useRef(null);
  const [cities, setCities] = useState([]);
  const [specs, setSpecs] = useState([]);
  const [isNear, setIsNear] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [docDetails, setDocDetails] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [dropValues,setDropValues] = useState([]);
  const doc_id = useRef(null);
  const [filters, setFilters] = useState({
    available: false,
    city: null,
    spec: null,
    nearBy: false,
    sortBy: null,
  });

  const [currPage, setCurrPage] = useState(1);

  useEffect(() => {
    if (apmt_id.current) {
      getAmptDetails(apmt_id.current)
      .then((resp) => {
          const data = resp.data;
          if (data.status === 1)
              apmt_details.current = data.data;
          else
              navigate("/error", {state: {"message" : "Appointment not found."}})
      })
    }

    axios.get("/doctor/search/").then((response) => {
      const data = response.data;
      setCities(data.cities);
      setSpecs(data.specs);
    });
  }, []);

//   const displayRazorPay = () => {
//     const options = {
//     key: 'rzp_test_eCu1qUcpkGwpvc',
//     currency: 'INR',
//     amount: 50000,
//     name: apmt_details.current.p_name,
//     description: "Wallet Transaction",
//     image: "",
//     order_id: apmt_details.current.razorpay_order_id,
//     handler: async function (resp) {
//         console.log(resp);
//         const data = {
//             orderCreationId: resp._id,
//             razorpayPaymentId: resp.razorpay_payment_id,
//             razorpayOrderId: resp.razorpay_order_id,
//             razorpaySignature: resp.razorpay_signature,
//         };
//         navigate("/consult/video/"+apmt_id.current)
//     },
//     prefill: {
//         name: apmt_details.current.p_name,
//         email: "",
//         contact: apmt_details.current.p_mobile,
//     },
//     };
//   const paymentObject = new window.Razorpay(options);
//   paymentObject.open();
// }

const displayRazorPay = () =>{
  navigate("/consult/video/"+apmt_id.current);
}

function payment() {
    axios.post("/consult/payment/"+apmt_id.current)
    .then((response) => {
        console.log(response.data)
        apmt_details.current = response.data.data;
        displayRazorPay();
    })
}

  function findCurrentLocation() {
    if (navigator.geolocation) {
      console.log("first");
      navigator.geolocation.getCurrentPosition(getLocation);
    }
  }

  function _updateAmptDetails() {
    updateAmptDetails(apmt_id.current, {doc_id: doc_id.current})
    .then((response) => {
        console.log(response.data)
        apmt_details.current = response.data.data
        if (!apmt_details.current.p_name) {
            navigate("/consult", { state : {apmt_id: apmt_id.current} })
        }
        else {
            payment();
        }
    });
  }

  function startApmt(_doc_id) {  
    doc_id.current = _doc_id;
    console.log(apmt_details.current, "apmtdeta")
    if (!apmt_details.current) {
        startConsult().then((resp) => {
          const data = resp.data;
          if (data.status === 1){
            console.log("first90")
            apmt_id.current = data.data._id;
            apmt_details.current = data.data;
            _updateAmptDetails()
          }
          else {
            navigate("/error", {state: {"message" : "Appointment can not start."}})
          }
        });
    }
    else {
      _updateAmptDetails();
    }
  }

  useEffect(() => {
    if (filters.nearBy) {
      findCurrentLocation();
    }
  }, [filters.nearBy]);

  function getLocation(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setCoordinates({
      latitude,
      longitude,
    });
  }

  useEffect(() => {
    let data = filters;
    filters["currPage"] = currPage;
    if (filters.nearBy) {
      data["coordinates"] = coordinates;
    }
    setDocDetails([]);
    axios
      .post("/doctor/search/", data)
      .then((response) => {
        const data = response.data;
        setDocDetails(data);
      });
  }, [currPage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = filters;
    filters["currPage"] = currPage;
    if (filters.nearBy) {
      data["coordinates"] = coordinates;
    }
    setDocDetails([]);
    axios
      .post("/doctor/search/", data)
      .then((response) => {
        const data = response.data;
        setDocDetails(data);
      });
  };

  const aquaticCreatures = [
    { label: 'Shark', value: 'Shark' },
    { label: 'Dolphin', value: 'Dolphin' },
    { label: 'Whale', value: 'Whale' },
    { label: 'Octopus', value: 'Octopus' },
    { label: 'Crab', value: 'Crab' },
    { label: 'Lobster', value: 'Lobster' },
  ];

  const searchByName = (e) => {
    // setDropValues([]);
      axios.get("/doctor/search/get?query="+e.target.value)
      .then((response) => {
          console.log(response.data.data);
          let d = [];
          response.data.data.map((item) => {
              d.push({label: item.name, value: item._id})
          })
          setDropValues(d);
      })
  }

  const fetchDoctorsByName = (e) => {
    setFilters({...filters, doc_name: e.label});
  }
  

  return (
<div class="container">
<h1 class="my-4">
    <small>Search Doctors</small>
</h1>

<div class="row">
    <div class="col-lg-4 mb-4">
    <div class="bg-white p-4 rounded shadow">
        <form action="" id="searchForm" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-12">
            <div class="p-1 bg-light rounded rounded-pill shadow mb-4">
            Search By name
              <Select
                options={dropValues}
                onKeyDown={searchByName}
                onChange={fetchDoctorsByName}
              />
            </div>
              
            </div>

            <div className="col-md-12">
              Search Location
              <div class="p-1 bg-light rounded rounded-pill shadow mb-4">
                <div className="input-group">
                  <select
                    class="form-control border-0 bg-light"
                    data-live-search="true"
                    onChange={(data) =>
                      setFilters({ ...filters, city: data.target.value })
                    }
                    name="city"
                  >
                    <option selected>Search Location</option>
                    {cities.map((e) => {
                      return <option value={e}>{e}</option>;
                    })}
                  </select>

                  <div class="input-group-append">
                    <button
                      id="button-addon1"
                      type="submit"
                      class="btn btn-link text-primary"
                    >
                      <i class="fa fa-search"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12">
              Search Doctor's specialization
              <div class="p-1 bg-light rounded rounded-pill shadow mb-4">
                <div class="input-group">
                  <select
                    class="form-control border-0 bg-light"
                    aria-describedby="button-addon1"
                    data-show-subtext="true"
                    data-live-search="true"
                    onChange={(data) =>
                      setFilters({ ...filters, spec: data.target.value })
                    }
                    name="spec"
                  >
                    <option selected>Search Doctors, Clinics etc.</option>
                    {specs.map((e) => {
                      return <option value={e}>{e}</option>;
                    })}
                  </select>
                  <div class="input-group-append">
                    <button
                      id="button-addon1"
                      type="submit"
                      class="btn btn-link text-success"
                    >
                      <i class="fa fa-search"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 mb-4">
              Priority
              <div>
                <label class="switch">
                  <input
                    type="checkbox"
                    onChange={(data) =>
                      setFilters({
                        ...filters,
                        nearBy: data.target.checked,
                      })
                    }
                  ></input>
                  <span class="slider"></span>
                </label>
                &nbsp; Search Doctors near you
              </div>
              <div>
                <label class="switch">
                  <input
                    type="checkbox"
                    onChange={(data) =>
                      setFilters({
                        ...filters,
                        available: data.target.checked,
                      })
                    }
                  ></input>
                  <span class="slider"></span>
                </label>
                &nbsp; Only Available Doctors
              </div>
            </div>

            <div className="col-md-12">
              Sort By
              <div class="p-1 bg-light rounded rounded-pill shadow mb-4">
                <select
                  class="form-control border-0 bg-light"
                  data-live-search="true"
                  onChange={(data) =>
                    setFilters({ ...filters, sortBy: data.target.value })
                  }
                >
                  <option value="nearest">Nearest Doctor</option>
                  <option value="ratings">Best Ratings</option>
                  <option value="fees">Fees</option>
                </select>
              </div>
            </div>

            <div className="col-md-12 mt-4">
              <button class="btn btn-primary" style={{ width: "60%" }}>
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
      <nav className="mt-4" aria-label="Page navigation example">
        <ul class="pagination">
          {currPage == 1 ? (
            <li class="page-item">
              <button
                class="page-link"
                disabled
                href="#"
                onClick={() => setCurrPage(currPage - 1)}
              >
                Previous
              </button>
            </li>
          ) : (
            <li class="page-item">
              <a
                class="page-link"
                href="#"
                onClick={() => setCurrPage(currPage - 1)}
              >
                Previous
              </a>
            </li>
          )}
          {currPage > 1 ? (
            <li class="page-item">
              <a class="page-link" href="#">
                {currPage - 1}
              </a>
            </li>
          ) : (
            ""
          )}
          <li class="page-item active">
            <a class="page-link" href="#">
              {currPage}
            </a>
          </li>
          <li class="page-item">
            <a
              class="page-link"
              href="#"
              onClick={() => setCurrPage(currPage + 1)}
            >
              {currPage + 1}
            </a>
          </li>
          <li class="page-item">
            <button
              class="page-link"
              href="#"
              onClick={() => setCurrPage(currPage + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
    <div class="col-lg-8 mb-4">
    {docDetails !== [] && (
            <>
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "15px",
                  paddingBottom: "20px",
                  marginBottom: "20px",
                  overflowY: "scroll",
                  height: "100vh",
                }}
                className="shadow"
              >
                {docDetails &&
                  docDetails.map((item) => {
                    return (
                      <DoctorsCard
                        item={item}
                        key={item.id}
                        startApmt={startApmt}
                      />
                    );
                  })}
              </div>
            </>
          )}
    </div>
    
</div>

</div>
  );
}

export default Search;

import axios from "axios";

import React, { Component, useEffect, useState } from "react";
import DoctorsCard from "./DoctorsCard";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

function Search() {
  const navigate = useNavigate();
  const { state = null } = useLocation();
  const [apmtDetails, setApmtDetails] = useState(state || null);
  const [cities, setCities] = useState([]);
  const [specs, setSpecs] = useState([]);
  const [isNear, setIsNear] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [docDetails, setDocDetails] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [filters, setFilters] = useState({
    available: false,
    city: null,
    spec: null,
    nearBy: false,
    sortBy: null,
  });

  const [currPage, setCurrPage] = useState(1);

  useEffect(() => {
    console.log(apmtDetails, "hey");
    if (apmtDetails && apmtDetails.doctor) {
      navigate("/video");
    }
    axios.get("/doctor/search/").then((response) => {
      const data = response.data;
      setCities(data.cities);
      setSpecs(data.specs);
    });
  }, []);

  function findCurrentLocation() {
    if (navigator.geolocation) {
      console.log("first");
      navigator.geolocation.getCurrentPosition(getLocation);
    }
  }

  function startConsult(doc_id) {
    setSelectedDoc(doc_id);
    console.log(apmtDetails, "hi");
    if (apmtDetails) {
      axios
        .post("/doctor/add/", {
          apmt_id: apmtDetails._id,
          doc_id,
        })
        .then((response) => {
          const data = response.data;
          if (data.status === 1){
            navigate("/consult/video/" + apmtDetails._id);
          }
          else{
            alert(data.msg)
          }
          
        });
    } else {
      navigate("/consult", { state: { doc_id } });
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

  return (
<div class="container">
<h1 class="my-4">
    <small>Search Doctors</small>
</h1>

<div class="row">
    <div class="col-lg-4 mb-4">
    <div class="bg-white p-5 rounded shadow">
        <form action="" id="searchForm" onSubmit={handleSubmit}>
          <div className="row">
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
                        startConsult={startConsult}
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

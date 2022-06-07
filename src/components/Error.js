import React from "react";
import { useLocation } from "react-router-dom";

function Error() {
  const { state } = useLocation();
  const { message = "Something went wrong :(" } = state;
  return (
    <div class="jumbotron container mt-5" style={{"minHeight" : "70vh"}}>
      <h1 class="display-4">
        <i class="fa-solid fa-ban" style={{ color: "red" }}></i> {message}
      </h1>
      <hr class="my-4"></hr>
      <p class="lead">
        <a class="btn btn-primary btn-lg" href="/" role="button">
          Go to home
        </a>
      </p>
    </div>
  );
}

export default Error;

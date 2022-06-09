import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context";
import "../css/consultroom.css";
import request from "../utils/makeRequest";

function ConsultRoom() {
  let ICEconfig = {
    iceServers: [
      {
        urls: ["stun:bn-turn1.xirsys.com"],
      },
      {
        username:
          "WtJcHNTgNpN90FSvMVmZtWWVztiHEhbFfsdRyMS1f_PoMfbjWJSW_rVXiivC4VCOAAAAAGGZQvNhc2hpc2hzYXNtYWwx",
        credential: "6e26a8e4-4a32-11ec-8f0c-0242ac140004",
        urls: [
          "turn:bn-turn1.xirsys.com:80?transport=udp",
          "turn:bn-turn1.xirsys.com:3478?transport=udp",
          "turn:bn-turn1.xirsys.com:80?transport=tcp",
          "turn:bn-turn1.xirsys.com:3478?transport=tcp",
          "turns:bn-turn1.xirsys.com:443?transport=tcp",
          "turns:bn-turn1.xirsys.com:5349?transport=tcp",
        ],
      },
    ],
  };
  const params = useParams();
  const navigate = useNavigate();
  let { user } = useContext(AppContext);
  const [chatSocket, setChatSocket] = useState(null);
  const [mediaConstraints, setMediaConstraints] = useState({
    video: true,
    audio: true,
  });
  const [localStream, setLocalStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [iceCandidatesList, setIceCandidatesList] = useState([]);
  const [mute, setMute] = useState(false);
  const videoOn = useRef(true);
  const audioOn = useRef(true);
  const [chats, addChats] = useState([]);
  const [apmtDetails, setApmtDetails] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [roomDetails, setRoomDetails] = useState({});
  const pc = useRef(null);
  // Stopwatch
  const [timer, setTimer] = useState(0);
  useEffect(() => {
    setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 1000);
  }, []);

  useEffect(() => {
    const minutes = `${Math.floor(timer / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(timer / 3600)}`.slice(-2);
    if (Math.floor(timer / 60) === 30 && timer % 60 === 0) {
      alert("This session has completed 30 minutes.");
    }
  }, [timer]);

  const formatTime = () => {
    const getSeconds = `0${timer % 60}`.slice(-2);
    const minutes = `${Math.floor(timer / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(timer / 3600)}`.slice(-2);

    return `${getHours} : ${getMinutes} : ${getSeconds}`;
  };

  const call = async () => {
    console.log("call");
    await createRTCPeerConnection();
    await createAndSendOffer();
  };

  const wrapConsult = () => {
    if (apmtDetails) {
      axios
      .post("/consult/save/" + apmtDetails._id, {
        ...roomDetails,
      })
      .then((response) => {
        if (response.data.status === 1) {
          window.location = "/";
        } else {
          alert("Something went wrong");
        }
      });
    }
  };

  const endCall = (endByUser = true) => {
    if (endByUser) {
      sendSocket({
        type: "end",
        msg: "",
      });
    }
    if (user.type === "doctor") {
      wrapConsult();
    } else {
      setShow(true);
    }
  };

  useEffect(() => {
    if (pc.current) {
      localStream.getTracks().forEach((track) => {
        // connDetails.addTrack(track, localStream);
        // setPeerConnection(connDetails)
        pc.current.addTrack(track, localStream);
      });
    }
  }, [localStream]);

  const createRTCPeerConnection = async (offer = false) => {
    console.log("RTCPeerConnection connected");
    // let connDetails = new RTCPeerConnection(ICEconfig);
    pc.current = new RTCPeerConnection(ICEconfig);
    // setPeerConnection(connDetails)
    console.log("local", localStream);
    if (localStream) {
      console.log("track daal raha hu");
      localStream.getTracks().forEach((track) => {
        // connDetails.addTrack(track, localStream);
        // setPeerConnection(connDetails)
        pc.current.addTrack(track, localStream);
      });
    }

    if (offer == true) {
      console.log("Creating Offer");
      pc.current.onnegotiationneeded = async (event) => createAndSendOffer();
      // setPeerConnection(connDetails)
    }
    pc.current.onicecandidate = (event) => handleICEcandidate(event);
    pc.current.ontrack = (event) => handleAddStream(event);
    // setPeerConnection(connDetails)
    return;
  };

  const createAndSendOffer = async () => {
    console.log("createAndSendOffer");
    // let connDetails = peerConnection;
    pc.current.createOffer(
      (offer) => {
        pc.current.setLocalDescription(new RTCSessionDescription(offer));
        sendSocket({
          type: "offer",
          msg: offer,
        });
        // setPeerConnection(connDetails);
      },
      (error) => {
        console.log("Error");
      }
    );
    // setPeerConnection(connDetails);
  };

  const handleICEcandidate = (event) => {
    if (event.candidate == null) return;
    sendSocket({
      type: "candidate",
      msg: event.candidate,
    });
  };

  const handleAddStream = (event) => {
    console.log("track received");
    let stream = event.streams[0];
    document.getElementById("remote").srcObject = stream;
    // onVideoAdd(user, stream);
  };

  const sendSocket = (data) => {
    if (chatSocket) {
      data.from = user;
      chatSocket.send(JSON.stringify(data));
    } else {
      console.log("Chat socket not connected");
    }
  };

  const accessMedia = () => {
    return navigator.mediaDevices.getUserMedia(mediaConstraints);
  };

  useEffect(() => {
    console.log(params, params.apmtId, "apmt")
    axios
      .get("/consult/get/" + params.apmtId)
      .then((response) => {
        const data = response.data;
        console.log(data, data.status)
        if (data.status === 1) {
          if (data.data.completed) {
            navigate("/error", {state: {"message" : "Consultation session already ended. "}})
          }
          setApmtDetails(data.data);
          console.log(window.location)
          var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
          console.log(ws_scheme + "://localhost:8000/ws/chat/asdasd/");
          setChatSocket(
            new WebSocket(ws_scheme + "://localhost:8000/ws/chat/asdasd/")
          );
          console.log("Websocket connected");
        } else if (data.status === 403) {
          navigate("/error", { state: { message: data.msg } });
        } else {
          navigate("/error", { state: { message: "Appointment Not Found." } });
        }
      });
  }, []);

  const handleIncomingcall = async (offer) => {
    console.log("handleIncomingcall");
    await createRTCPeerConnection();
    await createAndSendAnswer(offer);
  };

  const createAndSendAnswer = async (remoteOffer) => {
    // let connDetails = peerConnection;
    pc.current.setRemoteDescription(new RTCSessionDescription(remoteOffer));
    // setPeerConnection(connDetails);
    pc.current.createAnswer(
      (answer) => {
        pc.current.setLocalDescription(new RTCSessionDescription(answer));
        // setPeerConnection(connDetails);
        sendSocket({
          type: "answer",
          msg: answer,
        });
      },
      (error) => {
        console.log(error);
      }
    );
    // setPeerConnection(connDetails);
  };

  const handleIncomingICEcandidate = (candidate) => {
    console.log(pc.current, candidate)
    if (pc.current && candidate) {
      // let connDetails = peerConnection;
      pc.current.addIceCandidate(new RTCIceCandidate(candidate));
      // setPeerConnection(connDetails);
    } else {
      console.log("RTC peer connection not set");
      let ic = iceCandidatesList;
      ic.push(candidate);
      setIceCandidatesList(ic);
    }
  };

  const muteVideo = () => {
    videoOn.current = !videoOn.current;
    let ls = localStream;
    if (videoOn.current) {
      document.getElementById("videoBtn").className = "btn btn-sm btn-primary mr-3";
      document.getElementById("videoBtn").innerText = "Video On";
    }
    else {
      document.getElementById("videoBtn").className = "btn btn-sm btn-danger mr-3";
      document.getElementById("videoBtn").innerText = "Video Off";
    }
    if (ls) {
      // if (!videoOn) {
      //   ls.getVideoTracks()[0].stop();
      // }
      ls.getVideoTracks()[0].enabled = videoOn.current;
      setLocalStream(ls);
      console.log(videoOn.current);
    } else {
      alert("Please allow video permission.");
    }
  };

  const muteAudio = () => {
    audioOn.current = !audioOn.current;
    if (audioOn.current) {
      document.getElementById("audioBtn").className = "btn btn-sm btn-primary mr-3";
      document.getElementById("audioBtn").innerText = "Audio On";
    }
    else {
      document.getElementById("audioBtn").className = "btn btn-sm btn-danger mr-3";
      document.getElementById("audioBtn").innerText = "Audio Off";
    }
    let ls = localStream;
    if (ls) {
      // if (!videoOn) {
      //   ls.getVideoTracks()[0].stop();
      // }
      ls.getAudioTracks()[0].enabled = audioOn.current;
      setLocalStream(ls);
      console.log(audioOn.current);
    } else {
      alert("Please allow audio permission.");
    }
  };

  if (chatSocket && user) {
    chatSocket.onmessage = async (e) => {
      const data = JSON.parse(e.data);
      console.log(data);
      const from = data.from;
      const type = data.type;
      const msg = data.message;
      if (type === "chat") {
        addChats([...chats, data]);
      } else if (from._id !== user._id) {
        if (type === "joiner") {
          await call();
        } else if (type === "offer") {
          await handleIncomingcall(msg);
        } else if (type === "candidate") {
          console.log("ICE candidate received");
          handleIncomingICEcandidate(msg);
        } else if (type == "answer") {
          console.log("Call answered");
          // let connDetails = peerConnection;
          pc.current.setRemoteDescription(msg);
          // setPeerConnection(connDetails);
        } else if (type === "end") {
          alert("This video session has been ended. Thank You :)");
          endCall(false);
        }
      }
    };

    chatSocket.onopen = async (e) => {
      accessMedia()
        .then((stream) => {
          setLocalStream(stream);
          document.getElementById("local").srcObject = stream;

          sendSocket({
            type: "joiner",
            msg: "",
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    };
  }

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        data-keyboard="false"
      >
        <form>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row border-bottom p-2">
              <div className="col-md-6">
                <p className="mb-0">Please rate video quality</p>
              </div>
              <div className="col-md-6">
                <div className="col-md-3">
                  <input
                    placeholder="1-10"
                    min={"1"}
                    max={"10"}
                    type="number"
                    style={{
                      width: "60px",
                      padding: "3px",
                      border: "1px solid #d6d6d6",
                    }}
                    onChange={(e) =>
                      setRoomDetails({
                        ...roomDetails,
                        video_rating: e.target.value,
                      })
                    }
                    required
                  ></input>
                </div>
              </div>
            </div>
            <div className="row border-bottom p-2">
              <div className="col-md-6">
                <p className="mb-0">Please rate audio quality</p>
              </div>
              <div className="col-md-6">
                <div className="col-md-3">
                  <input
                    placeholder="1-10"
                    type="number"
                    style={{
                      width: "60px",
                      padding: "3px",
                      border: "1px solid #d6d6d6",
                    }}
                    onChange={(e) =>
                      setRoomDetails({
                        ...roomDetails,
                        audio_rating: e.target.value,
                      })
                    }
                    required
                  ></input>
                </div>
              </div>
            </div>
            <div className="row border-bottom p-2">
              <div className="col-md-6">
                <p className="mb-0">Please rate ratings to this Consultation</p>
              </div>
              <div className="col-md-6">
                <div className="col-md-3">
                  <input
                    placeholder="1-10"
                    type="number"
                    style={{
                      width: "60px",
                      padding: "3px",
                      border: "1px solid #d6d6d6",
                    }}
                    onChange={(e) =>
                      setRoomDetails({
                        ...roomDetails,
                        doc_rating: e.target.value,
                      })
                    }
                    required
                  ></input>
                </div>
              </div>
            </div>
            <div className="p-2">
              <label>Give review to the doctor</label>
              <textarea
                placeholder="Write your feedback"
                onChange={(e) =>
                  setRoomDetails({
                    ...roomDetails,
                    review: e.target.value,
                  })
                }
              ></textarea>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" variant="primary" onClick={wrapConsult}>
              Submit
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      <div class="container">
        <h1 class="my-4">
          <small>Session Time : {formatTime()}</small>
        </h1>

        <div class="row" style={{ minHeight: "70vh" }}>
          <div class="col-lg-8 mb-4">
            <div class="card shadow" style={{ minHeight: "50vh" }}>
              <video id="remote" width="100%" autoPlay  muted controls></video>
              <div class="card-body">
                <h4 class="card-title">
                  <a href="#">{apmtDetails && apmtDetails.doctor.name}</a>
                </h4>
              </div>
            </div>
          </div>

          <div class="col-lg-4 mb-4">
            <div class="card h-100 p-4 shadow">
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
                    My Cam
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
                    Chat
                  </button>
                </li>
              </ul>
              <div class="tab-content" id="pills-tabContent">
                <div
                  class="tab-pane fade show active"
                  id="pills-home"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab"
                  tabindex="0"
                >
                  <div class="card shadow">
                    <video
                      id="local"
                      width="100%"
                      autoPlay
                      muted
                      controls
                    ></video>
                    <div class="card-body">
                      <h4 class="card-title">
                        <a href="#">{apmtDetails && apmtDetails.p_name}</a>
                      </h4>
                    </div>
                  </div>
                </div>
                <div
                  class="tab-pane fade"
                  id="pills-profile"
                  role="tabpanel"
                  aria-labelledby="pills-profile-tab"
                  tabindex="0"
                >
                  <div
                    class="card shadow mb-3 p-3"
                    style={{ height: "40vh", "overflowY" : "scroll" }}
                  >
                    {chats &&
                      chats.map((item, idx) => {
                        return (
                          <p>
                            <b>{item.from.full_name} : </b>
                            {item.message}
                          </p>
                        );
                      })}
                  </div>

                  <div>
                    <textarea id="chat-msg"></textarea>
                    <br></br>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() =>
                        sendSocket({
                          msg: document.getElementById("chat-msg").value,
                          type: "chat",
                        })
                      }
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div class="btn-group mb-3" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-sm btn-primary mr-3" id="audioBtn" onClick={muteAudio}>
              Audio On
            </button>
            <button
              type="button"
              class="btn btn-sm btn-primary mr-3"
              id="videoBtn"
              onClick={muteVideo}
            >
              Video On
            </button>
            <button
              type="button"
              class="btn btn-sm btn-danger"
              onClick={endCall}
            >
              End Call
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConsultRoom;

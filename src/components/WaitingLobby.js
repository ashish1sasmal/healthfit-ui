import React, { Component, useEffect } from 'react'
import { useLocation } from 'react-router-dom';


function WaitingLobby() {

    const { state } = useLocation();
    console.log(state)
    if (state === null){
        alert("Invalid Action");
        window.location = "/"
    }

    useEffect(() => {
        var countDownDate = new Date(new Date().getTime()+ 10*60000).getTime();

        var x = setInterval(function() {

        var now = new Date().getTime();

        var distance = countDownDate - now;
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("countdown").innerHTML = minutes + "m " + seconds + "s ";

        if (distance < 0) {
            clearInterval(x);
            document.getElementById("countdown").innerHTML = "EXPIRED";
        }
        }, 1000);
    }, [])

  return (
    <div id='consultStep1'>
            <div className='row'>
        <div className='col'>
            <h4>Waiting Time</h4>
            <p id='countdown'></p>
            <hr style={{margin: '0'}}></hr>
            <div style={{textAlign: "center"}}>
                <div>
                    <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR35HfC0QZ9rb4aJYwXDSR0f_NyjjSGaG-RjQ&usqp=CAU'></img>
                </div>
                <div>
                    <h3>Dr. Mayank Sen</h3>
                    <p>Dentist</p>
                    <p>Overall 11+ year of experience</p>
                </div>
                <a role='button' target='_blank' href='/chat/start/chat' className='btn'>Join Now</a>
            </div>
        </div>
        <div className='col' style={{paddingTop: '20px'}}>
            <p><i class="fa-solid fa-circle-info"></i> Instructions</p>
            <ul>
                <li> You will have 20 minutes of live video chat window with alloted doctor.</li>
                <li>Join within 10 minutes of alloted time.</li>
                <li>Make sure your webcam and microphone are in working state.</li>
                <li>You can text doctor and share any file(e.g. medicine prescription) using the chat window.</li>
            </ul>
        </div>
      </div>
        </div>
  )
}

export default WaitingLobby
import axios from 'axios';
import React, { Component, useContext, useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AppContext } from '../context';
import { getAmptDetails } from '../utils/consultUtils';

function Step1() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const apmt_id = useRef(state?.apmt_id);
    const apmt_details = useRef(null);
    let { user } = useContext(AppContext)
    const [specs, setSpecs] = useState([]);
    const [details, setDetails] = useState(null || {symptoms: "fever", spec: "Physical Therapist", p_name: "Test user", p_mobile: "1234"});

    useEffect(() => {
      if (!user){
        user = JSON.parse(localStorage.getItem("user"));
      }
      if (apmt_id.current) {
          getAmptDetails(apmt_id.current)
          .then((resp) => {
              const data = resp.data;
              if (data.status === 1){
                apmt_details.current = data;
              }
              else {
                navigate("/error", {state: {"message" : data.msg}})
              }
          })
      }

      axios.get("/doctor/search/").then((response) => {
        const data = response.data;
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

    const updateAmptDetails = () => {
      axios
      .post("/consult/update/"+apmt_id.current,  details)
      .then((response) => {
        console.log(response.data, "kkk")
        apmt_details.current = response.data.data;
        if (apmt_details.current.doctor) {
          payment();
        }
        else {
          navigate('/doctors', {state: {apmt_id :apmt_id.current, spec: details.spec}});
        }
      });
    }

    const nextPage = () => {
        if (details.symptoms && details.p_mobile && details.spec) {
          if (!apmt_details.current) {
            axios
            .post("/consult/start/")
            .then((response) => {
                const { _id } = response.data.data;
                apmt_id.current = _id;
                apmt_details.current = response.data.data;
                updateAmptDetails();
            })
          }
          else {
            updateAmptDetails();
          }
        }
        else
            alert("Please fill all details")
    }

  return (
    <div id='consultStep1'  className='shadow border'>
    <div className='row'>
        <div className='col-5 m-2 mr-4'>
            <h3>Consult with a Doctor</h3>
            <p>Tell us your symptom or health problem</p>
            <textarea placeholder='e.g fever, headache' onChange={(data) => setDetails({...details, symptoms: data.target.value})}></textarea>
            
            <div id='selectDoctor' style={{"marginBottom" : "20px"}}>
            <p>Choose a relevant speciality</p>
            
            {specs!=[] && <select class="form-control" data-show-subtext="true" data-live-search="true" onChange={(data) => setDetails({...details, spec: data.target.value})}>
            {specs.map((e) => {
            return <option value={e}>{e}</option>;
            })}
            </select>}
            </div>
            <div className='mb-2'>
                <label className='inputLabel'>Patient Name</label><br></br>
                <input type='text' placeholder='Enter patient name' onChange={(data) => setDetails({...details, p_name: data.target.value})} required></input>
            </div>
            <p>Mobile Number</p>
            <input type={'text'} placeholder='Enter Mobile Number' onChange={(data) => setDetails({...details, p_mobile: data.target.value})}></input>
            
            <div style={{"marginTop" : "20px"}}>
                <button className='btn btn-primary' onClick={nextPage}>Proceed to pay</button>
            </div>
            
        </div>
        <div className='col-5'>
        <img className='border' style={{"width" : "400px", "margin-left": "50px", "marginTop" : "40px"}} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzbU4a4k2ZjhsePk5be_vfwWudHVjHrSDZQlMARsIhUtygc_D-lOp8cFNJbCLQvbCv7n0&usqp=CAU"/>
        </div>
    </div>
</div>
  )
}

export default Step1

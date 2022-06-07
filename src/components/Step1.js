import axios from 'axios';
import React, { Component, useContext, useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AppContext } from '../context';

function Step1() {
    const { state } = useLocation();
    let { user } = useContext(AppContext)
    const [specs, setSpecs] = useState([]);
    const [details, setDetails] = useState(state || {});
    const navigate = useNavigate();

    useEffect(() => {
      if (!user){
        user = JSON.parse(localStorage.getItem("user"));
      }
        axios.get("/doctor/search/").then((response) => {
        const data = response.data;
            setSpecs(data.specs);
        });
    }, []);

    const nextPage = () => {
      console.log(details)
        if (details.symptoms && details.mobile && details.spec)
            displayRazorPay();
        else
            alert("Please fill all details")
    }


      const displayRazorPay = () => {
    axios
      .post("/consult/payment/", details)
      .then((response) => {
        console.log(response.data.data)
          const options = {
            key: 'rzp_test_eCu1qUcpkGwpvc',
            currency: 'INR',
            amount: 50000,
            name: details.name,
            description: "Wallet Transaction",
            image: "",
            order_id: response.data.data.razorpay_order_id,
            handler: async function (resp) {
              console.log(resp);
              const data = {
                  orderCreationId: resp._id,
                  razorpayPaymentId: resp.razorpay_payment_id,
                  razorpayOrderId: resp.razorpay_order_id,
                  razorpaySignature: resp.razorpay_signature,
              };
              console.log(data);
              navigate('/doctors', {state: response.data.data})
            },
            prefill: {
              name: details.name,
              email: "",
              contact: details.mobile,
            },
          };
          if (response.data.status === 1){
              const paymentObject = new window.Razorpay(options);
              paymentObject.open();
          }
          else{
            alert(response.data.msg);
          }
      })  
  }

    // const displayRazorPay = () =>{
    //     axios
    //     .post("/consult/payment/", details)
    //     .then((response) => {
    //     navigate('/doctors', {state: response.data.data})
    //     })
    // }

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
                <input type='text' placeholder='Enter patient name' onChange={(data) => setDetails({...details, name: data.target.value})} required></input>
            </div>
            <p>Mobile Number</p>
            <input type={'text'} placeholder='Enter Mobile Number' onChange={(data) => setDetails({...details, mobile: data.target.value})}></input>
            
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

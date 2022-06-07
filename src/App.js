import './App.css';
import './styles.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Step1 from './components/Step1';
import WaitingLobby from './components/WaitingLobby';
import Footer from './components/Footer';
import Search from './components/Search';
import DoctorProfile from './components/DoctorProfile';
import { createContext, useEffect, useState } from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
import { AppContext } from './context';
import ConsultRoom from './components/ConsultRoom';
import Error from './components/Error';
import Home4 from './components/Home4';
import DocDashboard from './components/DocDashboard';
function App() {

  const [user, setUser] = useState(false);
  

  useEffect(() => {
      if (localStorage.getItem('user')){
        setUser(JSON.parse(localStorage.getItem('user')));
      }
  }, []);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  });


  

  

  return (
    <div className="App">
      <AppContext.Provider value={{user}}>
      <Navbar />  
        <div id='underNav'></div>
        <Routes>
          <Route path='doctor/dashboard' element={<DocDashboard />}></Route>
            <Route path='/' element={<Home4 />}></Route>
            <Route path='doctors' element={<Search />}></Route>
            <Route path='/doctors/:docId' element={<DoctorProfile />}></Route>
            <Route path='/consult' element={<Step1 />}>
            </Route>
            <Route path='/consult/confirm/lobby' element={<WaitingLobby />}></Route>
            <Route path='users/'>
              <Route path='signup/' element={<Signup />}></Route>
              <Route path={'login/'} element={<Login />}></Route>
            </Route>
            <Route path='/consult/video/:apmtId' element={<ConsultRoom />}></Route>
            <Route path='/error' element={<Error />}></Route>
        </Routes>
        <Footer />
      </AppContext.Provider>
        
        
        
    </div>
  );
}

export default App;

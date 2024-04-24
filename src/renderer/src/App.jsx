import React,{useEffect,useState} from 'react'
import { HashRouter, Routes, Route, Link,useNavigate } from 'react-router-dom';
import Footer from './components/Footer';
import Header from "./components/Header";
import Choices from './components/Choices';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Html5QrcodePlugin from './components/Html5QrcodePlugin'
import Success from './components/Success';


const onNewScanResultEntree = (decodedText, decodedResult) => {
  console.log(decodedText)
  window.electron.ipcRenderer.send('scan-entree',decodedText)
  navi("/menu/success")

};
const onNewScanResultSortie = (decodedText, decodedResult) => {
  console.log(decodedResult)
  window.electron.ipcRenderer.send('scan-sortie',decodedText)

};
function App() {
  
  return (
  
      <>
   <HashRouter>
        <Header></Header>
        
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="menu/*" element={<MenuRoutes  />} />
          <Route path="signup" element={<Signup  />} />
        </Routes>
        <br /><br />
        <Footer />
      </HashRouter>
      
    </>
  
  )
}

function MenuRoutes() {
  return (
    <>
    <div id="links">
            <Link to="/menu" className="navbar-brand m-auto " id="link">Menu</Link> 
            
        </div>
    <Routes>
      <Route index element={<Choices />} />
      <Route path="scanentree" element={<Html5QrcodePlugin
                fps={10}
                qrbox={300}
                disableFlip={false}
                qrCodeSuccessCallback={onNewScanResultEntree}
                channel='scan-entree'
            />} />
      <Route path="scansortie" element={<Html5QrcodePlugin
                fps={10}
                qrbox={300}
                disableFlip={false}
                qrCodeSuccessCallback={onNewScanResultSortie}
                channel='scan-sortie'
            />} />
      <Route path='success' element={<Success/>}/>
    </Routes>
    </>
  );
}
export default App


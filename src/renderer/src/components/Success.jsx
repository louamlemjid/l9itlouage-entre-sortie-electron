import { useLocation,useNavigate } from "react-router-dom"
import React,{useEffect,useState} from "react";
const Success=(props)=>{
  const [etat,setEtat]=useState(false)
  const [result,setResult]=useState()
  const location = useLocation();
  const navigate = useNavigate();
  let message = location.state.message;

  console.log(etat)

  useEffect(() => {
    window.electron.ipcRenderer.on('scan', async(event, response) => {
     setEtat(true)
     setResult(response)
    });
    
    return () => {
      window.electron.ipcRenderer.removeAllListeners('scan');
    };
  }, []);
  setTimeout(()=>{navigate("/menu/scanentree")},5000)
    return (<>
      {etat?
      result?
        <div id="success" >
          
        <div id="symdiv" >
              <i id="sym" >✓</i>
        </div>
        <div >
          <h1 id="h1success" >تم التعرف على الهوية </h1> 
          <p id="psuccess" >{message}</p>
        </div>
      </div>
      :
      <div id="success" >
          
        <div id="symdivfail" >
              <i id="sym" >x</i>
        </div>
        <div >
          <h1 id="h1fail" >هناك خطأ الرجاء الاتجاه الى مسؤول المحطة</h1> 
          
        </div>
      </div>
      :
      <div id="success" >
      <p>الرجاء الانتظار قليلا</p>
      </div>}
        </>
    )
}
export default Success
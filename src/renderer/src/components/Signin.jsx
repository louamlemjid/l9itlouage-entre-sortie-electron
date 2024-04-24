import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message,setMessage]=useState("pending..")
    const [sub,setSub]=useState("nothing submitted yet !")
    const [state, setSate] = useState(false);
    const navigate = useNavigate();
    const fetchData = async (dataToFetch) => {
        // Send request to main process to get city data
        window.electron.ipcRenderer.send('find', dataToFetch);
      };
  
    // Function to handle form submission
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission
        console.log('Form submitted:', formData);
        setSub("form submitted successfully :)")
        fetchData(formData);
        console.log(`the state :  ${state}`)
    };
    console.log('Component mounted');
    // Function to handle input changes
    const handleInputChange = (event) => {
        
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };
    useEffect(() => {
        window.electron.ipcRenderer.on('find', async(event, data,recevedMessage) => {
          // Update state with received data
          console.log(`data recived in the react : ${data}`)
          setMessage(recevedMessage)
          data?setSate(true):setSate(false);
        });
        console.log(`the is the state inside useeffect : ${state}`)
        state?navigate("/menu"):null
        
        // Clean up event listener
        return () => {
          window.electron.ipcRenderer.removeAllListeners('find');
        };
      }, [state]);

    return (
        <form onSubmit={handleSubmit} id="signin" className="w-75 btnn">
            <h1 className="text-primary fs-1 m-auto w-75">تسجيل الدخول</h1>
            <div className="input-group mb-3">
                <span className="input-group-text bg-transparent text-dark" id="basic-addon1">@</span>
                <input
                    type="email"
                    className="form-control bg-transparent text-dark"
                    placeholder="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="input-group mb-3">
                <span className="input-group-text bg-transparent text-dark" id="basic-addon1">PASSWORD</span>
                <input
                    type="password"
                    className="form-control bg-transparent text-dark"
                    placeholder="PASSWORD"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <Link to="/signup" id="signuplink">الاشتراك</Link>
            <div className="col-auto w-25 m-auto">
                <button type="submit" className="btn btn-primary mb-2 ">Connecter</button>
            </div>
        </form>
    );
};

export default Signin;

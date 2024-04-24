import login from "./../assets/login.png"
import logout from "./../assets/logout.png"

import { HashRouter ,Routes, Route, Link } from 'react-router-dom';

function Choices(){
    return(
        <div className="choices">
        <Link to="/menu/scanentree" className="m-auto">
        <button id="menuform" className="m-auto" >
                <img src={login} alt="" width="70" className="m-auto" />
                <label className="m-auto fs-6">scan entree</label>
        </button>
        </Link>
        
        <Link to="/menu/scansortie" className="m-auto" >
            <button  id="menuform" >
                <img src={logout} alt="" width="70" className="m-auto" />
                <label  className="m-auto fs-6">scan sortie</label>
            </button>
        </Link>

        
    </div>
    )
}
export default Choices;
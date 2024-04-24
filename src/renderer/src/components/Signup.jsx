import PriceCard from "./PriceCard";
import {Link} from "react-router-dom"
const Signup=()=>{
    return (
      <>
      <div id="links">
            <Link to="/" className="navbar-brand m-auto " id="link">Se connecter</Link> {/* Changed the link text */}
            
        </div>
        <div className="paiment">
          <PriceCard tier="FREE" price="0dt"timeLimit="7 days only!" support="for testing"privacy="sared data"louageLimit="100 Louages"/>
          <PriceCard tier="PRO" price="100dt"timeLimit="30 days renewable" support="24/7"privacy="sared data"louageLimit="300 Louages"/>
          <PriceCard tier="ENTREPRISE" price="250dt"timeLimit="90 days renewable" support="full support"privacy="private data"louageLimit="1000 Louages"/>
        </div>
      </>
        
    )
}
export default Signup;
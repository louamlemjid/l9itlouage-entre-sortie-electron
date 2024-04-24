import logo from "./../assets/logo.png"

function Header(){
    
    return(
        <>
        <nav  className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div id="logoheader">
            <img src={logo} alt="a building" width="40" className="m-1" />
            <p className="navbar-brand m-auto">L9itLouage</p>
            </div>
            
            
            
        </nav>
        <br />
        </>
    )
}
export default Header;

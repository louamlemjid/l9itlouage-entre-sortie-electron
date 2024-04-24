function currentYear(){
    return new Date().getFullYear();
}
const Footer=()=>{
    return(
      <>
      <br />
      <footer>
      
      <p className="text-center fs-4 text-dark border-top">L9itLouage © {currentYear()}, Inc</p>

    </footer>
      </>
    )
}
export default Footer;



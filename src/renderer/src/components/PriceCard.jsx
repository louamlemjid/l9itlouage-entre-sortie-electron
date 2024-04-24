const PriceCard=(props)=>{
    return (
        <div className="col">
        <div className="card mb-4  bg-dark">
          <div className="card-header py-3 ">
            <h4 className="my-0 fw-normal text-center fs-2 text-light">{props.tier}</h4>
          </div>
          <div className="card-body">
            <h1 className="card-title pricing-card-title text-light">{props.price}<small className="text-secondary fw-light">/mo</small></h1>
            <ul className="list-unstyled mt-3 mb-4 text-light">
              <li  className="text-success">{props.timeLimit}</li>
              <li>{props.support}</li>
              <li>{props.privacy}</li>
              <li className="text-danger">{props.louageLimit}</li>
            </ul>
            <button type="button" className="w-100 btn btn-lg btn-outline-light">Get started</button>
          </div>
        </div>
        
      </div>
    )
}
export default PriceCard
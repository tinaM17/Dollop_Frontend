

function NewFeatured() {
    return (
      <div className="container feature">
        <div
          className="row
      justify-content-center"
        >
          <div className="col-md-4 alignC">
          <img className='featureImg' src='./FeatureA.png' alt='Feature image' />
          </div>
          <div className="col-md-8">
            {/* <h2>Daily Sessions</h2>
            <p>Speak and unload, or just listen and enjoy</p> */}
            <h2 className="demo">Daily Sessions</h2>
            <p className="feturedText">Speak and unload, or just listen and enjoy</p>
          </div>
        </div>
        <div
          className="row
      justify-content-center"
        >
          <div className="col-md-4 alignC">
          <img className='featureImg' src='./FeatureB.png' alt='Feature image' />
          </div>
          <div className="col-md-8">
            <h2 className="demo">Pressure free</h2>
            <p className="feturedText">Try a session! No obligation to do any more</p>
          </div>
        </div>
        <div
          className="row
      justify-content-center"
        >
          <div className="col-md-4 alignC">
          <img className='featureImg' src='./FeatureC.png' alt='Feature image' />
          </div>
          <div className="col-md-8">
            {/* <h2>Completely FREE</h2>
            <p>We wont ask for any subscriptions or payments</p> */}
            <h2 className="demo">Completely FREE</h2>
            <p className="feturedText">We wont ask for any subscriptions or payments</p>
          </div>
        </div>
      </div>
    )
  }
  
  export default NewFeatured
  
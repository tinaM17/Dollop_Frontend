import Header from '../components/Header'
import Footer from '../components/Footer'

function Resources() {
  return (
    <div>
      <Header isAudioRoom={false} />
      <div className="container">
      <div className='header'>
         <h1 className='title'>Resources</h1>
      </div>
      <div className="resources footer">
        <p>UK & Republic of Ireland</p>
        <p>Emergency: 112 or 999</p>
        <p>Non-emergency: 111, Option 2</p>
        <p>24/7 Helpline: 116 123 (UK and ROI)</p>
        <p>Shout: Text "DESERVE" TO 85258</p>
        <p>Samaritans.org: <a className='link' href="https://www.samaritans.org/how-we-can-help-you/contact-us" target='_blank'>https://www.samaritans.org/how-we-can-help-you/contact-us</a></p>
        <p>YourLifeCounts.org: <a className='link' href="https://yourlifecounts.org/find-help/" target='_blank'>https://yourlifecounts.org/find-help/</a></p>
      </div>
      </div>
      <Footer />
    </div>
  )
}

export default Resources

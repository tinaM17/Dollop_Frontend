
import Header from '../components/Header'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import SelectGroup from '../components/SelectGroup'
import Review from '../components/Review'
import Featured from '../components/Featured'
import Discuss from '../components/Discuss'

function Home() {
  return (
    <div >
    <Header isAudioRoom={false} />
      <Hero />
      {/* <SelectGroup />
        <div className='mt-2 mb-2 container'>
          <p className='info'> Try talking, or just listening to a group of people who know
                exactly what you are going through. Feel normal again not alone
                in your struggle.</p>
        </div> */}
      <Review />
      <Featured />
      <SelectGroup />
      <Discuss />
      <div className='mt-2 mb-2 container pt-5'>
          {/* <p className='info'> Try talking, or just listening to a group of people who know
                exactly what you are going through. Feel normal again not alone
                in your struggle.</p> */}
           <p className='heroBoldText'> Talk or just listen to a group of people who know
                exactly what you are going through.
                <p className='heroBold'>You are not alone in your struggle.</p>
                </p>
                <br/>
                <br />
                <hr />
        </div>
      <Footer />
    </div>
  )
}

export default Home

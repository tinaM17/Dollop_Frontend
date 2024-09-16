import Header from "../components/Header";
import Footer from "../components/Footer";
import SelectGroup from "../components/SelectGroup";
import Review from "../components/Review";
import Discuss from "../components/Discuss";
import NewFeatured from "../components/NewFeatured";
import NewHero from "../components/NewHero";

function NewHome() {
  return (
    <div>
      <Header isAudioRoom={false} />
      <NewHero />
      {/* <SelectGroup />
        <div className='mt-2 mb-2 container'>
          <p className='info'> Try talking, or just listening to a group of people who know
                exactly what you are going through. Feel normal again not alone
                in your struggle.</p>
        </div> */}
      <Review />
      <NewFeatured />
      <SelectGroup />
      <Discuss />
      <div className="mt-2 mb-2 container pt-5">
        {/* <p className='info'> Try talking, or just listening to a group of people who know
                exactly what you are going through. Feel normal again not alone
                in your struggle.</p> */}
        <p className="heroBoldText">
          {" "}
          Talk or just listen to a group of people who know exactly what you are
          going through.
        </p>
        <p className="heroBold">You are not alone in your struggle.</p>
        <br />
        <br />
        <hr />
      </div>
      <Footer />
    </div>
  );
}

export default NewHome;

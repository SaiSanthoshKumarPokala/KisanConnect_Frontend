import { Link } from "react-router";

export default function LandingHero() {
  return (
    <div className="relative font-montserrat bg-[url(/hero.png)] bg-cover bg-center bg-darkgreen">
      <div>
        <div className="flex flex-col items-center justify-center h-150 gap-4">
          <h1 className="font-extrabold text-3xl md:text-5xl text-center text-white mx-6">
            GROW MORE THAN JUST CROPS
          </h1>
          <div className="flex flex-col items-center justify-center text-center px-4">
            <p className="font-bold md:text-xl text-gold">
              We provide the resources and support
            </p>
            <p className="font-bold md:text-xl text-gold">
              to help you achieve your goals, season after season.
            </p>
          </div>
          <div className="flex gap-8 m-4">
            <Link
              to="/auth"
              className="px-4 py-2 text-white font-bold rounded-xl m-2 border-gold/75 border-[1.2px] cursor-pointer bg-darkgreen hover:bg-linear-to-r hover:from-gold hover:to-yellow-200 hover:text-darkgreen transition-all ease-in duration-100"
            >
              Get Started
            </Link>
            <a
              href="#services"
              className="px-4 py-2 text-white font-bold rounded-xl m-2 border-white border-[1.2px] cursor-pointer hover:bg-white hover:text-gold hover:border-gold transition-all ease-in duration-100"
            >
              Know more
            </a>
          </div>
        </div>
      </div>
      <div className="relative bottom-0 h-20 bg-linear-to-b from-darkgreen/10 to-darkgreen" />
    </div>
  );
}
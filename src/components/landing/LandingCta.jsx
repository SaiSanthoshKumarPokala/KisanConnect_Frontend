import { Link } from "react-router";

export default function LandingCta() {
  return (
    <div className="bg-[url(/farmer.png)] bg-cover bg-top font-montserrat bg-black relative">
      <div className="flex flex-col items-center justify-center text-center h-110.75 gap-4">
        <h2 className="text-white font-bold text-3xl md:text-4xl lg:text-5xl">
          Grow with Us, Thrive Tomorrow
        </h2>
        <p className="text-white w-10/12 md:w-7/12 lg:w-5/12 md:text-lg">
          We empower you with agro education. Unlock expert knowledge and reliable support. Connect with fellow farmers to share insights and boost your harvest.
        </p>
        <Link
          to="/auth"
          className="px-4 py-2 text-white font-bold rounded-xl m-2 border-white border-[1.2px] cursor-pointer hover:bg-white hover:text-gold hover:border-gold transition-all ease-in duration-100"
        >
          Join Now
        </Link>
      </div>
    </div>
  );
}
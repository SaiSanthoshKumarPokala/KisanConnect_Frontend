import { Link } from "react-router";
import NavBar from "../components/NavBar";
import { UseAppContext } from "../context/AppContext";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function NotFound() {
  useDocumentTitle("Page Not Found");

  const { role } = UseAppContext();
  const returnPath =
    role === "farmer" || role === "serviceprovider" ? `/${role}` : "/";

  return (
    <div className="flex min-h-dvh flex-col bg-darkgreen font-montserrat">
      <NavBar />

      <main className="flex flex-1 flex-col items-center justify-evenly px-6 py-12 md:flex-row">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <h1 className="flex flex-col text-3xl font-extrabold text-white md:text-5xl lg:text-7xl">
            <span>It looks like</span>
            <span>you are lost</span>
            <span className="text-gold">in space</span>
          </h1>

          <Link
            to={returnPath}
            className="my-8 inline-block w-full max-w-xs cursor-pointer rounded-full border border-gold/75 bg-gold px-6 py-4 text-center text-xl font-bold text-darkgreen transition-all duration-200 hover:border-gold hover:bg-darkgreen hover:text-gold lg:text-2xl"
          >
            Get back to home
          </Link>
        </div>

        <div className="flex shrink-0 items-center justify-center p-4">
          <img
            src="/404.svg"
            alt="Lost in space 404 illustration"
            className="size-72 object-contain lg:size-96"
          />
        </div>
      </main>
    </div>
  );
}
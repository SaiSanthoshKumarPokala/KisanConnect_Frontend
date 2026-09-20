import { Link } from "react-router";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

export default function ServiceCard({ service, role }) {
  return (
    <Link
      to={`/${role}/${service.link}`}
      className="group flex w-full max-w-90 flex-col justify-between rounded-xl border-2 border-gold bg-black p-6 font-montserrat text-white shadow-gold transition-all duration-300 hover:shadow-[10px_10px_0px_0px_var(--color-gold,#d4af37)]"
    >
      <div>
        <img
          src={service.image}
          alt=""
          className="mb-4 size-20 object-contain"
          aria-hidden="true"
        />
        <h2 className="text-2xl font-bold text-white transition-colors group-hover:text-amber-200">
          {service.title}
        </h2>
        <p className="mt-2 text-sm font-medium leading-relaxed text-white/70">
          {service.point}
        </p>
      </div>

      <div className="mt-6 flex w-full items-center justify-between rounded-xl bg-white p-4 font-semibold text-black transition-colors duration-300 group-hover:bg-gold">
        <span className="text-lg">Get Started</span>
        <ArrowRightIcon className="size-6 fill-black transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
      </div>
    </Link>
  );
}
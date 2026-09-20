import { CheckBadgeIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

export default function LandingServiceCard({ service }) {
  return (
    <div className="group border-gold border rounded-3xl bg-black px-8 md:px-6 py-10 hover:bg-linear-to-br hover:from-gradstart hover:to-black hover:bg-darkgreen cursor-pointer transition-all">
      <div className="flex flex-col gap-4 justify-between h-full">
        <img src={service.icon} alt="" className="size-16" />
        <h2 className="font-bold text-white text-2xl">{service.name}</h2>
        <hr className="text-gold" />
        <div className="flex-col flex h-full justify-between gap-4">
          <ul className="text-lightblack font-semibold space-y-2">
            <li className="flex flex-row gap-2 whitespace-pre-wrap">
              <CheckBadgeIcon className="fill-gold size-6 shrink-0" />
              <span>{service.point1}</span>
            </li>
            <li className="flex flex-row gap-2 whitespace-pre-wrap">
              <CheckBadgeIcon className="fill-gold size-6 shrink-0" />
              <span>{service.point2}</span>
            </li>
            <li className="flex flex-row gap-2 whitespace-pre-wrap">
              <CheckBadgeIcon className="fill-gold size-6 shrink-0" />
              <span>{service.point3}</span>
            </li>
          </ul>
          <button
            type="button"
            className="px-4 py-2 flex items-center gap-2 border w-fit rounded-lg border-gold text-gold cursor-pointer font-bold group-hover:bg-gold group-hover:text-white"
          >
            <span>Read More</span>
            <ChevronRightIcon className="size-6 group-hover:translate-x-2 transition-transform ease-in duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
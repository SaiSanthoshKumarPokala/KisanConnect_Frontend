import { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import { AI_TOOLKIT_PREVIEWS } from "../../constants/landingData";

export default function LandingAiSection() {
  const [isactive, setIsactive] = useState(1);
  const activeTool =
    AI_TOOLKIT_PREVIEWS.find((t) => t.id === isactive) || AI_TOOLKIT_PREVIEWS[0];

  return (
    <div className="relative h-auto font-montserrat bg-darkgreen md:px-10 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 mx-6 md:px-12 gap-2 md:gap-10 items-center">
        <div className="flex flex-col p-6 gap-2 items-start">
          <h2 className="font-bold bg-linear-to-r from-gold to-yellow-200 bg-clip-text text-transparent text-2xl md:text-3xl">
            About us
          </h2>
          <p className="font-semibold text-3xl md:text-4xl text-white">Empowering</p>
          <p className="font-semibold text-3xl md:text-4xl text-white">Agriculture through</p>
          <p className="font-semibold text-3xl md:text-4xl text-white">Technology.</p>
        </div>
        <div className="flex p-6">
          <p className="text-white">
            Empowering agriculture through technology is about transforming an ancient practice into a modern, data-driven science. It's about giving farmers, regardless of their scale, the tools to move from reactive to proactive farming.
          </p>
        </div>
      </div>

      <h2 className="font-bold text-2xl md:text-4xl text-center m-6 text-white">
        <span className="text-3xl md:text-5xl">I</span>NSIDE THE{" "}
        <span className="bg-linear-to-r from-gold to-yellow-200 bg-clip-text text-transparent">
          AI TOOL KIT
        </span>
      </h2>

      <div className="flex flex-col md:flex-row m-auto justify-center p-4 w-11/12 md:w-11/12 lg:w-8/12 gap-1 md:gap-0.5">
        <div className="flex flex-col w-full md:w-8/12 lg:w-6/12 bg-black rounded-md border-gold/70 border">
          {AI_TOOLKIT_PREVIEWS.map((item) => (
            <div
              id={String(item.id)}
              key={item.id}
              className={`flex flex-row items-center gap-4 p-4 cursor-pointer rounded-md transition-all ${
                isactive === item.id
                  ? "bg-linear-to-r from-gold to-yellow-200 text-black"
                  : "bg-black text-white"
              }`}
              onClick={() => setIsactive(item.id)}
            >
              <div className="image rounded-full bg-white">
                <img src={item.icon} alt="" className="p-2 size-10" />
              </div>
              <p className="font-bold text-xl">{item.name}</p>
            </div>
          ))}
        </div>

        <div className="bg-black/42 border border-gold/70 w-full rounded-md bg-[url(/ai_bg.png)] bg-cover bg-center">
          <div className="flex flex-col p-6">
            <h3 className="text-3xl pb-1.25 font-bold bg-linear-to-r from-gold to-yellow-200 bg-clip-text text-transparent">
              {activeTool.name}
            </h3>
            <p className="text-xl text-white mt-1">{activeTool.desc}</p>
            <h4 className="text-white pt-4 pb-2 font-bold text-xl">You will learn:</h4>
            <ul className="text-white space-y-2">
              <li className="flex flex-row gap-4 items-center">
                <CheckIcon className="size-6 fill-activetab shrink-0" />
                <span>{activeTool.point1}</span>
              </li>
              <li className="flex flex-row gap-4 items-center">
                <CheckIcon className="size-6 fill-activetab shrink-0" />
                <span>{activeTool.point2}</span>
              </li>
              <li className="flex flex-row gap-4 items-center">
                <CheckIcon className="size-6 fill-activetab shrink-0" />
                <span>{activeTool.point3}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
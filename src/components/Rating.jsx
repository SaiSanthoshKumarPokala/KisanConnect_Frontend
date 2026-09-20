import { StarIcon } from "@heroicons/react/24/outline"

export default function Rating({ average = 0, href = "#", totalCount = 0 }) {
  return (
    <div className="mt-6 font-montserrat">
      <h3 className="sr-only">Reviews</h3>
      <div className="flex items-center">
        <div className="flex items-center">
          {[0, 1, 2, 3, 4].map((rating) => (
            <StarIcon
              key={rating}
              aria-hidden="true"
              className={`size-5 shrink-0 ${
                average > rating
                  ? "stroke-[#d4af37] fill-[#d4af37]"
                  : "stroke-[#d4af37] fill-transparent"
              }`}
            />
          ))}
        </div>
        <p className="sr-only">{average} out of 5 stars</p>
        <a
          href={href}
          className="ml-3 text-sm font-medium text-[#FFF085] hover:text-[#d4af37] transition-colors"
        >
          {totalCount} reviews
        </a>
      </div>
    </div>
  );
}
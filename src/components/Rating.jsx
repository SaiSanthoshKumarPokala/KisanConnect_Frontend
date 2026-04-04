import { StarIcon } from "@heroicons/react/24/outline"

export default function Rating(props) {

    const average = props.average;
    const href = props.href;
    const totalCount = props.totalCount;

    return (
        <>
            <div className="mt-6">
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center">
                    <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                            <StarIcon
                                key={rating}
                                className={` size-5 shrink-0 ${average > rating ? "stroke-yellow-500 fill-yellow-500" : "stroke-yellow-500"}`}
                            />
                        ))}
                    </div>
                    <p className="sr-only">{average} out of 5 stars</p>
                    <a href={href} className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        {totalCount} reviews
                    </a>
                </div>
            </div>
        </>
    )
}
import { FaLink } from "react-icons/fa";
import { City } from "../discover/page";

const CityCard = ({ city }: { city: City }) => {
  console.log(city.image, "img sit");
  return (
    <div className="h-auto w-full flex gap-4 rounded-lg text-black-opacity-80">
      <div className={` bg-${city.color}`} />
      <img
        src={city.image}
        alt="cityimg"
        className="h-20 w-20 rounded-lg shadow-sm  object-cover shadow-xl dark:shadow-gray-800"
      />
      <div className="flex flex-col justify-between py-1 text-left text-sm">
        <div className="flex gap-4 items-center justify-between">
          <h4 className="font-medium">{city.name}</h4>
          <FaLink className="text-black-opacity-50 font-light" />
        </div>

        <div className="flex items-center gap-2 text-black-opacity-60">
          Meetups hosted: {city.meetupsHosted}
        </div>
        <div className="flex items-center text-black-opacity-50">
          <p>{city.region}</p>
        </div>
      </div>
    </div>
  );
};

export default CityCard;

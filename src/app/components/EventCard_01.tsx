interface EventCardProps {
  status: string;
  city: string;
  country: string;
  author: string;
  date: string;
  fee: string;
  imageUrl: string;
}

export const EventCard_01: React.FC<EventCardProps> = ({
  status,
  city,
  country,
  author,
  date,
  fee,
  imageUrl,
}) => {
  return (
    <div className="flex flex-col space-y-3">
      <div className="relative w-32 h-20 rounded-lg overflow-hidden">
        <img
          src={imageUrl}
          alt={`${city}, ${country}`}
          className="w-full h-full object-cover rounded-lg"
        />
        <span className="bg-gray-100 text-black-opacity-70 top-0 left-0 absolute px-2 py-1 rounded-br-lg">
          {status}
        </span>
      </div>
      <div>
        <h3 className="text-lg font-semibold">
          {city}, {country}
        </h3>
        <p className="text-sm text-black-opacity-50">By {author}</p>
        <p className="text-sm text-black-opacity-50">{date}</p>
        <p className="text-sm text-black-opacity-50">Fee: {fee}</p>
      </div>
    </div>
  );
};

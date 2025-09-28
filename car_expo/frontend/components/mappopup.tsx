type Car = {
  id: string;
  name: string;
  year: number;
  rating: number;
  trips: number;
  distance: string;
  price: number;
  image: string;
};

export default function CarPopup({ cars }: { cars: Car[] }) {
  return (
    <div className="w-80 bg-white rounded-xl shadow-lg overflow-hidden font-sans">
      {cars.map((car) => (
        <div
          key={car.id}
          className="flex items-center border-b border-gray-200 p-3 hover:bg-gray-50 transition cursor-pointer"
        >
          <img
            src={car.image}
            alt={car.name}
            className="w-28 h-20 object-cover rounded-lg mr-3 flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/default-car.jpg";
            }}
          />
          <div className="flex-1 text-black">
            <h3 className="text-sm font-semibold leading-snug">
              {car.name} {car.year}
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              <i className="fas fa-star text-yellow-400 mr-1"></i>
              {car.rating} • {car.trips} trips
            </p>
            <p className="text-xs text-gray-600">
              <i className="fas fa-map-marker-alt text-red-500 mr-1"></i>
              {car.distance}
            </p>
            <p className="text-sm font-bold mt-1">
              <i className="fas fa-tag text-green-600 mr-1"></i>${car.price} total
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
/* =========================================================
   CarGo — static data (no backend; everything lives here)
   ========================================================= */

// Daily rates in Rwandan Francs (RWF)
const PACKAGES = {
  standard: {
    id: "standard",
    name: "Standard",
    tagline: "Smart, comfortable cars for everyday trips",
    kigali: 30000,
    outside: 50000,
    perks: [
      "Comfortable sedans, SUVs & vans",
      "Full insurance included",
      "24/7 roadside assistance",
      "Free delivery within Kigali",
      "Unlimited kilometres in Kigali"
    ]
  },
  premium: {
    id: "premium",
    name: "Premium",
    tagline: "Luxury, 4x4 and group vehicles for every road",
    kigali: 50000,
    outside: 70000,
    perks: [
      "Luxury cars, Land Cruisers & coasters",
      "Comprehensive insurance included",
      "Priority 24/7 roadside assistance",
      "Free airport pick-up & drop-off",
      "Ideal for safaris & upcountry trips"
    ]
  }
};

const IMG = "image/";

const CARS = [
  {
    id: "toyota-yaris",
    name: "Toyota Yaris Hybrid",
    type: "Hatchback",
    package: "standard",
    seats: 5,
    transmission: "Automatic",
    fuel: "Hybrid",
    year: 2020,
    image: IMG + "toyota-yaris.jpg",
    description:
      "A nimble, fuel-sipping hybrid that is perfect for Kigali's busy streets. Easy to park, smooth to drive and very economical on long days around the city.",
    features: ["Hybrid engine", "Air conditioning", "Bluetooth audio", "Reverse camera", "Cruise control", "USB charging"]
  },
  {
    id: "hyundai-sonata",
    name: "Hyundai Sonata",
    type: "Sedan",
    package: "standard",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    year: 2015,
    image: IMG + "2015-hyundai-sonata.jpg",
    description:
      "A spacious mid-size sedan with a quiet cabin and generous boot. Great for business meetings, airport runs and family outings.",
    features: ["Spacious boot", "Air conditioning", "Bluetooth audio", "Keyless entry", "Leather seats", "Cruise control"]
  },
  {
    id: "kia-sorento",
    name: "Kia Sorento",
    type: "SUV",
    package: "standard",
    seats: 7,
    transmission: "Automatic",
    fuel: "Diesel",
    year: 2019,
    image: IMG + "kia_sorento.jfif",
    description:
      "A practical seven-seat SUV with plenty of room for the whole family and their luggage. Confident on Kigali's hills and comfortable on the highway.",
    features: ["7 seats", "Dual-zone A/C", "Apple CarPlay", "Reverse camera", "Roof rails", "Hill-start assist"]
  },
  {
    id: "byd-song-plus",
    name: "BYD Song Plus",
    type: "Electric SUV",
    package: "standard",
    seats: 5,
    transmission: "Automatic",
    fuel: "Electric",
    year: 2024,
    image: IMG + "byd-design.webp",
    description:
      "Go green in style. The BYD Song Plus is a modern, silent electric SUV with a premium interior and a huge touchscreen — and zero fuel costs.",
    features: ["100% electric", "Panoramic roof", "Rotating touchscreen", "360° camera", "Wireless charging", "Lane assist"]
  },
  {
    id: "toyota-hiace",
    name: "Toyota Hiace",
    type: "Van",
    package: "standard",
    seats: 14,
    transmission: "Manual",
    fuel: "Diesel",
    year: 2018,
    image: IMG + "toyota-hiace.jpg",
    description:
      "The reliable choice for group travel. Move up to 14 passengers to weddings, church events, team outings or airport transfers.",
    features: ["14 seats", "Air conditioning", "Large luggage space", "Sliding door", "Reliable diesel", "Driver available"]
  },
  {
    id: "mercedes-c200",
    name: "Mercedes-Benz C200",
    type: "Luxury Sedan",
    package: "premium",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    year: 2021,
    image: IMG + "mercedes-c200.jpg",
    description:
      "Arrive in class. The C200 blends executive comfort with sporty handling — ideal for weddings, VIP guests and important business meetings.",
    features: ["Premium leather", "Ambient lighting", "Navigation", "Parking sensors", "Climate control", "Burmester-style audio"]
  },
  {
    id: "byd-ti7",
    name: "BYD Ti7",
    type: "Premium SUV",
    package: "premium",
    seats: 5,
    transmission: "Automatic",
    fuel: "Plug-in Hybrid",
    year: 2025,
    image: IMG + "byd-ti%207.webp",
    description:
      "A rugged yet refined plug-in hybrid SUV built for adventure. Silent electric driving in the city and long range for trips to the lakes and parks.",
    features: ["Plug-in hybrid", "All-wheel drive", "Ventilated seats", "360° camera", "Heads-up display", "Adaptive cruise"]
  },
  {
    id: "toyota-lc200",
    name: "Toyota Land Cruiser 200",
    type: "SUV 4x4",
    package: "premium",
    seats: 7,
    transmission: "Automatic",
    fuel: "Diesel",
    year: 2019,
    image: IMG + "lc200.jfif",
    description:
      "The legendary V8 Land Cruiser. Unbeatable reliability and comfort on every road in Rwanda, from city tarmac to rough rural tracks.",
    features: ["4x4 drive", "7 seats", "Leather interior", "Crawl control", "Sunroof", "Climate control"]
  },
  {
    id: "toyota-lc300",
    name: "Toyota Land Cruiser 300",
    type: "SUV 4x4",
    package: "premium",
    seats: 7,
    transmission: "Automatic",
    fuel: "Diesel",
    year: 2023,
    image: IMG + "lc%20300.jfif",
    description:
      "The newest generation Land Cruiser with a twin-turbo engine, modern tech and supreme comfort — the flagship of the CarGo fleet.",
    features: ["Twin-turbo engine", "Multi-terrain select", "Premium audio", "Heated seats", "Wireless CarPlay", "Adaptive headlights"]
  },
  {
    id: "mercedes-g-class",
    name: "Mercedes-Benz G-Class",
    type: "Luxury SUV",
    package: "premium",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    year: 2022,
    image: IMG + "Gwagen-Hero.jpg",
    description:
      "An icon on wheels. The G-Wagon turns heads everywhere it goes — the ultimate statement for weddings, celebrations and VIP events.",
    features: ["Iconic design", "Three locking diffs", "Premium leather", "Widescreen cockpit", "Massage seats", "Burmester sound"]
  },
  {
    id: "toyota-lc-pickup",
    name: "Land Cruiser 200 Pickup",
    type: "Pickup 4x4",
    package: "premium",
    seats: 5,
    transmission: "Manual",
    fuel: "Diesel",
    year: 2020,
    image: IMG + "toyota-lc200-pickup-jankel.jpg",
    description:
      "A tough double-cab pickup for heavy-duty work and off-road projects. Carries crew and cargo anywhere in the country.",
    features: ["4x4 drive", "Double cab", "Load bed", "Snorkel", "Heavy-duty suspension", "Tow hitch"]
  },
  {
    id: "toyota-coaster",
    name: "Toyota Coaster",
    type: "Minibus",
    package: "premium",
    seats: 29,
    transmission: "Manual",
    fuel: "Diesel",
    year: 2019,
    image: IMG + "toyota-coaster.jfif",
    description:
      "Comfortable transport for large groups of up to 29 passengers — conferences, tours, school trips and big family events.",
    features: ["29 seats", "Air conditioning", "Reclining seats", "PA system", "Large luggage rack", "Professional driver"]
  },
  {
    id: "safari-land-cruiser",
    name: "Safari Land Cruiser",
    type: "Safari 4x4",
    package: "premium",
    seats: 7,
    transmission: "Manual",
    fuel: "Diesel",
    year: 2018,
    image: IMG + "safari-landcruisers.jpg",
    description:
      "Purpose-built for game drives in Akagera and gorilla trekking trips to Musanze, with a pop-up roof for the best wildlife views.",
    features: ["Pop-up roof", "Window seats for all", "Snorkel", "Fridge", "Charging ports", "Long-range tank"]
  }
];

// Pick-up / destination options. Anything other than Kigali uses the "outside" rate.
const LOCATIONS = [
  { value: "kigali", label: "Kigali City", zone: "kigali" },
  { value: "musanze", label: "Musanze (Volcanoes NP)", zone: "outside" },
  { value: "rubavu", label: "Rubavu (Gisenyi)", zone: "outside" },
  { value: "huye", label: "Huye (Butare)", zone: "outside" },
  { value: "nyungwe", label: "Nyungwe Forest NP", zone: "outside" },
  { value: "akagera", label: "Akagera National Park", zone: "outside" },
  { value: "karongi", label: "Karongi (Kibuye)", zone: "outside" },
  { value: "rusizi", label: "Rusizi (Cyangugu)", zone: "outside" },
  { value: "nyagatare", label: "Nyagatare", zone: "outside" },
  { value: "muhanga", label: "Muhanga", zone: "outside" }
];

// Demo accounts — use these to log in (signups are added in localStorage)
const DUMMY_USERS = [
  { id: 1, name: "Jean Mugisha", email: "demo@cargo.rw", phone: "0788123456", password: "Demo@123" },
  { id: 2, name: "Aline Uwase", email: "aline@cargo.rw", phone: "0722456789", password: "Aline@123" }
];

const TESTIMONIALS = [
  { name: "Eric Nshimiyimana", role: "Business traveller", text: "Booked the Mercedes C200 for a week of meetings in Kigali. Spotless car, delivered to my hotel on time. Will definitely use CarGo again." },
  { name: "Claudine Mukamana", role: "Wedding planner", text: "The G-Class and two Land Cruisers made our wedding convoy unforgettable. Clear pricing in RWF and a very friendly team." },
  { name: "David Habimana", role: "Tour guide", text: "We use the Safari Land Cruisers for Akagera and Volcanoes trips. Reliable vehicles and the outside-Kigali rate is very fair." }
];

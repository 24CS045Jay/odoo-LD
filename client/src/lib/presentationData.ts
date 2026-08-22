// World Trotter presentation data: temporary local UI content until backend work begins.
export const logoUrl = "/manus-storage/world-trotter-logo_71e76a04.png";
export const heroUrl = "/manus-storage/globetrotter-hero-coast_c90d72eb.png";
export const europeUrl = "/manus-storage/globetrotter-region-europe_07b587c5.png";
export const asiaUrl = "/manus-storage/globetrotter-region-asia_85fe4439.png";

export const regions = [
  { name: "Europe", places: "Lisbon · Florence · Split", cost: "From €840", image: europeUrl, mood: "slow mornings", routes: 12 },
  { name: "Asia", places: "Bali · Kyoto · Hoi An", cost: "From €690", image: asiaUrl, mood: "deep colour", routes: 18 },
  { name: "The Americas", places: "Mexico City · Lima · Québec", cost: "From $920", image: heroUrl, mood: "big horizons", routes: 9 },
];

export const trips = [
  { id: "mediterranean", title: "A little Mediterranean escape", places: "Lisbon · Porto · Lagos", dates: "18–28 Sep 2026", duration: "10 days", budget: "€1,840", status: "Planning", image: europeUrl, accent: "sand" },
  { id: "indonesia", title: "Island days in Indonesia", places: "Bali · Nusa Penida", dates: "04–13 Nov 2026", duration: "9 days", budget: "€1,260", status: "Upcoming", image: asiaUrl, accent: "mist" },
  { id: "coast", title: "A slower way through the coast", places: "Amalfi · Sorrento · Capri", dates: "08–15 May 2027", duration: "7 days", budget: "€1,530", status: "Dreaming", image: heroUrl, accent: "cream" },
];

export const itineraryDays = [
  { day: "Day 01", date: "18 Sep", city: "Lisbon", theme: "A first long walk", items: ["Check in at Alfama", "Miradouro da Senhora do Monte", "Dinner near Baixa"], cost: "€126" },
  { day: "Day 02", date: "19 Sep", city: "Lisbon", theme: "Tiles, trams, and time", items: ["Ribeira market", "Tram 28 photo walk", "Fado after dark"], cost: "€112" },
  { day: "Day 03", date: "20 Sep", city: "Porto", theme: "Northbound by rail", items: ["Train to Porto", "Ribeira at golden hour", "Cellar tasting"], cost: "€154" },
];

export const activities = [
  { title: "Sunrise at Miradouro", city: "Lisbon", type: "Viewpoint", duration: "1.5 h", cost: "Free", image: heroUrl },
  { title: "Hand-painted tile workshop", city: "Lisbon", type: "Craft", duration: "2 h", cost: "€42", image: europeUrl },
  { title: "Temple garden breakfast", city: "Bali", type: "Food", duration: "2 h", cost: "€18", image: asiaUrl },
];

export const cities = [
  { name: "Lisbon", country: "Portugal", tag: "Atlantic light", image: europeUrl, cost: "€84/day" },
  { name: "Kyoto", country: "Japan", tag: "Quiet rituals", image: asiaUrl, cost: "€109/day" },
  { name: "Lima", country: "Peru", tag: "A taste for everywhere", image: heroUrl, cost: "€72/day" },
];

export const budgetData = [
  { label: "Stay", value: 610, color: "var(--navy)" },
  { label: "Transport", value: 430, color: "var(--gold)" },
  { label: "Food", value: 345, color: "var(--sand-dark)" },
  { label: "Activities", value: 210, color: "var(--navy-soft)" },
];

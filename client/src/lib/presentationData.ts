// World Trotter visual asset registry. The supplied official logo is never regenerated or restyled.
// All images live in client/public/assets/world-trotter so they load when the repository runs locally.
const localAsset = (filename: string) => `/assets/world-trotter/${filename}`;

export const emblemUrl = localAsset("world-trotter-emblem.png");
export const fullLogoUrl = localAsset("world-trotter-full-lockup.webp");
export const faviconUrl = localAsset("world-trotter-favicon.png");
export const logoUrl = emblemUrl;
export const heroUrl = localAsset("world-trotter-rajasthan-fort.jpeg");
export const europeUrl = localAsset("world-trotter-ladakh-himalaya.jpg");
export const asiaUrl = localAsset("world-trotter-kerala-backwaters.jpg");
export const tajUrl = localAsset("world-trotter-taj-mahal.jpeg");
export const hampiUrl = localAsset("world-trotter-hampi-temple.jpg");
export const templeUrl = localAsset("world-trotter-golden-temple.jpg");
export const regions = [
  { name: "Rajasthan", places: "Jaipur · Udaipur · Jodhpur", cost: "From ₹18,400", image: heroUrl, mood: "sandstone stories", routes: 12 },
  { name: "Himalayas & Hill Stations", places: "Leh · Spiti · Manali", cost: "From ₹22,600", image: europeUrl, mood: "high quiet", routes: 18 },
  { name: "Kerala Backwaters", places: "Alleppey · Kochi · Munnar", cost: "From ₹16,900", image: asiaUrl, mood: "slow waters", routes: 9 },
  { name: "Golden Triangle", places: "Delhi · Agra · Jaipur", cost: "From ₹20,500", image: tajUrl, mood: "marble mornings", routes: 14 },
  { name: "South Indian Temples", places: "Hampi · Mysore · Madurai", cost: "From ₹19,800", image: hampiUrl, mood: "carved time", routes: 11 },
  { name: "Punjab & Amritsar", places: "Amritsar · Anandpur · Patiala", cost: "From ₹15,700", image: templeUrl, mood: "golden welcome", routes: 7 },
];
export const trips = [
  { id: "rajasthan", title: "A golden route through Rajasthan", places: "Jaipur · Udaipur · Jodhpur", dates: "18–28 Sep 2026", duration: "10 days", budget: "₹84,000", status: "Planning", image: heroUrl, accent: "sand" },
  { id: "ladakh", title: "Himalayan days in Ladakh", places: "Leh · Nubra · Pangong", dates: "04–13 Nov 2026", duration: "9 days", budget: "₹96,000", status: "Upcoming", image: europeUrl, accent: "mist" },
  { id: "kerala", title: "Slow water in Kerala", places: "Kochi · Alleppey · Munnar", dates: "08–15 May 2027", duration: "7 days", budget: "₹63,000", status: "Dreaming", image: asiaUrl, accent: "cream" },
];
export const itineraryDays = [
  { day: "Day 01", date: "18 Sep", city: "Jaipur", theme: "A first long walk", items: ["Check in near the old city", "Hawa Mahal at dusk", "Dinner in a restored haveli"], cost: "₹6,200" },
  { day: "Day 02", date: "19 Sep", city: "Jaipur", theme: "Forts, courtyards, and time", items: ["Amber Fort at sunrise", "Block-print studio", "Rajasthani folk music"], cost: "₹7,400" },
  { day: "Day 03", date: "20 Sep", city: "Udaipur", theme: "Southbound by rail", items: ["Train to Udaipur", "Lake Pichola at golden hour", "Old city dinner"], cost: "₹7,800" },
];
export const activities = [
  { title: "Sunrise at Amber Fort", city: "Jaipur", type: "Heritage", duration: "2 h", cost: "₹500", image: heroUrl },
  { title: "Monastery morning in Ladakh", city: "Leh", type: "Culture", duration: "3 h", cost: "₹800", image: europeUrl },
  { title: "Backwater canoe at dawn", city: "Alleppey", type: "Nature", duration: "2 h", cost: "₹1,200", image: asiaUrl },
];
export const cities = [
  { name: "Jaipur", country: "India", tag: "Pink-city mornings", image: heroUrl, cost: "₹4,200/day" },
  { name: "Leh", country: "India", tag: "High quiet", image: europeUrl, cost: "₹5,400/day" },
  { name: "Alleppey", country: "India", tag: "Water and palms", image: asiaUrl, cost: "₹3,700/day" },
];
export const budgetData = [
  { label: "Stay", value: 610, color: "var(--navy)" }, { label: "Transport", value: 430, color: "var(--gold)" }, { label: "Food", value: 345, color: "var(--sand-dark)" }, { label: "Activities", value: 210, color: "var(--navy-soft)" },
];

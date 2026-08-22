import bcrypt from "bcryptjs";
import { connectMongo, disconnectMongo } from "../config/db";
import { Activity } from "../models/Activity.model";
import { City } from "../models/City.model";
import { CommunityPost } from "../models/CommunityPost.model";
import { Comment } from "../models/Comment.model";
import { Expense } from "../models/Expense.model";
import { ItineraryActivity } from "../models/ItineraryActivity.model";
import { Like } from "../models/Like.model";
import { SharedTrip } from "../models/SharedTrip.model";
import { Trip } from "../models/Trip.model";
import { TripSection } from "../models/TripSection.model";
import { User } from "../models/User.model";

const cities = [
  ["Lisbon", "Portugal", "Europe"], ["Porto", "Portugal", "Europe"], ["Paris", "France", "Europe"], ["London", "United Kingdom", "Europe"], ["Rome", "Italy", "Europe"], ["Barcelona", "Spain", "Europe"], ["Amsterdam", "Netherlands", "Europe"], ["Prague", "Czechia", "Europe"], ["Zurich", "Switzerland", "Europe"], ["Istanbul", "Türkiye", "Europe"],
  ["Tokyo", "Japan", "Asia"], ["Kyoto", "Japan", "Asia"], ["Bali", "Indonesia", "Asia"], ["Bangkok", "Thailand", "Asia"], ["Singapore", "Singapore", "Asia"], ["Dubai", "United Arab Emirates", "Asia"], ["Mumbai", "India", "Asia"], ["Delhi", "India", "Asia"], ["Jaipur", "India", "Asia"], ["Goa", "India", "Asia"],
  ["New York", "United States", "Americas"], ["Mexico City", "Mexico", "Americas"], ["Lima", "Peru", "Americas"], ["Quebec City", "Canada", "Americas"], ["Buenos Aires", "Argentina", "Americas"], ["Sydney", "Australia", "Oceania"], ["Melbourne", "Australia", "Oceania"], ["Cape Town", "South Africa", "Africa"], ["Marrakesh", "Morocco", "Africa"], ["Cairo", "Egypt", "Africa"],
] as const;
const categories = ["Food", "Walk", "Culture", "Nature"];

async function seed() {
  await connectMongo();
  if (process.env.SEED_RESET === "true") {
    await Promise.all([Activity.deleteMany({}), City.deleteMany({}), ItineraryActivity.deleteMany({}), TripSection.deleteMany({}), Expense.deleteMany({}), SharedTrip.deleteMany({}), Trip.deleteMany({}), CommunityPost.deleteMany({}), Comment.deleteMany({}), Like.deleteMany({})]);
  }
  const existingDemo = await User.findOne({ email: "demo@worldtrotter.app" });
  if (existingDemo) {
    const priorTrips = await Trip.find({ owner: existingDemo.id });
    const priorSections = await TripSection.find({ trip: { $in: priorTrips.map(trip => trip.id) } });
    await Promise.all([ItineraryActivity.deleteMany({ tripSection: { $in: priorSections.map(section => section.id) } }), TripSection.deleteMany({ trip: { $in: priorTrips.map(trip => trip.id) } }), Expense.deleteMany({ trip: { $in: priorTrips.map(trip => trip.id) } }), SharedTrip.deleteMany({ trip: { $in: priorTrips.map(trip => trip.id) } }), Trip.deleteMany({ owner: existingDemo.id }), existingDemo.deleteOne()]);
  }
  await User.deleteOne({ email: "admin@worldtrotter.app" });
  const passwordHash = await bcrypt.hash("WorldTrotterDemo2026", 12);
  const [demo, admin] = await User.create([{ firstName: "Alex", lastName: "Morgan", email: "demo@worldtrotter.app", passwordHash, city: "Bengaluru", country: "India" }, { firstName: "World", lastName: "Trotter Admin", email: "admin@worldtrotter.app", passwordHash, role: "admin", city: "Lisbon", country: "Portugal" }]);
  const cityDocs = await Promise.all(cities.map(([name, country, region], index) => City.findOneAndUpdate({ name, country }, { name, country, region, tag: `${region} discovery`, costIndex: 55 + index, popularityScore: 100 - index }, { new: true, upsert: true, setDefaultsOnInsert: true })));
  await Activity.deleteMany({ description: /^A practical .* option to save while planning time/ });
  await Activity.insertMany(cityDocs.flatMap((city, cityIndex) => categories.map((category, categoryIndex) => ({ name: `${city!.name} ${category.toLowerCase()} experience`, city: city!.id, category, cost: 10 + ((cityIndex + categoryIndex) % 9) * 8, duration: `${1 + (categoryIndex % 3)} h`, description: `A practical ${category.toLowerCase()} option to save while planning time in ${city!.name}.`, popularityScore: 100 - cityIndex - categoryIndex }))));
  const demoTrips = Array.from({ length: 20 }, (_, index) => {
    const city = cityDocs[index % cityDocs.length];
    const month = (index % 10) + 1;
    return { owner: demo.id, title: `${city.name} notes ${String(index + 1).padStart(2, "0")}`, description: `A planned route through ${city.name}.`, destinations: [{ city: city.name, country: city.country, cityRef: city.id }], startDate: new Date(Date.UTC(2026, month, 3)), endDate: new Date(Date.UTC(2026, month, 7 + (index % 3))), status: index % 3 === 0 ? "planning" : index % 3 === 1 ? "upcoming" : "completed", budget: 750 + index * 55, currency: "EUR" };
  });
  const trips = await Trip.insertMany(demoTrips);
  for (const trip of trips.slice(0, 5)) {
    const section = await TripSection.create({ trip: trip.id, city: trip.destinations[0].city, title: "Arrival and first walk", startDate: trip.startDate, endDate: trip.endDate, type: "sightseeing", budget: 180, orderIndex: 0 });
    await ItineraryActivity.create({ tripSection: section.id, title: "A considered local stop", category: "Culture", time: "10:00", duration: "2 h", cost: 32, orderIndex: 0 });
    await Expense.create({ trip: trip.id, tripSection: section.id, title: "First stay", category: "stay", amount: 145, date: trip.startDate });
  }
  await SharedTrip.findOneAndUpdate({ trip: trips[0].id }, { trip: trips[0].id, shareToken: "mediterranean", isPublic: true }, { upsert: true });
  console.log(`Seeded ${cityDocs.length} cities, ${cityDocs.length * categories.length} activities, ${trips.length} trips, and demo/admin accounts.`);
  console.log("Community posts, comments, and likes are intentionally not fabricated; create them through the live app instead.");
  await disconnectMongo();
}

seed().catch(async error => { console.error(error); await disconnectMongo(); process.exit(1); });

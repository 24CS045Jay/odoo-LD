import { connectMongo, disconnectMongo } from "../config/db";
import { Notification } from "../models/Notification.model";
import { User } from "../models/User.model";

async function seedNotifications() {
  await connectMongo();

  const demo = await User.findOne({ email: "demo@worldtrotter.app" });
  if (!demo) {
    console.log("Demo user not found — run pnpm seed first.");
    await disconnectMongo();
    return;
  }

  await Notification.deleteMany({ userId: demo._id });

  await Notification.insertMany([
    { userId: demo._id, title: "Trip to Lisbon starts in 3 days!", body: "Make sure your itinerary is ready and documents are packed.", type: "reminder", link: "/trips", read: false },
    { userId: demo._id, title: "Community post liked", body: "Someone liked your 'Hidden gems of Porto' post.", type: "community", link: "/community", read: false },
    { userId: demo._id, title: "Budget alert — Porto trip", body: "You've reached 80% of your budget for the Porto trip.", type: "trip", link: "/trips", read: false },
    { userId: demo._id, title: "Welcome to World Trotter!", body: "Explore cities, plan trips, and share your adventures.", type: "system", link: "/dashboard", read: true },
    { userId: demo._id, title: "New city added: Jaipur", body: "Jaipur, India has been added to the discovery catalog.", type: "system", link: "/cities", read: true },
  ]);

  console.log("✓ 5 demo notifications seeded for demo@worldtrotter.app");
  await disconnectMongo();
}

seedNotifications().catch((e) => { console.error(e); process.exit(1); });

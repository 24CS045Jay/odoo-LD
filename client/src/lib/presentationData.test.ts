// World Trotter verification: frontend presentation data supports the complete route flow.
import { describe, expect, it } from "vitest";
import { activities, budgetData, cities, itineraryDays, regions, trips } from "./presentationData";

describe("World Trotter presentation data", () => {
  it("provides destination content for all discovery routes", () => {
    expect(regions.length).toBeGreaterThanOrEqual(3);
    expect(cities.length).toBeGreaterThanOrEqual(3);
    expect(activities.length).toBeGreaterThanOrEqual(3);
  });

  it("provides an end-to-end planning route with trip, itinerary, and budget content", () => {
    expect(trips[0]?.id).toBe("rajasthan");
    expect(itineraryDays.map(day => day.city)).toContain("Jaipur");
    expect(budgetData.reduce((sum, item) => sum + item.value, 0)).toBe(1595);
  });
});

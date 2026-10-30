// Demo listings. Replace with an API / database later.
const A = ["Parking", "Lift", "Power backup", "Security", "Garden", "Gym"];
const mk = (id, mode, title, type, city, area, price, beds, baths, sqft, hue, amen, desc, age) => ({
  id, mode, title, type, city, area, price, beds, baths, sqft, hue,
  amenities: amen.map((i) => A[i]), desc, age,
});

export const listings = [
  mk(1, "buy", "Sunrise Heights 3BHK", "Apartment", "Kota", "Talwandi", 6800000, 3, 3, 1450, 200, [0, 1, 2, 3], "Bright corner flat on the 6th floor with a balcony facing the park. Close to coaching hubs and the market.", 2),
  mk(2, "buy", "Green Valley Villa", "Villa", "Jaipur", "Vaishali Nagar", 21500000, 4, 4, 3200, 150, [0, 2, 3, 4, 5], "Independent villa with a private lawn, modular kitchen and a covered two-car parking.", 5),
  mk(3, "rent", "Furnished 2BHK near Rajiv Gandhi Nagar", "Apartment", "Kota", "Rajiv Gandhi Nagar", 18000, 2, 2, 1050, 30, [1, 2, 3], "Fully furnished flat with AC in both rooms. Ideal for working professionals and small families.", 1),
  mk(4, "buy", "Lakeview Residency 2BHK", "Apartment", "Udaipur", "Fatehpura", 7400000, 2, 2, 1180, 215, [0, 1, 3, 5], "Peaceful society near Fateh Sagar with clubhouse access and evening walking track.", 3),
  mk(5, "buy", "Residential Plot 200 sq yd", "Plot", "Kota", "Kunhadi", 4200000, 0, 0, 1800, 95, [3], "East-facing corner plot in a developed colony with 40 ft road and ready water and electricity lines.", 0),
  mk(6, "rent", "Studio Apartment, Mansarovar", "Apartment", "Jaipur", "Mansarovar", 12500, 1, 1, 520, 275, [1, 2], "Compact studio with attached kitchen, great for students and single professionals.", 2),
  mk(7, "buy", "Royal Enclave Duplex", "House", "Jodhpur", "Pal Road", 11800000, 4, 3, 2400, 20, [0, 2, 3, 4], "Spacious duplex house with terrace garden, puja room and a separate servant room.", 6),
  mk(8, "rent", "Spacious 3BHK Independent Floor", "House", "Kota", "Vigyan Nagar", 24000, 3, 3, 1600, 175, [0, 3, 4], "Ground floor with parking and a small front lawn. Walking distance to schools.", 4),
  mk(9, "buy", "Skyline Towers 4BHK Penthouse", "Apartment", "Mumbai", "Andheri West", 58000000, 4, 4, 2800, 245, [0, 1, 2, 3, 5], "Top-floor penthouse with a wraparound terrace, city views and two reserved parking slots.", 1),
  mk(10, "rent", "Garden-facing 2BHK", "Apartment", "Udaipur", "Hiran Magri", 16500, 2, 2, 1000, 120, [1, 3, 4], "Quiet 2BHK facing the society garden, with wooden flooring and modular wardrobes.", 3),
  mk(11, "buy", "Farm Plot near Ring Road", "Plot", "Jaipur", "Ajmer Road", 9500000, 0, 0, 4500, 65, [3], "Large plot suited for a farmhouse or investment, with a fenced boundary and clear title.", 0),
  mk(12, "buy", "Heritage Style Villa", "Villa", "Jodhpur", "Ratanada", 32000000, 5, 5, 4200, 340, [0, 2, 3, 4, 5], "Sandstone-finished villa with jharokha balconies, a courtyard and a private home theatre room.", 8),
];

export const cities = ["All cities", ...new Set(listings.map((l) => l.city))];
export const budgets = {
  buy: [["Any budget", 0, Infinity], ["Under ₹50 L", 0, 5e6], ["₹50 L – 1 Cr", 5e6, 1e7], ["₹1 – 3 Cr", 1e7, 3e7], ["Above ₹3 Cr", 3e7, Infinity]],
  rent: [["Any budget", 0, Infinity], ["Under ₹15k", 0, 15000], ["₹15k – 20k", 15000, 20000], ["Above ₹20k", 20000, Infinity]],
};

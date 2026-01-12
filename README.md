# 🏕️ Camps Database 2025 | دليل بيوت المعسكرات

A responsive, offline-first web database for browsing and filtering camp venues organized by the 2025 Camps Committee (كنيسة العذراء ومارجرجس بمدينتي).

## 🌟 Features

- **Offline Capable**: Runs entirely in the browser. Just open `index.html`.
- **Smart Qualification System**: Venues auto-categorized as ✅ Qualified, ❓ Follow-up, or ❌ Excluded
- **Configurable Criteria**: Toggle filtering for camping ground, kitchen, halls, pergolas
- **Fuzzy Search**: Search in Arabic, English, or Arabizi (Franco-Arab)
- **Image Galleries**: Carousel with fullscreen lightbox viewer
- **Responsive Design**: Mobile, tablet, and desktop optimized

## 🚀 How to Use

1. Download the project folder
2. Open `index.html` in any modern browser
3. Use tabs to switch between venue categories
4. Configure criteria via ⚙️ Settings panel

## 📂 Project Structure

```
camps-database-2025/
├── css/
│   └── style.css      # All styling and responsive rules
├── js/
│   ├── app.js         # Core logic (rendering, filtering, search)
│   ├── data.js        # Venue database (62 venues)
│   └── schema.js      # Lookup tables and normalization helpers
├── images/            # Venue images organized by ID
│   └── {id}/          # Images for venue with that ID
├── index.html         # Main entry point
└── README.md          # This file
```

## 📊 Data Schema (v2.0)

Each venue in `data.js` follows this normalized structure:

```javascript
{
  "id": "1",
  "name": "Venue Name",
  "location": "City/Area",
  "statusCode": "confirmed",          // Status lookup code
  "phones": [
    { "number": "01xxxxxxxxx", "name": "Contact Name" }
  ],
  "links": [
    { "url": "https://...", "type": "google_maps" }  // facebook, website
  ],
  "pricing": {
    "camping": { "amount": 100, "period": "night", "includes": [] }
  },
  "capacity": {
    "camping": 200,                   // Number of people
    "beds": 50                        // Overnight beds
  },
  "amenities": {                      // 0=no, 1=yes, 2+=count
    "campground": 1,
    "kitchen": 1,
    "halls": 2,                       // 2 halls
    "pools": 0
  },
  "notes": "Warning or info text",
  "details": "Extended description",
  "images": ["images/1/photo.jpg"],
  "availability": { "2026-07-02": null }
}
```

## 🔧 Editing Data

To add or modify venues, edit `js/data.js`. Key amenity values:

| Amenity | Key | Value |
|---------|-----|-------|
| Camping Ground | `campground` | 0/1 |
| Rooms/Overnight | `rooms` | 0/1 |
| Kitchen | `kitchen` | 0/1 |
| Halls | `halls` | 0/1/2+ (count) |
| Pergolas | `pergolas` | 0/1 |
| Swimming Pool | `pools` | 0/1 |
| Sports Fields | `fields` | 0/1 |
| Canteen | `canteen` | 0/1 |

## 📈 Database Stats

- **Total Venues**: 62
- **Qualified**: ~5 venues meeting all criteria
- **Follow-up**: ~39 venues needing verification
- **Excluded**: ~18 venues not suitable
- **Last Updated**: January 2026

---
*لجنة معسكرات ٢٠٢٥ ⛺*

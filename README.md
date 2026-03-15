# 🏕️ Camp Venues Database — دليل بيوت المعسكرات

A responsive, offline-first web application for browsing, filtering, and comparing camp venues. Built for the 2025 Camps Committee of the Virgin Mary & St. George Church, Madinaty (كنيسة العذراء ومارجرجس بمدينتي).

---

## ✨ Features

| Feature | Details |
|---------|---------|
| **Zero dependencies** | Runs entirely in the browser — no server required |
| **Fuzzy search** | Search in Arabic, English, or Arabizi (Franco-Arab transliteration) |
| **Smart tabs** | Shortlisted venues separated from the full listing |
| **Image carousels** | Per-venue photo galleries with fullscreen lightbox |
| **Structured data** | Normalised schema for pricing, capacity, amenities, availability, and contact history |
| **Responsive layout** | JS masonry grid — 1 to 4 columns depending on screen width |
| **Scroll persistence** | Returns to last scroll position on re-open (localStorage) |

---

## 📂 Project Structure

```
camps-database-2025/
├── index.html          # Single-page entry point
├── css/
│   └── style.css       # Full stylesheet — variables, layout, cards, modals
├── js/
│   ├── schema.js       # Lookup tables, display helpers, camp weekends
│   ├── data.js         # Venue records (62 venues, normalised schema)
│   └── app.js          # Rendering, search, carousel, modal, scroll logic
├── images/
│   └── {venue_id}/     # Photos for each venue, referenced by data.js
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Quick Start

No build step required.

```bash
# Clone
git clone https://github.com/andrew-abdelmalak/camps-database-2025.git
cd camps-database-2025

# Open in browser
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

Or simply double-click `index.html` in your file manager.

---

## 📊 Data Schema

Each venue in `js/data.js` follows this normalised structure:

```javascript
{
  "id": "1",
  "name": "Venue Name (Arabic)",
  "location": "City / Area",
  "statusCode": "contacted" | "no_camping" | "no_response" | ...,
  "phones": [{ "number": "01xxxxxxxxx", "name": "Contact Name" }],
  "links": [{ "url": "https://...", "type": "google_maps" | "facebook" | "website" | ... }],
  "lastContact": { "date": "YYYY-MM-DD", "outcome": "answered" | "no_answer" | ... },
  "pricing": {
    "camping": { "amount": 100, "period": "night", "includes": [] },
    "rooms":   { "min": 350, "max": 500, "period": "night", "includes": ["meals"] }
  },
  "capacity": { "camping": 200, "beds": 50 },
  "amenities": {
    "campground": 1, "rooms": 1, "kitchen": 1, "bathrooms": 1,
    "church": 0, "halls": 2, "pergolas": 1, "pools": 0,
    "fields": 1, "ac": 0, "cooler": 0, "playground": 0, "canteen": 0, "sea": 0
  },
  "notes": "Optional warning or info text",
  "details": "Extended free-text description",
  "images": ["images/1/photo.jpg"],
  "availability": { "2026-07-02": null, ... }
}
```

Amenity values: `0` = absent, `1` = present, `2+` = count (e.g. number of halls).

---

## 🔧 Adding or Editing Venues

Edit `js/data.js` directly. Key rules:
- `id` must be unique and match the folder name under `images/`.
- `statusCode` must be a key defined in `js/schema.js → STATUS_CODES`, or `null`.
- Image paths must be relative, e.g. `"images/5/photo.jpg"`.
- Add photos to `images/{id}/` and reference them in the `images` array.

Available `statusCode` values:

| Code | Meaning |
|------|---------|
| `contacted` | Successfully contacted |
| `no_camping` | No camping allowed |
| `no_camp_ground` | No camping ground |
| `ground_unsuitable` | Ground not suitable |
| `small_space` | Space too small |
| `no_venue` | Venue does not exist |
| `not_accepting_scouts` | Not accepting scouts |
| `no_response` | Not responding |
| `unavailable` | Unavailable |
| `under_construction` | Under construction |
| `null` | Status unknown / pending |

---

## 📈 Database Stats

- **Total Venues:** 62
- **Shortlisted (Favourites):** 4 venues (IDs: 17, 42, 25, 26)
- **Last Updated:** March 2026

---

## 👤 Author

**Andrew Abdelmalak**
Camps Committee, Virgin Mary & St. George Church, Madinaty — 2025

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

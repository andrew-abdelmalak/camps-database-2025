# 🏕️ Camps Database 2025 | دليل بيوت المعسكرات

A responsive, offline-first web database for browsing and filtering camp venues organized by the 2025 Camps Committee.

## 🌟 Features

-   **Offline Capable**: Runs entirely in the browser. Just download and open `index.html`.
-   **Smart Filtering**:
    -   Filter by **Location** (e.g., Al-Obour, Wadi El-Natroun, Ras Sudr).
    -   Search by name or details.
-   **Gallery Mode**: Each venue features an image carousel and a fullscreen lightbox gallery.
-   **Responsive Design**: Works perfectly on mobile, tablet, and desktop.
-   **Contact Links**: Direct dialing and location links.

## 🚀 How to Use

1.  Download the repository or the project folder.
2.  Double-click `index.html` to open it in your web browser.
3.  That's it! No servers or installation required.

## 🛠️ Technology Stack

-   **HTML5 & CSS3**: Custom responsive styling with Flexbox/Grid.
-   **Vanilla JavaScript**: Efficient DOM manipulation with no external dependencies.
-   **JSON Data Structure**: Data is separated in `js/data.js` for easy updates.

## 📂 Project Structure

```
camps-database-2025/
├── css/
│   └── style.css       # All styling and responsive rules
├── js/
│   ├── app.js          # Core logic (rendering, filtering, interactions)
│   └── data.js         # Venue data database
├── assets/             # Images and static assets
└── index.html          # Main entry point
```

## 📝 Editing Data

To add or modify venues, open `js/data.js` in any text editor. The data is stored as a simple array of objects:

```javascript
{
    id: 1,
    name: "Venue Name",
    location: "City/Area",
    phones: [{ number: "01xxxxxxxxx", label: "Contact Name" }],
    // ...
}
```

---
*Created for the 2025 Camps Committee.*

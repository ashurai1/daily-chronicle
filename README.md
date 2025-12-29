# The Daily Chronicle 🗞️

A premium, digital newspaper-style website built with strict **HTML, CSS, and Vanilla JavaScript**.
Designed to mimic the feel of a high-end editorial publication with paper textures, serif typography, and calm animations.

## 📰 Project Overview
This project focuses on **Layout & Typography** rather than flashy effects. It uses CSS Grid to create a responsive, column-based newspaper layout that adapts from mobile (single column) to desktop (multi-column).

### Key Features
- **Editorial Design**: Custom serif font pairing (Playfair Display + Lora) and paper-like color palette.
- **Responsive Grid**:
  - 📱 Mobile: Single column vertical flow.
  - 💻 Tablet: Dual column.
  - 🖥️ Desktop: Triple column with featured article span.
- **Real-Time Data**: Fetches live headlines from NewsAPI.
- **Smooth Animations**: Staggered reveal of articles, smooth page transitions, and hover micro-interactions.
- **Dark Mode**: Toggleable "Night Reading" mode that inverts the paper/ink colors.

## 🛠️ Setup Instructions

### 1. Get an API Key
To see real news, you need a free API key:
1. Register at [NewsAPI.org](https://newsapi.org/).
2. Copy your key.

### 2. Add Key to Project
1. Open `js/app.js`.
2. Find the constant at the top:
   ```javascript
   const API_KEY = "YOUR_KEY_HERE";
   ```
3. Paste the key.

### 3. Run Locally
**Important:** You **must** use a local server (like Live Server in VS Code) for the API to work. Opening `index.html` directly as a file often blocks API requests due to CORS security policies.

1. Open visual studio code.
2. Install "Live Server" extension.
3. Right click `index.html` -> "Open with Live Server".

## 📁 Structure
```
newspaper-site/
├── index.html       # Semantic layout
├── css/
│   └── style.css    # Typography, Grid, Variables
└── js/
    └── app.js       # Fetch logic, Date handling, State
```

## ⚠️ Notes on Free API
- The free NewsAPI plan is rate-limited (100 requests/day).
- It only works on `localhost`. Use the "Developer" plan for production.
- If you see an error, check the Console (F12) for details.

---
© 2025 Ashwani Rai. Educational Project.

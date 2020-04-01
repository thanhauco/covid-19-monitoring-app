# 🦠 Pandemic Pulse - COVID-19 Monitoring Dashboard

A real-time COVID-19 global monitoring dashboard built during the early days of the pandemic (February-March 2020). Features stunning glassmorphism design, interactive visualizations, and time-travel capabilities to replay the spread of the virus.

![Dashboard Preview](https://img.shields.io/badge/Status-Active-success) ![Version](https://img.shields.io/badge/Version-1.0-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🗺️ Interactive World Map

- **Choropleth Visualization**: Countries colored by infection intensity using D3.js
- **Hover Tooltips**: See country name and case count on hover
- **Fullscreen Mode**: Press `F` or click ⛶ for immersive view

### 📊 Real-Time Statistics

- **Global Totals**: Cases, Active, Recovered, Deaths
- **Animated Counters**: Smooth number transitions
- **Dynamic Calculations**: Active cases = Cases - Deaths - Recovered

### ⏱️ Time-Travel Engine

- **Timeline Slider**: Scrub through pandemic timeline
- **Auto-Play**: Watch the spread unfold automatically
- **Keyboard Controls**: Space to play/pause, arrows to navigate

### 📈 Charts & Analytics

- **Spread Trends**: Line chart of global case growth
- **Recovery Rate**: Track recoveries over time
- **Top 5 Countries**: Horizontal bar chart of most affected regions

### 🎨 Premium Design

- **Glassmorphism UI**: Frosted glass panels with backdrop blur
- **3D Perspective**: Subtle tilt effect on the dashboard
- **Virus Particles**: Ambient animated background
- **Dark/Light Theme**: Toggle with persistence

### 🔍 Advanced Features

- **Country Search**: Filter countries instantly
- **Country Modal**: Click any country for detailed stats and trend chart
- **Animated Splash**: Dramatic intro sequence
- **Breaking News Ticker**: Historical headlines from 2020

## ⌨️ Keyboard Shortcuts

| Key      | Action                        |
| -------- | ----------------------------- |
| `Space`  | Play/Pause timeline           |
| `←`      | Previous date                 |
| `→`      | Next date                     |
| `F`      | Toggle fullscreen map         |
| `Escape` | Close modal / Exit fullscreen |

## 🚀 Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/thanhauco/covid-19-monitoring-app.git
   cd covid-19-monitoring-app
   ```

2. **Open in browser**

   ```bash
   open index.html
   ```

   Or use a local server:

   ```bash
   npx serve .
   ```

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Visualization**: D3.js v6, Chart.js, TopoJSON
- **Design**: Custom Glassmorphism CSS, CSS Variables
- **Fonts**: Google Fonts (Outfit)

## 📁 Project Structure

```
covid-19-monitoring-app/
├── index.html              # Main application
├── css/
│   └── styles.css          # Design system & animations
├── js/
│   ├── app.js              # Core application logic
│   ├── particles.js        # Ambient particle system
│   └── theme.js            # Dark/Light theme toggle
├── data/
│   └── covid-data.json     # Historical COVID-19 data
├── implementation_plan.md  # Development roadmap
└── README.md
```

## 📊 Data Coverage

The dashboard includes data from **January 22, 2020** to **March 31, 2020**, covering:

| Country    | Peak Cases (Mar 31) |
| ---------- | ------------------- |
| 🇺🇸 USA     | 188,172             |
| 🇮🇹 Italy   | 105,792             |
| 🇪🇸 Spain   | 95,923              |
| 🇨🇳 China   | 82,279              |
| 🇩🇪 Germany | 71,808              |

## 🔄 Development History

This project was developed with a realistic Git workflow:

- **12+ Pull Requests** merged into master
- **Feature branches** for major components
- **Bugfix branches** for issue resolution
- **Conventional commits** for clear history

View the full history:

```bash
git log --graph --oneline --all
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Thanh Vu**

- GitHub: [@thanhauco](https://github.com/thanhauco)
- Email: thanhauco@gmail.com

---

<p align="center">
  <em>Built with ❤️ during the COVID-19 pandemic to help visualize and understand the global spread.</em>
</p>

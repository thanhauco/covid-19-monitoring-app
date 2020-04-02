// Mock data loader
async function loadData() {
  console.log("Fetching covid data...");
  try {
    const response = await fetch("data/covid-data.json");
    return await response.json();
  } catch (error) {
    console.error("Failed to load data:", error);
    return [];
  }
}

// Format numbers
const formatNum = (num) => new Intl.NumberFormat("en-US").format(num);

// Animate counter
function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = formatNum(Math.floor(progress * (end - start) + start));
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Chart Initialization
let trendChart1, trendChart2, regionalChart;

function initCharts() {
  const ctx1 = document.getElementById("trendBox1").getContext("2d");
  const ctx2 = document.getElementById("trendBox2").getContext("2d");
  const ctx3 = document.getElementById("regionalChart").getContext("2d");

  // Common Chart Options
  const commonOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    elements: {
      line: { tension: 0.4 },
      point: { radius: 0 },
    },
  };

  trendChart1 = new Chart(ctx1, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Cases",
          data: [],
          borderColor: "#ef4444",
          borderWidth: 2,
          fill: true,
          backgroundColor: "rgba(239, 68, 68, 0.1)",
        },
      ],
    },
    options: commonOptions,
  });

  trendChart2 = new Chart(ctx2, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Recovered",
          data: [],
          borderColor: "#22c55e",
          borderWidth: 2,
          fill: true,
          backgroundColor: "rgba(34, 197, 94, 0.1)",
        },
      ],
    },
    options: commonOptions,
  });

  // Regional Bar Chart
  regionalChart = new Chart(ctx3, {
    type: "bar",
    data: {
      labels: [],
      datasets: [{
        label: "Cases",
        data: [],
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(234, 179, 8, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(56, 189, 248, 0.8)",
          "rgba(168, 85, 247, 0.8)"
        ],
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false },
        y: { 
          ticks: { color: '#94a3b8', font: { size: 10 } },
          grid: { display: false }
        }
      }
    }
  });
}

function updateRegionalChart(entry) {
  if (!regionalChart || !entry) return;
  
  const top5 = [...entry.countries]
    .sort((a, b) => b.cases - a.cases)
    .slice(0, 5);
  
  regionalChart.data.labels = top5.map(c => c.name);
  regionalChart.data.datasets[0].data = top5.map(c => c.cases);
  regionalChart.update();
}

// Map variables
let svg, projection, path, countries;
const colorScale = d3.scaleSequential(d3.interpolateYlOrRd).domain([0, 1000]);

async function initMap(data, currentIndex) {
  const container = document.getElementById("world-map");
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Load World Topology
  const world = await d3.json(
    "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
  );

  svg = d3
    .select("#world-map")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`);

  projection = d3
    .geoMercator()
    .scale(width / 6.5)
    .translate([width / 2, height / 1.5]);

  path = d3.geoPath().projection(projection);

  countries = svg
    .append("g")
    .selectAll("path")
    .data(topojson.feature(world, world.objects.countries).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", "rgba(255,255,255,0.05)")
    .attr("stroke", "rgba(255,255,255,0.1)")
    .attr("class", "country")
    .attr("id", (d) => `country-${d.id}`);
  
  const tooltip = d3.select("#map-tooltip");

  // Add hover effect
  countries.on("mouseover", function(event, d) {
    d3.select(this).style("stroke", "var(--accent-blue)").style("stroke-width", "1.5");
    
    // Show tooltip
    const entry = data[currentIndex];
    const cData = entry.countries.find(c => c.id === d.id);
    const count = cData ? formatNum(cData.cases) : "0";
    
    tooltip.style("opacity", 1)
           .html(`<span class="t-name">${d.properties.name}</span><span class="t-val">Cases: ${count}</span>`);
  }).on("mousemove", function(event) {
    const [x, y] = d3.pointer(event);
    tooltip.style("left", (x + 10) + "px")
           .style("top", (y - 40) + "px");
  }).on("mouseout", function(event, d) {
    d3.select(this).style("stroke", "rgba(255,255,255,0.1)").style("stroke-width", "1");
    tooltip.style("opacity", 0);
  });
}

function updateMap(entry) {
  if (!countries || !entry) return;

  const countryDataMap = new Map();
  entry.countries.forEach(c => countryDataMap.set(c.id, c.cases));

  // Determine domain based on max cases in entry for dynamic scaling
  const maxCases = d3.max(entry.countries, d => d.cases) || 1000;
  colorScale.domain([0, maxCases]);

  countries.transition()
    .duration(500)
    .style("fill", d => {
      const cases = countryDataMap.get(d.id) || 0;
      return cases > 0 ? colorScale(cases) : "rgba(255,255,255,0.05)";
    });
}

// Main App Logic
document.addEventListener("DOMContentLoaded", async () => {
  initCharts();

  const data = await loadData();
  let currentIndex = 0;
  
  await initMap(data, currentIndex);

  // UI Elements
  const dateDisplay = document.getElementById("current-date");
  const casesEl = document.getElementById("total-cases");
  const deathsEl = document.getElementById("deaths");
  const recoveredEl = document.getElementById("recovered-cases");
  const slider = document.getElementById("timeline-slider");
  const playBtn = document.getElementById("play-pause");
  const countryList = document.getElementById("country-list");
  const searchInput = document.getElementById("country-search");

  let isPlaying = false;
  let autoplayInterval = null;

  function renderCountryList(filter = "") {
    const entry = data[currentIndex];
    if (!entry) return;

    const filteredCountries = entry.countries.filter((c) =>
      c.name.toLowerCase().includes(filter.toLowerCase())
    );

    countryList.innerHTML = filteredCountries
      .map(
        (c) => `
      <li class="country-item">
        <span class="country-name">${c.name}</span>
        <span class="country-stat">${formatNum(c.cases)}</span>
      </li>
    `
      )
      .join("");
  }

  function togglePlay() {
    isPlaying = !isPlaying;
    playBtn.innerText = isPlaying ? "⏸" : "▶";

    if (isPlaying) {
      const speedSelector = document.getElementById("speed-selector");
      const speed = parseInt(speedSelector.value) || 1000;
      
      autoplayInterval = setInterval(() => {
        if (currentIndex < data.length - 1) {
          currentIndex++;
          slider.value = currentIndex;
          updateDashboard(currentIndex);
        } else {
          togglePlay(); // Stop at the end
        }
      }, speed);
    } else {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  function updateDashboard(index) {
    if (!data || data.length === 0 || index >= data.length) return;
    const entry = data[index];
    if (!entry) return;

    dateDisplay.innerText = new Date(entry.date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    animateValue(
      casesEl,
      parseInt(casesEl.innerText.replace(/,/g, "")) || 0,
      entry.global.cases,
      500
    );
    animateValue(
      deathsEl,
      parseInt(deathsEl.innerText.replace(/,/g, "")) || 0,
      entry.global.deaths,
      500
    );
    animateValue(
      recoveredEl,
      parseInt(recoveredEl.innerText.replace(/,/g, "")) || 0,
      entry.global.recovered,
      500
    );
    
    // Calculate and display active cases
    const activeEl = document.getElementById("active-cases");
    const activeCases = entry.global.cases - entry.global.deaths - entry.global.recovered;
    animateValue(
      activeEl,
      parseInt(activeEl.innerText.replace(/,/g, "")) || 0,
      activeCases,
      500
    );

    // Update Charts
    const history = data.slice(0, index + 1);
    trendChart1.data.labels = history.map((d) => d.date);
    trendChart1.data.datasets[0].data = history.map((d) => d.global.cases);
    trendChart1.update();

    trendChart2.data.labels = history.map((d) => d.date);
    trendChart2.data.datasets[0].data = history.map((d) => d.global.recovered);
    trendChart2.update();

    renderCountryList(searchInput.value);
    updateMap(entry);
    updateRegionalChart(entry);
  }

  // Event Listeners
  playBtn.addEventListener("click", togglePlay);

  searchInput.addEventListener("input", (e) => {
    renderCountryList(e.target.value);
  });

  // Setup Slider
  slider.max = data.length - 1;
  slider.addEventListener("input", (e) => {
    currentIndex = parseInt(e.target.value);
    updateDashboard(currentIndex);
  });

  // === NEW FEATURES ===
  
  // Modal Elements
  const modal = document.getElementById("country-modal");
  const modalClose = document.querySelector(".modal-close");
  const modalCountryName = document.getElementById("modal-country-name");
  const modalCases = document.getElementById("modal-cases");
  const modalRecovered = document.getElementById("modal-recovered");
  const modalDeaths = document.getElementById("modal-deaths");
  let modalChart = null;

  function openModal(countryId) {
    const entry = data[currentIndex];
    const country = entry.countries.find(c => c.id === countryId);
    if (!country) return;

    modalCountryName.textContent = country.name;
    modalCases.textContent = formatNum(country.cases);
    modalRecovered.textContent = formatNum(country.recovered || 0);
    modalDeaths.textContent = formatNum(country.deaths || 0);

    // Initialize or update modal chart
    const ctx = document.getElementById("modal-trend-chart").getContext("2d");
    const countryHistory = data.map(d => {
      const c = d.countries.find(x => x.id === countryId);
      return c ? c.cases : 0;
    });
    
    if (modalChart) {
      modalChart.data.labels = data.map(d => d.date);
      modalChart.data.datasets[0].data = countryHistory;
      modalChart.update();
    } else {
      modalChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: data.map(d => d.date),
          datasets: [{
            label: "Cases",
            data: countryHistory,
            borderColor: "#ef4444",
            borderWidth: 2,
            fill: true,
            backgroundColor: "rgba(239, 68, 68, 0.1)"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { display: false }, y: { display: false } }
        }
      });
    }

    modal.classList.add("active");
  }

  function closeModal() {
    modal.classList.remove("active");
  }

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Make country list items clickable
  countryList.addEventListener("click", (e) => {
    const item = e.target.closest(".country-item");
    if (item) {
      const countryName = item.querySelector(".country-name").textContent;
      const entry = data[currentIndex];
      const country = entry.countries.find(c => c.name === countryName);
      if (country) openModal(country.id);
    }
  });

  // Fullscreen Toggle
  const fullscreenBtn = document.getElementById("fullscreen-toggle");
  const mapSection = document.querySelector(".map-section");

  fullscreenBtn.addEventListener("click", () => {
    mapSection.classList.toggle("fullscreen-mode");
    fullscreenBtn.textContent = mapSection.classList.contains("fullscreen-mode") ? "✕" : "⛶";
  });

  // Keyboard Shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      mapSection.classList.remove("fullscreen-mode");
      fullscreenBtn.textContent = "⛶";
    }
    if (e.key === " " || e.key === "Space") {
      e.preventDefault();
      togglePlay();
    }
    if (e.key === "ArrowRight" && currentIndex < data.length - 1) {
      currentIndex++;
      slider.value = currentIndex;
      updateDashboard(currentIndex);
    }
    if (e.key === "ArrowLeft" && currentIndex > 0) {
      currentIndex--;
      slider.value = currentIndex;
      updateDashboard(currentIndex);
    }
    if (e.key === "f" || e.key === "F") {
      mapSection.classList.toggle("fullscreen-mode");
      fullscreenBtn.textContent = mapSection.classList.contains("fullscreen-mode") ? "✕" : "⛶";
    }
  });

  // Splash Screen
  const splash = document.getElementById("splash-screen");
  setTimeout(() => {
    splash.classList.add("hidden");
  }, 2000);

  // Initial Load
  updateDashboard(0);
});


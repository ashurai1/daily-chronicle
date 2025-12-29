/**
 * The Daily Chronicle - Main Application Logic
 * Handles fetching, formatting, and DOM manipulation.
 */

// 🔑 ADD YOUR NEWS API KEY HERE
const API_KEY = "87cb90b60ac842749ab423e8558253cd"; // Replace with your key
const BASE_URL = "https://newsapi.org/v2";

// Config
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 Minutes
const DEFAULT_PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=60";

// State
let currentCategory = "general";
let refreshTimer = null;

// DOM Elements
const newsContainer = document.getElementById("news-container");
const lastUpdatedEl = document.getElementById("last-updated");
const dateDisplay = document.getElementById("current-date");
const navItems = document.querySelectorAll(".nav-item");
const themeToggle = document.getElementById("theme-toggle");
const header = document.getElementById("header");

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    updateDateDisplay();
    setupTheme();
    setupNavigation();
    setupScroll();

    // Initial Load
    fetchNews(currentCategory);

    // Auto Refresh
    refreshTimer = setInterval(() => {
        console.log("Auto-refreshing news...");
        fetchNews(currentCategory, true);
    }, REFRESH_INTERVAL);
});

// --- Date & Time ---
function updateDateDisplay() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);
}

function updateLastUpdated() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    lastUpdatedEl.textContent = `Last Dispatch: ${timeString}`;
}

// --- Navigation ---
function setupNavigation() {
    navItems.forEach(button => {
        button.addEventListener("click", () => {
            // UI Update
            navItems.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            // Logic Update
            const category = button.dataset.category;
            if (category !== currentCategory) {
                currentCategory = category;
                fetchNews(category);
            }
        });
    });
}

// --- Theme Handling ---
function setupTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.documentElement.setAttribute("data-theme", savedTheme);
    }

    themeToggle.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        const newTheme = current === "dark" ? "light" : "dark";

        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    });
}

function setupScroll() {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 20) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
}

// --- Core Logic: Fetch News ---
async function fetchNews(category, isBackgroundRefresh = false) {
    if (!isBackgroundRefresh) {
        // Show loading state for manual navigation
        newsContainer.classList.add("fading");
        setTimeout(() => {
            newsContainer.innerHTML = `
                <div class="loading-state">
                    <div class="spinner"></div>
                    <p>Fetching the latest stories for ${category}...</p>
                </div>
            `;
            newsContainer.classList.remove("fading");
        }, 300);
    }

    try {
        const url = `${BASE_URL}/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            // Handle HTTP errors 
            if (response.status === 401) throw new Error("Invalid API Key. Please update js/app.js");
            if (response.status === 429) throw new Error("API Rate Limit Exceeded.");
            throw new Error(`Data unavailable (Status: ${response.status})`);
        }

        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
            // Filter junk articles
            const cleanArticles = data.articles.filter(article =>
                article.title !== "[Removed]" &&
                article.source.name !== "Google News"
            );

            renderArticles(cleanArticles);
            updateLastUpdated();
        } else {
            showError("No articles found in this section today.");
        }

    } catch (error) {
        console.error("Fetch Error:", error);
        showError(error.message);
    }
}

// --- Rendering ---
function renderArticles(articles) {
    // Fade out old content
    newsContainer.classList.add("fading");

    setTimeout(() => {
        newsContainer.innerHTML = "";

        articles.forEach((article, index) => {
            const articleEl = document.createElement("article");
            articleEl.className = "news-article";

            // Stagger animation
            articleEl.style.animationDelay = `${index * 100}ms`;

            // Format Date
            const dateObj = new Date(article.publishedAt);
            const dateStr = dateObj.toLocaleDateString("en-US", { month: 'short', day: 'numeric' });

            // Default Image Handling
            const imageUrl = article.urlToImage ? article.urlToImage : DEFAULT_PLACEHOLDER_IMG;

            articleEl.innerHTML = `
                <img src="${imageUrl}" 
                     alt="${article.title}" 
                     class="article-image" 
                     onerror="this.src='${DEFAULT_PLACEHOLDER_IMG}'">
                
                <div class="article-meta">
                    <span class="source">${article.source.name}</span>
                    <span class="date">• ${dateStr}</span>
                </div>
                
                <h2 class="article-headline">
                    <a href="${article.url}" target="_blank">${article.title}</a>
                </h2>
                
                <p class="article-summary">
                    ${article.description || "Click to read the full story on the original publication site."}
                </p>
                
                <a href="${article.url}" target="_blank" class="read-more-link">Continue Reading →</a>
            `;

            newsContainer.appendChild(articleEl);
        });

        // Fade in new content
        newsContainer.classList.remove("fading");
    }, 300);
}

function showError(message) {
    newsContainer.innerHTML = `
        <div class="loading-state">
            <p><strong>⚠️ Could not load edition</strong></p>
            <p>${message}</p>
            <br>
            <p style="font-size: 0.8rem">
                Tip: If you are running this locally, ensure you have a valid API Key in <code>js/app.js</code> 
                and that you are running on a local server (e.g., Live Server) to avoid CORS issues.
            </p>
        </div>
    `;
    newsContainer.classList.remove("fading");
}

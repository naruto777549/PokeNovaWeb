document.addEventListener("DOMContentLoaded", () => {
    console.log("Home Page Loaded. Waiting for PokeNova API...");

    // DOM Elements
    const heavyballsEl = document.getElementById("heavyballs");
    const moonballsEl = document.getElementById("moonballs");
    const loveballsEl = document.getElementById("loveballs");

    // Ye function baad me python API se data fetch karega
    function fetchTrainerData() {
        // Abhi ke liye dummy animation dikhane ke liye
        setTimeout(() => {
            heavyballsEl.textContent = "Loading...";
            moonballsEl.textContent = "Loading...";
        }, 500);
    }

    fetchTrainerData();
});

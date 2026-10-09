document.addEventListener("DOMContentLoaded", () => {
    
    const regions = [
        { name: "KANTO", start: 1, limit: 151, desc: "Gen 1" },
        { name: "JOHTO", start: 152, limit: 100, desc: "Gen 2" },
        { name: "HOENN", start: 252, limit: 135, desc: "Gen 3" },
        { name: "SINNOH", start: 387, limit: 107, desc: "Gen 4" },
        { name: "UNOVA", start: 494, limit: 156, desc: "Gen 5" },
        { name: "KALOS", start: 650, limit: 72, desc: "Gen 6" },
        { name: "ALOLA", start: 722, limit: 88, desc: "Gen 7" },
        { name: "GALAR", start: 810, limit: 96, desc: "Gen 8" },
        { name: "HISUI", start: 899, limit: 242, desc: "Regional Dex" },
        { name: "PALDEA", start: 906, limit: 120, desc: "Gen 9" }
    ];

    // Auto-Typing Search
    const searchInput = document.getElementById("searchInput");
    const clearSearchBtn = document.getElementById("clearSearch");
    const phrases = ["Search Pokémon...", "Search Shinies...", "Search Megas...", "Find Legendaries..."];
    let phraseIndex = 0; let charIndex = 0; let isDeleting = false;
    let typingTimeout;
    
    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            searchInput.placeholder = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            searchInput.placeholder = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true; typingTimeout = setTimeout(typeEffect, 1500); 
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length;
            typingTimeout = setTimeout(typeEffect, 500);
        } else {
            typingTimeout = setTimeout(typeEffect, isDeleting ? 40 : 80);
        }
    }
    typeEffect();

    // DOM Elements for Filtering UI
    const dynamicHeader = document.getElementById("dynamicHeader");
    const dynTitle = document.getElementById("dynTitle");
    const dynSubtitle = document.getElementById("dynSubtitle");
    const seasonNav = document.getElementById("seasonNav");
    const noResults = document.getElementById("noResults");

    // Unified Search & Filter Display Logic (Hides Region Headers)
    function applyGlobalFilterAndSearch() {
        const searchText = searchInput.value.toLowerCase().trim();
        const isSearching = searchText.length > 0;
        const isFiltering = currentFilter !== "normal";

        clearSearchBtn.style.display = isSearching ? "block" : "none";

        let visibleCount = 0;

        if (isSearching || isFiltering) {
            // Hide Region banners and Season Nav, keep grids
            document.querySelectorAll(".region-section").forEach(sec => {
                const banner = sec.querySelector(".region-banner");
                if(banner) banner.style.display = "none";
            });
            seasonNav.style.display = "none";
            dynamicHeader.style.display = "flex";

            if (isSearching) dynTitle.textContent = `SEARCH: "${searchText.toUpperCase()}"`;
            else dynTitle.textContent = `${currentFilter.toUpperCase()} POKÉMON`;

            // Filter cards
            document.querySelectorAll(".poke-card").forEach(card => {
                const pokeName = card.dataset.searchname;
                const isHiddenByFilter = card.classList.contains("filter-hidden");
                
                const matchesSearch = !isSearching || pokeName.includes(searchText);
                if (matchesSearch && !isHiddenByFilter) {
                    card.style.display = "flex";
                    visibleCount++;
                } else {
                    card.style.display = "none";
                }
            });

            dynSubtitle.textContent = `Showing ${visibleCount} matches`;
            
            // Show No Results Broken Pokeball if 0
            if (visibleCount === 0) noResults.style.display = "flex";
            else noResults.style.display = "none";

        } else {
            // Restore Normal View
            dynamicHeader.style.display = "none";
            noResults.style.display = "none";
            seasonNav.style.display = "flex";
            
            document.querySelectorAll(".region-section").forEach(sec => {
                const banner = sec.querySelector(".region-banner");
                if(banner) banner.style.display = "flex";
            });
            
            document.querySelectorAll(".poke-card").forEach(card => {
                if (!card.classList.contains("filter-hidden")) {
                    card.style.display = "flex";
                }
            });
        }
    }

    // SEARCH ON ENTER ONLY
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            applyGlobalFilterAndSearch();
            searchInput.blur(); // Dismiss keyboard
        }
    });
    // Remove typing event listener for live search so it only searches on enter!

    clearSearchBtn.addEventListener("click", () => {
        searchInput.value = "";
        applyGlobalFilterAndSearch();
    });

    // Filter Modal Logic
    const filterBtn = document.getElementById("filterBtn");
    const filterBadge = document.getElementById("filterBadge");
    const filterModal = document.getElementById("filterModal");
    const modalContent = document.getElementById("modalContent");
    const closeFilter = document.getElementById("closeFilter");
    const appContent = document.getElementById("app-content");
    const filterOptions = document.querySelectorAll(".filter-opt");
    let currentFilter = "normal"; 

    const openModal = () => { 
        filterModal.style.display = "flex"; 
        appContent.classList.add("blurred"); 
        document.body.classList.add("no-scroll"); 
        setTimeout(() => modalContent.style.transform = "translateY(0)", 10);
    };
    const closeModal = () => { 
        modalContent.style.transform = "translateY(100%)"; 
        appContent.classList.remove("blurred");
        document.body.classList.remove("no-scroll");
        setTimeout(() => filterModal.style.display = "none", 300); 
    };
    
    filterBtn.addEventListener("click", openModal);
    closeFilter.addEventListener("click", closeModal);

    let startY = 0;
    modalContent.addEventListener("touchstart", (e) => { startY = e.touches[0].clientY; }, {passive: true});
    modalContent.addEventListener("touchmove", (e) => {
        let dy = e.touches[0].clientY - startY;
        if (dy > 0) modalContent.style.transform = `translateY(${dy}px)`;
    }, {passive: true});
    modalContent.addEventListener("touchend", (e) => {
        let dy = e.changedTouches[0].clientY - startY;
        if (dy > 80) closeModal(); else modalContent.style.transform = "translateY(0)"; 
    });

    // Variant Filter Selection
    filterOptions.forEach(opt => {
        opt.addEventListener("click", function() {
            document.querySelector(".filter-opt.active").classList.remove("active");
            this.classList.add("active");
            currentFilter = this.dataset.val; 
            
            filterBadge.style.display = currentFilter !== "normal" ? "flex" : "none";
            
            // Loop through images and change src, rely on onload/onerror to tag them
            document.querySelectorAll(".poke-card").forEach(card => {
                const img = card.querySelector(".poke-sprite");
                const name = img.dataset.pokename;
                let folder = "ani"; let suffix = "";
                
                if (currentFilter === "shiny") folder = "ani-shiny";
                if (currentFilter === "mega") suffix = "-mega";
                if (currentFilter === "gmax") suffix = "-gmax";
                
                img.onload = function() {
                    card.classList.remove("filter-hidden");
                    applyGlobalFilterAndSearch();
                };
                img.onerror = function() {
                    card.classList.add("filter-hidden");
                    applyGlobalFilterAndSearch();
                };
                
                img.src = `https://play.pokemonshowdown.com/sprites/${folder}/${name}${suffix}.gif`;
            });
            
            closeModal();
            // Force apply filter UI changes immediately
            applyGlobalFilterAndSearch(); 
        });
    });

    // Build Regions
    const container = document.getElementById("pokedex-container");
    seasonNav.innerHTML = "";

    regions.forEach((region, idx) => {
        const seasonBtn = document.createElement("button");
        seasonBtn.className = `season-btn glass-card ${idx === 0 ? 'active' : ''}`;
        seasonBtn.dataset.target = region.name;
        seasonBtn.textContent = idx + 1;
        seasonNav.appendChild(seasonBtn);

        const section = document.createElement("div");
        section.className = "region-section";
        section.id = `region-${region.name}`;
        
        section.innerHTML = `
            <div class="region-banner">
                <div class="region-pokeball"></div>
                <div class="region-info">
                    <h2>${region.name}</h2>
                    <p>${region.desc} &nbsp;|&nbsp; ${region.limit} Pokémon</p>
                </div>
                <img src="https://files.catbox.moe/d6y6x7.jpg" class="region-map" alt="Map" draggable="false">
            </div>
            <div class="pokemon-grid" id="grid-${region.name}"></div>
        `;
        container.appendChild(section);
    });

    document.querySelectorAll(".season-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            document.querySelector(".season-btn.active").classList.remove("active");
            this.classList.add("active");
            
            const targetRegion = document.getElementById(`region-${this.dataset.target}`);
            const y = targetRegion.getBoundingClientRect().top + window.scrollY - 185; 
            window.scrollTo({top: y, behavior: 'smooth'});
        });
    });

    // API Fetch & Lazy Loading
    const regionCache = new Set();
    async function fetchRegion(regionObj) {
        const grid = document.getElementById(`grid-${regionObj.name}`);
        if (regionCache.has(regionObj.name)) return; 
        regionCache.add(regionObj.name);

        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${regionObj.limit}&offset=${regionObj.start - 1}`);
            const data = await res.json();
            
            data.results.forEach((poke, index) => {
                const id = regionObj.start + index;
                const cleanName = poke.name.replace('-', '');
                
                const card = document.createElement("div");
                card.className = "poke-card";
                card.dataset.searchname = poke.name.toLowerCase();
                
                const folder = currentFilter === "shiny" ? "ani-shiny" : "ani";
                const spriteUrl = `https://play.pokemonshowdown.com/sprites/${folder}/${cleanName}.gif`;
                
                card.innerHTML = `
                    <div class="poke-details">
                        <div class="poke-id">#${String(id).padStart(3, '0')}</div>
                        <div class="poke-name">${poke.name}</div>
                        <div class="poke-types"></div>
                    </div>
                    <img src="${spriteUrl}" loading="lazy" data-pokename="${cleanName}" class="poke-sprite" draggable="false">
                `;
                
                const newImg = card.querySelector(".poke-sprite");
                newImg.onerror = function() {
                    card.classList.add("filter-hidden");
                    applyGlobalFilterAndSearch();
                };

                grid.appendChild(card);

                fetch(poke.url)
                    .then(r => r.json())
                    .then(detailData => {
                        const typeHtml = detailData.types.map(t => `<span class="type-badge">${t.type.name}</span>`).join('');
                        const typeContainer = card.querySelector('.poke-types');
                        if (typeContainer) typeContainer.innerHTML = typeHtml;
                        card.dataset.fulldata = JSON.stringify(detailData); // Store for modal
                    }).catch(() => {});
            });
        } catch (error) { console.error("API Error", error); }
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const regionName = entry.target.id.split("-")[1];
                const regionObj = regions.find(r => r.name === regionName);
                if (regionObj) fetchRegion(regionObj);
                
                const activeBtn = document.querySelector(`[data-target="${regionName}"]`);
                if (activeBtn && searchInput.value.length === 0 && currentFilter === "normal") {
                    document.querySelector(".season-btn.active")?.classList.remove("active");
                    activeBtn.classList.add("active");
                }
            }
        });
    }, { rootMargin: "350px" });

    document.querySelectorAll(".region-section").forEach(sec => observer.observe(sec));

    // --- Product Details Modal Logic ---
    const pokeDetailsModal = document.getElementById("pokeDetailsModal");
    const closeDetails = document.getElementById("closeDetails");
    
    // Listen for clicks on Pokemon Cards
    document.addEventListener("click", (e) => {
        const card = e.target.closest(".poke-card");
        if (card) {
            const rawData = card.dataset.fulldata;
            if(!rawData) return;
            const pokeData = JSON.parse(rawData);
            
            const pokeName = card.dataset.searchname;
            const pokeId = card.querySelector(".poke-id").textContent;
            
            // Set basic info
            document.getElementById("det-name").textContent = pokeData.name;
            document.getElementById("det-id").textContent = pokeId;
            document.getElementById("det-height").textContent = (pokeData.height / 10).toFixed(1);
            document.getElementById("det-weight").textContent = (pokeData.weight / 10).toFixed(1);
            
            const abilities = pokeData.abilities.map(a => a.ability.name).join(', ');
            document.getElementById("det-abilities").textContent = abilities;
            
            // Types
            const typeHtml = pokeData.types.map(t => `<span class="type-badge" style="border: 1px solid #555; padding: 6px 12px;">${t.type.name}</span>`).join('');
            document.getElementById("det-types").innerHTML = typeHtml;

            // Stats
            const statMap = { 'hp':'HP', 'attack':'ATK', 'defense':'DEF', 'special-attack':'SPA', 'special-defense':'SPD', 'speed':'SPE' };
            let statsHtml = '';
            pokeData.stats.forEach(s => {
                const val = s.base_stat;
                const percent = Math.min((val / 200) * 100, 100);
                const shortName = statMap[s.stat.name] || s.stat.name.substring(0,3).toUpperCase();
                statsHtml += `
                    <div class="stat-row">
                        <div class="stat-name">${shortName}</div>
                        <div class="stat-val">${val}</div>
                        <div class="stat-bar-bg"><div class="stat-bar-fill" style="width: ${percent}%;"></div></div>
                    </div>
                `;
            });
            document.getElementById("det-stats").innerHTML = statsHtml;
            
            // 3D Image Setting
            const folder = currentFilter === "shiny" ? "ani-shiny" : "ani";
            let suffix = "";
            if (currentFilter === "mega") suffix = "-mega";
            if (currentFilter === "gmax") suffix = "-gmax";
            
            const cleanName = pokeName.replace('-', '');
            document.getElementById("det-img").src = `https://play.pokemonshowdown.com/sprites/${folder}/${cleanName}${suffix}.gif`;

            // Open Modal
            pokeDetailsModal.style.display = "flex";
            document.body.classList.add("no-scroll");
        }
    });

    closeDetails.addEventListener("click", () => {
        pokeDetailsModal.style.display = "none";
        if(filterModal.style.display !== "flex") {
            document.body.classList.remove("no-scroll");
        }
    });

    document.addEventListener("contextmenu", e => e.preventDefault());
});

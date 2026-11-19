const civilizations = [
  {
    id: "egypt",
    name: "Egypt (Middle Kingdom)",
    type: "State society",
    category: "state",
    desc: "Around 2000 BC the Middle Kingdom was consolidating after the First Intermediate Period. Mentuhotep II of the 11th Dynasty reunified Upper and Lower Egypt, restoring centralized pharaonic rule along the Nile.",
    facts: [
      "Capital shifting toward Thebes (Niut-Reset)",
      "Strong trade with Nubia, Levant, and Punt",
      "Literary golden age beginning (e.g. Story of Sinuhe)",
      "Monumental building and irrigation projects resumed"
    ]
  },
  {
    id: "mesopotamia",
    name: "Mesopotamia (post-Ur III)",
    type: "City-states / emerging states",
    category: "state",
    desc: "The Third Dynasty of Ur collapsed around 2004 BC. Southern Mesopotamia fragmented into competing city-states (Isin, Larsa, etc.) while Amorite groups rose in influence. Early Assyrian power centers existed in the north.",
    facts: [
      "Cuneiform writing and scribal culture continued",
      "Isin and Larsa competed for hegemony",
      "Amorite dynasties emerging (later Old Babylonian)",
      "Trade networks still linked to Indus and Anatolia"
    ]
  },
  {
    id: "elam",
    name: "Elam (Simashki)",
    type: "Kingdom",
    category: "state",
    desc: "The Elamite kingdom in southwestern Iran (roughly modern Khuzestan and Fars) was a major power rivaling Mesopotamian states. Around 2000 BC it was under the Simashki dynasty.",
    facts: [
      "Controlled key highland-lowland trade routes",
      "Frequent conflict and alliance with Mesopotamian cities",
      "Distinct language and culture alongside Akkadian influence",
      "Capital areas around Susa and Anshan"
    ]
  },
  {
    id: "indus",
    name: "Indus Valley Civilization",
    type: "Urban civilization",
    category: "state",
    desc: "The Mature Harappan phase was still flourishing. Cities such as Mohenjo-daro and Harappa featured grid planning, advanced drainage, standardized weights, and extensive trade.",
    facts: [
      "Writing system remains undeciphered",
      "Trade links with Mesopotamia (seals, beads, etc.)",
      "No clear evidence of palaces or royal tombs",
      "Began regional decline later in the 2nd millennium"
    ]
  },
  {
    id: "minoan",
    name: "Minoan Civilization",
    type: "Palace culture",
    category: "complex",
    desc: "On Crete the first palaces (Middle Minoan) were being constructed around 2000–1900 BC. Knossos and other centers developed sophisticated architecture, art, and maritime trade.",
    facts: [
      "Linear A script (undeciphered)",
      "Advanced plumbing and multi-story buildings",
      "Strong Aegean and eastern Mediterranean trade",
      "Later influenced Mycenaean Greek culture"
    ]
  },
  {
    id: "china",
    name: "Early China (Longshan / Xia)",
    type: "Complex culture / proto-state",
    category: "complex",
    desc: "The Longshan culture in the Yellow River valley showed increasing social complexity, walled settlements, and early bronze work. Traditional histories place the semi-legendary Xia dynasty in this era.",
    facts: [
      "Black pottery and jade working",
      "Walled towns indicating hierarchy",
      "Millet and rice agriculture",
      "Archaeological bridge to later Shang dynasty"
    ]
  },
  {
    id: "steppe",
    name: "Central Asian Pastoralists",
    type: "Nomadic / semi-nomadic",
    category: "pastoral",
    desc: "Groups on the Eurasian steppe practiced pastoralism. Early Indo-European expansions and the spread of horse technology and chariots were underway.",
    facts: [
      "Horse domestication and early chariots",
      "Mobile herding economies",
      "Cultural links stretching toward Europe and South Asia",
      "Influenced later Andronovo and related cultures"
    ]
  },
  {
    id: "amorites",
    name: "Amorite groups (Levant & Mesopotamia)",
    type: "Tribal / emerging dynasties",
    category: "complex",
    desc: "Amorite-speaking groups were expanding from the northwest into Mesopotamia and the Levant, founding dynasties that would dominate the region in the following centuries.",
    facts: [
      "Later established Old Babylonian dynasty",
      "Controlled many Syrian and Mesopotamian cities",
      "Blended with existing Akkadian/Sumerian culture",
      "Important in the transition after Ur III"
    ]
  },
  {
    id: "nubia",
    name: "Kerma Culture (Nubia)",
    type: "Complex society",
    category: "complex",
    desc: "In Upper Nubia the Kerma culture was a powerful African kingdom south of Egypt, known for large settlements, trade, and distinctive architecture.",
    facts: [
      "Major trading partner and sometimes rival of Egypt",
      "Distinctive pottery and burial practices",
      "Controlled Nile trade routes southward",
      "Flourished through the Middle Kingdom period"
    ]
  }
];

const listEl = document.getElementById("region-list");
const detailContent = document.getElementById("detail-content");
const detailPlaceholder = document.querySelector(".detail-placeholder");
const detailTitle = document.getElementById("detail-title");
const detailTags = document.getElementById("detail-tags");
const detailDesc = document.getElementById("detail-desc");
const detailFacts = document.getElementById("detail-facts");
const searchInput = document.getElementById("search");
const map = document.getElementById("world-map");

let currentScale = 1;
let currentX = 0;
let currentY = 0;
let isDragging = false;
let startX, startY;

function renderList(filter = "") {
  listEl.innerHTML = "";
  const filtered = civilizations.filter(c =>
    c.name.toLowerCase().includes(filter.toLowerCase()) ||
    c.type.toLowerCase().includes(filter.toLowerCase())
  );
  filtered.forEach(c => {
    const li = document.createElement("li");
    li.innerHTML = `${c.name}<div class="type">${c.type}</div>`;
    li.dataset.id = c.id;
    li.addEventListener("click", () => selectRegion(c.id));
    listEl.appendChild(li);
  });
}

function selectRegion(id) {
  const civ = civilizations.find(c => c.id === id);
  if (!civ) return;

  // Highlight map
  document.querySelectorAll(".region").forEach(r => r.classList.remove("active"));
  const poly = document.querySelector(`.region[data-id="${id}"]`);
  if (poly) poly.classList.add("active");

  // Highlight list
  document.querySelectorAll(".region-list li").forEach(li => {
    li.classList.toggle("active", li.dataset.id === id);
  });

  // Show detail
  detailPlaceholder.hidden = true;
  detailContent.hidden = false;
  detailTitle.textContent = civ.name;
  detailTags.innerHTML = `<span class="tag">${civ.type}</span>`;
  detailDesc.textContent = civ.desc;
  detailFacts.innerHTML = civ.facts.map(f => `<li>${f}</li>`).join("");
}

function closeDetail() {
  detailContent.hidden = true;
  detailPlaceholder.hidden = false;
  document.querySelectorAll(".region").forEach(r => r.classList.remove("active"));
  document.querySelectorAll(".region-list li").forEach(li => li.classList.remove("active"));
}

// Map interactions
document.querySelectorAll(".region").forEach(region => {
  region.addEventListener("click", () => selectRegion(region.dataset.id));
  region.addEventListener("mouseenter", () => {
    region.style.cursor = "pointer";
  });
});

document.getElementById("close-detail").addEventListener("click", closeDetail);

searchInput.addEventListener("input", (e) => renderList(e.target.value));

// Simple pan & zoom
function applyTransform() {
  map.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;
  map.style.transformOrigin = "0 0";
}

map.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX - currentX;
  startY = e.clientY - currentY;
});
window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  currentX = e.clientX - startX;
  currentY = e.clientY - startY;
  applyTransform();
});
window.addEventListener("mouseup", () => isDragging = false);

document.getElementById("zoom-in").addEventListener("click", () => {
  currentScale = Math.min(currentScale * 1.2, 3);
  applyTransform();
});
document.getElementById("zoom-out").addEventListener("click", () => {
  currentScale = Math.max(currentScale / 1.2, 0.5);
  applyTransform();
});
document.getElementById("reset-view").addEventListener("click", () => {
  currentScale = 1;
  currentX = 0;
  currentY = 0;
  applyTransform();
});

// Init
renderList();

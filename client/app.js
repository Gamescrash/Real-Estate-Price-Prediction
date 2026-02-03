const API_BASE = document.body.dataset.apiBase || "http://127.0.0.1:5000";

const form = document.getElementById("price-form");
const locationSelect = document.getElementById("location");
const locationHelper = document.getElementById("location-helper");
const statusPill = document.getElementById("status-pill");
const resultValue = document.getElementById("result-value");
const resultEur = document.getElementById("result-eur");
const resultCaption = document.getElementById("result-caption");
const resultInputs = document.getElementById("result-inputs");
const heroEstimate = document.getElementById("hero-estimate");
const heroEur = document.getElementById("hero-eur");
const heroInputs = document.getElementById("hero-inputs");
const apiStatus = document.getElementById("api-status");
const yearEl = document.getElementById("year");
const eurRateInput = document.getElementById("eur-rate");

let lastEstimateLakh = null;

const setStatus = (state, message) => {
  statusPill.dataset.state = state;
  statusPill.textContent = message;
};

const setApiStatus = (message, state = "ready") => {
  apiStatus.textContent = message;
  apiStatus.dataset.state = state;
};

const formatPrice = (value) => {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) {
    return "INR -- Lakh";
  }
  const formatted = numberValue.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
  return `INR ${formatted} Lakh`;
};

const updateInputsSummary = (sqft, bhk, bath, location) => {
  const summary = `${sqft} sqft | ${bhk} BHK | ${bath} bath | ${location}`;
  resultInputs.textContent = summary;
  heroInputs.textContent = summary;
};

const updateResult = (value, caption) => {
  resultValue.textContent = value;
  heroEstimate.textContent = value;
  if (caption) {
    resultCaption.textContent = caption;
  }
};

const formatEuro = (value) => {
  if (!Number.isFinite(value)) {
    return "EUR --";
  }
  return value.toLocaleString("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  });
};

const updateEuroDisplay = (estimateLakh) => {
  const rate = Number(eurRateInput.value);
  if (!Number.isFinite(rate) || rate <= 0 || !Number.isFinite(estimateLakh)) {
    resultEur.textContent = "EUR --";
    heroEur.textContent = "EUR --";
    return;
  }
  const eurValue = estimateLakh * 100000 * rate;
  const formatted = formatEuro(eurValue);
  resultEur.textContent = formatted;
  heroEur.textContent = formatted;
};

const setYear = () => {
  const now = new Date();
  yearEl.textContent = now.getFullYear();
};

const loadLocations = async () => {
  setStatus("loading", "Loading");
  locationHelper.textContent = "Connecting to the Flask API...";
  locationSelect.innerHTML = '<option value="">Loading locations...</option>';

  try {
    const response = await fetch(`${API_BASE}/get_location_names`);
    if (!response.ok) {
      throw new Error("Failed to fetch locations");
    }
    const data = await response.json();
    const locations = Array.isArray(data.locations) ? data.locations : [];

    if (!locations.length) {
      locationSelect.innerHTML = '<option value="">No locations found</option>';
      locationHelper.textContent = "No locations returned by the API.";
      setStatus("error", "No data");
      setApiStatus("No data", "error");
      return;
    }

    locationSelect.innerHTML = '<option value="">Select a location</option>';
    locations.forEach((location) => {
      const option = document.createElement("option");
      option.value = location;
      option.textContent = location;
      locationSelect.appendChild(option);
    });

    locationHelper.textContent = "Select a Bengaluru neighborhood.";
    setStatus("ready", "Ready");
    setApiStatus("Connected", "ready");
  } catch (error) {
    locationSelect.innerHTML = '<option value="">Server not reachable</option>';
    locationHelper.textContent = "Start the Flask API and refresh.";
    setStatus("error", "Offline");
    setApiStatus("Offline", "error");
    updateResult("INR -- Lakh", "Could not reach the prediction API.");
    lastEstimateLakh = null;
    updateEuroDisplay(Number.NaN);
  }
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const sqft = Number(document.getElementById("sqft").value);
  const bhk = Number(document.getElementById("bhk").value);
  const bath = Number(document.getElementById("bath").value);
  const location = locationSelect.value;

  if (!location || !Number.isFinite(sqft) || !Number.isFinite(bhk) || !Number.isFinite(bath)) {
    setStatus("error", "Check inputs");
    updateResult("INR -- Lakh", "Please fill every field before predicting.");
    lastEstimateLakh = null;
    updateEuroDisplay(Number.NaN);
    return;
  }

  updateInputsSummary(sqft, bhk, bath, location);
  setStatus("loading", "Calculating");
  updateResult("Calculating...", "Working on your estimate.");
  updateEuroDisplay(Number.NaN);

  const formData = new FormData();
  formData.append("total_sqft", sqft);
  formData.append("location", location);
  formData.append("bhk", bhk);
  formData.append("bath", bath);

  try {
    const response = await fetch(`${API_BASE}/predict_home_price`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Prediction request failed");
    }

    const data = await response.json();
    lastEstimateLakh = Number(data.estimated_price);
    const estimate = formatPrice(lastEstimateLakh);
    setStatus("success", "Estimate ready");
    updateResult(estimate, "Price shown in lakhs of INR.");
    updateEuroDisplay(lastEstimateLakh);
  } catch (error) {
    setStatus("error", "Error");
    updateResult("INR -- Lakh", "Prediction failed. Check the API and try again.");
    lastEstimateLakh = null;
    updateEuroDisplay(Number.NaN);
  }
});

eurRateInput.addEventListener("input", () => {
  updateEuroDisplay(lastEstimateLakh);
});

setYear();
loadLocations();

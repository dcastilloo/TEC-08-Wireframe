/* =========================
   TEC-08 Wireframe Map
   Leaflet + Esri World Imagery
   ========================= */

(function () {
  // ---- Config base ----
  const DEFAULT_CENTER = [-6.7714, -79.8409]; // Chiclayo aprox
  const DEFAULT_ZOOM = 13;

  // ---- Init map ----
  const map = L.map("map", {
    zoomControl: true,
    attributionControl: true,
  }).setView(DEFAULT_CENTER, DEFAULT_ZOOM);

  // ---- Basemap: Esri World Imagery (satellite/aerial) ----
  const esriImagery = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      maxZoom: 19,
      attribution:
        "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
    }
  ).addTo(map);

  // ---- Optional labels / streets overlay (context) ----
  const osmLabels = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    opacity: 0.35,
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // ---- Layer control (wireframe useful) ----
  const baseLayers = {
    "Satelital (Esri)": esriImagery,
  };

  const overlays = {
    "Calles/labels (OSM)": osmLabels,
  };

  L.control.layers(baseLayers, overlays, { collapsed: true }).addTo(map);

  // ---- Dummy data: SET marker + MT route polyline ----
  let setLatLng = L.latLng(DEFAULT_CENTER[0], DEFAULT_CENTER[1]);
  const setMarker = L.marker(setLatLng, { draggable: false }).addTo(map);
  setMarker.bindPopup("<b>SET</b><br/>ALT-SET-02 · SET-ALT-002");

  // Simple initial route (3 points)
  let waypoints = [
    L.latLng(DEFAULT_CENTER[0] + 0.02, DEFAULT_CENTER[1] - 0.02),
    L.latLng(DEFAULT_CENTER[0] + 0.01, DEFAULT_CENTER[1] - 0.005),
    L.latLng(DEFAULT_CENTER[0], DEFAULT_CENTER[1] + 0.015),
  ];

  const routeLine = L.polyline(waypoints, { weight: 4, opacity: 0.85 }).addTo(map);

  // Waypoint markers group
  const wpLayer = L.layerGroup().addTo(map);
  function redrawWaypointMarkers() {
    wpLayer.clearLayers();
    waypoints.forEach((p, idx) => {
      const m = L.circleMarker(p, { radius: 5, weight: 2, opacity: 0.9, fillOpacity: 0.6 });
      m.bindTooltip(`WP-${String(idx + 1).padStart(2, "0")}`, { permanent: false });
      m.addTo(wpLayer);
    });
  }
  redrawWaypointMarkers();

  // Zoom to content (nice demo)
  const bounds = L.latLngBounds([setLatLng, ...waypoints]);
  map.fitBounds(bounds.pad(0.25));

  // ---- Wireframe modes ----
  let mode = "none"; // none | move-set | waypoints

  const $ = (id) => document.getElementById(id);

  function setMode(nextMode) {
    mode = nextMode;

    // UI state
    const btnMoveSet = $("btnMoveSet");
    const btnWaypoints = $("btnWaypoints");

    btnMoveSet.classList.toggle("is-active", mode === "move-set");
    btnWaypoints.classList.toggle("is-active", mode === "waypoints");
  }

  // Toggle buttons
  $("btnMoveSet")?.addEventListener("click", () => setMode(mode === "move-set" ? "none" : "move-set"));
  $("btnWaypoints")?.addEventListener("click", () => setMode(mode === "waypoints" ? "none" : "waypoints"));

  // Optional: “Recalcular” just re-fits bounds in wireframe
  $("btnRecalc")?.addEventListener("click", () => {
    routeLine.setLatLngs(waypoints);
    redrawWaypointMarkers();
    const b = L.latLngBounds([setLatLng, ...waypoints]);
    map.fitBounds(b.pad(0.25));
  });

  // Map click behavior based on mode
  map.on("click", (e) => {
    if (mode === "move-set") {
      setLatLng = e.latlng;
      setMarker.setLatLng(setLatLng);
      setMarker.openPopup();
      return;
    }

    if (mode === "waypoints") {
      waypoints.push(e.latlng);
      routeLine.setLatLngs(waypoints);
      redrawWaypointMarkers();
      return;
    }
  });

  // Start with no mode active (or uncomment to default)
  setMode("none");
})();

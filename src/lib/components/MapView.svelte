<script>
  import { onMount, onDestroy } from "svelte";
  import {
    events,
    currentEventIndex,
    isPlaying,
    currentEvent,
  } from "$lib/store.js";

  let mapContainer;
  let map;
  let L;
  let markers = [];
  let pathLines = [];
  let pulseMarker = null;
  let currentLine = null;

  const CATEGORY_COLORS = {
    birth: "#C5A55A",
    education: "#3A7CA5",
    activism: "#A62E2E",
    exile: "#B87333",
    international: "#3A7CA5",
    imprisonment: "#6B3A5D",
    revolution: "#8B1A1A",
    death: "#4A4A4A",
  };

  const CATEGORY_LABELS = {
    birth: "Kelahiran",
    education: "Pendidikan",
    activism: "Aktivisme",
    exile: "Pengasingan",
    international: "Internasional",
    imprisonment: "Penjara",
    revolution: "Revolusi",
    death: "Wafat",
  };

  function createPulseIcon(color) {
    return L.divIcon({
      className: "pulse-marker-wrapper",
      html: `
        <div class="pulse-marker" style="--marker-color: ${color}">
          <div class="pulse-core"></div>
          <div class="pulse-ring"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  }

  function createDotIcon(color, isActive = false) {
    const size = isActive ? 12 : 7;
    return L.divIcon({
      className: "dot-marker-wrapper",
      html: `<div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: 2px solid rgba(245, 230, 200, 0.8);
        border-radius: 50%;
        box-shadow: 0 0 ${isActive ? 12 : 6}px ${color}80;
        transition: all 0.3s;
      "></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  }

  function animatePath(from, to, color, duration = 1200) {
    return new Promise((resolve) => {
      const frames = 40;
      const latStep = (to[0] - from[0]) / frames;
      const lngStep = (to[1] - from[1]) / frames;
      let points = [L.latLng(from[0], from[1])];
      let frame = 0;

      if (currentLine) {
        map.removeLayer(currentLine);
      }

      currentLine = L.polyline(points, {
        color: color,
        weight: 2.5,
        opacity: 0.7,
        dashArray: "8, 4",
        lineCap: "round",
      }).addTo(map);

      const interval = setInterval(() => {
        frame++;
        const lat = from[0] + latStep * frame;
        const lng = from[1] + lngStep * frame;
        currentLine.addLatLng(L.latLng(lat, lng));
        if (frame >= frames) {
          clearInterval(interval);
          pathLines.push(currentLine);
          currentLine = null;
          resolve();
        }
      }, duration / frames);
    });
  }

  async function goToEvent(index) {
    const evts = $events;
    if (!evts.length || !map || !L) return;

    const evt = evts[index];
    const color = CATEGORY_COLORS[evt.category] || "#C5A55A";

    if (pulseMarker) {
      map.removeLayer(pulseMarker);
    }

    if (evt.fromCoordinates) {
      const from = [evt.fromCoordinates.lat, evt.fromCoordinates.lng];
      const to = [evt.coordinates.lat, evt.coordinates.lng];
      await animatePath(from, to, color, 800);
    }

    pulseMarker = L.marker([evt.coordinates.lat, evt.coordinates.lng], {
      icon: createPulseIcon(color),
      zIndexOffset: 1000,
    }).addTo(map);

    const dot = L.marker([evt.coordinates.lat, evt.coordinates.lng], {
      icon: createDotIcon(color),
    }).addTo(map);

    dot.bindTooltip(`<strong>${evt.title}</strong><br/>${evt.date}`, {
      className: "custom-tooltip",
      direction: "top",
      offset: [0, -8],
    });

    markers.push(dot);

    map.flyTo(
      [evt.coordinates.lat, evt.coordinates.lng],
      getZoomForCategory(evt),
      {
        duration: 1.2,
        easeLinearity: 0.4,
      },
    );
  }

  function getZoomForCategory(evt) {
    if (evt.fromCoordinates) {
      const dist =
        Math.abs(evt.coordinates.lat - evt.fromCoordinates.lat) +
        Math.abs(evt.coordinates.lng - evt.fromCoordinates.lng);
      if (dist > 40) return 3;
      if (dist > 15) return 4;
      if (dist > 5) return 5;
      return 6;
    }
    return 6;
  }

  function clearMap() {
    markers.forEach((m) => map.removeLayer(m));
    pathLines.forEach((p) => map.removeLayer(p));
    if (pulseMarker) map.removeLayer(pulseMarker);
    if (currentLine) map.removeLayer(currentLine);
    markers = [];
    pathLines = [];
    pulseMarker = null;
    currentLine = null;
  }

  onMount(async () => {
    L = (await import("leaflet")).default;

    map = L.map(mapContainer, {
      center: [-0.1, 100.65],
      zoom: 5,
      zoomControl: false,
      attributionControl: false,
    });

    L.control.zoom({ position: "bottomleft" }).addTo(map);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 19,
        subdomains: "abcd",
      },
    ).addTo(map);

    L.control
      .attribution({
        prefix: false,
        position: "bottomright",
      })
      .addAttribution("© CartoDB © OpenStreetMap")
      .addTo(map);

    const unsub = events.subscribe((evts) => {
      if (evts.length > 0) {
        goToEvent(0);
        unsub();
      }
    });
  });

  $: if (map && $events.length > 0 && $currentEventIndex >= 0) {
    goToEvent($currentEventIndex);
  }

  onDestroy(() => {
    if (map) map.remove();
  });
</script>

<div class="map-container" bind:this={mapContainer}></div>

<style>
  .map-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }

  :global(.pulse-marker-wrapper) {
    background: none !important;
    border: none !important;
  }

  :global(.pulse-marker) {
    position: relative;
    width: 24px;
    height: 24px;
  }

  :global(.pulse-core) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    background: var(--marker-color);
    border-radius: 50%;
    border: 2px solid rgba(245, 230, 200, 0.9);
    box-shadow: 0 0 16px var(--marker-color);
    z-index: 2;
  }

  :global(.pulse-ring) {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid var(--marker-color);
    opacity: 0.6;
    animation: pulseMarker 2s ease-out infinite;
    z-index: 1;
  }

  :global(.dot-marker-wrapper) {
    background: none !important;
    border: none !important;
  }

  :global(.custom-tooltip) {
    background: rgba(26, 26, 46, 0.95) !important;
    border: 1px solid rgba(197, 165, 90, 0.4) !important;
    border-radius: 6px !important;
    color: #f5e6c8 !important;
    font-family: "Source Serif 4", serif !important;
    font-size: 12px !important;
    padding: 6px 10px !important;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5) !important;
  }

  :global(.custom-tooltip::before) {
    border-top-color: rgba(26, 26, 46, 0.95) !important;
  }

  @keyframes pulseMarker {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.6;
    }
    100% {
      transform: translate(-50%, -50%) scale(2.5);
      opacity: 0;
    }
  }
</style>

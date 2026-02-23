<script>
    import { onMount } from "svelte";
    import MapView from "$lib/components/MapView.svelte";
    import Timeline from "$lib/components/Timeline.svelte";
    import EventPanel from "$lib/components/EventPanel.svelte";
    import StatsPanel from "$lib/components/StatsPanel.svelte";
    import { events } from "$lib/store.js";
    import eventsData from "$lib/data/tan_malaka_events.json";
    import "../app.css";

    let loaded = false;

    onMount(() => {
        events.set(eventsData.events);
        setTimeout(() => {
            loaded = true;
        }, 600);
    });
</script>

<svelte:head>
    <title>Tan Malaka — Dari Penjara ke Penjara | Peta Perjalanan Hidup</title>
</svelte:head>

<div class="app" class:loaded>
    {#if !loaded}
        <div class="loading-screen">
            <div class="loading-content">
                <div class="loading-ornament">❖</div>
                <h1 class="loading-title">Tan Malaka</h1>
                <p class="loading-subtitle">Dari Penjara ke Penjara</p>
                <div class="loading-bar">
                    <div class="loading-fill"></div>
                </div>
                <p class="loading-hint">Memuat peta perjalanan...</p>
            </div>
        </div>
    {/if}

    <MapView />

    <div class="title-watermark">
        <h1>Tan Malaka</h1>
        <p>Peta Perjalanan · 1897–1949</p>
    </div>

    <EventPanel />
    <StatsPanel />
    <Timeline />
</div>

<style>
    .app {
        width: 100vw;
        height: 100vh;
        position: relative;
        overflow: hidden;
        opacity: 0;
        transition: opacity 0.8s ease;
    }

    .app.loaded {
        opacity: 1;
    }

    .loading-screen {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: var(--ink);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .loading-content {
        text-align: center;
    }

    .loading-ornament {
        font-size: 24px;
        color: var(--gold);
        margin-bottom: 16px;
        opacity: 0.6;
    }

    .loading-title {
        font-family: var(--font-display);
        font-size: 36px;
        font-weight: 700;
        color: var(--parchment);
        margin-bottom: 6px;
        letter-spacing: 2px;
    }

    .loading-subtitle {
        font-family: var(--font-display);
        font-style: italic;
        font-size: 16px;
        color: var(--gold-dim);
        margin-bottom: 30px;
    }

    .loading-bar {
        width: 180px;
        height: 2px;
        background: rgba(197, 165, 90, 0.15);
        border-radius: 1px;
        margin: 0 auto 12px;
        overflow: hidden;
    }

    .loading-fill {
        width: 100%;
        height: 100%;
        background: var(--gold);
        animation: shimmer 1.2s ease-in-out infinite;
        background: linear-gradient(
            90deg,
            transparent,
            var(--gold),
            transparent
        );
        background-size: 200% 100%;
    }

    .loading-hint {
        font-size: 12px;
        color: var(--muted);
        font-family: var(--font-body);
    }

    .title-watermark {
        position: absolute;
        bottom: 140px;
        right: 24px;
        z-index: 500;
        text-align: right;
        pointer-events: none;
        opacity: 0.15;
    }

    .title-watermark h1 {
        font-family: var(--font-display);
        font-size: 42px;
        font-weight: 800;
        color: var(--parchment);
        line-height: 1;
        letter-spacing: 3px;
    }

    .title-watermark p {
        font-family: var(--font-display);
        font-style: italic;
        font-size: 13px;
        color: var(--gold);
        letter-spacing: 2px;
        margin-top: 4px;
    }

    @media (max-width: 640px) {
        .title-watermark {
            bottom: 160px;
            right: 14px;
        }
        .title-watermark h1 {
            font-size: 28px;
        }
        .title-watermark p {
            font-size: 11px;
        }
    }
</style>

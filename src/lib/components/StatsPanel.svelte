<script>
    import { events, currentEventIndex } from "$lib/store.js";

    $: uniqueCountries = new Set(
        $events.map((e) => {
            const loc = e.location;
            if (
                loc.includes("Sumatera") ||
                loc.includes("Jawa") ||
                loc.includes("Jakarta") ||
                loc.includes("Banten") ||
                loc.includes("Semarang") ||
                loc.includes("Yogyakarta") ||
                loc.includes("Solo") ||
                loc.includes("Kediri") ||
                loc.includes("Batavia")
            )
                return "Indonesia";
            if (
                loc.includes("Belanda") ||
                loc.includes("Rotterdam") ||
                loc.includes("Haarlem") ||
                loc.includes("Den Haag")
            )
                return "Belanda";
            if (loc.includes("Rusia") || loc.includes("Moskow")) return "Rusia";
            if (loc.includes("Jerman") || loc.includes("Berlin"))
                return "Jerman";
            if (
                loc.includes("Tiongkok") ||
                loc.includes("Guangzhou") ||
                loc.includes("Shanghai") ||
                loc.includes("Xiamen")
            )
                return "Tiongkok";
            if (loc.includes("Filipina") || loc.includes("Manila"))
                return "Filipina";
            if (loc.includes("Thailand") || loc.includes("Bangkok"))
                return "Thailand";
            if (loc.includes("Hong Kong")) return "Hong Kong";
            if (loc.includes("Singapura")) return "Singapura";
            if (loc.includes("Myanmar") || loc.includes("Yangon"))
                return "Myanmar";
            return loc;
        }),
    ).size;

    $: uniqueCities = new Set($events.map((e) => e.location)).size;

    let visible = false;

    function toggle() {
        visible = !visible;
    }
</script>

<div class="top-right-btns">
    <a
        class="github-btn"
        href="https://github.com/dionarya23/tan-malaka-map"
        target="_blank"
        rel="noopener noreferrer"
        title="Open Source di GitHub"
    >
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            opacity="0.7"
        >
            <path
                d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
            />
        </svg>
    </a>
    <div class="stats-trigger" on:mouseenter={() => (visible = true)}>
        <button class="stats-icon-btn" on:click={toggle} title="Statistik">
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                opacity="0.7"
            >
                <path
                    d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
                />
            </svg>
        </button>
    </div>
</div>

{#if visible}
    <div class="stats-panel" on:mouseleave={() => (visible = false)}>
        <h3 class="stats-title">Statistik Perjalanan</h3>

        <div class="stat-row">
            <span class="stat-label">Total Peristiwa</span>
            <span class="stat-value">{$events.length}</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Negara Dikunjungi</span>
            <span class="stat-value">{uniqueCountries}</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Lokasi Berbeda</span>
            <span class="stat-value">{uniqueCities}</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Rentang Waktu</span>
            <span class="stat-value">52 tahun</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Tahun Pengasingan</span>
            <span class="stat-value">~20 tahun</span>
        </div>

        <div class="stat-divider"></div>

        <div class="stat-progress-label">Perjalanan Saat Ini</div>
        <div class="stat-progress-bar">
            <div
                class="stat-progress-fill"
                style="width: {$events.length > 0
                    ? (($currentEventIndex + 1) / $events.length) * 100
                    : 0}%"
            ></div>
        </div>
    </div>
{/if}

<style>
    .top-right-btns {
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 1000;
        display: flex;
        gap: 8px;
        align-items: center;
    }

    .github-btn {
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--panel-bg);
        border: 1px solid var(--panel-border);
        border-radius: 10px;
        color: var(--gold);
        transition: all 0.2s;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        text-decoration: none;
    }

    .github-btn:hover {
        background: rgba(197, 165, 90, 0.15);
        transform: scale(1.05);
        color: var(--parchment);
    }

    .stats-icon-btn {
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--panel-bg);
        border: 1px solid var(--panel-border);
        border-radius: 10px;
        color: var(--gold);
        transition: all 0.2s;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    }

    .stats-icon-btn:hover {
        background: rgba(197, 165, 90, 0.15);
        transform: scale(1.05);
    }

    .stats-panel {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 240px;
        z-index: 1001;
        background: var(--panel-bg);
        backdrop-filter: blur(24px);
        border: 1px solid var(--panel-border);
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
        animation: fadeSlideUp 0.3s var(--ease-smooth);
    }

    .stats-title {
        font-family: var(--font-display);
        font-size: 14px;
        font-weight: 600;
        color: var(--gold);
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(197, 165, 90, 0.15);
    }

    .stat-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 0;
    }

    .stat-label {
        font-size: 12px;
        color: var(--muted-light);
    }

    .stat-value {
        font-family: var(--font-mono);
        font-size: 13px;
        font-weight: 600;
        color: var(--parchment);
    }

    .stat-divider {
        height: 1px;
        background: rgba(197, 165, 90, 0.12);
        margin: 10px 0;
    }

    .stat-progress-label {
        font-size: 11px;
        color: var(--muted);
        margin-bottom: 6px;
    }

    .stat-progress-bar {
        width: 100%;
        height: 4px;
        background: rgba(197, 165, 90, 0.1);
        border-radius: 2px;
        overflow: hidden;
    }

    .stat-progress-fill {
        height: 100%;
        background: linear-gradient(to right, var(--gold-dim), var(--gold));
        border-radius: 2px;
        transition: width 0.5s var(--ease-smooth);
    }
</style>

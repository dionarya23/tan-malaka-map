<script>
    import {
        currentEventIndex,
        events,
        isPlaying,
        playbackSpeed,
        progress,
        currentEvent,
        totalEvents,
    } from "$lib/store.js";

    let playInterval = null;

    const SPEED_OPTIONS = [
        {
            label: "Cepat",
            value: 2000,
            icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 6v6l4.7 2.8.8-1.3-3.5-2.1V6h-2zM10 2h4l-1 2h-2l-1-2zM4.1 5.5l1.4-1.4L7 5.6 5.6 7 4.1 5.5zM2 12h2v2H2v-2zm9-9h2v2h-2V3zm7.9 2.5l-1.4-1.4L16 5.6 17.4 7l1.5-1.5zM20 12h2v2h-2v-2z"/><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-14a6 6 0 1 1 0 12 6 6 0 0 1 0-12z"/></svg>`,
        },
        {
            label: "Normal",
            value: 4000,
            icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`,
        },
        {
            label: "Lambat",
            value: 6000,
            icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2v-2zm0-2h2V7h-2v7z"/></svg>`,
        },
    ];

    function play() {
        if ($currentEventIndex >= $totalEvents - 1) {
            $currentEventIndex = 0;
        }
        $isPlaying = true;
        clearInterval(playInterval);
        playInterval = setInterval(() => {
            if ($currentEventIndex < $totalEvents - 1) {
                $currentEventIndex++;
            } else {
                pause();
            }
        }, $playbackSpeed);
    }

    function pause() {
        $isPlaying = false;
        clearInterval(playInterval);
    }

    function togglePlay() {
        if ($isPlaying) pause();
        else play();
    }

    function prev() {
        pause();
        if ($currentEventIndex > 0) $currentEventIndex--;
    }

    function next() {
        pause();
        if ($currentEventIndex < $totalEvents - 1) $currentEventIndex++;
    }

    function onSlider(e) {
        pause();
        $currentEventIndex = parseInt(e.target.value);
    }

    function setSpeed(val) {
        $playbackSpeed = val;
        if ($isPlaying) {
            pause();
            play();
        }
    }

    $: if ($isPlaying && $playbackSpeed) {
    }
</script>

<div class="timeline">
    <div class="timeline-event-info">
        {#if $currentEvent}
            <span class="event-date">{$currentEvent.date}</span>
            <span class="event-divider">—</span>
            <span class="event-title-text">{$currentEvent.title}</span>
            <span class="event-loc">{$currentEvent.location}</span>
        {:else}
            <span class="event-date">Memuat...</span>
        {/if}
    </div>

    <div class="timeline-controls">
        <div class="player-btns">
            <button
                class="ctrl-btn"
                on:click={prev}
                disabled={$currentEventIndex <= 0}
                title="Sebelumnya"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    ><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg
                >
            </button>
            <button
                class="ctrl-btn play-btn"
                on:click={togglePlay}
                title={$isPlaying ? "Jeda" : "Putar"}
            >
                {#if $isPlaying}
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        ><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg
                    >
                {:else}
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"><path d="M8 5v14l11-7z" /></svg
                    >
                {/if}
            </button>
            <button
                class="ctrl-btn"
                on:click={next}
                disabled={$currentEventIndex >= $totalEvents - 1}
                title="Selanjutnya"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    ><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg
                >
            </button>
        </div>

        <div class="slider-area">
            <input
                type="range"
                class="timeline-slider"
                min="0"
                max={$totalEvents - 1}
                value={$currentEventIndex}
                on:input={onSlider}
            />
            <div class="slider-labels">
                <span>1897</span>
                <span class="progress-text">
                    {$currentEventIndex + 1}/{$totalEvents} · {$currentEvent
                        ? $currentEvent.age + " tahun"
                        : ""} · {$progress}%
                </span>
                <span>1949</span>
            </div>
        </div>

        <div class="speed-btns">
            {#each SPEED_OPTIONS as opt}
                <button
                    class="speed-btn"
                    class:active={$playbackSpeed === opt.value}
                    on:click={() => setSpeed(opt.value)}
                    title={opt.label}
                >
                    {@html opt.icon}
                </button>
            {/each}
        </div>
    </div>
</div>

<style>
    .timeline {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: min(94vw, 900px);
        z-index: 1000;
        background: var(--panel-bg);
        backdrop-filter: blur(20px);
        border: 1px solid var(--panel-border);
        border-bottom: none;
        border-radius: 14px 14px 0 0;
        padding: 14px 20px 16px;
        box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.5);
    }

    .timeline-event-info {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(197, 165, 90, 0.12);
        flex-wrap: wrap;
        min-height: 24px;
    }

    .event-date {
        font-family: var(--font-mono);
        font-size: 12px;
        color: var(--gold);
        background: rgba(197, 165, 90, 0.12);
        padding: 2px 8px;
        border-radius: 4px;
        white-space: nowrap;
        letter-spacing: 0.5px;
    }

    .event-divider {
        color: var(--muted);
        font-size: 12px;
    }

    .event-title-text {
        font-family: var(--font-display);
        font-size: 14px;
        font-weight: 600;
        color: var(--parchment);
        flex: 1;
        min-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .event-loc {
        font-size: 11px;
        color: var(--muted-light);
        background: rgba(140, 123, 107, 0.15);
        padding: 2px 8px;
        border-radius: 4px;
        white-space: nowrap;
    }

    .timeline-controls {
        display: flex;
        align-items: center;
        gap: 14px;
    }

    .player-btns {
        display: flex;
        gap: 4px;
        flex-shrink: 0;
    }

    .ctrl-btn {
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: rgba(197, 165, 90, 0.08);
        border: 1px solid rgba(197, 165, 90, 0.15);
        color: var(--gold);
        transition: all 0.2s var(--ease-smooth);
    }

    .ctrl-btn:hover:not(:disabled) {
        background: rgba(197, 165, 90, 0.2);
        border-color: rgba(197, 165, 90, 0.4);
        transform: scale(1.05);
    }

    .ctrl-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }

    .play-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(197, 165, 90, 0.15);
        border: 1px solid rgba(197, 165, 90, 0.3);
    }

    .play-btn:hover {
        background: rgba(197, 165, 90, 0.25) !important;
        box-shadow: 0 0 20px rgba(197, 165, 90, 0.2);
    }

    .slider-area {
        flex: 1;
        min-width: 0;
    }

    .timeline-slider {
        width: 100%;
        height: 6px;
        -webkit-appearance: none;
        appearance: none;
        background: rgba(197, 165, 90, 0.12);
        border-radius: 3px;
        outline: none;
        cursor: pointer;
    }

    .timeline-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        background: var(--gold);
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid var(--ink);
        box-shadow: 0 0 10px rgba(197, 165, 90, 0.4);
        transition: all 0.2s;
    }

    .timeline-slider::-webkit-slider-thumb:hover {
        transform: scale(1.2);
        box-shadow: 0 0 16px rgba(197, 165, 90, 0.6);
    }

    .timeline-slider::-moz-range-thumb {
        width: 16px;
        height: 16px;
        background: var(--gold);
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid var(--ink);
        box-shadow: 0 0 10px rgba(197, 165, 90, 0.4);
    }

    .slider-labels {
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
        font-size: 10px;
        color: var(--muted);
        font-family: var(--font-mono);
    }

    .progress-text {
        color: var(--muted-light);
        letter-spacing: 0.3px;
    }

    .speed-btns {
        display: flex;
        gap: 3px;
        flex-shrink: 0;
    }

    .speed-btn {
        width: 30px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        font-size: 12px;
        background: rgba(197, 165, 90, 0.06);
        border: 1px solid rgba(197, 165, 90, 0.1);
        transition: all 0.2s;
    }

    .speed-btn.active {
        background: rgba(197, 165, 90, 0.2);
        border-color: var(--gold);
        color: var(--gold);
    }

    .speed-btn:hover {
        background: rgba(197, 165, 90, 0.15);
    }

    @media (max-width: 640px) {
        .timeline {
            width: 100vw;
            border-radius: 12px 12px 0 0;
            padding: 10px 14px 14px;
        }
        .event-title-text {
            font-size: 13px;
        }
        .speed-btns {
            display: none;
        }
        .timeline-controls {
            gap: 8px;
        }
    }
</style>

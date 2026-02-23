<script>
    import { currentEvent, showEventPanel } from "$lib/store.js";

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

    function toggle() {
        $showEventPanel = !$showEventPanel;
    }
</script>

{#if $currentEvent}
    <div class="panel" class:collapsed={!$showEventPanel}>
        <button
            class="toggle-btn"
            on:click={toggle}
            title={$showEventPanel ? "Sembunyikan" : "Tampilkan"}
        >
            {$showEventPanel ? "‹" : "›"}
        </button>

        {#if $showEventPanel}
            <div class="panel-content">
                <!-- Header -->
                <div class="panel-header">
                    <div class="header-top">
                        <span class="cat-badge cat-{$currentEvent.category}">
                            {CATEGORY_LABELS[$currentEvent.category] ||
                                $currentEvent.category}
                        </span>
                        <span class="age-badge">{$currentEvent.age} tahun</span>
                    </div>
                    <h2 class="event-title">{$currentEvent.title}</h2>
                    <div class="event-meta">
                        <span class="meta-date">{$currentEvent.date}</span>
                        <span class="meta-sep">·</span>
                        <span class="meta-loc">{$currentEvent.location}</span>
                    </div>
                </div>

                <!-- Divider -->
                <div class="divider">
                    <div class="divider-line"></div>
                    <div class="divider-ornament">❖</div>
                    <div class="divider-line"></div>
                </div>

                <p class="description">{$currentEvent.description}</p>

                <div class="panel-footer">
                    <span class="footer-text">Dari Penjara ke Penjara</span>
                </div>
            </div>
        {/if}
    </div>
{/if}

<style>
    .panel {
        position: absolute;
        top: 20px;
        left: 20px;
        width: 340px;
        z-index: 1000;
        transition: all 0.4s var(--ease-smooth);
    }

    .panel.collapsed {
        width: 36px;
    }

    .toggle-btn {
        position: absolute;
        top: 12px;
        right: -16px;
        width: 32px;
        height: 32px;
        background: var(--panel-bg);
        border: 1px solid var(--panel-border);
        border-radius: 0 8px 8px 0;
        color: var(--gold);
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
        transition: all 0.2s;
    }

    .toggle-btn:hover {
        background: rgba(197, 165, 90, 0.15);
        color: var(--parchment);
    }

    .panel-content {
        background: var(--panel-bg);
        backdrop-filter: blur(24px);
        border: 1px solid var(--panel-border);
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
        animation: fadeSlideUp 0.4s var(--ease-smooth);
    }

    .panel-header {
        margin-bottom: 0;
    }

    .header-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .cat-badge {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        padding: 3px 10px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .cat-badge.cat-birth {
        background: rgba(197, 165, 90, 0.15);
        color: #c5a55a;
    }
    .cat-badge.cat-education {
        background: rgba(58, 124, 165, 0.15);
        color: #3a7ca5;
    }
    .cat-badge.cat-activism {
        background: rgba(166, 46, 46, 0.15);
        color: #e05555;
    }
    .cat-badge.cat-exile {
        background: rgba(184, 115, 51, 0.15);
        color: #d4944a;
    }
    .cat-badge.cat-international {
        background: rgba(58, 124, 165, 0.15);
        color: #5bc0eb;
    }
    .cat-badge.cat-imprisonment {
        background: rgba(107, 58, 93, 0.15);
        color: #a06090;
    }
    .cat-badge.cat-revolution {
        background: rgba(139, 26, 26, 0.15);
        color: #e05555;
    }
    .cat-badge.cat-death {
        background: rgba(74, 74, 74, 0.2);
        color: #999;
    }

    .cat-icon {
        font-size: 12px;
    }

    .age-badge {
        font-family: var(--font-mono);
        font-size: 11px;
        color: var(--muted-light);
        background: rgba(140, 123, 107, 0.12);
        padding: 3px 8px;
        border-radius: 4px;
    }

    .event-title {
        font-family: var(--font-display);
        font-size: 20px;
        font-weight: 700;
        color: var(--parchment);
        line-height: 1.3;
        margin-bottom: 8px;
    }

    .event-meta {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: var(--muted);
    }

    .meta-date {
        font-family: var(--font-mono);
        color: var(--gold-dim);
    }

    .meta-sep {
        color: rgba(197, 165, 90, 0.3);
    }

    .meta-loc {
        color: var(--muted-light);
    }

    .divider {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 16px 0;
    }

    .divider-line {
        flex: 1;
        height: 1px;
        background: linear-gradient(
            to right,
            transparent,
            rgba(197, 165, 90, 0.3),
            transparent
        );
    }

    .divider-ornament {
        color: rgba(197, 165, 90, 0.3);
        font-size: 10px;
    }

    .description {
        font-family: var(--font-body);
        font-size: 14px;
        line-height: 1.7;
        color: var(--parchment-dark);
        margin-bottom: 16px;
    }

    .panel-footer {
        text-align: center;
        padding-top: 12px;
        border-top: 1px solid rgba(197, 165, 90, 0.1);
    }

    .footer-text {
        font-family: var(--font-display);
        font-style: italic;
        font-size: 11px;
        color: rgba(197, 165, 90, 0.35);
        letter-spacing: 1px;
    }

    @media (max-width: 640px) {
        .panel {
            top: 10px;
            left: 10px;
            width: calc(100vw - 20px);
            max-width: 340px;
        }
        .event-title {
            font-size: 17px;
        }
        .panel-content {
            padding: 14px;
        }
    }
</style>

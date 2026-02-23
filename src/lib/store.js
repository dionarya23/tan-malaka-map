import { writable, derived } from 'svelte/store';

export const events = writable([]);
export const currentEventIndex = writable(0);
export const isPlaying = writable(false);
export const playbackSpeed = writable(2000);
export const showEventPanel = writable(true);

export const currentEvent = derived(
    [events, currentEventIndex],
    ([$events, $idx]) => $events[$idx] || null
);

export const totalEvents = derived(events, ($e) => $e.length);

export const progress = derived(
    [currentEventIndex, totalEvents],
    ([$idx, $total]) => $total > 0 ? Math.round(($idx / ($total - 1)) * 100) : 0
);

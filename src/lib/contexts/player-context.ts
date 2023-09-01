import type { Writable } from 'svelte/store';
import type { Player } from '$lib/core';

export type PlayerContext = Writable<Record<string, Writable<Player>>>;

export const PLAYER_CONTEXT = Symbol('players');

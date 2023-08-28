import { describe, it, expect } from 'vitest';
import { generateSlates, generateRoundRobinMatches } from '$lib/core';

const mockPlayers = (numPlayers: number) => {
	return [
		{ id: 'a', name: 'paul', present: true, playing: false, rank: 1000 },
		{ id: 'b', name: 'joe', present: true, playing: false, rank: 2000 },
		{ id: 'c', name: 'mary', present: true, playing: false, rank: 3000 },
		{ id: 'd', name: 'ted', present: true, playing: false, rank: 4000 },
		{ id: 'e', name: 'zach', present: true, playing: false, rank: 5000 },
		{ id: 'f', name: 'glenn', present: true, playing: false, rank: 6000 },
		{ id: 'g', name: 'luis', present: true, playing: false, rank: 1500 },
		{ id: 'h', name: 'henry', present: true, playing: false, rank: 2500 },
		{ id: 'i', name: 'moe', present: true, playing: false, rank: 3500 },
		{ id: 'j', name: 'paulina', present: true, playing: false, rank: 4500 },
		{ id: 'k', name: 'esther', present: true, playing: false, rank: 5500 },
		{ id: 'l', name: 'keaton', present: true, playing: false, rank: 6500 },
		{ id: 'm', name: 'mike', present: true, playing: false, rank: 100 },
		{ id: 'n', name: 'andy', present: true, playing: false, rank: 200 },
		{ id: 'o', name: 'vincent', present: true, playing: false, rank: 300 },
		{ id: 'p', name: 'marcel', present: true, playing: false, rank: 400 }
	].slice(0, numPlayers);
};

describe('generateRoundRobinMatches', () => {
	it('generates matches for 1', () => {
		const result = generateRoundRobinMatches(mockPlayers(1), 3);
		expect(result.length).toBe(0);
	});

	it('generates matches for 2', () => {
		const result = generateRoundRobinMatches(mockPlayers(2), 3);
		expect(result.length).toBe(1);
	});

	it('generates matches for 3', () => {
		const result = generateRoundRobinMatches(mockPlayers(3), 3);
		expect(result.length).toBe(3);
	});

	it('generates matches for 4', () => {
		const result = generateRoundRobinMatches(mockPlayers(4), 3);
		expect(result.length).toBe(3 + 2 + 1);
	});

	it('generates matches for 16', () => {
		const result = generateRoundRobinMatches(mockPlayers(16), 3);
		expect(result.length).toBe(15 + 14 + 13 + 12 + 11 + 10 + 9 + 8 + 7 + 6 + 5 + 4 + 3 + 2 + 1);
	});
});

describe('generateSlates', () => {
	const mockVenues = (numVenues: number) => {
		return Array.from({ length: numVenues }, (v, k) => ({ name: `Table ${k + 1}` }));
	};
	it('should return an empty list if given no venues', () => {
		const result = generateSlates([], mockPlayers(16), 3);

		expect(result.length).toBe(0);
	});

	it('should return a slate per venue with an evenly divisible set of players', () => {
		const result = generateSlates(mockVenues(4), mockPlayers(16), 3);

		expect(result.length).toBe(4);

		expect(result[0].matches.length).toBe(6);
		expect(result[1].matches.length).toBe(6);
		expect(result[2].matches.length).toBe(6);
		expect(result[3].matches.length).toBe(6);
	});

	it('should return a slate for 16 players with 3 venues', () => {
		const result = generateSlates(mockVenues(3), mockPlayers(16), 3);

		expect(result.length).toBe(3);

		expect(result[0].matches.length).toBe(5 + 4 + 3 + 2 + 1);
		expect(result[1].matches.length).toBe(4 + 3 + 2 + 1);
		expect(result[2].matches.length).toBe(4 + 3 + 2 + 1);
	});

	it('should return a slate for 10 players with 3 venues', () => {
		const result = generateSlates(mockVenues(3), mockPlayers(10), 3);

		expect(result.length).toBe(3);

		expect(result[0].matches.length).toBe(3 + 2 + 1);
		expect(result[1].matches.length).toBe(2 + 1);
		expect(result[2].matches.length).toBe(2 + 1);
	});

	it('should return a slate for 7 players with 2 venues', () => {
		const result = generateSlates(mockVenues(2), mockPlayers(7), 3);

		expect(result.length).toBe(2);

		expect(result[0].matches.length).toBe(3 + 2 + 1);
		expect(result[1].matches.length).toBe(2 + 1);
	});
});

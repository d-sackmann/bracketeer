class AssertionError extends Error {}

export function assertTrue(claim: boolean, message?: string): asserts claim {
	if (!claim) throw new AssertionError(message || 'Assertion violated');
}

export function sum(list: number[]) {
	return list.reduce((acc, next) => acc + next, 0);
}

export function tally<T>(list: T[], predicate: (e: T, i?: number, l?: T[]) => boolean): number {
	return list.reduce((acc, next, i, l) => {
		if (predicate(next, i, l)) return acc + 1;
		return acc;
	}, 0);
}

export function keyBy<T, K extends keyof T>(list: T[] = [], propName: K): Map<T[K], T> {
	const result = new Map<T[K], T>();

	for (let i = 0; i < list.length; i++) {
		result.set(list[i][propName], list[i]);
	}

	return result;
}

export function arrayEquals<T extends K, K>(arr1: T[], arr2: K[]): boolean {
	return arr1.length === arr2.length && arr1.every((arr1Val) => arr2.includes(arr1Val));
}

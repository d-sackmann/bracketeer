import { describe, it, expect } from 'vitest';
import getDatabase from './initializeDb';
import { createAppUser } from './users';

describe('createAppUser', () => {
	it('should create an app user', () => {
		const userId = createAppUser({});

		const userRow = getDatabase()
			.prepare('SELECT id FROM appUser where id = :userId')
			.get({ userId }) as { id: string };
		expect(userRow?.id).toBe(userId);
	});
});

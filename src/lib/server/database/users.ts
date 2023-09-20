import { v4 as uuid } from 'uuid';
import { createAppUserStmt } from './statements';

type NewUser = object;
export function createAppUser(_userData: NewUser) {
	const userId = uuid();
	createAppUserStmt.run({ id: userId });

	return userId;
}

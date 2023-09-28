import { v4 as uuid } from 'uuid';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies }) => {
	if (cookies.get('sessionId')) {
		return;
	}
	cookies.set('sessionId', uuid(), { httpOnly: false, secure: false, path: '/' });
};

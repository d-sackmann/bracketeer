import { browser } from '$app/environment';
import { readable, type Subscriber } from 'svelte/store';

export default function source(url: string) {
	let source: EventSource;
	return {
		subscribe(cb: Subscriber<string>) {
			if (!browser) {
				return readable('').subscribe(cb);
			}

			source = new EventSource(url);
			const store = readable('', function (set) {
				const listener = function (event: MessageEvent) {
					set(event.data);
				};

				source.addEventListener('score-change', listener);

				return function stop() {
					source.removeEventListener('score-change', listener);
				};
			});

			return store.subscribe(cb);
		},

		close() {
			if (source && source.readyState !== 2) {
				source.close();
			}
		}
	};
}

import { browser } from '$app/environment';
import { readable, type Readable, type Subscriber } from 'svelte/store';

export type ScoreChangeEventSource = Readable<string> & {
	close: () => void;
};
export default function source(url: string): ScoreChangeEventSource {
	let source: EventSource;
	let store: Readable<string>;
	return {
		subscribe(cb: Subscriber<string>) {
			if (!browser) {
				return readable('').subscribe(cb);
			}

			source = source || new EventSource(url);
			store =
				store ||
				readable('', function (set) {
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

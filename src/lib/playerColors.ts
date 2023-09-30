export type PlayerColor =
	| 'red'
	| 'orange'
	| 'green'
	| 'blue'
	| 'pink'
	| 'purple'
	| 'brown'
	| 'grey';

export type ColorScheme = {
	primaryBg: string;
	secondaryBg: string;
};
export const ALL_COLORS = ['red', 'green', 'blue', 'pink', 'orange', 'purple', 'brown', 'grey'];

const colorsByTheme: Record<string, ColorScheme> = {
	red: {
		secondaryBg: '#fe5757',
		primaryBg: '#cb2424'
	},
	orange: {
		primaryBg: '#fb7200',
		secondaryBg: '#e36700'
	},
	green: {
		primaryBg: '#00b100',
		secondaryBg: '#00cb00'
	},
	blue: {
		primaryBg: '#001be7',
		secondaryBg: '#004fff'
	},
	pink: {
		primaryBg: '#ff33ff',
		secondaryBg: '#ff66ff'
	},
	purple: {
		primaryBg: '#4c0099',
		secondaryBg: '#6600cc'
	},
	brown: {
		primaryBg: '#9f530a',
		secondaryBg: '#9f6210'
	},
	grey: {
		primaryBg: '#969696',
		secondaryBg: '#7b7d7b'
	}
};

export function getColorScheme(color: PlayerColor) {
	return colorsByTheme[color] || colorsByTheme.gray;
}

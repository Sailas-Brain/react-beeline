export type TList = {
	key: number;
	title: string;
	rate: number;
	reviews: number;
	image: {
		width: number;
		height: number;
		preview: boolean;
		src: string;
	};
	memory: string;
	camera: string;
	screen: string;
	price: string;
	promo: {
		isActive: boolean,
		isDisabled: boolean,
		label: string,
	};
	color: {
		isActive: boolean,
		isDisabled: boolean,
		label: string,
		color: string
	}
}
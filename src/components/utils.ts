

export const calcWidth = (data: { screenWidth: number, screenHeight: number }): number => {
	if (data.screenWidth < 500) {
		return Math.floor(data.screenWidth * 0.9);
	}
	return Math.floor(data.screenWidth / 3.1);
}

export const getFullURL = (endpoint: string) => import.meta.env.VITE_BASE_URL + endpoint; 
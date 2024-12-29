export function getFormattedDate(date: string) {
	return new Date(date).toLocaleDateString("en-us", {
		year: "numeric",
		month: "numeric",
		day: "numeric",
	});
}

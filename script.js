const leftPad = (s, n, ch) => {
	s = '' + s;  // Ensure s is a string.
	if (s.length >= n) return s;
	return [...new Array(n - s.length)].map(_ => ch).join('') + s;
};

const now = new Date();
const tzOffs = now.getTimezoneOffset();
const tzDiff = Math.abs(tzOffs);
const [tzHours, tzMinutes] = [Math.trunc(tzDiff / 60), tzDiff % 60];
let tzString = [...leftPad(tzHours, 2, '0'), ...leftPad(tzMinutes, 2, '0')];
tzString.splice(2, 0, ":");
tzString = tzString.join('');
const tzHTML = [
	'<span class="tzOffs">GMT',
	tzOffs > 0 ? '-' : '+',
	tzString, '</span>'
].join('');

console.log(tzHTML);

let timeElem = null;  // Wait for DOM load.

const startTime = () => {
	const today = new Date();
	let h = today.getHours();
	let m = today.getMinutes();
	let s = today.getSeconds();
	// Add a zero in front of numbers <10.
	h = leftPad(h, 2, '0');
	m = leftPad(m, 2, '0');
	s = leftPad(s, 2, '0');

	timeElem.innerHTML = '<span class="hour">' + h + '</span>'
		+ ":" + '<span class="min">' + m + '</span>'
		+ ":" + '<span class="sec">' + s + '</span>'
		+ tzHTML;
	t = setTimeout(startTime, 500); // Refresh every 0.5s.
}

/* Wait for page load */
let columns = null;
let searchBox = null
let currentCol = 1;
let currentRow = 1;
let firstPress = true;

// Start on page load.
document.addEventListener("DOMContentLoaded", () => {
	timeElem = document.getElementById('time');
	columns = document.getElementsByClassName('favorites-list');
	searchBox = document.getElementById('search-box');
	searchBox.focus();
	startTime()
});

const getRows = column =>
	column.getElementsByTagName("a")

const focusByIndex = (x, y) =>
	getRows(columns[x - 1])[y - 1].focus();

// Use vim-keys or arrow keys to navigate.
// Also allow number-keys to select column.
document.addEventListener("keydown", event => {
	if (event.code == "Escape") {
		if (searchBox !== document.activeElement) {
			searchBox.focus();
			return
		}
	}
	// Ignore keyboard navigation if we're using the search-box.
	if (searchBox == document.activeElement) {
		if (event.code == "Tab" || event.code == "Escape") {
			firstPress = false;
			focusByIndex(currentCol, currentRow);
			event.preventDefault();
		}
		return;
	}

	if (firstPress && getRows(columns[0])[0] == document.activeElement)
		firstPress = false;

	switch (event.code) {
	case "KeyH":
	case "ArrowLeft":
		currentCol -= 1;
		break;
	case "KeyJ":
	case "ArrowDown":
		currentRow += 1;
		break;
	case "Tab":
		console.log("Tab stolen.");
		currentRow += event.shiftKey ? -1 : 1;
		event.preventDefault();
		break;
	case "KeyK":
	case "ArrowUp":
		currentRow -= 1;
		break;
	case "KeyL":
	case "ArrowRight":
		currentCol += 1;
		break;
	case "Digit1":
		currentCol = 1;
		firstPress = false;
		focusByIndex(1, 1);
		return;
	case "Digit2":
		currentCol = 2;
		firstPress = false;
		focusByIndex(2, 1);
		break;
	case "Digit3":
		currentCol = 3;
		firstPress = false;
		focusByIndex(3, 1);
		break;
	default:
		return;
	}

	if (firstPress) {
		firstPress = false;
		currentCol = 1;
		currentRow = 1;
		focusByIndex(currentCol, currentRow);
		return;
	}

	let column = null;
	let row = null;
	const clampCol = () => {
		if (currentCol > columns.length)
				currentCol = 1;
		if (currentCol < 1)
			currentCol = columns.length;

		column = columns[currentCol - 1];
		rows = getRows(column);
	}

	clampCol();

	if (currentRow > rows.length) {
		currentCol += 1;
		clampCol();
		currentRow = 1;
	} else if (currentRow < 1) {
		currentCol -= 1;
		clampCol();
		currentRow = rows.length;
	}

	rows[currentRow - 1].focus();
});

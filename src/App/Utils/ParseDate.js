const months = {
	janvier: 1,
	février: 2,
	mars: 3,
	avril: 4,
	mai: 5,
	juin: 6,
	juillet: 7,
	août: 8,
	septembre: 9,
	octobre: 10,
	novembre: 11,
	décembre: 12,
};

const parseUrl = (url, withoutHttp = false) => {
	if (withoutHttp) {
		url = url.replace("https://", "").replace("http://", "").replace("/", "%2F");
	} else {
		if (!url.includes("https") && !url.includes("http")) {
			url = "https://" + url;
		}
	}

	return url;
};

const parseDate = (record) => {
	let dates = record.periode_principale_de_deroulement_du_festival ? (record.periode_principale_de_deroulement_du_festival.match(/\(([^)]+)\)/) ? record.periode_principale_de_deroulement_du_festival.match(/\(([^)]+)\)/)[1] : record.periode_principale_de_deroulement_du_festival) : null;

	const datesArray = dates ? dates.split(" - ") : null;
	const year = new Date().getFullYear();
	let begginDate = "1/1/" + year;
	let endDate = "31/12/" + year;

	if (datesArray && datesArray.length === 2) {
		let begginMonth = datesArray[0].split(" ")[1].toLowerCase();
		let endMonth = datesArray[1].split(" ")[1].toLowerCase();
		const begginDateMonth = months[begginMonth];
		const endDateMonth = months[endMonth];
		let begginDay = parseInt(datesArray[0].split(" ")[0].match(/\d+/)[0], 10);
		let endDay = parseInt(datesArray[1].split(" ")[0]);
		begginDate = begginDay + "/" + begginDateMonth + "/" + year;
		endDate = endDay + "/" + endDateMonth + "/" + year;
		dates = begginDate + " - " + endDate;
	} else if (datesArray && datesArray.length === 1) {
		const date = new Date();
		const year = date.getFullYear();
		begginDate = datesArray[0].split(" ");
		let month = begginDate[0].toLowerCase();
		const begginDateMonth = months[month];
		const endDateMonth = months[month];
		let begginDay = 1;
		let endDay = new Date(year, begginDateMonth, 0).getDate();
		begginDate = begginDay + "/" + begginDateMonth + "/" + year;
		endDate = endDay + "/" + endDateMonth + "/" + year;
		dates = begginDate + " - " + endDate;
	} else {
		dates = begginDate + " - " + endDate;
	}

	// console.log(dates);
	return dates;
};

export {parseDate, parseUrl};

import "./ZoneInfo.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark, faLocationDot, faMapPin, faAngleDown, faCalendar, faBus, faTrainTram} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import WeatherIcon from "../WeatherIcon/WeatherIcon";
import {parseUrl} from "../../Utils/ParseDate";
import ShareNetworks from "../ShareNetworks/ShareNetworks";

function ZoneInfo({open, festivalInfo, onClose}) {
	const [dataWeather, setDataWeather] = useState([]);
	const [dataWeatherDays, setDataWeatherDays] = useState([]);
	const [transportData, setTransportData] = useState([]); // État pour stocker les données de transport
	const [dataAccomodation, setDataAccomodation] = useState([]); // État pour stocker les données d'hébergement

	//Fecth les données de transport
	const fetchTransportData = async () => {
		const apiKey = "1b639f26-d7db-439d-81d7-0446801d9ac5";
		try {
			const res = await fetch(`https://api.navitia.io/v1/coverage/${festivalInfo.geocodage_xy.lon};${festivalInfo.geocodage_xy.lat}/coords/${festivalInfo.geocodage_xy.lon};${festivalInfo.geocodage_xy.lat}/arrivals`, {
				headers: {
					Authorization: apiKey,
				},
			});

			if (res.ok) {
				const dataTransport = await res.json();
				console.log(dataTransport);
				setTransportData(dataTransport);
			} else {
				console.error("Erreur lors de la récupération des données.");
			}
		} catch (error) {
			console.error("Erreur lors de la récupération des données.", error);
		}
	};
	// fetch les données d'hébergement
	const fetchAccomodationData = async () => {
		try {
			const res = await fetch(`https://data.opendatasoft.com/api/records/1.0/search/?dataset=air-bnb-listings@public&facet=column_19&refine.column_19=France&geofilter.distance=${festivalInfo.geocodage_xy.lat},${festivalInfo.geocodage_xy.lon},30000`);
			if (res.ok) {
				const dataAccomodation = await res.json();
				console.log(dataAccomodation);
				setDataAccomodation(dataAccomodation);
			} else {
				console.error("Erreur lors de la récupération des données.");
			}
		} catch (error) {
			console.error("Erreur lors de la récupération des données.", error);
		}
	};

	// Fetch la météo du jour
	const fetchWeatherData = async () => {
		try {
			const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${festivalInfo.geocodage_xy.lat}&lon=${festivalInfo.geocodage_xy.lon}&units=metric&lang=fr&appid=02822772050e71f4024a80ef96da348f`);
			if (res.ok) {
				const dataWeather = await res.json();
				console.log(dataWeather);
				setDataWeather(dataWeather);
			} else {
				console.error("Erreur lors de la récupération des données.");
			}
		} catch (error) {
			console.error("Erreur lors de la récupération des données.", error);
		}
	};

	const fetchWeatherDataAllDays = () => {
		fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?lat=${festivalInfo.geocodage_xy.lat}&lon=${festivalInfo.geocodage_xy.lon}&cnt=7&lang=fr&units=metric&appid=02822772050e71f4024a80ef96da348f`)
			.then((res) => res.json())
			.then((res) => {
				setDataWeatherDays(res);
			});
	};

	useEffect(() => {
		setTransportData([]);
		if (festivalInfo) {
			fetchWeatherData();
			fetchWeatherDataAllDays();
			fetchTransportData();
			fetchAccomodationData();
		}
	}, [festivalInfo]);

	const iconCode = dataWeather.weather ? dataWeather.weather[0].icon : null; // Récupère le code d'icône de l'API OpenWeather

	return (
		<div className={`zoneInfo zoneInfo-${open ? "enter-active" : "exit"}`}>
			<button onClick={() => onClose()} className="close">
				<FontAwesomeIcon icon={faXmark} className="faXmark" />
			</button>
			<div className="container">
				{!festivalInfo && <p>Aucun Festival est sélectionné</p>}
				{festivalInfo && (
					<>
						<ShareNetworks data={festivalInfo}></ShareNetworks>
						<h2>{festivalInfo.nom_du_festival}</h2>
						{festivalInfo.annee_de_creation_du_festival && (
							<>
								<p>
									Festival qui a lieu depuis <strong>{festivalInfo.annee_de_creation_du_festival}.</strong>
								</p>
							</>
						)}
						{festivalInfo.periode_principale_de_deroulement_du_festival && (
							<>
								<p>
									Se déroulant habituellement en <br />
									{festivalInfo.periode_principale_de_deroulement_du_festival}
								</p>
							</>
						)}
						{festivalInfo.departement_principal_de_deroulement && (
							<>
								<p>Département : {festivalInfo.departement_principal_de_deroulement}</p>
							</>
						)}
						{festivalInfo.site_internet_du_festival && (
							<div className="containerSiteWebFestival">
								<a href={parseUrl(festivalInfo.site_internet_du_festival)} target="_blank" rel="noreferrer" className="siteWebFestival">
									Site web du festival
								</a>
							</div>
						)}
						{festivalInfo.geocodage_xy.lon && festivalInfo.geocodage_xy.lat && (
							<>
								<a href={`https://www.google.com/maps/search/?api=1&query=${festivalInfo.geocodage_xy.lat},${festivalInfo.geocodage_xy.lon}`} target="_blank" rel="noreferrer" className="googleMaps">
									<FontAwesomeIcon icon={faMapPin} />
									&nbsp; Voir sur Google Maps
								</a>
							</>
						)}
						{dataWeather.main && (
							<div>
								<div className="weatherDay">
									<h3>Météo du jour</h3>
									<div className="containerContentWeatherDay">
										<WeatherIcon iconCode={iconCode} />
										<div className="contentWeatherDay">
											<p>{Math.round(dataWeather.main.temp_max)}°C</p>
											<p>{dataWeather.weather[0].description}</p>
											<p>
												<FontAwesomeIcon icon={faLocationDot} className="faLocationDotWeather" />
												&nbsp;
												{dataWeather.name}
											</p>
										</div>
									</div>
									<details className="meteoOtherDays">
										<summary>
											En savoir plus sur la météo des 7 prochains jours...&nbsp;
											<FontAwesomeIcon icon={faAngleDown} />
										</summary>
										{dataWeatherDays.list && (
											<div className="containerContentWeatherDays">
												{dataWeatherDays.list.map((item, index) => (
													<div key={index}>
														<p className="dateWeather">
															<FontAwesomeIcon icon={faCalendar} />
															&nbsp;&nbsp;
															<strong>{new Date(item.dt * 1000).toLocaleDateString("fr-FR", {day: "numeric", month: "numeric"})}</strong>
														</p>
														<WeatherIcon iconCode={item.weather[0].icon} />
														<p>{Math.round(item.temp.day)}°C</p>
													</div>
												))}
											</div>
										)}
									</details>
								</div>
							</div>
						)}
						{transportData && (
							<div className="transport">
								<h3>Transports</h3>
								{transportData.arrivals ? (
									<div className="containerContentTransport">
										{transportData.arrivals.map((item, index) => (
											<div key={index}>
												<p>
													<strong>{item.route.name}</strong>
												</p>
												<p>
													<FontAwesomeIcon icon={faLocationDot} className="faLocationDotTransport" />
													&nbsp;
													{item.stop_point.name}
												</p>
												{/* Type de transport */}
												<p>
													<strong>
														{item.stop_date_time.arrival_date_time.slice(9, 11)}h{item.stop_date_time.arrival_date_time.slice(11, 13)} - {item.display_informations.physical_mode === "Bus" && <FontAwesomeIcon icon={faBus} className="faBus" />}
														{item.display_informations.physical_mode === "Tramway" && <FontAwesomeIcon icon={faTrainTram} className="faBus" />}&nbsp;
														<strong>{item.display_informations.physical_mode}</strong>
													</strong>
												</p>
											</div>
										))}
									</div>
								) : (
									<p>Il n'y a aucun moyen de transport disponible pour le moment.</p>
								)}
							</div>
						)}

						{dataAccomodation && (
							<div className="accomodation">
								<h3>Hébergement</h3>
								{dataAccomodation.records && dataAccomodation.records.length > 0 ? (
									<div className="containerContentAccomodation">
										{dataAccomodation.records.map((item, index) => (
											<div key={index}>
												<p>
													<strong>{item.fields.name}</strong>
												</p>
												<p>
													<FontAwesomeIcon icon={faLocationDot} className="faLocationDotAccomodation" />
													&nbsp;
													{item.fields.city}
												</p>
												<p>
													<strong>{item.fields.room_type}</strong>
												</p>
											</div>
										))}
									</div>
								) : (
									<p>Il n'y a aucun hébergement disponible pour le moment à proximité.</p>
								)}
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}

export default ZoneInfo;

import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSun, faMoon, faCloudSun, faCloudMoon, faCloud, faCloudShowersHeavy, faCloudRain, faBolt, faSnowflake, faSmog, faQuestion} from "@fortawesome/free-solid-svg-icons";
import "./WeatherIcon.css";

const WeatherIcon = ({iconCode}) => {
	const iconMapping = {
		"01d": faSun,
		"01n": faMoon,
		"02d": faCloudSun,
		"02n": faCloudMoon,
		"03d": faCloud,
		"03n": faCloud,
		"04d": faCloud,
		"04n": faCloud,
		"09d": faCloudShowersHeavy,
		"09n": faCloudShowersHeavy,
		"10d": faCloudRain,
		"10n": faCloudRain,
		"11d": faBolt,
		"11n": faBolt,
		"13d": faSnowflake,
		"13n": faSnowflake,
		"50d": faSmog,
		"50n": faSmog,
	};

	const fontAwesomeIcon = iconMapping[iconCode] || faQuestion; // Utilisez une icône de question par défaut si le code d'icône n'est pas trouvé

	return <FontAwesomeIcon icon={fontAwesomeIcon} className="fontawesomeWeather" />;
};

export default WeatherIcon;

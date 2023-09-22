import "./App.css";
import Header from "./App/Components/Header/Header";
import * as React from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, {Marker, FullscreenControl, GeolocateControl, Popup} from "react-map-gl";
import {useState, useEffect, useCallback, useRef} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLocationDot} from "@fortawesome/free-solid-svg-icons";
import ZoneInfo from "./App/Components/ZoneInfo/ZoneInfo";
import Spinner from "./App/Components/Spinner/Spinner";
import PopupContent from "./App/Components/PopupContent/PopupContent";
import {parseDate} from "./App/Utils/ParseDate";

function App() {
	const [search, setSearch] = useState(""); // État pour stocker la valeur du champ de recherche
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showPopup, setShowPopup] = useState(false); // État pour contrôler l'affichage de la Popup
	const [selectedMarker, setSelectedMarker] = useState(null); // État pour stocker les informations du marqueur sélectionné
	const [filteredData, setFilteredData] = useState([]);

	const [showPopin, setShowPopin] = useState(false); // État pour contrôler l'affichage de la Popin
	const [festivalInfo, setFestivalInfo] = useState(null); // État pour stocker les informations du festival sélectionné

	const [viewState, setViewState] = useState({
		longitude: 3.06,
		latitude: 50.63,
		zoom: 8,
	});

	// useEffect(() => {
	// 	// Utilisez un service de géolocalisation pour obtenir la position de l'utilisateur
	// 	navigator.geolocation.getCurrentPosition((position) => {
	// 		const {longitude, latitude} = position.coords;
	// 		// Mettez à jour les états lng et lat avec les nouvelles coordonnées
	// 		setViewState({
	// 			longitude: longitude,
	// 			latitude: latitude,
	// 			zoom: 8,
	// 		});
	// 	});
	// }, []);

	// Fonction pour récupérer les données de l'API
	const fetchData = async () => {
		const res = await fetch("https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/festivals-global-festivals-_-pl/records?limit=100");
		const data = await res.json();

		data.results.forEach((item) => {
			item.date = parseDate(item);
		});

		setData(data);
		setIsLoading(false);
	};

	// Fonction pour filtrer les données en fonction de la valeur de recherche
	const filterData = (data) => {
		return data.results.filter((item) => {
			return item.nom_du_festival.toLowerCase().includes(search.toLowerCase());
		});
	};

	useEffect(() => {
		fetchData();
	}, []);

	const mapRef = useRef();

	const onSelectCity = useCallback(({longitude, latitude}) => {
		if (mapRef.current) {
			mapRef.current.flyTo({center: [longitude, latitude], duration: 2000, zoom: 10});
		}
	}, []);

	//	Gestion de la réucpération des données depuis l'url
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get("location-index")) {
			if (data.results) {
				handleMarkerClick(data.results[urlParams.get("location-index")], urlParams.get("location-index"));
			}
		}
	}, [data]);

	const handleMarkerClick = (item, index) => {
		item.map_index = index;
		setSelectedMarker(item); // Stockez les informations du marqueur sélectionné
		setViewState({
			longitude: item.geocodage_xy.lon,
			latitude: item.geocodage_xy.lat,
		});
		// Mettez à jour showPopup ici
		let markers = document.getElementsByClassName("faLocationDot");
		for (let i = 0; i < markers.length; i++) {
			markers[i].classList.remove("active");

			if (markers[i].dataset.marker === "marker-" + index) {
				markers[i].classList.add("active");
			}
		}
		onSelectCity({longitude: item.geocodage_xy.lon, latitude: item.geocodage_xy.lat});
		setFestivalInfo(item);

		setShowPopup(true);
	};

	return (
		<>
			{data.results && (
				<Header
					search={search}
					onSearchChange={(value) => {
						setSearch(value);
						setShowPopup(false);
					}}
					handleMarkerClick={handleMarkerClick}
					data={data}
				/>
			)}

			<div className="App">
				{isLoading ? (
					// Affichez le spinner lorsque les données sont en cours de chargement
					<Spinner></Spinner>
				) : (
					<div className="map-container">
						<Map mapboxAccessToken="pk.eyJ1IjoiamRlcmFjaGUiLCJhIjoiY2xtcmtyZXkwMDF2czJpb2wyaGIxemg1eiJ9.34_nRdMh5dmWByoKgnzwNw" initialViewState={"zoom: 7;"} {...viewState} onMove={(evt) => setViewState(evt.viewState)} ref={mapRef} mapStyle="mapbox://styles/mapbox/streets-v9">
							{!isLoading &&
								filterData(data).map((item, index) => {
									return (
										<Marker
											key={index}
											longitude={item.geocodage_xy.lon}
											latitude={item.geocodage_xy.lat}
											anchor="bottom"
											onClick={() => {
												handleMarkerClick(item, index);
											}}>
											<FontAwesomeIcon icon={faLocationDot} className="faLocationDot" data-marker={"marker-" + index} />
										</Marker>
									);
								})}
							<GeolocateControl positionOptions={{enableHighAccuracy: true}} showUserLocation={true} auto={true} position="bottom-right" />
							<FullscreenControl position="bottom-right" />
							{showPopup && festivalInfo && (
								<Popup closeOnClick={false} longitude={festivalInfo.geocodage_xy.lon} latitude={festivalInfo.geocodage_xy.lat} anchor="top">
									<PopupContent festivalInfo={festivalInfo} onClose={() => setShowPopup(false)} showPopin={() => setShowPopin(true)}></PopupContent>
								</Popup>
							)}
						</Map>
					</div>
				)}
			</div>
			<ZoneInfo
				open={showPopin}
				festivalInfo={festivalInfo} // Passez les informations du festival sélectionné à la Popin
				onClose={() => setShowPopin(false)} // Gérer la fermeture de la Popin
			/>
		</>
	);
}

export default App;

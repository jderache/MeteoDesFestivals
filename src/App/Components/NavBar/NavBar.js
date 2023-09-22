import React from "react";
import "./NavBar.css";
import {useEffect, useState, useRef} from "react";

function NavBar({search, onSearchChange, data, handleMarkerClick}) {
	const [openResults, setOpenResults] = useState(false);
	const wrapper = useRef(null);

	const handleSearchChange = (event) => {
		const value = event.target.value;
		onSearchChange(value); // Mettre à jour la valeur de recherche dans le composant parent (Header)
		// console.log(value);
	};

	useEffect(() => {
		function handleClickOutside(event) {
			if (wrapper.current && !wrapper.current.contains(event.target)) {
				setOpenResults(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [wrapper]);

	const filterDataResults = (data) => {
		return data.results.filter((item) => {
			return item.nom_du_festival.toLowerCase().includes(search.toLowerCase());
		});
	};

	return (
		<div className="headerSearch" ref={wrapper}>
			<div className="containerSearch">
				<input
					type="search"
					className="searchBar"
					placeholder="Rechercher un festival..."
					value={search}
					onChange={handleSearchChange}
					onFocus={() => {
						setOpenResults(true);
					}}
				/>
			</div>
			{openResults && (
				<div className="resultSearch">
					<ul>
						{filterDataResults(data).map((item, index) => {
							return (
								<li
									key={index}
									onClick={() => {
										handleMarkerClick(item, index);
										setOpenResults(false);
									}}>
									{item.nom_du_festival} ({item.departement_principal_de_deroulement})
								</li>
							);
						})}{" "}
						{<li style={{color: "#ffa630"}}>Aucun résultat</li>}
					</ul>
				</div>
			)}
		</div>
	);
}

export default NavBar;

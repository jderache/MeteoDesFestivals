import NavBar from "../NavBar/NavBar";
import "./Header.css";

function Header({search, onSearchChange, data, handleMarkerClick}) {
	return (
		<header className="App-header">
			<div className="containerHeader">
				<h1>
					Météo<span className="logo">DesFestivals</span>
				</h1>
				<NavBar search={search} onSearchChange={onSearchChange} data={data} handleMarkerClick={handleMarkerClick} />
			</div>
		</header>
	);
}

export default Header;

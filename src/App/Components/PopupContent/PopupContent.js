import "./PopupContent.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";

function PopupContent({onClose, festivalInfo, showPopin}) {
	return (
		<div>
			<>
				<button className="closePopup" onClick={() => onClose()}>
					<FontAwesomeIcon icon={faXmark} className="faXmark" />
				</button>
				{festivalInfo.nom_du_festival && (
					<>
						<h3>{festivalInfo.nom_du_festival}</h3>
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
				<button className="EnSavoirPlus" onClick={() => showPopin()}>
					En savoir plus
				</button>
			</>
		</div>
	);
}

export default PopupContent;

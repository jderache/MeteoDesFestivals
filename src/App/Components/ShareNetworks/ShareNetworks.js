import "./ShareNetworks.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebook, faTwitter} from "@fortawesome/free-brands-svg-icons";
import {faCopy, faCheck} from "@fortawesome/free-solid-svg-icons";
import {useState, useEffect} from "react";

function ShareNetworks({data}) {
	const [isCopy, setIsCopy] = useState(false);

	const shareUrl = window.location.origin + "?location-index=" + data.map_index;

	const handleFacebookClick = () => {
		const facebookPostUrl = `https://www.facebook.com/sharer/sharer.php?&u${encodeURIComponent(shareUrl)}`;
		window.open(facebookPostUrl, "_blank");
	};

	const handleTweetClick = (festival_name) => {
		const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent("Je viens de trouver un festival sur MétéoDesFestival.fr ! Le Lien : ")}&url=${encodeURIComponent(shareUrl)}&hashtags=${encodeURIComponent("festivals,MeteoDesFestivals," + festival_name.replace(/ /g, ""))}`;
		window.open(tweetUrl, "_blank");
	};

	const handleCopyClick = () => {
		navigator.clipboard.writeText(shareUrl);
		setIsCopy(true);
	};

	return (
		<div className="shareNetworks">
			<div className="iconsContainer">
				<button onClick={() => handleFacebookClick()}>
					<FontAwesomeIcon icon={faFacebook} />
				</button>
				<button onClick={() => handleTweetClick(data.nom_du_festival)}>
					<FontAwesomeIcon icon={faTwitter} />
				</button>
				<button onClick={() => handleCopyClick()}>
					<FontAwesomeIcon icon={!isCopy ? faCopy : faCheck} />
				</button>
			</div>
		</div>
	);
}

export default ShareNetworks;

import "./Spinner.css";
import {Rings} from "react-loader-spinner";

function Spinner() {
	return (
		<div className="spinner">
			<Rings height="80" width="80" color="#4059ad" radius="6" wrapperClass="spinnerLoading" visible={true} ariaLabel="rings-loading" />
		</div>
	);
}

export default Spinner;

import InfoDisplay from "./InfoDisplay";
import { ViewerContext } from "../../pages/Viewer"
// import { useContext } from "react";

export default function MapInfoBox(props) {
    const { redStats, blueStats } = props

    return (
        <div className="map-info-box">
            <InfoDisplay side="Blue" playerStats={blueStats} />
            <InfoDisplay side="Red" playerStats={redStats} />
        </div>
    );
}
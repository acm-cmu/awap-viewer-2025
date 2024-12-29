import InfoDisplay from "./InfoDisplay";

export default function MapInfoBox(props) {
    // Need the actual game info
    return (
        <div className="map-info-box">
            <InfoDisplay side="Blue" />
            <InfoDisplay side="Red" />
        </div>
    );
}
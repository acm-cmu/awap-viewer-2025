import BlueBadge from "../../assets/BlueBadge.png"
import RedBadge from "../../assets/RedBadge.png"

export default function InfoDisplay(props) {
    const { side } = props;
    return (
        <div>
            < div className="info-badge" >
                <img src={side == "Blue" ? BlueBadge : RedBadge} alt="" />
            </div >
            <p>Total Troops:</p>
        </div >
    );
}
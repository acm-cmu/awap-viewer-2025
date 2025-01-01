import BlueBadge from "../../assets/BlueBadge.png"
import RedBadge from "../../assets/RedBadge.png"
import Coin from "../../assets/Coin.png"

export default function InfoDisplay(props) {
    const { side } = props;
    return (
        <div className="info-box">
            < div className="info-badge" >
                <img src={side == "Blue" ? BlueBadge : RedBadge} alt="" />
                <div className="info-coins">
                    <div>
                        <img src={Coin} alt="" />
                        <p>&nbsp;{1}&nbsp;</p>
                    </div>
                </div>
            </div >
            <div className="info-side">
                <p>Total Troops:</p>
                <p>Castles: </p>
                <p>Farmlands: </p>
                <p>Farmlands: </p>
            </div>
        </div >
    );
}
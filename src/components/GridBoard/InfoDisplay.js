import BlueBadge from "../../assets/BlueBadge.png"
import RedBadge from "../../assets/RedBadge.png"
import Coin from "../../assets/Coin.png"

export default function InfoDisplay(props) {
    // playerStats = [coinAmount, maxCastleHealth, currCastleHealth, farmlands]
    const { side, playerStats } = props;
    return (
        <div className="info-box">
            < div className="info-badge" >
                <img src={side == "Blue" ? BlueBadge : RedBadge} alt="" />
                <div className="info-coins">
                    <div>
                        <img src={Coin} alt="" />
                        <p>&nbsp;{playerStats[0]}&nbsp;</p>
                    </div>
                </div>
            </div >
            <div className="info-side">
                <p>Total Troops:</p>
                <div>
                    <label htmlFor={"Progress" + side}>Castle HP:&nbsp;</label>
                    <progress id="file" value={playerStats[2]} max={playerStats[1]}>  </progress>
                    <p>&nbsp;{Math.round(playerStats[2] / playerStats[1] * 100)}%</p>
                </div>
                <p>Farmlands: </p>
                <p>Farmlands: </p>
            </div>
        </div >
    );
}
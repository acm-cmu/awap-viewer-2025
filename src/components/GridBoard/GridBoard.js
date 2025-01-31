import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useContext,
  useCallback,
} from "react"
import { ViewerContext } from "../../pages/Viewer"
import GridSquare from "./GridSquare"
import TroopSquare from "./TroopSquare"
import MapInfoBox from "./MapInfoBox"
import "./Grid.css"
import BuildSquare from "./BuildSquare"
import { Slider, SliderMarkLabel } from "@mui/material"
import { IconButton } from "@mui/material"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import PauseIcon from "@mui/icons-material/Pause"


export default function GridBoard(props) {
  const {
    replay,
    sliderValue,
    setSliderValue,
    isPlay,
    setIsPlay,
    framePlaying,
    setIsFinished,
    speed,
    setMetadata,
    setTimeout,
    colorKey,
    RandTileColor,
    normalImgArray,
    blockedImgArray,
    // setRedStats,
    // setBlueStats,
  } = useContext(ViewerContext)
  // setSliderValue(1)
  const gameTurns = replay.replay
  const nrows = gameTurns[0].map.height
  const ncols = gameTurns[0].map.width
  const initColors = gameTurns[0].map.tiles
  const [turnInfo, setTurnInfo] = useState(gameTurns[1].game_state)
  const winner = replay.winner_color;
  const numTurns = gameTurns.length - 1;
  // const { sliderValue, setSliderValue } = props
  const maxHealth = gameTurns[1].game_state.buildings.BLUE[0].health
  document.documentElement.style.setProperty('--cols', ncols)
  document.documentElement.style.setProperty('--rows', nrows)

  const [index, setIndex] = useState(-1)
  const intervalID = useRef(null)

  // States for displaying various elements
  const [grid, setGrid] = useState(null)
  const [troops, setTroops] = useState(null)
  const [buildings, setBuildings] = useState(null)
  const [play, setPlay] = useState(false)


  // need to update this to account for explosions

  const [redStats, setRedStats] = useState([turnInfo.balance.RED, maxHealth, turnInfo.buildings.RED[0].health, 0])
  const [blueStats, setBlueStats] = useState([turnInfo.balance.BLUE, maxHealth, turnInfo.buildings.BLUE[0].health, 0])


  // const redBuildings = turnInfo.buildings.RED[0];
  // const blueBuildings = turnInfo.buildings.BLUE[0];

  // Initialize Player Stats
  // setBlueStats([turnInfo.balance.BLUE, 20, turnInfo.buildings.BLUE[sliderValue], 0])
  // setRedStats([turnInfo.balance.RED, 20, turnInfo.buildings.RED[sliderValue], 0])


  // Initializes tile grid (unchanged during game)
  const initialGrid = useMemo(() => {
    let tempArr = []
    // Basic Map
    for (let row = 0; row < nrows; row++) {
      tempArr.push([])
      for (let col = 0; col < ncols; col++) {
        let color = colorKey[initColors[row][col]];
        let randChoice = RandTileColor(color)
        tempArr[row].push(
          <GridSquare key={`${row}${col}`} color={color} imgIdx={randChoice} normalImgArray={normalImgArray} blockedImgArray={blockedImgArray} />
        )
      }
    }

    setGrid(tempArr)
    setIndex(-1)
    clearInterval(intervalID.current)
    intervalID.current = null
    return [tempArr]
  }, [nrows, ncols,])

  // Initializes buildings
  const allBuildings = useMemo(() => {
    let tempArr = []
    // Basic Map
    for (let row = 0; row < nrows; row++) {
      tempArr.push([])
      for (let col = 0; col < ncols; col++) {
        tempArr[row].push(
          <GridSquare key={`b${row}${col}`}
            color="5"
          />
        )
      }
    }

    if (sliderValue < gameTurns.length) {
      // console.log(turnInfo)
      const redBuildings = turnInfo.buildings.RED[0];
      const blueBuildings = turnInfo.buildings.BLUE[0];
      // console.log(redBuildings)
      if (redBuildings.health != 0) {
        tempArr[redBuildings.x][redBuildings.y] = <BuildSquare id={0} color="RED" type={0} />
      } else {
        tempArr[redBuildings.x][redBuildings.y] = <BuildSquare id={0} color="RED" type={3} />
      }
      if (blueBuildings.health != 0) {
        tempArr[blueBuildings.x][blueBuildings.y] = <BuildSquare id={0} color="BLUE" type={0} />
      } else {
        tempArr[blueBuildings.x][blueBuildings.y] = <BuildSquare id={0} color="BLUE" type={3} />
      }
    }

    setBuildings(tempArr)
    return tempArr
  }, [nrows, ncols, turnInfo, sliderValue])


  // Initializes troops grid
  const initialTroops = useMemo(() => {
    // Set Troops
    const blueTroops = turnInfo.units.BLUE;
    const redTroops = turnInfo.units.RED;

    let tempArr = []
    for (let row = 0; row < nrows; row++) {
      tempArr.push([])
      for (let col = 0; col < ncols; col++) {
        tempArr[row].push(
          <GridSquare key={`t${row}${col}`}
            color="5"
          />
        )
      }
    }


    // change the one at that index to be valid troopsquare
    for (let i = 0; i < blueTroops.length; i++) {
      const s = blueTroops[i];
      tempArr[s.x][s.y] = <TroopSquare key={`b${s.id}`} color={"b"} type={s.type} lvl={s.level} health={s.health} attack_range={s.attack_range} damage={s.damage} defense={s.defense} damage_range={s.damage_range} />
    }

    for (let i = 0; i < redTroops.length; i++) {
      const s = redTroops[i];
      tempArr[s.x][s.y] = <TroopSquare key={`r${s.id}`} color={"r"} type={s.type} lvl={s.level} health={s.health} attack_range={s.attack_range} damage={s.damage} defense={s.defense} damage_range={s.damage_range} />
    }

    setTroops(tempArr)
    return tempArr
  }, [nrows, ncols, turnInfo, sliderValue])


  const handleFrameChange = (event, newVal) => {
    const change = newVal - sliderValue;
    // console.log(newVal)
    if (1 <= sliderValue + change && sliderValue + change <= numTurns)
      console.log("changing frame")
    update(change)
  }

  // const messageRef = useRef('');
  // const [message, setMessage] = useState('');

  useEffect(() => {
    console.log("playing")
    console.log(sliderValue)
    console.log(numTurns)
    while (sliderValue <= numTurns) {
      console.log("loop start")
      const timeoutId = setInterval(() => {
        console.log("")
        handleFrameChange(null, sliderValue + 1)
      }, 1000);

      // Cleanup function
      return () => clearInterval(timeoutId);
    }
  }, [play]);

  // const handleChange = (e) => {
  //   e.preventDefault();
  //   setMessage(e.target.value);
  // };

  // const sendMessage = (e) => {
  //   e.preventDefault();
  //   setTimeout(() => {
  //     // Most recent value
  //     alert(messageRef.current);
  //   }, 2000);

  const handleClick = () => {
    setPlay((isPlay) => !isPlay)
  };

  const update = (step) => {
    // console.log(sliderValue);
    // console.log(gameTurns[60])
    if (sliderValue + step < gameTurns.length) {
      setTurnInfo(gameTurns[sliderValue + step].game_state)
      setSliderValue(sliderValue + step)
      setRedStats([turnInfo.balance.RED, maxHealth, turnInfo.buildings.RED[0].health, 0])
      setBlueStats([turnInfo.balance.BLUE, maxHealth, turnInfo.buildings.BLUE[0].health, 0])
    }
  }

  return (
    <div className="map">
      <div className="board build">{allBuildings}</div>
      <div className="board robot">{troops}</div>
      <div className="board grid">{grid}</div>
      {<MapInfoBox redStats={redStats} blueStats={blueStats} maxHealth={maxHealth} />}
      <div className="sliderSettings">
        <h2 className="info stats">Winner: {winner}</h2>
        <div className="full">
          <p className="info bold">
            Frame {sliderValue} of {numTurns}:
          </p>
          <Slider
            sx={{ width: '90%', height: '40%', margin: 0, padding: 0 }}
            aria-label="Frame No."
            defaultValue={0}
            value={sliderValue}
            valueLabelDisplay="auto"
            step={1}
            marks
            min={0}
            size="medium"
            max={replay != null ? numTurns : 1}
            className="slider"
            onChange={handleFrameChange}
          />
          <IconButton
            id="play-button"
            aria-label="play/pause"
            className="play-control"
            onClick={handleClick}
          >
            {framePlaying ? (
              <PauseIcon className="play-icon" />
            ) : (
              <PlayArrowIcon className="play-icon" />
            )}
          </IconButton>
        </div>

      </div>
    </div >
  )
}



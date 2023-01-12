import React, { useState, useEffect, useCallback, useContext } from "react"
import { AppContext } from "../../App"
import "./SidePanel.css"
import Button from "react-bootstrap/Button"
import Slider from "@mui/material/Slider"
import { StyledEngineProvider } from "@mui/material/styles"
import ToggleSwitch from "./ToggleSwitch/ToggleSwitch"

export default function SidePanel(props) {
  const disablePlay = props.disablePlay
  const { replay, setReplay, sliderValue, setSliderValue, isPlay, setIsPlay } =
    useContext(AppContext)

  const [framePlaying, setFramePlaying] = useState(false)

  const handleFrameChange = (event, newVal) => {
    setSliderValue(newVal)
  }

  const changePlay = () => {
    let playButton = document.getElementById("play-button")
    const newFramePlaying = !framePlaying
    setFramePlaying(newFramePlaying)
    if (newFramePlaying) {
      playButton.innerHTML = "Pause"
    } else {
      playButton.innerHTML = "Play"
    }
    setIsPlay(newFramePlaying)
  }
  const resetPlaybutton = useCallback(() => {
    let playButton = document.getElementById("play-button")
    playButton.innerHTML = "Play"
    setFramePlaying(false)
    setIsPlay(false)
  }, [setIsPlay])

  const showFile = async (event) => {
    // object.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => {
      const replay_text = e.target.result
      try {
        var replay_object = JSON.parse(replay_text)
        resetPlaybutton()
      } catch (err) {
        console.log(err.message)
      }
      setReplay(replay_object)
      props.onFileData(replay_object)
      setSliderValue(-1)
    }
    reader.readAsText(event.target.files[0])
  }

  useEffect(() => {
    if (disablePlay) {
      resetPlaybutton()
    }
  }, [disablePlay, resetPlaybutton])

  const handleToggleP1Vis = () => {
    let checkbox = document.getElementById("p1vis")
    props.onP1VisToggled(checkbox.checked)
  }

  const handleToggleP2Vis = () => {
    let checkbox = document.getElementById("p2vis")
    props.onP2VisToggled(checkbox.checked)
  }

  return (
    <div className="side-panel">
      <h1>AWAP 2023 Viewer</h1>
      <input type="file" className="file-upload" onChange={showFile} />
      <StyledEngineProvider injectFirst>
        <Slider
          aria-label="Frame No."
          defaultValue={0}
          value={sliderValue}
          valueLabelDisplay="auto"
          step={1}
          marks
          min={0}
          max={replay != null ? replay.turns.length - 1 : 250}
          className="slider"
          onChangeCommitted={handleFrameChange}
        />
      </StyledEngineProvider>
      <br></br>
      <Button
        id="play-button"
        variant="custom"
        disabled={props.disablePlay}
        onClick={changePlay}
      >
        Play
      </Button>
      <ToggleSwitch onToggle={handleToggleP1Vis} useID="p1vis">
        Player 1 Visibility
      </ToggleSwitch>
      <ToggleSwitch onToggle={handleToggleP2Vis} useID="p2vis">
        Player 2 Visibility
      </ToggleSwitch>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 graph">
            <p>
              Metal Graph placeholder placeholder placeholder placeholder
              placeholder placeholder placeholder placeholder placeholder
              placeholder
            </p>
          </div>
          <div className="col-lg-6 graph">
            <p>
              Terraform Graph placeholder placeholder placeholder placeholder
              placeholder placeholder placeholder placeholder placeholder
              placeholder
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

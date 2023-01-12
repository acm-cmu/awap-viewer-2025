import React, { useEffect, useCallback, useContext } from "react"
import { AppContext } from "../../App"
import "./SidePanel.css"
import Button from "react-bootstrap/Button"
import Slider from "@mui/material/Slider"
import { StyledEngineProvider } from "@mui/material/styles"
import ToggleSwitch from "./ToggleSwitch/ToggleSwitch"

export default function SidePanel(props) {
  const {
    replay,
    sliderValue,
    setSliderValue,
    setIsPlay,
    framePlaying,
    setFramePlaying,
    isDisabled,
    isFinished,
    setIsFinished,
  } = useContext(AppContext)

  const showFile = async (event) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const replay_text = e.target.result
      try {
        var replay_object = JSON.parse(replay_text)
        resetPlaybutton()
      } catch (err) {
        console.log(err.message)
      }
      props.onFileData(replay_object)
    }
    reader.readAsText(event.target.files[0])
  }

  const handleFrameChange = (event, newVal) => {
    /*
    Note: If framePlaying == true, then the viewer is playing, so setIsPlay(true)  
    has no effect since isPlay == true anyway. If framePlaying == false, then  
    only changing isPlay and not framePlaying will only render the next frame and 
    not future frames, which is the desired behavior.
    */
    setIsPlay(true)
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
  }, [setFramePlaying, setIsPlay])

  useEffect(() => {
    if (isFinished) {
      resetPlaybutton()
      setSliderValue(-1)
      setIsFinished(false)
    }
  }, [isFinished, resetPlaybutton, setSliderValue, setIsFinished])

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
          onChange={handleFrameChange}
          disabled={isDisabled}
        />
      </StyledEngineProvider>
      <br></br>
      <Button
        id="play-button"
        variant="custom"
        disabled={isDisabled}
        onClick={changePlay}
      >
        Play
      </Button>
      <ToggleSwitch
        onToggle={handleToggleP1Vis}
        useID="p1vis"
        disabled={isDisabled}
      >
        Player 1 Visibility
      </ToggleSwitch>
      <ToggleSwitch
        onToggle={handleToggleP2Vis}
        useID="p2vis"
        disabled={isDisabled}
      >
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

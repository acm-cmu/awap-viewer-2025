import React, { useState, useEffect } from "react"
import "./SidePanel.css"
import Button from "react-bootstrap/Button"
import ToggleSwitch from "./ToggleSwitch/ToggleSwitch"

export default function SidePanel(props) {
  const disablePlay = props.disablePlay
  const [framePlaying, setframePlaying] = useState(false)

  const changePlay = () => {
    let playButton = document.getElementById("play-button")
    const newFramePlaying = !framePlaying
    setframePlaying(newFramePlaying)
    if (newFramePlaying) {
      playButton.innerHTML = "Pause"
    } else {
      playButton.innerHTML = "Play"
    }
    props.onPlayData(newFramePlaying)
  }

  const showFile = async (event) => {
    // object.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => {
      const replay_text = e.target.result
      try {
        var replay_object = JSON.parse(replay_text)
      } catch (err) {
        console.log(err.message)
      }
      props.onFileData(replay_object)
    }
    reader.readAsText(event.target.files[0])
  }

  useEffect(() => {
    if (disablePlay) {
      let playButton = document.getElementById("play-button")
      playButton.innerHTML = "Play"
    }
  }, [disablePlay])

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
      <br />
      <br />
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
    </div>
  )
}

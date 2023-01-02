import React, { useState } from "react"
import "./SidePanel.css"
import Button from "react-bootstrap/Button"

export default function SidePanel(props) {
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

  return (
    <div className="side-panel">
      <h1>
        <font face="Impact" size="5">
          AWAP 2023 Viewer
        </font>
        <br />
      </h1>
      <input type="file" class="form-control" onChange={showFile} />
      <br />
      <br />
      <Button id="play-button" onClick={changePlay}>
        Play
      </Button>
    </div>
  )
}

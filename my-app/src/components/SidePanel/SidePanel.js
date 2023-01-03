import React, { useState, useEffect } from "react"
import "./SidePanel.css"
import Button from "react-bootstrap/Button"

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
    </div>
  )
}

import React, {useState} from 'react'
import './SidePanel.css'
import Button from 'react-bootstrap/Button'

export default function SidePanel(props) {
  let framePlaying = false
  const changePlay = () => {
    var playButton = document.getElementById("play-button")
    framePlaying = !framePlaying
    if (framePlaying) {
      playButton.innerHTML = "Pause"
    } else {
      playButton.innerHTML = "Play"
    }
  }

  const showFile = async (event) => {
    // object.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => { 
      const replay_text = e.target.result
      try {
          var replay_object = JSON.parse(props.replayData)
      }
      catch(err) {
          console.log(err.message)
      }
      props.parentCallback(replay_object)
      alert(replay_text)
    };
    reader.readAsText(event.target.files[0])
  }

  return (
      <div className="side-panel">
        <h1>
          <font face="Impact" size="5">AWAP 2023 Viewer</font><br />
        </h1>
        <input type="file" onChange={showFile} /><br /><br />
        <Button id="play-button" onClick={changePlay}>Play</Button>
      </div>
  )
}
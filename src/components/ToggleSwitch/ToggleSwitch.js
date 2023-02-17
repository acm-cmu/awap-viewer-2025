import React from "react"
import "./ToggleSwitch.css"

// Creates the toggle switch button
export default function ToggleSwitch(props) {
  return (
    <div className="form-check form-switch">
      <label className="form-check-label" htmlFor={props.useID}>
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id={props.useID}
          onClick={props.onToggle}
          disabled={props.disabled}
        />{" "}
        {props.children}
      </label>
    </div>
  )
}

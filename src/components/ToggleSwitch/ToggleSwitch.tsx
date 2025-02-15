import React from 'react';

import './ToggleSwitch.css';

type ToggleSwitchProps = {
  useID: string;
  onToggle: (event: React.MouseEvent) => void;
  disabled: boolean;
};

// Creates the toggle switch button
export default function ToggleSwitch(props: ToggleSwitchProps) {
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
        />{' '}
      </label>
    </div>
  );
}

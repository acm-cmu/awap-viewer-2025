import React, { useCallback, useContext, useEffect, useState } from 'react';

import { ViewerContext } from '../../pages/Viewer.js';

import './SidePanel.css';

import PauseIcon from '@mui/icomaterial/PauseIcon';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SettingsIcon from '@mui/icons-material/Settings';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { IconButton } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import { StyledEngineProvider } from '@mui/material/styles';

export default function SidePanel(props) {
  const {
    replay,
    setIsPlay,
    framePlaying,
    setFramePlaying,
    isDisabled,
    isFinished,
    setIsFinished,
    speed,
    setSpeed,
    setIsTrailToggled,
    metaData,
    sliderValue,
    setSliderValue,
    setTimeout,
    timeout,
  } = useContext(ViewerContext);

  // const { sliderValue, setSliderValue } = props;
  const [wrongFile, setWrongFile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const showFile = async (event) => {
    const fileInput = document.getElementById('fileobj');
    const filePath = fileInput.value;
    const ext = filePath.slice(filePath.length - 4, filePath.length);
    if (ext !== 'json') {
      setWrongFile(true);
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const replay_text = e.target.result;
      try {
        const replay_object = JSON.parse(replay_text);
        setWrongFile(false);
        resetPlaybutton();
        setIsFinished(false);
        setTimeout([false, null]);
      } catch (err) {
        console.log(err.message);
      }
      props.onFileData(replay_object);
    };
    reader.readAsText(event.target.files[0]);
  };

  const handleFrameChange = (event, newVal) => {
    /*
    Note: If framePlaying == true, then the viewer is playing, so setIsPlay(true)  
    has no effect since isPlay == true anyway. If framePlaying == false, then  
    only changing isPlay and not framePlaying will only render the next frame and 
    not future frames, which is the desired behavior.
    */
    setIsPlay(true);
    setSliderValue(newVal);
  };

  const handleFrameStep = (step) => {
    if (step <= 0 && sliderValue < 0) {
      return;
    }
    setFramePlaying(false);
    setIsPlay(true);
    setSliderValue((sliderValue) => sliderValue + step);
  };

  const changePlay = () => {
    const newFramePlaying = !framePlaying;
    setFramePlaying(newFramePlaying);
    setIsPlay(newFramePlaying);
    if (isFinished && newFramePlaying) {
      setIsFinished(false);
      setTimeout([false, null]);
    }
  };

  const resetPlaybutton = useCallback(() => {
    // setRedMetal([])
    // setBlueMetal([])
    // setRedTerraform([])
    // setBlueTerraform([])
    setFramePlaying(false);
    setIsPlay(false);
  }, [setFramePlaying, setIsPlay]);

  useEffect(() => {
    if (isFinished) {
      resetPlaybutton();
      setSliderValue(-1);
    }
  }, [isFinished, resetPlaybutton, setSliderValue, setIsFinished]);

  const handleSpeedChange = (event) => {
    setSpeed(event.target.value);
  };

  const handleToggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <div className="side-panel">
      <button style={{ position: 'absolute', top: 0, right: 10, zIndex: 10 }} onClick={props.togglePage}>
        <SwapHorizIcon />
      </button>
      <h1 style={{ marginTop: 18, marginBottom: 0 }}>AWAP 2025</h1>
      <h2 style={{ marginTop: 0, marginBottom: 18 }}>Game Viewer</h2>
      <input id="fileobj" type="file" className="file-upload" onChange={showFile} />
      {wrongFile ? (
        <h2 className="info">Please upload replay files with .awap25r extensions only. </h2>
      ) : (
        <div></div>
      )}
      {!wrongFile && replay != null ? (
        <div>
          <Stack direction="column" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              {isFinished ? (
                <h2 className={'info ' + replay.winner}>{replay.winner === 'RED' ? 'RED' : 'BLUE'} WINS!</h2>
              ) : (
                <div></div>
              )}
              {isFinished && timeout[0] ? <h2 className="info win">{timeout[1]} TIMED OUT</h2> : <div></div>}
            </Stack>
          </Stack>
          <h2 className="info">
            FRAME {sliderValue < 0 ? 0 : sliderValue} OF {replay.replay.length - 1} / TURN {metaData[0]}
          </h2>
        </div>
      ) : (
        <h2 className="info">FRAME 0 OF 250 / TURN 0 OF BLUE </h2>
      )}
      <StyledEngineProvider injectFirst>
        <Slider
          aria-label="Frame No."
          defaultValue={0}
          value={sliderValue}
          valueLabelDisplay="auto"
          step={1}
          marks
          min={0}
          max={replay != null ? replay.replay.length - 1 : 1}
          className="slider"
          onChange={handleFrameChange}
          disabled={isDisabled}
        />
      </StyledEngineProvider>
      <br></br>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-around"
        sx={{ flexWrap: 'wrap', gap: 1, px: 1 }}>
        <button
          onClick={() => handleToggleSettings()}
          style={{
            marginBottom: 0,
            marginTop: 0,
            marginLeft: 0,
          }}>
          <SettingsIcon />
        </button>
        <Stack direction="row" justifyContent="center" alignItems="center">
          <button className="arrow" disabled={isDisabled} onClick={() => handleFrameStep(-1)}>
            &#8249;
          </button>
          <IconButton
            id="play-button"
            aria-label="play/pause"
            className="play-control"
            disabled={isDisabled}
            onClick={changePlay}>
            {framePlaying ? <PauseIcon className="play-icon" /> : <PlayArrowIcon className="play-icon" />}
          </IconButton>
          <button className="arrow" disabled={isDisabled} onClick={() => handleFrameStep(1)}>
            &#8250;
          </button>
        </Stack>

        <StyledEngineProvider injectFirst>
          <FormControl variant="outlined">
            <Select
              id="speed-toggle"
              value={speed}
              disabled={isDisabled}
              onChange={handleSpeedChange}
              className="speed-select">
              <MenuItem value={0.25}>0.25x</MenuItem>
              <MenuItem value={0.5}>0.5</MenuItem>
              <MenuItem value={1}>1.0</MenuItem>
              <MenuItem value={2.0}>2.0</MenuItem>
              <MenuItem value={4.0}>4x</MenuItem>
              <MenuItem value={8.0}>8x</MenuItem>
            </Select>
          </FormControl>
        </StyledEngineProvider>
      </Stack>
      {/* <Collapse in={showSettings}>
        <div className="toggle-layout">
          <ToggleSwitch
            onToggle={handleToggleP1Vis}
            useID="p1vis"
            disabled={isDisabled}
          >
            <h2 className="togglelabel">PLAYER 1 (RED) VISIBILITY</h2>
          </ToggleSwitch>
          <ToggleSwitch
            onToggle={handleToggleP2Vis}
            useID="p2vis"
            disabled={isDisabled}
          >
            <h2 className="togglelabel">PLAYER 2 (BLUE) VISIBILITY</h2>
          </ToggleSwitch>
          <ToggleSwitch
            onToggle={() => setIsTrailToggled((value) => !value)}
            useID="trailtoggle"
            disabled={isDisabled}
          >
            <h2 className="togglelabel">SHOW ROBOT MOVE TRAIL</h2>
          </ToggleSwitch>
        </div>
      </Collapse> */}
      {/* <br></br>

      <h2>Expedition Progress</h2>
      <div className="hori-container graph">
        <div>
          <img src={CyanT1} className="trainingStatCyan" alt="" />
          <p className="info"> Number of Troops: # </p>
        </div>
        <div>
          <p className="info"> Graph showing number of terms remainng, bar chart </p>
        </div>
      </div>*/}
    </div>
  );
}

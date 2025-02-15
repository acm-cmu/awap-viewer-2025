import React, { ChangeEvent, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { ViewerContext, ViewerContextTypes } from '../../pages/Viewer';

import './SidePanel.css';

import { Co2Sharp } from '@mui/icons-material';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import PauseIcon from '@mui/icons-material/PauseCircle';
import PlayArrowIcon from '@mui/icons-material/PlayCircle';
import SwapHoriz from '@mui/icons-material/SwapHorizontalCircleRounded';
import { Stack } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import { StyledEngineProvider } from '@mui/material/styles';

import TroopTable from '../../assets/Troop Table.png';

export type Building = {
  id: number;
  team: 'RED' | 'BLUE';
  type: 'MAIN_CASTLE';
  x: number;
  y: number;
  health: number;
  damage: number;
  defense: number;
  attack_range: number;
  damage_range: number;
  turn_actions_remaining: number;
  level: number;
};

export type Unit = {
  id: number;
  team: string;
  type: string;
  x: number;
  y: number;
  turn_actions_remaining: number;
  turn_movement_remaining: number;
  attack_range: number;
  health: number;
  damage: number;
  defense: number;
  damage_range: number;
  level: number;
};

export type Turn = {
  turn_number: number;
  game_state: {
    balance: { BLUE: number; RED: number };
    turn: number;
    tile_size: number;
    buildings: { BLUE: Building[]; RED: Building[] };
    units: {
      BLUE: Unit[];
      RED: Unit[];
      red_main_castle_id: number;
      blue_main_castle_id: number;
      time_remaining: { RED: number; BLUE: number };
    };
  };
  winner_color: string;
};

export interface Replay {
  UUID: string;
  map: { width: number; height: number; tiles: string[][] };
  'map-changes': { 'changed-turns': number[]; 'changed-maps': string[][][] };
  winner_color: string;
  replay: Turn[];
}

type SidePanelProps = {
  onFileData: (arg0: Replay) => void;
  togglePage: () => void;
};

export default function SidePanel(props: SidePanelProps) {
  const context = useContext(ViewerContext);

  if (!context) {
    throw new Error('useViewer must be used within a ViewerProvider');
  }

  const {
    replay,
    setReplay,
    sliderValue,
    setSliderValue,
    isPlay,
    setIsPlay,
    framePlaying,
    setFramePlaying,
    timeout,
    setTimeout,
    colorKey,
    RandTileColor,
    normalImgArray,
    blockedImgArray,
    redStats,
    setRedStats,
    blueStats,
    setBlueStats,
    isFinished,
    setIsFinished,
  } = context;

  const [wrongFile, setWrongFile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const showFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = document.getElementById('fileobj') as HTMLInputElement;
    const filePath = fileInput!.value;
    const ext = filePath.slice(filePath.length - 8, filePath.length);
    if (ext !== '.awap25r') {
      setWrongFile(true);
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const replay_text = e.target!.result;
      try {
        const replay_object: Replay = JSON.parse(replay_text as string);
        setWrongFile(false);
        resetPlaybutton();
        setTimeout([false, null]);
        props.onFileData(replay_object);
      } catch (error) {
        const err = error as Error;
        console.log(err.message);
      }
      // props.onFileData(replay_object);
    };
    const f = event.target.files as FileList;
    reader.readAsText(f[0] as Blob);
  };

  const [tempValue, setTempValue] = useState<number>(0);
  const [speed, setSpeed] = useState(1);

  const handleFrameChange = (event: Event, value: number | number[]) => {
    if (typeof value === 'number') {
      const v = Number(value) as number;
      if (v != tempValue && 0 <= v && v < replay!.replay.length) {
        setTempValue(v);
      }
    }
  };

  useEffect(() => {
    setSliderValue(tempValue);
  }, [tempValue]);

  const handleFrameStep = (step: number) => {
    if (0 <= sliderValue + step && sliderValue + step < replay!.replay.length) {
      setTempValue((value) => sliderValue + step);
    }
  };

  const changePlay = () => {
    setIsPlay(true);
  };

  const resetPlaybutton = useCallback(() => {
    // setFramePlaying(false);
    setIsPlay(false);
  }, [setFramePlaying, setIsPlay]);

  // useEffect(() => {
  //   if (isFinished) {
  //     resetPlaybutton();
  //     setSliderValue(-1);
  //   }
  // }, [isFinished, resetPlaybutton, setSliderValue, setIsFinished]);

  const handleToggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const intervalRef = useRef<number | null>(null);

  const [isPlayRef, setIsPlayRef] = useState(false);

  let currVal = sliderValue;

  useEffect(() => {
    // 🔍 Debugging

    if (isPlayRef) {
      intervalRef.current = window.setInterval(() => {
        currVal = Math.min(sliderValue + 1, replay!.replay.length - 1);
        setSliderValue((prev) => {
          const nextValue = prev + 1;
          if (nextValue >= replay!.replay.length) {
            setIsPlayRef(false); // Stop autoplay when the last frame is reached
            clearInterval(intervalRef.current!); // Clear the interval once the last frame is reached
            return prev; // Return the previous value to prevent going beyond the last frame
          }
          return nextValue;
        });
      }, 500 / speed);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [isPlayRef, speed]);

  const handlePlay = () => {
    setIsPlayRef(true);
  };

  const changeSpeed = (event: SelectChangeEvent) => {
    setSpeed(Number(event.target.value));
  };

  const handleStopPlay = () => {
    setIsPlayRef(false);
    setTempValue(currVal);
  };

  return (
    <div className="side-panel">
      <button
        style={{
          position: 'absolute',
          top: 0,
          right: 10,
          zIndex: 10,
          background: 'transparent',
          border: 'none',
          margin: '5px',
        }}
        onClick={props.togglePage}>
        <SwapHoriz style={{ color: '#be8700', fontSize: 'xx-large' }} />
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
                <h2 className={'info ' + replay.winner_color}>
                  {replay.winner_color === 'RED' ? 'RED' : 'BLUE'} WINS!
                </h2>
              ) : (
                <div></div>
              )}
              {isFinished && timeout[0] ? <h2 className="info win">{timeout[1]} TIMED OUT</h2> : <div></div>}
            </Stack>
          </Stack>
          <div>
            <h2 className="info">
              FRAME {sliderValue < 0 ? 0 : sliderValue} OF {replay.replay.length - 1} / TURN{' '}
              {replay.replay.length - 1}
            </h2>
            <StyledEngineProvider injectFirst>
              <FormControl variant="outlined" sx={{ m: 1 }}>
                <Select
                  id="speed-select"
                  value={speed.toString()}
                  label="Speed"
                  style={{ height: 20, fontFamily: 'Roboto', color: 'var(--dark-color)' }}
                  onChange={changeSpeed}>
                  <MenuItem value={10.0}>10.0x</MenuItem>
                  <MenuItem value={4.0}>4.0x</MenuItem>
                  <MenuItem value={2.0}>2.0x</MenuItem>
                  <MenuItem value={1.5}>1.5x</MenuItem>
                  <MenuItem value={1.0}>1.0x</MenuItem>
                  <MenuItem value={0.5}>0.5x</MenuItem>
                  <MenuItem value={0.25}>0.25x</MenuItem>
                </Select>
              </FormControl>
            </StyledEngineProvider>
          </div>

          <div>
            <StyledEngineProvider injectFirst>
              <Slider
                aria-label="Frame No."
                defaultValue={0}
                value={sliderValue}
                valueLabelDisplay="auto"
                step={1}
                marks={true}
                min={0}
                max={replay != null ? replay.replay.length - 1 : 1}
                className="slider"
                onChange={handleFrameChange}></Slider>
            </StyledEngineProvider>
          </div>
          <div>
            <button
              style={{
                background: 'transparent',
                border: 'none',
                margin: '5px',
              }}
              onClick={() => {
                handleFrameStep(-1);
              }}>
              <ArrowCircleLeftIcon style={{ color: '#be8700', fontSize: 'xx-large' }} />
            </button>
            {!isPlayRef ? (
              <button onClick={handlePlay} style={{ background: 'transparent', margin: '0px' }}>
                <PlayArrowIcon style={{ color: '#be8700', fontSize: 'xxx-large' }} />
              </button>
            ) : (
              <button onClick={handleStopPlay} style={{ background: 'transparent', margin: '0px' }}>
                <PauseIcon style={{ color: '#be8700', fontSize: 'xxx-large' }} />
              </button>
            )}
            <button
              style={{
                background: 'transparent',
                border: 'none',
                margin: '5px',
              }}
              onClick={() => {
                handleFrameStep(1);
              }}>
              <ArrowCircleRightIcon style={{ color: '#be8700', fontSize: 'xx-large' }} />
            </button>
          </div>
          <h2>{replay.winner_color} wins!</h2>
        </div>
      ) : (
        <h2 className="info">FRAME 0 OF 250 / TURN 0 OF BLUE </h2>
      )}
      <img id="troop-label" src={TroopTable} alt="troop table" />
    </div>
  );
}

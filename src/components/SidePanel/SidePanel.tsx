import React, { ChangeEvent, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { ViewerContext, ViewerContextTypes } from '../../pages/Viewer';

import './SidePanel.css';

import { time } from 'console';
import { Co2Sharp } from '@mui/icons-material';
import PauseIcon from '@mui/icons-material/PauseCircle';
import PlayArrowIcon from '@mui/icons-material/PlayCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import SwapHoriz from '@mui/icons-material/SwapHorizontalCircleRounded';
import { IconButton, Stack } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
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
  map: { width: number; height: number; tiles: string[] };
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
    updateSliderValue,
  } = context;

  // const { sliderValue, setSliderValue } = props;
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

  const [value, setValue] = useState<number>(0);

  const handleFrameChange = (event: Event, value: number | number[]) => {
    setValue(value as number);
    console.log(value);
    // if (typeof value === 'number') {
    //   const v = Number(value) as number;
    //   if (v != sliderValue && 0 <= v && v < replay!.replay.length) {
    //     updateSliderValue(v);
    //   }
    // }
  };

  const handleFrameStep = (step: number) => {
    if (step <= 0 && sliderValue < 0) {
      return;
    }
    setFramePlaying(false);
    setIsPlay(true);
    setSliderValue((sliderValue) => sliderValue + step);
  };

  const changePlay = () => {
    setIsPlay(true);
    // const newFramePlaying = !framePlaying;
    // setFramePlaying(newFramePlaying);
    // setIsPlay(newFramePlaying);
    // if (isFinished && newFramePlaying) {
    //   setIsFinished(false);
    //   setTimeout([false, null]);
    // }
  };

  const resetPlaybutton = useCallback(() => {
    // setFramePlaying(false);
    setIsPlay(false);
  }, [setFramePlaying, setIsPlay]);

  useEffect(() => {
    if (isFinished) {
      resetPlaybutton();
      setSliderValue(-1);
    }
  }, [isFinished, resetPlaybutton, setSliderValue, setIsFinished]);

  const handleToggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const intervalRef = useRef<number | null>(null);

  const isPlayRef = useRef(false);

  useEffect(() => {
    // 🔍 Debugging

    if (isPlayRef.current) {
      intervalRef.current = window.setInterval(() => {
        setSliderValue((prev) => {
          const nextValue = prev + 1;
          if (nextValue >= replay!.replay.length) {
            setIsPlay(false); // Stop autoplay when the last frame is reached
            clearInterval(intervalRef.current!); // Clear the interval once the last frame is reached
            return prev; // Return the previous value to prevent going beyond the last frame
          }
          return nextValue;
        });
      }, 500);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [isPlayRef.current]);

  const handlePlay = () => {
    isPlayRef.current = true;
  };

  const handleStopPlay = () => {
    isPlayRef.current = false;
  };

  // useEffect(() => {
  //   console.log('🔥 isPlay changed:', isPlayRef);
  // }, [isPlayRef]);

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
          <h2 className="info">
            FRAME {sliderValue < 0 ? 0 : sliderValue} OF {replay.replay.length - 1} / TURN{' '}
            {replay.replay.length - 1}
          </h2>
          <div>
            <StyledEngineProvider injectFirst>
              <Slider
                aria-label="Frame No."
                defaultValue={0}
                value={value}
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
            {!isPlayRef.current ? (
              <button onClick={handlePlay} style={{ background: 'transparent' }}>
                <PlayArrowIcon style={{ color: '#be8700', fontSize: 'xxx-large' }} />
              </button>
            ) : (
              <button onClick={handleStopPlay} style={{ background: 'transparent' }}>
                <PauseIcon style={{ color: '#be8700', fontSize: 'xxx-large' }} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <h2 className="info">FRAME 0 OF 250 / TURN 0 OF BLUE </h2>
      )}
      <img id="troop-label" src={TroopTable} alt="troop table" />
    </div>
  );
}

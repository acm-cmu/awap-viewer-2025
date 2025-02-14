import React, { ChangeEvent, useCallback, useContext, useEffect, useState } from 'react';

import { ViewerContext, ViewerContextTypes } from '../../pages/Viewer';

import './SidePanel.css';

import { Co2Sharp } from '@mui/icons-material';
import PauseIcon from '@mui/icons-material/PauseCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
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

  const handleFrameChange = (event: Event | React.SyntheticEvent, value: number | number[]) => {
    /*
    Note: If framePlaying == true, then the viewer is playing, so setIsPlay(true)  
    has no effect since isPlay == true anyway. If framePlaying == false, then  
    only changing isPlay and not framePlaying will only render the next frame and 
    not future frames, which is the desired behavior.
    */
    try {
      if (typeof value === 'number') {
        const v = Number(value) as number;
        if (0 <= v && v < replay!.replay.length && v != sliderValue) {
          setSliderValue(v);
          console.log(`changed ${value}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
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
    const newFramePlaying = !framePlaying;
    setFramePlaying(newFramePlaying);
    setIsPlay(newFramePlaying);
    if (isFinished && newFramePlaying) {
      setIsFinished(false);
      setTimeout([false, null]);
    }
  };

  const resetPlaybutton = useCallback(() => {
    setFramePlaying(false);
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
                value={sliderValue}
                valueLabelDisplay="auto"
                step={1}
                marks={true}
                min={0}
                max={replay != null ? replay.replay.length - 1 : 1}
                className="slider"
                onChange={handleFrameChange}
                onChangeCommitted={handleFrameChange}></Slider>
            </StyledEngineProvider>
          </div>
        </div>
      ) : (
        <h2 className="info">FRAME 0 OF 250 / TURN 0 OF BLUE </h2>
      )}
      <img id="troop-label" src={TroopTable} alt="troop table" />
    </div>
  );
}

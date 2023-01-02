<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/ACM-CMU/awap-viewer-2023">
    <!-- <img src="images/logo.png" alt="Logo" width="80" height="80"> -->
    LOGO PLACEHOLDER
  </a>

  <h3 align="center">AWAP 2023 Game Viewer</h3>

  <p align="center">
    A helpful tool to view your matches against other bots!
    <br />
    <a href="https://github.com/ACM-CMU/awap-viewer-2023/issues">Report Bug</a>
    ·
    <a href="https://github.com/ACM-CMU/awap-viewer-2023/issues">Request Feature</a>
  </p>
</div>

## Introduction
This is the AWAP 2023 game viewer. You can run matches between bots using the game engine, then upload the generated replay files to this viewer to view the match.

Last year's game viewer can be found [here](https://github.com/rzhan11/awap2022-viewer).

## Getting Started

### Requirements
- [Node.js](https://nodejs.org/en/download/)

### Installation
1. Clone the repo
   ```sh
   git clone https://github.com/ACM-CMU/awap-viewer-2023.git
   ```
2. Navigate to the `my-app` folder and install NPM packages
   ```sh
   cd my-app
   npm install
   ```

## Running The Viewer
1. Navigate to the `my-app` folder
2. Starts the local server (if not running yet)
   ```sh
   npm start
   ```
3. Open http://localhost:3000/
4. Upload a replay file using the upload button (match replays are saved in the `replays/` folder of the game engine repo)


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/ACM-CMU/awap-viewer-2023">
    <img src="public/banner.png" alt="Logo" width="800" height="222">
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
2. Install NPM packages
   ```sh
    npm install
    ```
## Running The Viewer (locally)
1. Run the viewer
   ```sh
   npm start
   ```
2. Open the viewer in your browser
   ```sh
    http://localhost:3000
    ```

## Deployment 
1. Push the changes to the `main` branch
2. Run the deploy script
   ```sh
   npm run deploy
   ```
3. The viewer will be deployed to https://view.awap.acmatcmu.com  


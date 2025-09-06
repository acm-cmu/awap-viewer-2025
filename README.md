<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">AWAP 2025 Game Viewer</h3>

</div>

## Introduction

This is the AWAP 2025 game viewer. You can run matches between bots using the game engine, then upload the generated replay files to this viewer to view the match. See [here](http://view.awap.acmatcmu.com/).

Last year's game viewer can be found [here](https://github.com/rzhan11/awap2022-viewer).

## Getting Started on running locally

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

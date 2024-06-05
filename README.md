# YouTube Discord RPC Electron App

This Electron app integrates Discord Rich Presence functionality to display YouTube video details in your Discord status.

## Overview

This application uses Electron to create a standalone desktop app that renders the YouTube website and interacts with the Discord Rich Presence API to showcase the video being watched on YouTube.

## Features

- Displays YouTube website within an Electron window.
- Integrates with Discord Rich Presence to show video details as your Discord status.
- Customizable window size and settings.

## Prerequisites

- node.js installed on your machine.

## Installation

1. **Clone the repository:**
   ```git clone https://github.com/DrakonZZZ/youtube-electron-rpc```

2. **Navigate to the project directory:**
   cd your-repository

3. **Install dependencies:**
   ```npm install or npm i```


## Usage

1. **Run the application:**
    npm run dev
   (or)
   you can compile the .exe using
   
   ```
   npm run make or npm run package
   ```
   download the exe from here : https://github.com/DrakonZZZ/youtube-electron-rpc/releases
3. The app window opens and displays the YouTube website.
4. The app updates your Discord status with YouTube video details.

## Configuration

- Modify the window size, settings, or YouTube URL in the `windowHandler.js` file to suit your preferences.
- You can change the discord Large image icon by having your own discord developer portal [https://discord.com/developers/docs/intro](https://discord.com/developers/applications) application and change the clientId in main.js

##Customization
- Change your discord presence image in rpcInfo.js file 
## Contributing

Contributions are welcome! Fork the repository and create a pull request for any enhancements or fixes.

## License

This project is licensed under the [MIT 

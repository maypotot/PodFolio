# PodFolio

This project is a React-based application built with Create React App that integrates with the Solid protocol.

## Prerequisites

Ensure you have Node.js and npm installed.

## Installation

Run the following commands to install the required dependencies:

```
pip install -r requirements.txt
npm install
```

## Local Development

To run the application locally in development mode:
```
npm start
```
Open http://localhost:3000 to view it in your browser.


## Production Build

To create a production build locally:

```
npm run build
```

The compiled assets will be generated in the build/ folder.

## Deployment on Render

To host and deploy this static application on Render, follow these steps:

    Sign in to your Render dashboard.

    Click New + and select Static Site.

    Connect your GitHub repository (maypotot/PodFolio).

    Configure the project settings with the following parameters:

        Name: podfolio (or your preferred name)

        Branch: main (or your default branch)

        Build Command: npm run build

        Publish Directory: build

    Click Create Static Site.

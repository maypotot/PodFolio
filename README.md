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


# Render Full Stack Setup Guide

This guide covers setting up the Frontend Static Site, Django API Backend, and PostgreSQL Database within your Render project.

---

## 1. PostgreSQL Database Setup

1. In your Render Dashboard, click **New +** and select **PostgreSQL**.
2. Configure the database settings:
   * **Name**: `podfolio-db`
   * **Region**: Choose the same region for all services to minimize latency.
3. Click **Create Database**.
4. Once active, copy the **Internal Database URL** (for backend connections) or **External Database URL** (for local development testing).

---

## 2. Django API Backend Setup

1. Click **New +** and select **Web Service**.
2. Connect your repository.
3. Configure the following deployment settings:
   * **Name**: `PodFolio-backend`
   * **Language**: `Python`
   * **Build Command**: `python src\podfolio_db_backend\manage.py migrate`
   * **Start Command**: `cd src/podfolio_db_backend && gunicorn podfolio_db_backend.wsgi:application --bind 0.0.0.0:$PORT`
4. Scroll down to **Environment Variables** and add your required keys:
   * `DATABASE_URL`: *Paste your Internal Database URL here*
   * `SECRET_KEY`: *Your Django secret key*
   * `DEBUG`: `False`
5. Click **Create Web Service**. Copy the generated live URL once the deploy completes.

---

## 3. React Frontend Static Site Setup

1. Click **New +** and select **Static Site**.
2. Connect your repository.
3. Configure the build parameters:
   * **Name**: `Podfolio-frontend`
   * **Build Command**: `npm run build`
   * **Publish Directory**: `build`
4. If your React app communicates with the Django API via an environment variable, add it to the **Environment Variables** section:
   * `REACT_APP_API_URL`: *Paste your Render Backend Web Service URL*
5. Click **Create Static Site**.

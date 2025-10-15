# xCHnG - Document Exchange

*xCHnG* is a Proof of Concept (POC) web application for *document exchange* with admin approval workflows, user management, and PWA support.  
The project is built with *React + Vite + Tailwind + Express + MongoDB* and packaged as a *PWA + Android App (.aab)* for Play Store delivery.

---

## Features

- *Authentication*
  - Signup with admin approval flow
  - Login with JWT token
  - Profile management

- *User Roles*
  - Normal User: Upload, Download, request documents
  - Admin: Approve/reject new signups, manage users, add new admins

- *Dashboard*
  - Pending requests section
  - Notifications for new users
  - Profile page
  - Approve/Reject workflow for requests

- *PWA Support*
  - Installable on desktop and mobile
  - Works offline with caching
  - Auto-updates via service worker

- *Android App (.aab & .apk)*
  - Generated with Bubblewrap (Trusted Web Activity)
  - Play Store ready (with custom keystore signing)
  - Address bar removed (using assetlinks.json verification)

---

## Tech Stack

- *Frontend:* React (Vite) + TailwindCSS + ShadCN UI
- *Backend:* Node.js + Express + Render
- *Database:* MongoDB Atlas
- *WebSocket:* Socket.io
- *Storage:* Firebase
- *PWA & App:* VitePWA + Bubblewrap

---

## Deployment

### Frontend
- Hosted on *Vercel*
- [Vercel Docs](https://vercel.com/docs)

### Backend
- Hosted on *Render*
- [Render Docs](https://render.com/docs)

### Database
- *MongoDB Atlas* connection string required  
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)

---

## PWA & Android App

- *PWA*: Installable directly from browser (Chrome, Edge, etc.)  
- *Android App*: Built with [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap)  
  - Signed .aab file for Play Store  
  - .apk file for direct installation  
  - assetlinks.json deployed for TWA verification

---

## Required Details for Deployment

1. *Vercel account access* (for frontend deployment)  
   - [Vercel Login](https://vercel.com/login)  

2. *Render account access* (for backend deployment)  
   - [Render Signup](https://dashboard.render.com/register)  

3. *MongoDB Atlas connection string* (with username & password)  
   - [MongoDB Docs](https://www.mongodb.com/docs/atlas/tutorial/connect-to-your-cluster/)  

---

## Build & Run

### Frontend
```bash
cd client
npm install
npm run dev
```

### Backend
```bash
cd server
npm install
npm run dev
```

### PWA Build
```bash
cd client
npm run build
```
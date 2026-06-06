# 🖥️ Infosoft Employee Live Tracker

A real-time employee monitoring system built with Node.js, WebRTC, and Socket.io. Track your employees live — video feed, audio, GPS location, all in one admin dashboard.

---

## 🚀 Live Demo

- **Employee Page:** `https://employee-tracker-q3cs.onrender.com`
- **Admin Dashboard:** `https://employee-tracker-q3cs.onrender.com/admin`

---

## ✨ Features

| Feature | Description |
|---|---|
| 📷 **Live Video Feed** | Real-time camera stream from employee's device |
| 🎙️ **Live Audio** | Microphone audio streamed to admin |
| 📍 **Live GPS Tracking** | Exact location on interactive map |
| 🗺️ **Live Map** | Moving dots showing employee positions |
| 🌐 **IP Detection** | Auto-detects employee public IP |
| 📊 **Admin Dashboard** | Password-protected real-time monitor |
| 📱 **Mobile Support** | Works on Android & iOS browsers |
| 👥 **20+ Employees** | Multiple employees simultaneously |

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** — Structure
- **CSS3** — Styling & Dark UI
- **Vanilla JavaScript** — Logic
- **WebRTC** — Live video/audio streaming
- **Geolocation API** — GPS tracking
- **Socket.io Client** — Real-time events
- **Leaflet.js** — Interactive live map

### Backend
- **Node.js** — Server runtime
- **Express.js** — Web framework
- **Socket.io** — WebSocket real-time communication
- **HTTP module** — Server creation

### APIs
- **ipify.org** — Public IP detection
- **apiip.net** — IP geolocation data
- **OpenStreetMap** — Map tiles
- **Google STUN** — WebRTC peer connection

### Deployment
- **GitHub** — Code repository
- **Render.com** — Live server hosting (persistent WebSocket support)

---

## 📁 Project Structure

```
employee-tracker/
├── server.js            ← Main server (Express + Socket.io + WebRTC signaling)
├── package.json         ← Dependencies
├── render.yaml          ← Render.com deployment config
├── .gitignore
├── README.md
└── public/
    ├── index.html       ← Employee check-in page (camera + mic + GPS)
    └── admin.html       ← Admin live monitor dashboard
```

---

## ⚙️ How It Works

```
Employee opens website
        ↓
Allows Camera + Mic + GPS permissions
        ↓
Socket.io connects to server
        ↓
Admin clicks "Start Stream"
        ↓
WebRTC peer connection established
        ↓
Live video + audio streams to admin
        ↓
GPS coordinates sent every 5 seconds
        ↓
Live map updates with moving dot
```

---

## 🔧 Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/employee-tracker.git
cd employee-tracker

# 2. Install dependencies
npm install

# 3. Start server
npm start

# 4. Open in browser
# Employee page → http://localhost:3000
# Admin panel   → http://localhost:3000/admin
```

**Default admin password:** `admin123`

---

## 🚀 Deploy on Render.com

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/YOUR_USERNAME/employee-tracker.git
git push -u origin main
```

### Step 2 — Create Web Service on Render
1. Go to [render.com](https://render.com) → Sign up with GitHub
2. Click **New** → **Web Service**
3. Select your `employee-tracker` repo
4. Settings:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free

### Step 3 — Environment Variables
Go to **Environment** tab and add:

| Key | Value |
|---|---|
| `ADMIN_PASS` | `YourSecretPassword` |

### Step 4 — Deploy!
Click **Deploy** — your app will be live in ~2 minutes.

---

## 🔐 Environment Variables

| Variable | Default | Description |
|---|---|---|
| `ADMIN_PASS` | `admin123` | Admin dashboard password |
| `PORT` | `3000` | Server port (auto-set by Render) |

---

## 📱 How to Use

### For Admin:
1. Open `your-url.onrender.com/admin`
2. Enter your password
3. Dashboard loads — waiting for employees
4. Click **"Start Stream"** on any employee card
5. Live video + audio starts instantly
6. Watch live map for GPS movement

### For Employees:
1. Open `your-url.onrender.com`
2. Click **"Allow & Check In"**
3. Allow Camera, Microphone, and Location permissions
4. Done — admin can now monitor

---

## ⚠️ Important Notes

- **HTTPS required** — Camera/mic/GPS only work on HTTPS (Render provides this automatically)
- **Render free tier** — Server sleeps after 15 min of inactivity, first load may take 30 seconds
- **WebRTC** — Requires both admin and employee to be online simultaneously for video stream
- **GPS accuracy** — Depends on device (mobile GPS is more accurate than desktop)
- **In-memory storage** — Employee sessions reset when server restarts

---

## 🌐 Browser Support

| Browser | Video | Audio | GPS |
|---|---|---|---|
| Chrome (Desktop) | ✅ | ✅ | ✅ |
| Chrome (Android) | ✅ | ✅ | ✅ |
| Safari (iOS) | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ |

---

## 👨‍💻 Built By

**Aditya** — Infosoft  
Built with ❤️ using Node.js + WebRTC + Socket.io

---

## 📄 License

This project is for internal use by Infosoft only.  
All employees are informed about monitoring as per company policy.
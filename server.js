const express   = require('express');
const http      = require('http');
const { Server } = require('socket.io');
const path      = require('path');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: '*' },
  maxHttpBufferSize: 1e7
});

const PORT       = process.env.PORT || 3000;
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',      (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/admin', (_, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

// ── In-memory store ───────────────────────────────────────────────────────
const employees = new Map(); // socketId → employeeData
const admins    = new Set(); // socketIds of admins

// ── Socket.io ─────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`[CONNECT] ${socket.id}`);

  // ── EMPLOYEE joins ───────────────────────────────────────────────────
  socket.on('employee:join', (data) => {
    const emp = {
      id:       socket.id,
      name:     data.name     || 'Employee',
      empId:    data.empId    || socket.id.slice(0,6),
      joinedAt: new Date().toISOString(),
      location: null,
      online:   true,
    };
    employees.set(socket.id, emp);
    socket.join('employees');
    console.log(`[JOIN] ${emp.name} (${emp.empId})`);

    // Tell all admins about new employee
    admins.forEach(adminId => {
      io.to(adminId).emit('employee:new', emp);
    });
  });

  // ── EMPLOYEE sends location update ───────────────────────────────────
  socket.on('employee:location', (loc) => {
    const emp = employees.get(socket.id);
    if (!emp) return;
    emp.location = { ...loc, updatedAt: new Date().toISOString() };
    // Broadcast to all admins
    admins.forEach(adminId => {
      io.to(adminId).emit('employee:location', { id: socket.id, location: emp.location });
    });
  });

  // ── WebRTC Signaling ─────────────────────────────────────────────────
  // Admin requests stream from employee
  socket.on('admin:request-stream', ({ employeeId }) => {
    io.to(employeeId).emit('stream:requested', { adminId: socket.id });
  });

  // Employee sends WebRTC offer to admin
  socket.on('webrtc:offer', ({ to, offer }) => {
    io.to(to).emit('webrtc:offer', { from: socket.id, offer });
  });

  // Admin sends WebRTC answer to employee
  socket.on('webrtc:answer', ({ to, answer }) => {
    io.to(to).emit('webrtc:answer', { from: socket.id, answer });
  });

  // ICE candidates exchange
  socket.on('webrtc:ice', ({ to, candidate }) => {
    io.to(to).emit('webrtc:ice', { from: socket.id, candidate });
  });

  // ── ADMIN joins ──────────────────────────────────────────────────────
  socket.on('admin:join', ({ password }) => {
    if (password !== ADMIN_PASS) {
      socket.emit('admin:auth-fail');
      return;
    }
    admins.add(socket.id);
    socket.join('admins');
    console.log(`[ADMIN] joined: ${socket.id}`);

    // Send current employee list
    const list = Array.from(employees.values());
    socket.emit('admin:employee-list', list);
  });

  // ── DISCONNECT ───────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    if (employees.has(socket.id)) {
      const emp = employees.get(socket.id);
      emp.online = false;
      admins.forEach(adminId => {
        io.to(adminId).emit('employee:offline', { id: socket.id });
      });
      employees.delete(socket.id);
      console.log(`[LEAVE] ${emp.name}`);
    }
    admins.delete(socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`✅  Running → http://localhost:${PORT}`);
  console.log(`📊  Admin  → http://localhost:${PORT}/admin`);
});

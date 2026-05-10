'use strict';
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json({ limit: '25mb' }));
app.use(express.static(path.join(__dirname)));

const saveHandler    = require('./api/save');
const loadHandler    = require('./api/load');
const uploadHandler  = require('./api/upload');
const uploadAudio    = require('./api/upload-audio');

app.post('/api/save',         (req, res) => saveHandler(req, res));
app.get( '/api/load',         (req, res) => loadHandler(req, res));
app.post('/api/upload',       (req, res) => uploadHandler(req, res));
app.post('/api/upload-audio', (req, res) => uploadAudio(req, res));

// SPA fallback — all other routes serve index.html
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌸 Server running on port ${PORT}`));

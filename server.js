const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use((req, res, next) => {
    const logData = {
        ip: req.ip,
        time: new Date().toISOString(),
        url: req.originalUrl
    };
    fs.appendFile('visits.log', JSON.stringify(logData) + '\n', (err) => {
        if (err) {
            console.error('Error logging visit:', err);
        }
    });

    next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.get('/logs', (req, res) => {
    fs.readFile('visits.log', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read logs' });
        }

        const logs = data.trim().split('\n').map((log) => JSON.parse(log));
        res.json(logs);
    });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

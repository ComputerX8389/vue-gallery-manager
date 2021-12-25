const fs = require('fs');
const path = require('path');
const db = require('./databasehandler.js');

// List all files in a directory in Node.js recursively in a synchronous fashion
var WalkDir = function (dir) {
    var files = fs.readdirSync(dir);
    files.forEach(function (file) {
        var fullpath = path.join(dir, file);

        if (fs.statSync(fullpath).isDirectory()) {
            WalkDir(fullpath);
        } else {
            let filestats = fs.statSync(fullpath);

            db.InsertFile({
                filename: path.basename(fullpath),
                fullpath: fullpath,
                filepath: path.dirname(fullpath),
                filesize: filestats.size,
                filetype: path.extname(fullpath),
                createdAt: filestats.birthtime,
                updatedAt: filestats.mtime,
            });
        }
    });
};

async function ScanDir(dir) {
    console.log('Scanning directory: ' + dir);
    try {
        WalkDir(dir);
        console.log('Done scanning directory: ' + dir);
        return true;
    } catch (err) {
        console.log('Error scanning directory: ' + dir);
        console.log(err);
        return false;
    }
}

module.exports = {
    ScanDir,
};

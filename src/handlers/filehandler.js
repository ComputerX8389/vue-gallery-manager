const fs = require('fs');
const path = require('path');
const db = require('./databasehandler.js');
const { ipcRenderer } = require('electron');

var WalkDir = function (dir, done) {
    var results = [];

    fs.readdir(dir, function (err, list) {
        if (err) {
            return done(err);
        }
        var pending = list.length;

        if (!pending) {
            return done(null, results);
        }
        list.forEach(function (file) {
            file = path.resolve(dir, file);

            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    WalkDir(file, function (err, res) {
                        results = results.concat(res);
                        if (!--pending) {
                            done(null, results);
                        }
                    });
                } else {
                    results.push(file);
                    db.InsertFile({
                        filename: path.basename(file),
                        fullpath: file,
                        filepath: path.dirname(file),
                        filesize: stat.size,
                        filetype: path.extname(file),
                        createdAt: stat.birthtime,
                        updatedAt: stat.mtime,
                    });
                    if (!--pending) {
                        done(null, results);
                    }
                }
            });
        });
    });
};

async function ScanDir(dir, callback) {
    console.log('Scanning directory: ' + dir);
    WalkDir(dir, function (err) {
        if (err) {
            console.log('Error scanning directory: ' + dir);
        } else {
            console.log('Done scanning directory: ' + dir);
            callback();
        }
    });
}

async function CheckForDeletedFiles() {
    console.log('Checking for deleted files...');
    var files = await db.GetFullGallery();

    for (var i = 0; i < files.length; i++) {
        let file = files[i];

        try {
            await fs.promises.access(file.fullpath);
        } catch (err) {
            console.log('File is deleted ' + file.fullpath);
            db.DeleteFile(file);
        }
    }
}

function OpenFolderDialog() {
    return ipcRenderer.sendSync('OpenFolderDialog');
}

module.exports = {
    ScanDir,
    OpenFolderDialog,
    CheckForDeletedFiles,
};

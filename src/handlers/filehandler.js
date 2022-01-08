const os = require('os');
const fs = require('fs');
const path = require('path');
const db = require('./databasehandler.js');
const sharp = require('sharp');

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

            fs.stat(file, async function (err, stat) {
                if (stat && stat.isDirectory()) {
                    WalkDir(file, function (err, res) {
                        results = results.concat(res);
                        if (!--pending) {
                            done(null, results);
                        }
                    });
                } else {
                    results.push(file);

                    let dbfile = await db.InsertFile({
                        filename: path.basename(file),
                        fullpath: file,
                        filepath: path.dirname(file),
                        filesize: stat.size,
                        filetype: path.extname(file),
                        createdAt: stat.birthtime,
                        updatedAt: stat.mtime,
                        thumbnail: '',
                    });
                    if (dbfile) {
                        GenerateImageThumbnail(dbfile);
                    }
                    if (!--pending) {
                        done(null, results);
                    }
                }
            });
        });
    });
};

async function ScanDir(dir) {
    console.log('Scanning directory: ' + dir);
    WalkDir(dir, function (err) {
        if (err) {
            console.log('Error scanning directory: ' + dir);
        } else {
            console.log('Done scanning directory: ' + dir);
        }
    });
}

async function CheckForDeletedFiles(folders) {
    console.log('Checking for deleted files...');
    let raw = await db.GetFullGallery();
    let files = [...raw];

    for (var i = 0; i < files.length; i++) {
        let file = files[i];

        let fileInKnowFolder = false;

        for (let i = 0; i < folders.length; i++) {
            const folder = folders[i];
            if (file.fullpath.startsWith(folder)) {
                fileInKnowFolder = true;
            }
        }

        if ((await FileExits(file.fullpath)) == false || fileInKnowFolder == false) {
            console.log('File is deleted ' + file.fullpath);
            fs.unlinkSync(file.thumbnail);
            await db.DeleteFile(file);
        }
    }
}

async function FileExits(fullpath) {
    try {
        await fs.promises.access(fullpath);
        return true;
    } catch (err) {
        return false;
    }
}

function GenerateImageThumbnail(file) {
    console.log('Generating thumbnail for ' + file._id);

    let temppath = path.join(os.tmpdir(), 'vue-gallery-manager-thumbnails');
    let thumbPath = path.join(temppath, file._id + '.jpg');

    if (!fs.existsSync(temppath)) {
        fs.mkdirSync(temppath);
        console.log('Created temp directory: ' + temppath);
    }

    sharp(file.fullpath)
        .resize(100)
        .toFile(thumbPath, (err) => {
            if (err) {
                console.log(err);
            }
            file.thumbnail = thumbPath;
            db.EditFile(file);
        });
}

module.exports = {
    ScanDir,
    CheckForDeletedFiles,
};

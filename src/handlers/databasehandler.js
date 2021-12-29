const Realm = require('realm');
const BSON = require('bson');

// Database schema
const File = {
    name: 'File',
    properties: {
        _id: 'objectId',
        filename: 'string',
        fullpath: 'string',
        filepath: 'string',
        filesize: 'int',
        filetype: 'string',
        createdAt: 'date',
        updatedAt: 'date',
    },
};

// Realm singleton
var realmInstance;

async function getRealm() {
    if (realmInstance) {
        return realmInstance;
    } else {
        realmInstance = await Realm.open({
            schema: [File],
        });
        return realmInstance;
    }
}

// Checks if file exists in database. if not then inserts it.
async function InsertFile(fileinfo) {
    let realm = await getRealm();
    // check if file already exists
    let file = realm.objects('File').filtered('fullpath = $0', fileinfo.fullpath);
    if (file.length > 0) {
        return;
    }

    fileinfo._id = new BSON.ObjectID();
    realm.write(() => {
        realm.create('File', fileinfo);
    });
}

async function GetFullGallery() {
    console.log('Getting all files');
    let realm = await getRealm();
    let files = realm.objects('File');
    console.log('Found ' + files.length + ' files');
    return files;
}

module.exports = {
    InsertFile,
    GetFullGallery,
};

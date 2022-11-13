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
    thumbnail: 'string',
    thumberror: 'string',
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
  return fileinfo;
}

async function EditFile(file) {
  let realm = await getRealm();
  let oldfile = realm.objects('File').filtered('_id = $0', file._id)[0];
  realm.write(() => {
    oldfile.filename = file.filename;
    oldfile.fullpath = file.fullpath;
    oldfile.filepath = file.filepath;
    oldfile.filesize = file.filesize;
    oldfile.filetype = file.filetype;
    oldfile.createdAt = file.createdAt;
    oldfile.updatedAt = file.updatedAt;
    oldfile.thumbnail = file.thumbnail;
    oldfile.thumberror = file.thumberror;
  });
}

async function DeleteFile(file) {
  let realm = await getRealm();
  realm.write(() => {
    realm.delete(file);
  });
}

async function GetFullGallery() {
  console.log('Getting all files');
  let realm = await getRealm();
  let files = realm.objects('File').sorted('createdAt', true);
  console.log('Found ' + files.length + ' files');
  return files;
}

module.exports = {
  InsertFile,
  GetFullGallery,
  DeleteFile,
  EditFile,
};

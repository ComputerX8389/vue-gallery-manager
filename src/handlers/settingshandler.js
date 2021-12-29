function GetFolders() {
    let folderslocal = localStorage.getItem('folders');
    console.log('Raw folders', folderslocal);

    if (folderslocal) {
        folderslocal = JSON.parse(folderslocal);
        return folderslocal;
    } else {
        console.log('No folders found in local storage');
        return [];
    }
}

function SetFolders(folders) {
    localStorage.setItem('folders', JSON.stringify(folders));
}

export default {
    GetFolders,
    SetFolders,
};

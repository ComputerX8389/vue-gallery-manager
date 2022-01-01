<template>
    <div id="app">
        <b-container fluid>
            <div>
                <div id="nav">
                    <router-link to="/">Gallery</router-link> |
                    <router-link to="/settings">Settings</router-link>
                </div>
                <router-view />
            </div>
        </b-container>
    </div>
</template>

<script>
import filehandler from '@/handlers/filehandler';
import settingshandler from '@/handlers/settingshandler.js';

export default {
    async created() {
        let folders = settingshandler.GetFolders();
        // If there are no folders, ask user to select one
        if (folders.length == 0) {
            let response = filehandler.OpenFolderDialog();
            if (response.canceled == false) {
                folders.push(response.filePaths[0]);
                settingshandler.SetFolders(folders);
            }
        }
        await filehandler.CheckForDeletedFiles();
        await filehandler.ScanDir(folders[0], () => {
            console.log('Scanning complete');
        });
    },
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    padding: 30px;
}

#nav a {
    font-weight: bold;
    color: #2c3e50;
}

#nav a.router-link-exact-active {
    color: #42b983;
}

/* Fix icons not centered in buttons */
.btn .b-icon {
    vertical-align: middle !important;
    margin-right: 0.5rem !important;
}
.btn .b-icon:last-child {
    margin-right: 0 !important;
}
</style>

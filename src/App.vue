<template>
    <div id="app">
        <b-container fluid>
            <div>
                <div id="nav">
                    <router-link to="/">Gallery</router-link> |
                    <router-link to="/settings">Settings</router-link>
                    <b-button squared :disabled="ScanningInProgress" class="RefreshButton" @click="Refresh()"><b-icon-arrow-clockwise /></b-button>
                </div>
                <router-view />
            </div>
        </b-container>
    </div>
</template>

<script>
const { ipcRenderer } = require('electron');
import settingshandler from '@/handlers/settingshandler.js';

export default {
    name: 'App',
    data() {
        return {
            LastRefreshTime: null,
            ScanningInProgress: false,
        };
    },
    created() {
        this.onData = () => {
            console.log('Scanning done');
            this.ScanningInProgress = false;
        };
        ipcRenderer.on('ScanDirReply', this.onData);

        setTimeout(() => {
            this.Refresh();
        }, 5000);
    },
    beforeDestroy() {
        ipcRenderer.removeListener('ScanDirReply', this.onData);
    },
    methods: {
        Refresh() {
            console.log('Refreshing');
            this.ScanningInProgress = true;

            let folders = settingshandler.GetFolders();
            // If there are no folders, ask user to select one
            if (folders.length == 0) {
                let response = ipcRenderer.sendSync('OpenFolderDialog');
                if (response.canceled == false) {
                    folders.push(response.filePaths[0]);
                    settingshandler.SetFolders(folders);
                }
            }

            ipcRenderer.send('ScanDir', folders);
        },
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

.RefreshButton {
    float: right;
}
</style>

<template>
    <div class="Folders">
        <b-row>
            <b-col class="NoPadding">
                <b-button class="LineItem" squared variant="primary" @click="AddFolder">Add folder <b-icon-folder-plus style="margin-left: 10px" /></b-button>
            </b-col>
        </b-row>
        <b-row v-for="(folder, index) in folders" :key="index">
            <b-col cols="10" class="NoPadding">
                <p class="LineItem LineItemText">{{ folder }}</p>
            </b-col>
            <b-col cols="2" class="NoPadding">
                <b-button squared class="LineItem" @click="RemoveFolder(index)"><b-icon-folder-minus /></b-button>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import filehandler from '@/handlers/filehandler.js';
import settingshandler from '@/handlers/settingshandler.js';

export default {
    data() {
        return {
            folders: [],
        };
    },
    methods: {
        AddFolder() {
            let response = filehandler.OpenFolderDialog();
            if (response.canceled == false) {
                let folderpath = response.filePaths[0];

                if (this.folders.includes(folderpath) == false) {
                    this.folders.push(folderpath);
                } else {
                    console.log('Folder already exists');
                }
            }
        },
        RemoveFolder(index) {
            this.folders.splice(index, 1);
        },
    },
    created() {
        this.folders = settingshandler.GetFolders();
    },
    watch: {
        folders: {
            handler() {
                settingshandler.SetFolders(this.folders);
            },
            deep: true,
        },
    },
};
</script>

<style scoped>
.Folders {
    padding: 12px;
}

.LineItem {
    margin: 5px;
    height: 3rem;
    width: 100%;
}

.LineItemText {
    font-size: 1rem;
    /* center text vertically */
    display: flex;
    align-items: center;
    justify-content: left;
}

.LineItem {
    font-size: 1.1rem !important;
}

.NoPadding {
    padding: 0;
}
</style>

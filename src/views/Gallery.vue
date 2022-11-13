<template>
  <b-row>
    <b-col>
      <div class="inline" v-for="file in files" :key="file.id">
        <div class="imagePreviewContianer" @click="PictureClick(file.fullpath)">
          <b-img-lazy class="imagePreview" center :src="file.thumbnail" fluid></b-img-lazy>
        </div>
      </div>
    </b-col>
  </b-row>
</template>

<script>
const { ipcRenderer } = require('electron');
import databasehandler from '@/handlers/databasehandler';

export default {
  name: 'Gallery',
  data() {
    return {
      files: [],
    };
  },
  methods: {
    PictureClick: function (path) {
      console.log(path);
      this.$router.push({ name: 'Picture', params: { path: path } });
    },
    async LoadPictures() {
      this.files = await databasehandler.GetFullGallery();
      console.log(this.files);
    },
  },
  async created() {
    this.LoadPictures();
    this.onData = () => {
      console.log('Updating pictures');
      // Everything as awited or callbacked. But when getting the event
      // there is no new date, the database updates a little later
      setTimeout(() => {
        this.LoadPictures();
      }, 1000);
    };

    ipcRenderer.on('ScanDirReply', this.onData);
  },

  beforeDestroy() {
    ipcRenderer.removeListener('ScanDirReply', this.onData);
  },
};
</script>

<style scoped>
.inline {
  display: inline-block;
}

.imagePreviewContianer {
  height: 5rem;
  width: 5rem;
}

.imagePreview {
  max-height: 5rem;
  max-width: 5rem;
}
</style>

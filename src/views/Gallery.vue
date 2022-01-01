<template>
    <b-row>
        <b-col v-if="loading">
            <b-spinner></b-spinner>
        </b-col>
        <b-col v-else>
            <div class="inline" v-for="file in files" :key="file.id">
                <div class="imagePreviewContianer" @click="PictureClick(file.fullpath)">
                    <b-img-lazy class="imagePreview" center :src="file.thumbnail" fluid></b-img-lazy>
                </div>
            </div>
        </b-col>
    </b-row>
</template>

<script>
import databasehandler from '@/handlers/databasehandler';

export default {
    name: 'Gallery',
    data() {
        return {
            loading: true,
            files: [],
        };
    },
    methods: {
        PictureClick: function (path) {
            console.log(path);
            this.$router.push({ name: 'Picture', params: { path: path } });
        },
    },
    async created() {
        this.files = await databasehandler.GetFullGallery();
        this.loading = false;
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

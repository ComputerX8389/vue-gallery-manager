<template>
    <b-row>
        <b-col v-if="loading">
            <b-spinner></b-spinner>
        </b-col>
        <b-col v-else>
            <div class="inline" v-for="file in files" :key="file.id">
                <div @click="PictureClick(file.fullpath)">
                    <b-img-lazy v-bind="imageProps" :src="file.fullpath"></b-img-lazy>
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
            imageProps: {
                width: 100,
            },
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
</style>

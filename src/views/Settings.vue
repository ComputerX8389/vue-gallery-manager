<template>
    <div>
        <b-row>
            <b-col>
                <h2>Folders</h2>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <Folders />
            </b-col>
        </b-row>
    </div>
</template>

<script>
import Folders from '@/components/settings/Folders.vue';
export default {
    components: {
        Folders,
    },
};
</script>

<style scoped>
h2 {
    float: left;
    margin: 5px;
}
</style>

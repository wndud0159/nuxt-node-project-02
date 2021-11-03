<template>
    <div v-if="images.length !== 0" class=" flex flex-wrap space-x-2">
        <img class="w-20 h-20" v-for="item in images" :key="item.id" :src="`${$axios.defaults.baseURL}/${item.src}`" alt="">
    </div>
</template>

<script>
export default {
    props: {
        images: {
            type: Array,
            required: true
        }
    },
    data() {
        return {

        }
    },
    mounted() {
    },
    methods: {
        
    }

}
</script>

<style>

</style>
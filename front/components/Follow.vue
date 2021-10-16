<template>
    <div class="space-y-3">
        <div v-for="item in users" :key="item.id" class="flex items-center space-x-1">
            <div>{{ item.nickname }}</div>
            <i @click="remove(item.id)" class="far fa-minus-square"></i>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        users: {
            type: Array,
            required: true,
        },
        remove: {
            type: Function,
            required: true,
        },
    },
    data() {
        return {};
    },
    methods: {},
};
</script>

<style></style>

<template>
    <div class="space-y-3">
        <PostForm v-if="user" class="mb-10" />
        <PostList v-for="item in post" :key="item.id" :post="item" />
    </div>
</template>

<script>
import PostList from "../components/PostList.vue";
import PostForm from "../components/PostForm.vue";
export default {
    components: {
        PostList,
        PostForm,
    },
    computed: {
        user() {
            return this.$store.state.users.user;
        },
        post() {
            return this.$store.state.posts.post;
        },
    },
};
</script>

<style></style>

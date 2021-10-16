<template>
    <div>
        <div v-if="post">
            <PostList :post="post" />
        </div>
        <div v-else>
            해당 게시글이 존재하지 않습니다
        </div>
    </div>
</template>

<script>
import PostList from "~/components/PostList.vue";
export default {
    components: {
        PostList,
    },
    computed: {
        post() {
            return this.$store.state.posts.post.find((v) => v.id === parseInt(this.$route.params.id, 10));
        },
    },
};
</script>

<style></style>

<template>
    <div class="space-y-3">
        <PostList v-for="item in post" :key="item.id" :post="item" />
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
            return this.$store.state.posts.post;
        },
    },
    fetch({ store, params }) {
        return store.dispatch('posts/loadHashtagPosts', {
            hashtag: encodeURIComponent(params.id),
            reset: true,
        });
    },
    mounted() {
        window.addEventListener("scroll", this.onScroll);
    },
    beforeDestroy() {
        window.addEventListener("scroll", this.onScroll);
    },
    methods: {
        onScroll() {
            if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
                console.log("찍어보세용~");
                if (this.hasMorePost) {
                    this.$store.dispatch("posts/loadPosts");
                }
            }
        },
    },
};
</script>

<style></style>

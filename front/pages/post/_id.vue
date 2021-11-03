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
    fetch({ store, params }) {
        return store.dispatch('posts/loadPost', params.id);
    },
    head() {
        return {
            title: `${this.post && this.post.User.nickname}님의 게시글`,
            meta: [{
            hid: 'desc', name: 'description', content: this.post.content,
            }, {
            hid: 'ogtitle', property: 'og:title', content: `${this.post.User.nickname}님의 게시글`,
            }, {
            hid: 'ogdesc', property: 'og:description', content: this.post.content,
            }, {
            // hid: 'ogimage', property: 'og:image', content: this.post.Images[0] ? this.post.Images[0].src : 'https://vue.nodebird.com/vue-nodebird.png',
            }, {
            // hid: 'ogurl', property: 'og:url', content: `https://vue.nodebird.com/post/${this.post.id}`,
            }],
        };
    }
};
</script>

<style></style>

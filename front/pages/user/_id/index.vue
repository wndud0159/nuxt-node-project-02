<template>
    <div class="space-y-3">
        <div class="border px-3 py-3 shadow-md">
            <div class="">
                {{other.nickname}} 님의 타임라인
            </div>
            <div>
                <div>{{other.Followings.length}} 팔로잉</div>
                <div>{{other.Followers.length}} 팔로워</div>
            </div>
        </div>
        <PostList v-for="item in post" :key="item.id" :post="item" />
    </div>
</template>

<script>
import PostList from "../../../components/PostList.vue";
export default {
    components: {
        PostList,
    },
    computed: {
        other() {
            return this.$store.state.users.other;
        },
        post() {
            return this.$store.state.posts.post;
        },
    },
    fetch({ store, route }) {
        return Promise.all([
            store.dispatch('posts/loadUserPosts', {
            userId: route.params.id,
            reset: true,
            }),
            store.dispatch('users/loadOther', {
            userId: route.params.id,
            }),
        ]);

    },
    asyncData() {
        // 컴포넌트의 데이터를 비동기 채워넣어야 할 경우
    },
    mounted() {
        window.addEventListener("scroll", this.onScroll);
    },
    beforeDestroy() {
        window.addEventListener("scroll", this.onScroll);
    },
    methods: {
        onScroll() {
            if (
                window.scrollY + document.documentElement.clientHeight >
                document.documentElement.scrollHeight - 300
            ) {
                console.log("찍어보세용~");
                if (this.hasMorePost) {
                    // this.$store.dispatch("posts/loadOther", {
                    //     userId: this.$route.params.id,
                    // });
                }
            }
        },
    },
};
</script>

<style></style>

<template>
    <div>
        <nuxt-link class="text-2xl font-semibold" :to="`/user/${post.User.id}`"> {{ post.User.nickname }} </nuxt-link><br />
        <div class="">
            <div class="mt-3 mb-3">
                <div v-for="(item, index) in nodes" :key="index">
                    <nuxt-link
                        v-if="item.startsWith('#')"
                        :key="index"
                        :to="`/hashtag/${item.slice(1)}`"
                        style="color: deepskyblue"
                    >
                    {{item}}
                    </nuxt-link>
                    <nuxt-link :to="`/post/${post.id}`" v-else>
                        {{item}}
                    </nuxt-link>
                </div>
                <div class="mt-3 -mb-3">{{$moment(post.createdAt).fromNow()}}</div>
            </div>
        </div>
        <PostImages class="mb-3" :images="post.Images || []" />
        <button class="px-4 py-2 bg-green-500 text-white rounded-lg" v-if="isFollow" @click="onFollow">팔로우</button>
        <button class="px-4 py-2 bg-gray-300 rounded-lg" v-if="isUnFollow" @click="onUnFollow">언팔로우</button>
    </div>
</template>

<script>
import PostImages from './PostImages.vue'
export default {
    components: {
        PostImages
    },
    props: {
        post: {
            type: Object
        }
    },
    computed: {
        user() {
            return this.$store.state.users.user
        },
        isFollow() {
            // description : 로그인상태여야 하고 게시글의 주인이 아니여야 하며 팔로잉을 하지 않은상태
            return this.user && this.post.User.id !== this.user.id && !this.user.Followings.find(v => v.id === this.post.User.id)
        },
        isUnFollow() {
            return this.user && this.post.User.id !== this.user.id && this.user.Followings.find(v => v.id === this.post.User.id)
        },
        nodes() {
            return this.post.content.split(/(#[^\s#]+)/);
        }
    },
    methods: {
        onFollow() {
            this.$store.dispatch('users/follow', {
                userId: this.post.User.id
            })
        },
        onUnFollow() {
            this.$store.dispatch('users/unfollow', {
                userId: this.post.User.id
            })
        }
    }

}
</script>

<style>

</style>
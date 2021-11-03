<template>
    <div class="px-3 py-3 border shadow-md rounded-sm border-gray-200">
        <div  v-if="post.RetweetId && post.Retweet">
            <div class="text-gray-500 mb-3">
                {{post.User.nickname}}님이 리트윗 하셨습니다.
            </div>
            <PostContent class="py-3 px-3 border shadow-sm" :post="post.Retweet"/>
        </div>
        <div v-else>
        <PostContent :post="post"/>
        </div>
        <div class="flex space-x-10 text-lg text-yellow-400 mt-10">
            <i :class="`fas fa-retweet`" @click="onClickRetweet"></i>
            <i :class="`far fa-heart ${heartIcon}`" @click="onClickHeart"></i>
            <i @click="onToggleCommentHandler" class="far fa-comment-alt"></i>
            <div class=" relative w-full">
                <i @click="onDropdownHandler" class="fas fa-ellipsis-h"></i>
                <div v-if="isDropdown" class=" absolute top-0 ">
                    <div @click="test" class="text-black px-10 bg-gray-200 text-center border-b border-gray-300 hover:bg-green-500 hover:text-white">
                        x
                    </div>
                    <div @click="onEditPost" class="bg-gray-200 text-black px-10 border-b border-gray-300  hover:bg-green-500 hover:text-white">수정</div>
                    <div @click="onRemovePost" class="bg-gray-200 text-black px-10 border-b border-gray-300  hover:bg-green-500 hover:text-white">삭제</div>
                </div>
            </div>
        </div>
        <div v-if="isComment">
            <CommentForm :postId="post.id" class="mb-5" />
            <div v-for="item in post.Comments" :key="item.id" class="border border-gray-200 px-2 py-2">
                <div class="text-xl">{{ item.User.nickname[0] }}</div>
                <div class="mt-5">
                <div>{{item.User.nickname}}</div>
                <div>comment : {{ item.content }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CommentForm from "./CommentForm.vue";
import PostImages from './PostImages.vue'
import PostContent from './PostContent.vue'

export default {
    components: {
        CommentForm,
        PostImages,
        PostContent
    },
    props: {
        post: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            isDropdown: false,
            isComment: false,
        };
    },
    computed: {
        user() {
            return this.$store.state.users.user
        },
        liked() {
            const user = this.$store.state.users.user
            return !!(this.post.Likers || []).find(v => v.id === (user && user.id))
        },
        heartIcon() {
            return this.liked ? 'text-red-500' : 'text-yello-400'
        }
    },
    methods: {
        onDropdownHandler() {
            this.isDropdown = true;
        },
        test() {
            this.isDropdown = false;
        },
        onToggleCommentHandler() {
            if (!this.isComment) {
                this.$store.dispatch("posts/loadComment", {
                    postId: this.post.id,
                });
            }
            this.isComment = !this.isComment;
        },
        onRemovePost() {
            this.$store.dispatch("posts/remove", {
                postId: this.post.id,
            });
        },
        onEditPost() {
            consol.log("");
        },
        onClickRetweet() {
            if(!this.user) {
                return alert('로그인이 필요합니다.')
            }
            this.$store.dispatch('posts/retweet', {
                postId: this.post.id
            })
        },
        onClickHeart() {
            if(!this.user) {
                return alert('로그인이 필요합니다.')
            }
            if(this.liked) {
                return this.$store.dispatch('posts/unlikePost', {
                    postId: this.post.id
                })
            }
            return this.$store.dispatch('posts/likePost', {
                postId: this.post.id
            })
        }
    },
};
</script>

<style></style>

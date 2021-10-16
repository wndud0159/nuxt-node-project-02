<template>
    <div class="px-3 py-3 border shadow-md rounded-sm border-gray-200">
        <nuxt-link :to="`/user/${post.id}`">
            {{ post.user.nickname }} </nuxt-link
        ><br />
        <nuxt-link :to="`/post/${post.id}`">
            {{ post.content }}
        </nuxt-link>
        <div class="flex space-x-10 text-lg text-yellow-400 mt-10">
            <i class="fas fa-retweet"></i>
            <i class="far fa-heart"></i>
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
            <div v-for="item in post.comment" :key="item.id" class="border border-gray-200 px-2 py-2">
                <div class="text-xl">{{ item.user.nickname }}</div>
                <div>comment : {{ item.comment }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import CommentForm from "./CommentForm.vue";
export default {
    components: {
        CommentForm,
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
    methods: {
        onDropdownHandler() {
            this.isDropdown = true;
        },
        test() {
            this.isDropdown = false;
        },
        onToggleCommentHandler() {
            this.isComment = !this.isComment;
        },
        onRemovePost() {
            this.$store.dispatch("posts/remove", {
                id: this.post.id,
            });
        },
        onEditPost() {
            consol.log("");
        },
    },
};
</script>

<style></style>

<template>
    <div class="px-3 py-3 border shadow-md rounded-sm">
        <form @submit.prevent="onSubmitHandler" action="">
            <textarea v-model="content" class="px-3 py-3 outline-none border w-full resize-none focus:ring-1" placeholder="댓글달기" required rows="5"></textarea>
            <div v-if="isMessage" class="text-green-500">{{ message }}</div>
            <div class="flex justify-between">
                <button type="submit" class="bg-green-500 py-2 px-6 rounded-md">삐약</button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    props: {
        postId: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            message: "",
            isMessage: false,
            content: "",
        };
    },
    computed: {
        user() {
            return this.$store.state.users.user;
        },
    },
    methods: {
        onTextChangeHandler() {
            this.isMessage = false;
            this.message = "";
        },
        onSubmitHandler() {
            this.$store
                .dispatch("posts/addComment", {
                    postId: this.postId,
                    content: this.content,
                })
                .then(() => {
                    this.isMessage = true;
                    this.message = "댓글이 등록되었습니다!";
                    this.content = "";
                });
        },
    },
};
</script>

<style></style>

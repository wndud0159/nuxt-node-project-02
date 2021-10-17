<template>
    <div class="px-3 py-3 border shadow-md rounded-sm">
        <form @submit.prevent="onSubmitHandler" action="">
            <textarea v-model="content" @input="onTextChangeHandler" class="px-3 py-3 outline-none border w-full resize-none focus:ring-1" placeholder="어떠한 신기한 일이 있었나요?" required rows="5"></textarea>
            <div v-if="hideDetails" class="text-green-500">{{ message }}</div>
            <div class="flex justify-between">
                <input ref="imageInput" type="file" multiple hidden @change="onChangeImages" />
                <div>
                    <button type="button" @click="onClickImageUpload" class="bg-gray-200 py-2 px-3 rounded-md">이미지 업로드</button>
                    <div v-if="imagePaths">
                        <div v-for="item in imagePaths" :key="item" class="">
                            <img :src="`http://localhost:8080/${item}`" :alt="`${item}`" class="w-40" />
                            <div @click="onRemoveImage(item)">제거</div>
                        </div>
                    </div>
                </div>
                <button type="submit" class="bg-green-500 py-2 px-6 rounded-md">짹짹</button>
            </div>
        </form>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    data() {
        return {
            hideDetails: false,
            message: "",
            content: "",
        };
    },
    computed: mapState({
        user: (state) => state.users.user,
        imagePaths: (state) => state.posts.imagePaths,
    }),
    methods: {
        onTextChangeHandler() {
            this.hideDetails = false;
            this.message = "";
        },
        async onSubmitHandler() {
            try {
                const result = await this.$store.dispatch("posts/add", {
                    content: this.content,
                });
                this.hideDetails = true;
                this.message = "게시글 등록 성공!";
                this.content = "";
            } catch (error) {
                console.log("postForm submit error : ", error);
            }
        },
        onClickImageUpload() {
            this.$refs.imageInput.click();
        },
        onChangeImages(e) {
            console.log(e.target.files);
            const imageFormData = new FormData();
            [].forEach.call(e.target.files, (f) => [imageFormData.append("image", f)]);
            this.$store.dispatch("posts/uploadImages", imageFormData);
        },
        onRemoveImage(index) {
            this.$store.commit("posts/removeImagePaths", index);
        },
    },
};
</script>

<style></style>

<template>
    <div class="mb-10">
        <!-- header section -->
        <div class=" w-full flex justify-between fixed  px-3 bg-green-500 h-20 items-center text-white">
            <nuxt-link to="/" class="text-2xl">
                NodeBird
            </nuxt-link>
            <div class="flex items-center space-x-8">
                <form @submit.prevent="onSubmitHandler" class="">
                    <button type="submit">
                        <i class="fas fa-search cursor-pointer"></i>
                    </button>
                    <input v-model="hashtag" required class="px-3 border-b bg-green-500 outline-none text-white border-white" type="text" />
                </form>
                <nuxt-link to="/profile" class=" cursor-pointer">
                    프로필
                </nuxt-link>
                <nuxt-link to="/signup" class=" cursor-pointer">
                    회원가입
                </nuxt-link>
            </div>
        </div>

        <div class="flex md:flex-row flex-col w-full pt-24 px-3">
            <div class="md:w-4/12 w-full mr-5"><LoginForm /></div>
            <div class="md:w-8/12 w-full mt-10 md:mt-0"><nuxt /></div>
        </div>
    </div>
</template>

<script>
import LoginForm from "../components/LoginForm.vue";
export default {
    components: {
        LoginForm,
    },
    data() {
        return {
            hashtag: "",
        };
    },
    fatch({ store }) {
        store.dispatch("users/loadUser");
    },
    computed: {},
    methods: {
        onSubmitHandler() {
            this.$router.push({
                path: `/hashtag/${this.hashtag}`,
            });
            this.hashtag = "";
        },
    },
};
</script>

<style></style>

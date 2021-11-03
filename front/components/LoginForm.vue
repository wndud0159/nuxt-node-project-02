<template>
    <div class=" border shadow-md px-3 py-3">
        <form v-if="!user" @submit.prevent="onSubmitHandler" action="" class=" space-y-3">
            <div>
                <div>이메일</div>
                <input v-model="email" class="border-b w-full outline-none focus:ring-1 border-gray-300" type="email" name="" id="" required />
            </div>
            <div>
                <div>비밀번호</div>
                <input v-model="password" class="border-b w-full outline-none focus:ring-1 border-gray-300" type="password" required />
            </div>
            <div class="flex space-x-3">
                <button type="submit" class="bg-green-500 px-5 py-2 rounded-md">로그인</button>
                <nuxt-link to="/signup" class="bg-gray-200 px-5 py-2 rounded-md">회원가입</nuxt-link>
            </div>
        </form>
        <div v-else class="space-y-3">
            <div>{{ user.nickname }}님</div>
            <div>로그인 되었습니다.</div>
            <button @click="onLogOut" class="bg-gray-200 px-5 py-2 rounded-md">로그아웃</button>
            <div>
                <div>{{user.Followings.length}} 팔로잉</div>
                <div>{{user.Followers.length}} 팔로워</div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    data() {
        return {
            email: "",
            password: "",
        };
    },
    computed: mapState({
        user: (state) => state.users.user,
    }),
    methods: {
        onLogOut() {
            this.$store.dispatch("users/logout");
        },
        onSubmitHandler() {
            this.$store.dispatch("users/login", {
                email: this.email,
                password: this.password,
            });
        },
    },
};
</script>

<style></style>

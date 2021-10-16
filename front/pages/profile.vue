<template>
    <div v-if="user" class="space-y-3">
        <div class=" border shadow-md px-3 py-3">
            <form action="" class=" space-y-3">
                <div class="text-xl font-semibold">내 프로필</div>
                <form action="" @submit.prevent="onEditNickName">
                    <div>
                        <div>내 프로필</div>
                        <input required v-model="name" class="border-b w-full outline-none focus:ring-1 border-gray-300" type="text" :placeholder="user.nickname" />
                    </div>
                    <div class="flex space-x-3">
                        <button type="submit" class="bg-blue-500 px-5 py-2 rounded-md">수정</button>
                    </div>
                </form>
            </form>
        </div>
        <div class="space-y-3 border shadow-md px-3 py-3">
            <div class="text-xl font-semibold">팔로잉</div>
            <Follow :users="followingList" :remove="removeFollowing" />
        </div>
        <div class="space-y-3 border shadow-md px-3 py-3">
            <div class="text-xl font-semibold">팔로워</div>
            <Follow :users="followerList" :remove="removeFollower" />
        </div>
    </div>
</template>

<script>
import Follow from "../components/Follow.vue";
export default {
    components: {
        Follow,
    },
    data() {
        return {
            name: "",
        };
    },
    computed: {
        user() {
            return this.$store.state.users.user;
        },
        followingList() {
            return this.$store.state.users.followingList;
        },
        followerList() {
            return this.$store.state.users.followerList;
        },
    },
    methods: {
        onEditNickName() {
            this.$store.dispatch("users/edit", {
                nickname: this.name,
            });
            this.name = "";
        },
        removeFollowing(id) {
            this.$store.dispatch("users/removeFollowing", { id });
        },
        removeFollower(id) {
            this.$store.dispatch("users/removeFollower", { id });
        },
    },
    middleware: "authenticated",
};
</script>

<style></style>

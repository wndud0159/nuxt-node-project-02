<template>
    <div class="space-y-3">
        <div class=" border shadow-md px-3 py-3">
            <form action="" class=" space-y-3">
                <div class="text-xl font-semibold">내 프로필</div>
                <div>
                    <div>닉네임</div>
                    <input class="border-b w-full outline-none focus:ring-1 border-gray-300" type="text" />
                </div>
                <div class="flex space-x-3">
                    <button class="bg-blue-500 px-5 py-2 rounded-md">수정</button>
                </div>
            </form>
        </div>
        <div class="space-y-3 border shadow-md px-3 py-3">
            <div class="text-xl font-semibold">팔로잉</div>
            <Follow />
        </div>
    </div>
</template>

<script>
import Follow from "../components/Follow.vue";
export default {
    components: {
        Follow,
    },
};
</script>

<style></style>

<template>
    <div class=" border shadow-md px-3 py-3">
        <form ref="form" @submit.prevent="onSubmitHandler" action="" class=" space-y-3">
            <div class="text-xl font-semibold">회원가입</div>
            <div>
                <div>이메일</div>
                <input v-model="email" class="border-b w-full outline-none focus:ring-1 border-gray-300" type="email" name="" id="" required />
            </div>
            <div>
                <div>비밀번호</div>
                <input v-model="password" class="border-b w-full outline-none focus:ring-1 border-gray-300" type="password" required />
            </div>
            <div>
                <div>비밀번호 확인</div>
                <input v-model="passwordCheck" class="border-b w-full outline-none focus:ring-1 border-gray-300" type="password" required />
            </div>
            <div>
                <div>닉네임</div>
                <input v-model="nickname" class="border-b w-full outline-none focus:ring-1 border-gray-300" type="text" required />
            </div>
            <div class="space-x-3">
                <input @change="onCheckHandler" v-model="terms" type="checkbox" name="" id="" required />
                <span>개인정보 이용정책 동의</span>
            </div>
            <div class="flex space-x-3">
                <button class="bg-green-500 px-5 py-2 rounded-md">가입하기</button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            email: "",
            password: "",
            passwordCheck: "",
            nickname: "",
            terms: false,
        };
    },
    methods: {
        onCheckHandler() {
            console.log(this.terms);
        },
        onSubmitHandler() {
            console.log("체크");
            console.log(this.$refs.form.email);
        },
    },
};
</script>

<style></style>

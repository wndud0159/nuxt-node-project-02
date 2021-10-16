export const state = () => ({
    user: null,
    followingList: [
        {
            id: 1,
            nickname: "주영",
        },
        {
            id: 2,
            nickname: "주빵",
        },
        {
            id: 3,
            nickname: "주순",
        },
    ],
    followerList: [
        {
            id: 1,
            nickname: "윤아",
        },
        {
            id: 2,
            nickname: "길동",
        },
        {
            id: 3,
            nickname: "홍구",
        },
    ],
});

export const mutations = {
    setUser(state, payload) {
        state.user = payload;
    },
    editNickName(state, payload) {
        state.user.nickname = payload.nickname;
    },
    addFollowing(state, payload) {
        state.followingList.push(payload);
    },
    addFollower(state, payload) {
        state.followerList.push(payload);
    },
    removeFollowing(state, payload) {
        const index = state.followingList.findIndex((v) => v.id === payload.id);
        state.followingList.splice(index, 1);
    },
    removeFollower(state, payload) {
        const index = state.followerList.findIndex((v) => v.id === payload.id);
        state.followerList.splice(index, 1);
    },
};

export const actions = {
    signUp({ commit, state }, payload) {
        // context {commit, state, 등등} 를 구조분해
        // 서버에 회원가입 요청을 보내는 부분
        commit("setUser", payload);
    },
    logIn({ commit }, payload) {
        commit("setUser", payload);
    },
    logOut({ commit }, payload) {
        commit("setUser", null);
    },
    edit({ commit }, payload) {
        commit("editNickName", payload);
    },
    addFollowing({ commit }, payload) {
        commit("addFollowing", payload);
    },
    addFollower({ commit }, payload) {
        commit("addFollower", payload);
    },
    removeFollowing({ commit }, payload) {
        commit("removeFollowing", payload);
    },
    removeFollower({ commit }, payload) {
        commit("removeFollower", payload);
    },
};

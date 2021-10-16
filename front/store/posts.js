export const state = () => ({
    post: [],
});

export const mutations = {
    addPost(state, payload) {
        state.post.unshift(payload);
    },
    removePost(state, payload) {
        const index = state.post.findIndex((v) => v.id === payload.id);
        state.post.splice(index, 1);
    },
    addComment(state, payload) {
        const index = state.post.findIndex((v) => v.id === payload.postId);
        state.post[index].comment.unshift(payload);
    },
};

export const actions = {
    add({ commit }, payload) {
        // 서버에 게시글 등록 요청 보냄
        commit("addPost", payload); //인자를 {root: true}가 있다면(3번째) 같은 뮤테이션네임 중 index에 있는걸 실행한다
        return true;
    },
    remove({ commit }, payload) {
        commit("removePost", payload);
    },
    addComment({ commit }, payload) {
        commit("addComment", payload);
    },
};

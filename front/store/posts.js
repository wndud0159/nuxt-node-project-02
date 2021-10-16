export const state = () => ({
    post: [],
    hasMorePost: true, // 인피니트스크롤링 기법
});

const limit = 10;
const totalPosts = 51;

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
    loadPosts(state) {
        const diff = totalPosts - state.post.length;
        const fakePosts = Array(diff > limit ? limit : diff)
            .fill()
            .map((v) => ({
                id: Math.random().toString(),
                user: {
                    id: 1,
                    nickname: "주영",
                },
                content: `hello infinite scrolling${Math.random()}`,
                comments: [],
                images: [],
            }));
        state.post = state.post.concat(fakePosts);
        state.hasMorePost = fakePosts.length === limit;
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
    loadPosts({ commit, state }, payload) {
        if (state.hasMorePost) {
            commit("loadPosts");
        }
    },
};

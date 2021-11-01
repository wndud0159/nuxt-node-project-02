export const state = () => ({
    post: [],
    hasMorePost: true, // 인피니트스크롤링 기법
    imagePaths: [],
});

const limit = 10;
// const totalPosts = 51;

export const mutations = {
    addPost(state, payload) {
        state.post.unshift(payload);
        state.imagePaths = [];
    },
    removePost(state, payload) {
        const index = state.post.findIndex((v) => v.id === payload.postId);
        state.post.splice(index, 1);
    },
    addComment(state, payload) {
        const index = state.post.findIndex((v) => v.id === payload.postId);
        state.post[index].comment.unshift(payload);
    },
    loadComment(state, payload) {
        const index = state.post.findIndex((v) => v.id === payload.postId);
        state.post[index].comment = payload;
    },
    loadPosts(state, payload) {
        // const diff = totalPosts - state.post.length;
        // const fakePosts = Array(diff > limit ? limit : diff)
        //     .fill()
        //     .map((v) => ({
        //         id: Math.random().toString(),
        //         User: {
        //             id: 1,
        //             nickname: "주영",
        //         },
        //         content: `hello infinite scrolling${Math.random()}`,
        //         comments: [],
        //         images: [],
        //     }));
        // state.post = state.post.concat(fakePosts);
        // state.hasMorePost = fakePosts.length === limit;
        state.post = state.post.concat(payload);
        state.hasMorePost = payload.length == limit;
    },
    concatImagePaths(state, payload) {
        state.imagePaths = state.imagePaths.concat(payload);
    },
    removeImagePaths(state, payload) {
        state, imagePaths.splice(payload, 1);
    },
};

export const actions = {
    add({ commit, state }, payload) {
        // 서버에 게시글 등록 요청 보냄
        this.$axios
            .post(
                "/post",
                {
                    content: payload.content,
                    image: state.imagePaths,
                },
                {
                    withCredentials: true,
                }
            )
            .then((response) => {
                commit("addPost", response.data); //인자를 {root: true}가 있다면(3번째) 같은 뮤테이션네임 중 index에 있는걸 실행한다
                return true;
            })
            .catch((error) => {
                console.error("post create error : ", error);
            });
    },
    remove({ commit }, payload) {
        this.$axios
            .delete(`/post/${payload.postId}`, {
                withCredentials: true,
            })
            .then((response) => {
                commit("removePost", response.data);
            })
            .error((error) => {
                console.error("post remove error : ", error);
            });
    },
    addComment({ commit }, payload) {
        this.$axios
            .post(
                `/post/${payload.postId}/comment`,
                {
                    content: payload.content,
                },
                {
                    withCredentials: true,
                }
            )
            .then((response) => {
                commit("addComment", response.data);
            })
            .catch((error) => {
                console.error("add commit error : ", error);
            });
    },
    loadComment({ commit }, payload) {
        this.$axios
            .get(`/post/${payload.postId}/comments`)
            .then((response) => {
                commit("loadComment", response.data);
            })
            .catch((error) => {
                console.error("comment load error : ", error);
            });
    },
    async loadPosts({ commit, state }, payload) {
        try {
            const result = await this.$axios.get(`/posts?offset=${state.post.length}$limit=10`);
            // console.log("postlist check", result.data);
            commit("loadPosts", result.data);
        } catch (error) {
            console.error("load posts error : ", error);
        }
    },

    uploadImages({ commit }, payload) {
        this.$axios
            .post("/post/images", payload, {
                withCredentials: true,
            })
            .then((response) => {
                console.log("image upload success!", response.data);
                commit("concatImagePaths", response.data);
            })
            .catch((error) => {
                console.error("image upload error : ", error);
            });
    },
};

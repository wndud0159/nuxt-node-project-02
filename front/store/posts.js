import Vue from 'vue';
import throttle from 'lodash.throttle'

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
        const index = state.post.findIndex((v) => v.id === payload.PostId);
        state.post[index].Comments.unshift(payload);
    },
    loadComments(state, payload) {
        const index = state.post.findIndex((v) => v.id === payload.postId);
        // state.post[index].content = payload;
        Vue.set(state.post[index], 'Comments', payload.data);
    },
    loadPost(state, payload) {
        state.post = [payload];
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
        //         comments: [],r
        //         images: [],
        //     }));
        // state.post = state.post.concat(fakePosts);
        // state.hasMorePost = fakePosts.length === limit;
        if (payload.reset) {
            state.post = payload.data;
        } else {
            state.post = state.post.concat(payload.data);
        }
        state.hasMorePost = payload.data.length === 10;
    },
    concatImagePaths(state, payload) {
        state.imagePaths = state.imagePaths.concat(payload);
    },
    removeImagePaths(state, payload) {
        state, imagePaths.splice(payload, 1);
    },
    unlikePost(state, payload) {
        const index = state.post.findIndex(v => v.id === payload.postId)
        const userIndex = state.post[index].Likers.findIndex(v => v.id === payload.postId)
        state.post[index].Likers.splice(userIndex, 1);
    },
    likePost(state, payload) {
        const index = state.post.findIndex(v => v.id === payload.postId)
        state.post[index].Likers.push({
            id: payload.userId
        })
    }
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
                commit("removePost", payload);
            })
            .catch((error) => {
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
                console.log('response data', response.data)
                commit("addComment", response.data);
            })
            .catch((error) => {
                console.error("add commit error : ", error);
            });
    },
    loadComment({ commit }, payload) {
        this.$axios
            .get(`/post/${payload.postId}/comments`, {
                withCredentials: true,
            })
            .then((response) => {
                commit("loadComments", {
                    postId: payload.postId,
                    data: response.data,   
                });
            })
            .catch((error) => {
                console.error("content load error : ", error);
            });
    },
    async loadPost({ commit, state }, payload) {
        try {
            const res = await this.$axios.get(`/post/${payload}`, {
                withCredentials: true,
            });
            commit('loadPost', res.data);
        } catch (err) {
            console.error(err);
        }
    },
    loadPosts: throttle(async function ({ commit, state }, payload) {
        console.log('loadPosts')
        try {
            if (payload && payload.reset) {
                const res = await this.$axios.get(`/posts?limit=10`, {
                    withCredentials: true,
                });
                commit('loadPosts', {
                    data: res.data,
                    reset: true,
                });
                return;
            }
            if (state.hasMorePost) {
                const lastPost = state.post[state.post.length - 1];
                const res = await this.$axios.get(`/posts?lastId=${lastPost && lastPost.id}&limit=10`, {
                    withCredentials: true,
                });
                console.log(res)
                commit('loadPosts', {
                    data: res.data,
                });
                return;
            }
        } catch (error) {
            console.error("load posts error : ", error);
        }
    }, 2000),
    loadUserPosts: throttle(async function ({ commit, state }, payload) {
        try {
            if (payload && payload.reset) {
                const res = await this.$axios.get(`/user/${payload.userId}/posts?limit=10`, {
                    withCredentials: true,
            });
            commit('loadPosts', {
                data: res.data,
                reset: true,
            });
            return;
            }
            if (state.hasMorePost) {
            const lastPost = state.post[state.post.length - 1];
                const res = await this.$axios.get(`/user/${payload.userId}/posts?lastId=${lastPost && lastPost.id}&limit=10`, {
                    withCredentials: true,
            });
            commit('loadPosts', {
                data: res.data,
            });
            return;
            }
        } catch (err) {
            console.error(err);
        }
    }, 2000),
    loadHashtagPosts: throttle(async function ({ commit, state }, payload) {
        console.log('loadHashtagPosts')
        try {
            if (payload && payload.reset) {
                const res = await this.$axios.get(`/hashtag/${payload.hashtag}?limit=10`, {
                    withCredentials: true,
            });
            commit('loadPosts', {
                data: res.data,
                reset: true,
            });
            return;
            }
            if (state.hasMorePost) {
            const lastPost = state.post[state.post.length - 1];
                const res = await this.$axios.get(`/hashtag/${payload.hashtag}?lastId=${lastPost && lastPost.id}&limit=10`, {
                    withCredentials: true,
            });
            commit('loadPosts', {
                data: res.data,
            });
            return;
            }
        } catch (err) {
            console.error(err);
        }
    }, 2000),
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
    retweet({commit}, payload) {
        this.$axios.post(`/post/${payload.postId}/retweet`, {
            withCredentials: true,
        })
            .then((response) => {
                if (response.data.error) {
                    console.log(response.data.message)
                    return
                }
                commit('addPost', response.data)
            }).catch((error) => {
                console.log(error)
            })
    },
    likePost({commit}, payload) {
        this.$axios.post(`/post/${payload.postId}/like`, {
            withCredentials: true,
        })
            .then((response) => {
                commit('likePost', {
                    userId: response.data.userId,
                    postId: payload.postId
                })
            }).catch((error) => {
                console.log(error)
            })
    },
    unlikePost({commit}, payload) {
        this.$axios.delete(`/post/${payload.postId}/like`, {
            withCredentials: true,
        })
            .then((response) => {
                commit('unlikePost', {
                    userId: response.data.userId, 
                    postId: payload.postId
                })
            }).catch((error) => {
                console.log(error)
            })
    },
    
};

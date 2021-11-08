
export const state = () => ({
    user: null,
    followingList: [],
    followerList: [],
    hasMoreFollowing: true,
    hasMoreFollower: true,
    other: null, // 남의 정보
});

const totalFollowers = 8;
const totalFollowings = 6;
const limit = 3;

export const mutations = {
    setUser(state, payload) {
        state.user = payload;
        console.log("user state : ", state.user);
    },
    // editNickName(state, payload) {
    //     state.user.nickname = payload.nickname;
    // },
    // addFollowing(state, payload) {
    //     state.followingList.push(payload);
    // },
    // addFollower(state, payload) {
    //     state.followerList.push(payload);
    // },
    // removeFollowing(state, payload) {
    //     const index = state.followingList.findIndex((v) => v.id === payload.id);
    //     state.followingList.splice(index, 1);
    // },
    // removeFollower(state, payload) {
    //     const index = state.followerList.findIndex((v) => v.id === payload.id);
    //     state.followerList.splice(index, 1);
    // },
    // loadFollowings(state, payload) {
    //     const diff = totalFollowings - state.followingList.length;
    //     const fakeUsers = Array(diff > limit ? limit : diff)
    //         .fill()
    //         .map((v) => ({
    //             id: Math.random().toString(),
    //             nickname: Math.floor(Math.random() * 1000),
    //         }));
    //     state.followingList = state.followingList.concat(fakeUsers);
    //     state.hasMoreFollowing = fakeUsers.length === limit;
    // },
    // loadFollowers(state, payload) {
    //     const diff = totalFollowers - state.followerList.length;
    //     const fakeUsers = Array(diff > limit ? limit : diff)
    //         .fill()
    //         .map((v) => ({
    //             id: Math.random().toString(),
    //             nickname: Math.floor(Math.random() * 1000),
    //         }));
    //     state.followerList = state.followerList.concat(fakeUsers);
    //     state.hasMoreFollower = fakeUsers.length === limit;
    // },
    setOther(state, payload) {
        state.other = payload;
        console.log('other state', state.other)
    },
    changeNickname(state, payload) {
    state.user.nickname = payload.nickname;
    },
    addFollower(state, payload) {
    state.followerList.push(payload);
    },
    addFollowing(state, payload) {
    state.followingList.push(payload);
    },
    removeFollower(state, payload) {
    let index = state.user.Followers.findIndex(v => v.id === payload.userId);
    state.user.Followers.splice(index, 1);
    index = state.followerList.findIndex(v => v.id === payload.id);
    state.followerList.splice(index, 1);
    },
    removeFollowing(state, payload) {
    let index = state.user.Followings.findIndex(v => v.id === payload.userId);
    state.user.Followings.splice(index, 1);
    index = state.followerList.findIndex(v => v.id === payload.userId);
    state.followingList.splice(index, 1);
    },
    loadFollowings(state, payload) {
    if (payload.offset === 0) {
        state.followingList = payload.data;
    } else {
        state.followingList = state.followingList.concat(payload.data);
    }
    state.hasMoreFollowing = payload.data.length === limit;
    },
    loadFollowers(state, payload) {
    if (payload.offset === 0) {
        state.followerList = payload.data;
    } else {
        state.followerList = state.followerList.concat(payload.data);
    }
    state.hasMoreFollower = payload.data.length === limit;
    },
    following(state, payload) {
        console.log('following id : ', payload.userId)
    state.user.Followings.push({ id: payload.userId });
    },
};

export const actions = {
    signUp({ commit, state }, payload) {
        // context {commit, state, 등등} 를 구조분해
        // 서버에 회원가입 요청을 보내는 부분
        this.$axios
            .post(
                "/user",
                {
                    email: payload.email,
                    nickname: payload.nickname,
                    password: payload.password,
                },
            )
            .then((response) => {
                console.log("signup success : ", response);
                // commit("setUser", response.data);
            })
            .catch((error) => {
                console.error("user create error : ", error);
            });
    },
    login({ commit }, payload) {
        this.$axios
            .post(
                "/user/login",
                {
                    email: payload.email,
                    password: payload.password,
                },
                {
                    withCredentials: true,
                }
            )
            .then((response) => {
                if (response.data.error) {
                    console.log(response.data.message)
                    return
                }
                commit("setUser", response.data.user);
            })
            .catch((error) => {
                console.error("user login error : ", error);
            });
    },
    logout({ commit }, payload) {
        this.$axios
            .post(
                "/user/logout",{}, {
                    withCredentials: true,
                })
            .then((response) => {
                console.log("logout success : ", response);
                commit("setUser", response.data.user);
            })
            .catch((error) => {
                console.error("user logout error : ", error);
            });
    },
    // edit({ commit }, payload) {
    //     commit("editNickName", payload);
    // },

    // addFollowing({ commit }, payload) {
    //     commit("addFollowing", payload);
    // },
    // addFollower({ commit }, payload) {
    //     commit("addFollower", payload);
    // },
    // removeFollowing({ commit }, payload) {
    //     commit("removeFollowing", payload);
    // },
    // removeFollower({ commit }, payload) {
    //     commit("removeFollower", payload);
    // },
    // loadFollowings({ commit, state }, payload) {
    //     if (state.hasMoreFollowing) {
    //         commit("loadFollowings", payload);
    //     }
    // },
    // loadFollowers({ commit, state }, payload) {
    //     if (state.hasMoreFollower) {
    //         commit("loadFollowers", payload);
    //     }
    // },
    async loadUser({ state, commit }) {
        try {
            const res = await this.$axios.get("/user",{
                withCredentials: true,
            },);
            if (res.data.error) {
                console.log('loadUser error : ', res.data.message)
                return
            }
            commit('setUser', res.data.user)
        } catch (err) {
            console.error("loaduser error : ", err);
        }
    },
    async loadOther({ commit }, payload) {
        try {
            const res = await this.$axios.get(`/user/${payload.userId}`, {
                withCredentials: true,
            });
            commit('setOther', res.data);
        } catch (err) {
            console.error(err);
        }
    },
    changeNickname({ commit }, payload) {
        this.$axios.patch(`/user/nickname`, { nickname: payload.nickname }, {
            withCredentials: true,
        })
            .then(() => {
                commit('changeNickname', payload);
            })
            .catch((err) => {
                console.error(err);
            });
    },
    addFollowing({ commit }, payload) {
        commit('addFollowing', payload);
    },
    addFollower({ commit }, payload) {
        commit('addFollower', payload);
    },
    loadFollowers({ commit, state }, payload) {
        if (!(payload && payload.offset === 0) && !state.hasMoreFollower) {
        return;
        }
        let offset = state.followerList.length;
        if (payload && payload.offset === 0) {
        offset = 0;
        }
        return this.$axios.get(`/user/${state.user.id}/followers?limit=3&offset=${offset}`, {
        withCredentials: true,
        })
        .then((res) => {
            commit('loadFollowers', {
            data: res.data,
            offset,
            });
        })
        .catch((err) => {
            console.error(err);
        });
    },
    loadFollowings({ commit, state }, payload) {
        if (!(payload && payload.offset === 0) && !state.hasMoreFollowing) {
        return;
        }
        let offset = state.followingList.length;
        if (payload && payload.offset === 0) {
        offset = 0;
        }
        return this.$axios.get(`/user/${state.user.id}/followings?limit=3&offset=${offset}`, {
        withCredentials: true,
        })
        .then((res) => {
            commit('loadFollowings', {
            data: res.data,
            offset,
            });
        })
        .catch((err) => {
            console.error(err);
        });
    },
    follow({ commit }, payload) {
        this.$axios.post(`/user/${payload.userId}/follow`, {}, {
        withCredentials: true,
        })
            .then((res) => {
                console.log('test')
            commit('following', {
            userId: payload.userId,
            });
        })
        .catch((err) => {
            console.error(err);
        });
    },
    unfollow({ commit }, payload) {
        return this.$axios.delete(`/user/${payload.userId}/follow`,  {
        withCredentials: true,
        })
        .then((res) => { 
            commit('removeFollowing', {
            userId: payload.userId,
            });
        })
        .catch((err) => {
            console.error(err);
        });
    },
    removeFollower({ commit }, payload) {
        return this.$axios.delete(`/user/${payload.userId}/follower`, {
        withCredentials: true,
        })
        .then((res) => {
            commit('removeFollower', {
            userId: payload.userId,
            });
        })
        .catch((err) => {
            console.error(err);
        });
        },
};

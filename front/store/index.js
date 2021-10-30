export const state = () => ({});

export const mutations = {};

export const actions = {
    nuxtServerInit({ commit, dispatch, state }, { req }) {
        try {
            return dispatch("users/loadUser");
        } catch (error) {
            console.log("serverinit error", error);
        }
    },
};

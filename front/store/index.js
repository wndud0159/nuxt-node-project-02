export const state = () => ({
    name: "vuex",
});

export const mutations = {
    bye(state) {
        state.name = "goodbye";
    },
};

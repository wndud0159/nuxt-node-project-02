module.exports = {
    head: {
        title: "NodeBird",
        link: [
            {
                rel: "stylesheet",
                href: "https://use.fontawesome.com/releases/v5.15.3/css/all.css",
                integrity: "sha384-SZXxX4whJ79/gErwcOYf+zWLeJdY/qpuqC4cAa9rOGUstPomtqpuNWT9wdPEn2fk",
                crossorigin: "anonymous",
            },
        ],
        meta: [{ charset: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0" }],
    },
    modules: ["@nuxtjs/axios"],
    buildModules: ["@nuxtjs/tailwindcss"],
    axios: {
        browserBaseURL: "http://localhost:8080",
        baseURL: "http://localhost:8080",
        https: false,
    },
};

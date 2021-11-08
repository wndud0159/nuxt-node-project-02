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
            { rel: 'shortcut icon', href: '/vue-nodebird.png' }
        ],
        meta: [
            // content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover',
            { charset: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0" },
            { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge', },
            { hid: 'desc', name: 'description', content: '최주영의 NodeBird SNS',},
            { hid: 'ogtitle', name: 'og:title', content: 'NodeBird',},
            { hid: 'ogdesc', name: 'og:description', content: '최주영의 NodeBird SNS',},
            { hid: 'ogtype', property: 'og:type', content: 'website',},
            // { hid: 'ogimage', property: 'og:image', content: 'https://vue.nodebird.com/vue-nodebird.png',},
            // { hid: 'ogurl', property: 'og:url', content: 'https://vue.nodebird.com',}
        ],
    },
    modules: ["@nuxtjs/axios"],
    buildModules: ["@nuxtjs/tailwindcss", '@nuxtjs/moment', '@nuxtjs/dotenv'],
    moment: {
        locales: ['ko'],
    },
    build: {
        analyze: false,
        extend(config, { isClient, isServer, isDev }) {
            if (isServer && !isDev) {
            config.devtool = 'hidden-source-map';
            }
            console.log('webpack', config, isServer, isClient);
        },
    },
    axios: {
        
    },
    publicRuntimeConfig: {
        axios: {
            browserBaseURL: process.env.NODE_ENV === 'production' ? 'http://api.wndud0159.shop' : 'http://localhost:8080' //csr
        }
    },

    privateRuntimeConfig: {
        axios: {
            baseURL: process.env.NODE_ENV === 'production' ? 'http://api.wndud0159.shop' : 'http://localhost:8080' //ssr 
        }
    },
    
    server: {
        port: process.env.NODE_ENV === 'production' ? process.env.PORT : 3000,
        host: '0.0.0.0', // default: localhost,
    },

};

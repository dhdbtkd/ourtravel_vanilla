const config = {
    remoteUrl : import.meta.env.MODE == "development"?"http://localhost:3000":"https://port-0-ourtravel-backend-koh2xlivr60m6.sel4.cloudtype.app",
}
export default config;
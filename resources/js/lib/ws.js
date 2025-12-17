import Pusher from "pusher-js";

const pusher = new Pusher("local", {
    cluster: "mt1", // REQUIRED even if local
    wsHost: "127.0.0.1",
    wsPort: 8080,
    forceTLS: false,
    enabledTransports: ["ws"],
});

export default pusher;

import { io } from "socket.io-client";\nexport const socket = io(import.meta.env.VITE_API_URL);

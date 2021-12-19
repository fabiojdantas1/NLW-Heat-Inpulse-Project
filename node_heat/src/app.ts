import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

import { router } from "./routes";

const app = express();
app.use(cors());

//Passando o app como parâmetro na criação do protocolo http
const serverHttp = http.createServer(app);

//Permitindo acosso de qualquer origem à aplicação com o parâmetro '*' no cors
const io = new Server(serverHttp, {
    cors: {
        origin: "*",
    },
});

//Ouvindo e emitindo as connections pelo protocolo socket e pegando o ID do socket (usar crase '`' para concatenar texto e variável)
io.on("connection", (socket) => {
    console.log(`Usuário conectado no socket ${socket.id}`);
});

app.use(express.json());

app.use(router);

app.get("/github", (request, response) => {
    //utilizando a crase `para incluir variáveis mescladas com o texto
    response.redirect(
        `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
    );
});

app.get("/signin/callback", (request, response) => {
    //fazendo uma desestruturação para pegar o parâmetro code de dentro do request
    const { code } = request.query;

    return response.json(code);
});

export { serverHttp, io };

import prismaClient from "../prisma";

import { io } from "../app";

class CreateMessageService {
    async execute(text: string, user_id: string) {
        const message = await prismaClient.message.create({
            data: {
                text,
                user_id,
            },
            //Trazendo todas as informações do user
            include: {
                user: true,
            },
        });


        //Pegando as infos da message
        const infoWS = {
            text: message.text,
            user_id: message.user_id,
            create_at: message.created_at,
            user: {
                name: message.user.name,
                avatar_url: message.user.avatar_url,
            },
        };

        //Passando as infos para o io
        io.emit("new_message", infoWS);

        return message;
    }
}

export { CreateMessageService };
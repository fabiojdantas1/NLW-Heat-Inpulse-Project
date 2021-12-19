import { Request, Response } from "express";
import { GetLast3MessagesService } from "../services/GetLast3MessageService";

class GetLast3MessagesController {
    async handle(request: Request, response: Response) {
        const server = new GetLast3MessagesService();

        const result = await server.execute();

        return response.json(result);
    }
}

export { GetLast3MessagesController };
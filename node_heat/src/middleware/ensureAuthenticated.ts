import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

/**
 * Caso o usuário não esteja autenticado, pula pro próximo user
 */

interface IPayload {
    sub: string;
}

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    //buscando os parâmetros cadastrados no perfil do user
    const authToken = request.headers.authorization;

    if (!authToken) {
        return response.status(401).json({
            errorCode: "token.invalid",
        });
    }

    /** Ignorando o parâmetro Bearer
     * Ex:  = Bearer numtokençawleraçwlsdawera6w54a6we5f4a53dadfasdfa
     * [0] = Bearer
     * [1] = numtokençawleraçwlsdawera6w54a6we5f4a53dadfasdfa
     */

    const [, token] = authToken.split(" ");

    try {
        const { sub } = verify(token, process.env.JWT_SECRET) as IPayload
        //Criar a tipagem @types para sobrescrever as tipagens do express para reconhecer o parametro user_id
        request.user_id = sub;

        return next();

    } catch (err) {
        return response.status(401).json({
            errorCode: "token.expired",
        });
    }

};
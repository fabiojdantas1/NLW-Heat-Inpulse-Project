declare namespace Express {
    //Recebe tudo que está em Request mais o user_id
    export interface Request {
        user_id: string;
    }
}
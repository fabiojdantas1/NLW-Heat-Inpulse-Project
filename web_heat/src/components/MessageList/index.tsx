import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { api } from '../../services/api';
import styles from './styles.module.scss';

import logoImg from '../../assets/logo.svg';


//Criando as tipagens utilizadas na aplicação
type Message = {
    id: string;
    text: string;
    user: {
        name: string;
        avatar_url: string;
    }
}

//gerando uma fila para armazenar uma lista de messageUser
const messagesQueue: Message[] = [];

const socket = io('http://localhost:4000');

//Ao receber nova mensagem, armazenar a messagem na fila
socket.on('new_message', (newMessage: Message) => {
    messagesQueue.push(newMessage);
})

export function MessageList() {

    /** 
     * Utilizando a function setMessage para atualizar o valor do array messages
     * Armazenando informações nas variáveis do componente iniciando com um array vazio
     */
    const [messages, setMessages] = useState<Message[]>([])

    //Verificando se há mensagens na fila e sobrepondo o array de mensagens com novas informações e limpando o item mais antigo da lista
    useEffect(() => {
        setInterval(() => {
            if (messagesQueue.length > 0) {
                setMessages(prevState => [
                    messagesQueue[0],
                    prevState[0],
                    prevState[1],
                ].filter(Boolean))
                messagesQueue.shift();
            }
        }, 3000)
    }, [])

    /**Fazendo a requição ao back-end para carregar os dados assin que o componente é exibido em tela
     * Deixando o array vazio para executar a function apenas uma vez
     */
    useEffect(() => {
        api.get<Message[]>('messages/last3').then(response => {
            setMessages(response.data)
        })
    }, [])

    return (
        <div className={styles.messageListWrapper}>
            <img src={logoImg} alt="DoWhile 2021" />

            <ul className={styles.messageList}>
                {/* Iterando com o react para mostrar para cada item do array as informações em tela */}
                {messages.map(message => {
                    return (
                        <li key={message.id} className={styles.message}>
                            <p className={styles.messageContent}>{message.text}</p>
                            <div className={styles.messageUser}>
                                <div className={styles.userImage}>
                                    <img src={message.user.avatar_url} alt={message.user.name} />
                                </div>
                                <span>{message.user.name}</span>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}
import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { io } from 'socket.io-client';

import { api } from '../../servers/api';

import { Message, MessageProps } from '../Message'
import { styles } from './styles';

//Armazena em memória as mensagens que vão chegando na fila
let messagesQueue: MessageProps[] = [];

//Verifica quando há nova mensagem no back-end e guarda a mensagem no array
const socket = io(String(api.defaults.baseURL));
socket.on('new_message', (newMessage) => {
    messagesQueue.push(newMessage);
    console.log(newMessage);
})

export function MessageList() {

    //Cria o estado para o array de messages
    const [currentMessages, setCurrentMessages] = useState<MessageProps[]>([]);

    useEffect(() => {
        async function fetchMessages() {
            //Faz a busca das 3 últimas mensagens utiliando a rota last3 do back-end
            const messagesResponse = await api.get<MessageProps[]>('/messages/last3');

            setCurrentMessages(messagesResponse.data);

        }

        fetchMessages();

    }, []);

    //Cria um temporizador para executar a função a cada 3 milissegundos
    useEffect(() => {
        const timer = setInterval(() => {

            if (messagesQueue.length > 0) {
                //Recupera o estado anterior da fila e observa se já nova mensagem para incluir no início da fila
                setCurrentMessages(prevState => [messagesQueue[0], prevState[0], prevState[1]]);
                messagesQueue.shift(); //Exclui a mensagem da fila
            }
        }, 3000);

        return () => clearInterval(timer); //Limpa a variável da memória a cada 3 segundos

    }, []);

    return (
        <ScrollView
            style={styles.container}
            /* Estilo do conteúdo da mensagem */
            contentContainerStyle={styles.content}
            /*Fecha o teclado caso o user click fora da caixa de texto*/
            keyboardShouldPersistTaps="never"
        >
            {/* Executa um map para renderizar cada mensagem passando a chave da mensagem */}
            {currentMessages.map((message) => <Message key={message.id} data={message} />)}
        </ScrollView>
    );
}

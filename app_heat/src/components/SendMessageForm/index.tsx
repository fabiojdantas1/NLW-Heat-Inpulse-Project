import React, { useState } from 'react';
import { Alert, Keyboard, TextInput, View } from 'react-native';
import { api } from '../../servers/api';

import { COLORS } from '../../theme';
import { Button } from '../Button';

import { styles } from './styles';

export function SendMessageForm() {
    /* Estado para armazenar o conteúdo da mensagem */
    const [message, setMessage] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);

    async function handleMessageSubmit() {
        const messageFormatted = message.trim();


        if (messageFormatted.length > 0) {
            setSendingMessage(true);

            await api.post('messages', { message: messageFormatted });

            setMessage('');
            Keyboard.dismiss();
            setSendingMessage(false);
            Alert.alert('Mensagem enviada com sucesso!');

        } else {
            Alert.alert('Escreva a mensagem para enviar.');
        }
    }

    return (
        <View style={styles.container}>
            {/* Configura as props da caixa de texto */}
            <TextInput
                keyboardAppearance="dark" //somente IOS
                placeholder="Qual a seua expectativa para o envento"
                placeholderTextColor={COLORS.GRAY_SECONDARY}
                multiline
                maxLength={140}
                //Ao muda o valor da mensagem, exibir a mensagem
                onChangeText={setMessage}
                value={message}
                style={styles.input}
                //Não permite editar enquando está carregando a mensagem
                editable={!sendingMessage}
            />

            <Button
                title="ENVIAR MENSAGEM"
                backgroundColor={COLORS.PINK}
                color={COLORS.WHITE}
                isLoading={sendingMessage}

                onPress={handleMessageSubmit}
            />

        </View>
    );
}
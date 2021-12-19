import React from "react";
//Importando a biblioteca KeyboardAvoidingView para a funcionalidade o teclado do ios e a biblioteca Platform para apontar o SO
import { View, KeyboardAvoidingView, Platform } from "react-native";

import { Header } from "../../components/Header";
import { MessageList } from "../../components/MessageList";
import { SignInBox } from "../../components/SignInBox";
import { SendMessageForm } from "../../components/SendMessageForm";

import { styles } from "./styles";
import { useAuth } from "../../hooks/auth";
import { defined } from "react-native-reanimated";

//Exporta o componente para ser utilizado pelo App.tsx
export function Home() {

    const { user } = useAuth();

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.container}>
                <Header />
                <MessageList />

                {/* Usa o component de forma condicional*/}
                {user ? <SendMessageForm /> : <SignInBox />}

            </View>

        </KeyboardAvoidingView>
    )
}
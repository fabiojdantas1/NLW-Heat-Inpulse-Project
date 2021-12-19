import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSessions from "expo-auth-session";

import { api } from '../servers/api';

const CLIENT_ID = '8fb609da53166f577d6e';
const SCOPE = 'read:user';
const USER_STORAGE = '@app-heat:user';
const TOKEN_STORAGE = '@app-heat:token';

type User = {
    id: string;
    avatar_url: string;
    name: string;
    loading: string;
}

type AuthContextData = {
    user: User | null;
    isSigningIn: boolean; //Armazena se há requisição para a aplicação ativar um loading
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
}

//Cria um children do tipo ReactNode para receber o Home  
type AuthProviderProps = {
    children: React.ReactNode;
}

//Define a tipagem das respostas esperadas pela requisição para a aplicação de login
type AuthResponse = {
    token: string;
    user: User;
}

//Define a tipagem do code gerado pelo login para envio ao Back-End para a requisição das inforamções
type AuthAuthenticationResponse = {
    params: {
        code?: string;
        error?: string;
    },
    type?: string;
}

export const AuthContext = createContext({} as AuthContextData);

//Função para prover todo o contexto para a aplicação
function AuthProvider({ children }: AuthProviderProps) {
    const [isSigningIn, setIsSigningIn] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    async function signIn() {
        try {

            setIsSigningIn(true);
            //Utiliza o acento grave para mesclar texto e variáveis
            const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`;

            //Exporta o params com a url    
            const authSessionResponse = await AuthSessions.startAsync({ authUrl }) as AuthAuthenticationResponse;

            //verifica se retornou para a aplicação e sem acesso negado
            if (authSessionResponse.type === "success" && authSessionResponse.params.error !== 'access_denied'!) {
                //Faz o request passa o code com parâmetro
                const authResponse = await api.post('/authenticate', { code: authSessionResponse.params.code });
                //Retorna o response do tipo AuthResponse
                const { user, token } = authResponse.data as AuthResponse;
                //Envia o token de autenticação pelo header da requição
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                //Armazena os dados convertido para string
                await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
                await AsyncStorage.setItem(TOKEN_STORAGE, token);

                setUser(user);
            }

        } catch (error) {
            console.log(error);
        } finally {
            setIsSigningIn(false);
        }

    }
    async function signOut() {
        setUser(null);
        await AsyncStorage.removeItem(USER_STORAGE);
        await AsyncStorage.removeItem(TOKEN_STORAGE);
    }

    useEffect(() => {
        async function loadUserStorageData() {
            const userStorage = await AsyncStorage.getItem(USER_STORAGE);
            const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE);

            //Verifica se há o user e um token
            if (userStorage && tokenStorage) {
                api.defaults.headers.common['Authorization'] = `Bearer ${tokenStorage}`;
                //Atualiza o estado e tranforma a string em json
                setUser(JSON.parse(userStorage));
            }

            //Seta pra false após a verificação de login
            setIsSigningIn(false);
        }
        //Chama a function para o useEffect
        loadUserStorageData();

    }, []);

    return (
        <AuthContext.Provider value={{
            signIn,
            signOut,
            user,
            isSigningIn
        }}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);

    return context;
}

export { AuthProvider, useAuth };
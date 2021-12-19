import { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from '../services/api';

type User = {
    id: string;
    name: string;
    login: string;
    avatar_url: string;
}

type AuthContextData = {
    user: User | null; //Terá um tipo User ou será null
    signInUrl: string;
    signOut: () => void; //Não retorna nada
}

//Exportando o contexto
export const AuthContext = createContext({} as AuthContextData);

type AuthProvider = {
    children: ReactNode; //ReactNode é qualquer coisa aceibável pelo react
}

type AuthResponse = {
    token: string;
    user: {
        id: string;
        avatar_url: string;
        name: string;
        login: string;
    }
}

//Todos os componentes dentro do Provider terão acesso à informação do contexto
export function AuthProvider(props: AuthProvider) {

    const [user, setUser] = useState<User | null>(null);

    //Criando a URL para pegar as principais informações do user com o parâmetro scope
    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=bd61edd58666abebc189`;

    //Pegando os dados do user e o token de autenticação na aplicação
    async function signIn(githubCode: string) {
        const response = await api.post<AuthResponse>('authenticate', {
            code: githubCode,
        });

        const { token, user } = response.data;

        //Salvando o token de autenticação
        localStorage.setItem('@dowhile:token', token);

        //Enviando o token de autenticação pelo header da requição
        api.defaults.headers.common.authorization = `Bearer ${token}`;

        setUser(user);
    }

    function signOut() {
        setUser(null);

        localStorage.removeItem('@dowhile:token');
    }

    //Pegando o localStorage o token de autenticação
    useEffect(() => {
        const token = localStorage.getItem('@dowhile:token')

        if (token) {

            api.defaults.headers.common.authorization = `Bearer ${token}`;

            api.get<User>('profile').then(response => {
                setUser(response.data);
            })
        }

    }, [])

    /**Fazendo a requição ao back-end para carregar os dados assin que o componente é exibido em tela
     * Deixando o array vazio para executar a function apenas uma vez
     */
    useEffect(() => {
        const url = window.location.href;
        const hasGithubCode = url.includes('?code=');

        //Se user conectado = pegar o code Client ID da URL
        if (hasGithubCode) {
            const [urlWithoutCode, githubCode] = url.split('?code=');

            //Limpando a url para não mostrar as informações de navegação
            window.history.pushState({}, '', urlWithoutCode);

            signIn(githubCode);
        }

    }, [])

    return (

        <AuthContext.Provider value={{ signInUrl, user, signOut }}>
            {props.children}
        </AuthContext.Provider>
    );

}
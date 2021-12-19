import { useContext, useState, FormEvent } from 'react';
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc';
import { AuthContext } from '../../contexts/Auth';
import { api } from '../../services/api';
import styles from './styles.module.scss';

export function SendMessageForm() {

    const { user, signOut } = useContext(AuthContext);
    const [message, setMessage] = useState('');

    //function para cadastrar a mensagem, previnindo o comportamento padrão do onSubmit com o FormEvent
    async function handleSendMessage(event: FormEvent) {

        event.preventDefault();

        if (!message.trim()) {
            return;
        }

        await api.post('messages', { message });

        //limpando a mensagem da tela
        setMessage('');

    }

    return (
        <div className={styles.sendMessageFormWrapper}>
            <button onClick={signOut} className={styles.signOutButton}>
                <VscSignOut size="32" />
            </button>

            <header className={styles.userInformation}>
                <div className={styles.userImage}>
                    {/* Como o user pode ser null, incluir '?' */}
                    <img src={user?.avatar_url} alt={user?.name} />
                </div>

                <strong className={styles.userName}>{user?.name}</strong>
                <span className={styles.userGithub}>
                    <VscGithubInverted size="16" />
                    {user?.login}
                </span>
            </header>

            <form onSubmit={handleSendMessage} className={styles.sendMessageForm}>
                <label htmlFor="message">Mensagem</label>
                <textarea
                    name="message"
                    id="message"
                    placeholder="Qual é a sua expectativa para o evento?"
                    // Quando o texto do textarea mudar, pegar o valor digitado
                    onChange={event => setMessage(event.target.value)}
                    value={message}
                />

                <button type="submit">Enviar mensagem</button>
            </form>

        </div>
    )
}
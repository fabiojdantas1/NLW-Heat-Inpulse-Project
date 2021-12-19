
import { useContext } from 'react';
import { VscGithubInverted } from 'react-icons/vsc';
import { AuthContext } from '../../contexts/Auth';

import styles from './styles.module.scss';

export function LoginBox() {

    const { signInUrl } = useContext(AuthContext);

    return (
        <div className={styles.loginBoxWrapper}>
            <strong>Entre e compartilhe sua mensagem</strong>
            <a href={signInUrl} className={styles.signInWithGithub}>
                <VscGithubInverted size="25" />
                Entrar com o Github
            </a>
        </div>
    )
}
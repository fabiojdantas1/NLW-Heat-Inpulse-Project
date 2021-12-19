import React from 'react';
import { View } from 'react-native';

import { useAuth } from '../../hooks/auth';
import { Button } from '../Button';
import { COLORS } from '../../theme';

import { styles } from './styles';

export function SignInBox() {

    //Acessa o signIn da function AuthProvider no context pela function useAuth
    const { signIn, isSigningIn } = useAuth();

    return (
        <View style={styles.container}>
            <Button
                title="ENTRAR COM O GITHUB"
                color={COLORS.BLACK_PRIMARY}
                backgroundColor={COLORS.YELLOW}
                icon="github"
                onPress={signIn} //Chama a function signIn ao pressionar o button
                isLoading={isSigningIn}
            />

        </View>
    );
}
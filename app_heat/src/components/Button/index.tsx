import React from 'react';

import {
    TouchableOpacity,
    TouchableOpacityProps,
    Text,
    ColorValue,
    ActivityIndicator,
} from 'react-native';

//Importa a biblioteca de icons do expo
import { AntDesign } from '@expo/vector-icons';

import { styles } from './styles';

//Combina os tipos
type Props = TouchableOpacityProps & {
    title: string;
    color: ColorValue;
    backgroundColor: ColorValue;
    //Pega na biblioteca AntDesign a props name do icon: ;
    icon?: React.ComponentProps<typeof AntDesign>['name'];
    isLoading?: boolean;
}

export function Button({
    title,
    color,
    backgroundColor,
    icon,
    isLoading = false,
    ...rest
}: Props) {

    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor }]}
            //Reduz o efeito do button
            activeOpacity={0.7}
            disabled={isLoading} //Bloquear o button durante a requisião
            //Pega as demais props do button pelo operador rest
            {...rest}
        >

            {
                /**
                 * Faz a redenização condicional 
                 * Gera o efeito de carregamento ao lado do icon
                 * */
                isLoading ? <ActivityIndicator color={color} /> :

                    <>
                        <AntDesign name={icon} size={24} style={styles.icon} />

                        <Text style={[styles.title, { color }]}>
                            {title}
                        </Text>
                    </>
            }

        </TouchableOpacity>
    );
}
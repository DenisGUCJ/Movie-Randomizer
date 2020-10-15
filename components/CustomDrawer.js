import React, { useState, useEffect, useContext, useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native'
import { LocalizationContext, EnableSwipeContext } from './ContextProvider'
import AsyncStorage from '@react-native-community/async-storage'
import { useFocusEffect } from '@react-navigation/native';
import { useIsDrawerOpen } from '@react-navigation/drawer'



const CustomDrawer = () => {

    //const [language, setLanguage] = useState(null)


    const { t, locale, setLocale } = useContext(LocalizationContext)
    const { setEnableSwipe } = useContext(EnableSwipeContext)
    const isFocused = useIsDrawerOpen()
    
    useEffect(()=>{
        if(isFocused){
            console.log('F')
            setEnableSwipe(false)
        }else{
            console.log('NE F')
            setEnableSwipe(true)
        }
    },[isFocused])

    const SetLocaleAsyncStorage = async (_locale) => {
        await AsyncStorage.setItem('LOCALE', JSON.stringify(_locale))
        setLocale(_locale)
    }

    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
                <TouchableOpacity style={styles.languageButton} onPress={() => SetLocaleAsyncStorage('en')}>
                    <Text>ENG</Text>
                </TouchableOpacity>
                <TouchableHighlight style={styles.languageButton} onPress={() => SetLocaleAsyncStorage('ru')}>
                    <View>
                        <Text>RU</Text>
                    </View>
                </TouchableHighlight>
            </View>
        </View >
    )
}

export default CustomDrawer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'yellow',
        justifyContent: 'flex-start'
    },
    rowContainer: {
        justifyContent: 'space-around',
        alignItems: 'center',
        flex: 0.5,
        flexDirection: 'row',
        backgroundColor: 'pink'
    },
    languageButton: {
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 80,
        borderRadius: 90
    }
})
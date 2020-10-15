import { } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import i18n from 'i18n-js'

i18n.translations = {
    en: require("../localization/en.json"),
    ru: require("../localization/ru.json")
}

export const setLanguage = async () => {
    const currentLanguage = await AsyncStorage.getItem('LANGUAGE')
    i18n.locale = currentLanguage
}

export const translate = word => {
    setLanguage()
    return i18n.t(word)
}
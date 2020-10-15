import React, { useState, useMemo, useEffect, useContext } from 'react'
import * as Localization from 'expo-localization'
import AsyncStorage from '@react-native-community/async-storage'
import i18n from 'i18n-js';


const LocalizationContext = React.createContext();
const ChosenIdContext = React.createContext();
const EnableSwipeContext = React.createContext();
const GenresContext = React.createContext()

export function useLocalization() {
    return useContext(LocalizationContext)
}

export function useChosenID() {
    return useContext(ChosenIdContext)
}

export function useEnableSwipe() {
    return useContext(EnableSwipeContext)
}

export function useGenres() {
    return useContext(GenresContext)
}

export function LocalizationProvider({ children }) {

    const [locale, setLocale] = useState(null)

    useEffect(() => {
        LocaleInitialSetUp()
    }, [])

    const LocaleInitialSetUp = async () => {

        let responce = await AsyncStorage.getItem('LOCALE')

        responce = JSON.parse(responce)

        if (responce != null) {
            setLocale(responce)
        } else {

            let locale_string = Localization.locale.split('-')[0]

            if (locale_string == 'ru') {
                setLocale('ru')
            } else {
                setLocale('en')
            }
        }
    }

    const localizationContext = useMemo(
        () => ({
            t: (scope, options) => i18n.t(scope, { locale, ...options }),
            locale,
            setLocale
        }),
        [locale]
    )

    return (
        <LocalizationContext.Provider value={localizationContext}>
            {children}
        </LocalizationContext.Provider>
    )
}

export function ChosenIdProvider({ children }) {

    const [chosenID, setChosenID] = useState(null)

    const chosenIDContext = useMemo(
        () => ({
            chosenID,
            setChosenID
        }),
        [chosenID]
    )

    return (
        <ChosenIdContext.Provider value={chosenIDContext}>
            {children}
        </ChosenIdContext.Provider>
    )
}

export function EnableSwipeProvider({ children }) {

    const [enableSwipe, setEnableSwipe] = useState(true)

    const enableSwipeContext = useMemo(
        () => ({
            enableSwipe,
            setEnableSwipe
        }),
        [enableSwipe]
    )

    return (
        <EnableSwipeContext.Provider value={enableSwipeContext}>
            {children}
        </EnableSwipeContext.Provider>
    )
}

export function GenresProvider({ children }) {

    const [genres, setGenres] = useState([0,1,2])
    /*
    useEffect(() => {
        console.log('CONTEXT')
        //getGenresFromStorageAsync()
    }, [])

    const getGenresFromStorageAsync = async () => {
        await AsyncStorage.getItem('GENRES', (_, value) => {
            setGenres(JSON.parse(value))
        })
    }
    */

    const genresContext = useMemo(
        () => ({
            genres,
            setGenres
        }),
        [genres]
    )


    return (
        <GenresContext.Provider value={genresContext}>
            {children}
        </GenresContext.Provider>
    )
}


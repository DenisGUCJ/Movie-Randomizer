import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StyleSheet, AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import MainWindow from './screens/Main'
import FilterWindow from './screens/Filter'
import LastFilms from './screens/LastFilms'
import i18n from 'i18n-js';
import { LocalizationProvider, ChosenIdProvider, EnableSwipeProvider, GenresProvider, useEnableSwipe, useGenres } from './components/ContextProvider'
import * as ScreenOrientation from 'expo-screen-orientation'
import DrawerFilter from './screens/DrawerFiler'
import AsyncStorage from '@react-native-community/async-storage'


ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)

i18n.fallbacks = true;

i18n.translations = {
  en: require("./localization/en.json"),
  ru: require("./localization/ru.json")
}


const Stack = createStackNavigator();

const Tab = createMaterialTopTabNavigator();

const Drawer = createDrawerNavigator();


function MainScreens() {

  const { enableSwipe } = useEnableSwipe()


  return (
    <Tab.Navigator
      style={{ marginTop: 25 }}
      tabBarOption={{
        showLabel: false,
      }}
      swipeEnabled={enableSwipe}
    >
      <Tab.Screen
        name='Main'
        component={DrawerScreens}
      />
      <Tab.Screen name='Films' component={LastFilms}></Tab.Screen>
    </Tab.Navigator>
  )
}

function DrawerScreens() {

  return (
    <Drawer.Navigator
      drawerContent={() => <DrawerFilter />}
    >
      <Drawer.Screen name='MainWindow' component={MainWindow} initialParams={{ ID: null }} swipeEnabled={false}
        options={{
        }}
      ></Drawer.Screen>
    </Drawer.Navigator>
  )
}

function AppLayer() {

  const { genres, setGenres } = useGenres()
  const [temp, setTemp] = useState(genres)

  useEffect(() => {

    getGenresFromStorageAsync()

  }, [])

  const getGenresFromStorageAsync = async () => {
    await AsyncStorage.getItem('GENRES', (_, value) => {
      setGenres(JSON.parse(value))
    })
  }


  useEffect(() => {
    //saveToStorageAsync()
    AppState.addEventListener('change', _handleAppStateChange)
    return () => {
      console.log('clean')
      AppState.removeEventListener('change', _handleAppStateChange) //try to find info if this thing is cleared up
    }
  }, [genres])
  /*
    const saveToStorageAsync = async () => {
      await AsyncStorage.setItem('GENRES', JSON.stringify(genres))
    }
    */

  const _handleAppStateChange = (nextAppState) => {
    if (nextAppState == 'background') {
      //to do ...
      //setGenres([0,1,2,3])
      console.log(genres)
      AsyncStorage.setItem('GENRES', JSON.stringify(genres))
      //console.log(genres)
    }
  }

  //console.log(genres)

  return (
    <LocalizationProvider>
      <ChosenIdProvider>
        <EnableSwipeProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name='Compound' component={MainScreens}
                options={{
                  header: () => { return null }
                }}
              />
              <Stack.Screen name="Filter" component={FilterWindow}
                options={{
                  gestureEnabled: true,
                  gestureDirection: 'horizontal',
                  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </EnableSwipeProvider>
      </ChosenIdProvider>
    </LocalizationProvider>
  );
}

export default function App() {

  /*
  useEffect(() => {

    AppState.addEventListener('change', _handleAppStateChange)
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange) //try to find info if this thing is cleared up
    }
  }, [])

  const _handleAppStateChange = (nextAppState) => {
    if (nextAppState == 'background') {
      console.log('saving')
      //AsyncStorage.setItem('GENRES',genres)
    }
  }
  */

  return (
    <GenresProvider>
      <AppLayer />
    </GenresProvider>
  );
}




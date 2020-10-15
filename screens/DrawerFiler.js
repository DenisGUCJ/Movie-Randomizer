import React, { useState, useEffect, useContext, useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    Dimensions,
    FlatList
} from 'react-native'
import { useLocalization, useEnableSwipe, useGenres } from '../components/ContextProvider'
import { Picker } from '@react-native-community/picker';
import AsyncStorage from '@react-native-community/async-storage'
import { useIsDrawerOpen } from '@react-navigation/drawer'


const numColumns = 2

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const GenresList = [
    'genres_action',
    'genres_adult',
    'genres_adventure',
    'genres_animation',
    'genres_biography',
    'genres_comedy',
    'genres_crime',
    'genres_documentary',
    'genres_drama',
    'genres_family',
    'genres_fantasy',
    'genres_film-noir',
    'genres_history',
    'genres_horror',
    'genres_musical',
    'genres_music',
    'genres_mystery',
    'genres_romance',
    'genres_sci_fi',
    'genres_short',
    'genres_sport',
    'genres_thriller',
    'genres_war',
    'genres_western',
];

const moods = [
    {
        label: 'Tense-nervous',
        name: 'tense'
    },
    {
        label: 'Irritated-Annoyed',
        name: 'irritated'
    },
    {
        label: 'Bored-Weary',
        name: 'bored'
    },
    {
        label: 'Gloomy-Sad',
        name: 'gloomy'
    },
    {
        label: 'Excited-Lively',
        name: 'excited'
    },
    {
        label: 'Cheerful-Happy',
        name: 'cheerful'
    },
    {
        label: 'Relaxed-Carefree',
        name: 'relaxed'
    },
    {
        label: 'Calm-Serene',
        name: 'calm'
    },
];


const dates = Array.from(new Array(40).keys()).map(x => x = x + 1980)



const DrawerFilter = () => {

    const [chosenMood, setMood] = useState(null)
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const { genres, setGenres } = useGenres()

    const { t } = useLocalization()
    const { setEnableSwipe } = useEnableSwipe()
    const isFocused = useIsDrawerOpen()

    
    useEffect(() => {
        console.log("DRAWER")
        //getFromStorage()
    }, [])
    

    useEffect(() => {
        if (isFocused) {
            setEnableSwipe(false)
        } else {
            //saveToStorage()
            setEnableSwipe(true)
        }
    }, [isFocused])

    useEffect(() => {
        //console.log('savig')
        console.log(genres)
        //saveToStorageAsync()
    }, [genres])

    const saveToStorageAsync = async () => {
        console.log(genres)
        await AsyncStorage.setItem('GENRES', JSON.stringify(genres))
    }

    const getFromStorage = () => {
        AsyncStorage.getItem('MOOD', (_, value) => {
            setMood(JSON.parse(value))
        })
        AsyncStorage.getItem('GENRES', (_, value) => {
            setGenres(JSON.parse(value))
        })
        AsyncStorage.getItem('START_DATE', (_, value) => {
            setStartDate(JSON.parse(value))
        })
        AsyncStorage.getItem('END_DATE', (_, value) => {
            setEndDate(JSON.parse(value))
        })
    }

    const handleMoodChange = (name) => {
        if (chosenMood != name) {
            setMood(name)
        }
    }

    const setGenreColor = (val) => {
        if (genres.includes(val))
            return '#F6A9A9'
        else
            return '#ffff'
    }

    const setMoodColor = (val) => {
        if (val == chosenMood)
            return '#F6A9A9'
        else
            return '#ffff'
    }

    const _renderGenresListItem = ({ item, index }) => {
        return (
            <TouchableHighlight
                style={[styles.genreItemStyle, { backgroundColor: setGenreColor(index) }]}
                onPress={() => handleGenresChange(index)}
                underlayColor='#F6A9A9'
            >
                <View>
                    <Text style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{t(item)}</Text>
                </View>
            </TouchableHighlight>
        )
    }

    const _renderMoodListItem = ({ item }) => {
        return <TouchableHighlight style={[styles.moodItemStyle, { backgroundColor: setMoodColor(item.label) }]} onPress={() => handleMoodChange(item.label)}>
            <View >
                <Text>{item.label}</Text>
            </View>
        </TouchableHighlight>
    }


    const handleGenresChange = (name) => {
        if (genres.includes(name)) {
            setGenres(genres.filter(item => item !== name)
            )
        }
        else {
            setGenres([...genres, name])
        }

    }

    const saveToStorage = () => {
        AsyncStorage.setItem('MOOD', JSON.stringify(chosenMood))
        AsyncStorage.setItem('GENRES', JSON.stringify(genres))
        AsyncStorage.setItem('START_DATE', JSON.stringify(startDate))
        AsyncStorage.setItem('END_DATE', JSON.stringify(endDate))
    }

    return (
        <View style={styles.container}>
            <View style={styles.horizontalContainer}>
                <View>
                    <Text>From</Text>
                    <Picker
                        item={dates}
                        style={{ width: 100 }}
                        selectedValue={startDate}
                        onValueChange={(value) => (setStartDate(value))}
                        mode='dialog'
                    >
                        {dates.map((value, index) => {
                            return <Picker.Item
                                label={value.toString()}
                                value={value}
                                key={index.toString()}
                            />
                        })}
                    </Picker>
                </View>
                <View>
                    <Text>To</Text>
                    <Picker
                        item={dates}
                        style={{ width: 100 }}
                        selectedValue={endDate}
                        onValueChange={(value) => (setEndDate(value))}
                        mode='dropdown'
                    >
                        {dates.map((value, index) => {
                            return <Picker.Item

                                label={value.toString()}
                                value={value}
                                key={index.toString()}
                            />
                        })}
                    </Picker>
                </View>
            </View>
            <View style={{ flex: 0.4 }}>
                <Text style={{ flex: 0.2 }}>Mood</Text>
                <FlatList
                    style={{ flex: 0.8 }}
                    data={moods}
                    renderItem={_renderMoodListItem}
                    keyExtractor={(_, index) => index}
                    numColumns={numColumns}
                />
            </View>
            <View style={{ flex: 0.4 }}>
                <Text style={{ flex: 0.2, textTransform: 'uppercase' }}>{t('genres')}</Text>
                <FlatList
                    style={{ flex: 0.8 }}
                    data={GenresList}
                    renderItem={_renderGenresListItem}
                    keyExtractor={(_, index) => index}
                    numColumns={numColumns}
                />
            </View>
        </View>

    )


}

export default DrawerFilter;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 15,
        alignItems: 'stretch',
        justifyContent: 'space-evenly',
    },
    horizontalContainer: {
        flex: 0.1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'stretch',
        alignSelf: 'stretch',
        marginTop: '10%'
    },
    textInput: {
        backgroundColor: '#fff',
    },
    moodItemStyle: {
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        paddingLeft: '10%',
        justifyContent: 'center',
        flex: 1,
        width: WIDTH / 2,
        height: HEIGHT / 20,
        margin: '1.2%'
    },
    genreItemStyle: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: '8%',
        margin: 1,
        flex: 1,
        width: WIDTH / 2,
        height: HEIGHT / 20,
        flexDirection: 'row',
        margin: '1.2%',
    },
    dateInput: {
        width: 100,
        height: 35,
        backgroundColor: '#FFFF',
    }
});
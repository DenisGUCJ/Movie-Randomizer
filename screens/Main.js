import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableHighlight,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import { useValue } from 'react-native-redash'
import { useLocalization, useChosenID } from '../components/ContextProvider'
import { WebView } from 'react-native-webview'
import Genres from '../components/Genres'
import Animated from 'react-native-reanimated'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const IP = '192.168.0.45'

const MainWindow = ({ navigation }) => {

    const [id, setId] = useState(null)
    const [imdbUrl, setImdbUrl] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)
    const [trailerUrl, setTrailerUrl] = useState(null)
    const [genres, setGenres] = useState(null)
    const [mood, setMood] = useState(null)
    const [name, setName] = useState(null)
    const [description, setDescription] = useState(null)
    const [releaseDate, setReleaseDate] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const [trailerLoading, setTrailerLoading] = useState(false)

    const { t } = useLocalization()
    const { chosenID } = useChosenID()

    translateX = useValue(0)

    useEffect(() => {
        getChosenFilm()
    }, [chosenID])

    useEffect(() => {
        getFilms()
    }, [])

    useEffect(() => {
        saveLastFilm()
    }, [name, imageUrl])



    const saveLastFilm = async () => {


        let lastFilms = await AsyncStorage.getItem('LAST_FILMS')


        lastFilms = JSON.parse(lastFilms)

        if (lastFilms == null) {
            lastFilms = [{ name: name, imageUrl: imageUrl }]
        }
        else {
            lastFilms = lastFilms.filter(item => {
                return (item.name != name) || (item.imageUrl != imageUrl)
            })
            if (name != null)
                lastFilms = (await lastFilms).concat({ id: id, name: name, imageUrl: imageUrl })

        }


        await AsyncStorage.setItem('LAST_FILMS', JSON.stringify(lastFilms))

    }

    useEffect(() => {
        AsyncStorage.setItem('LANGUAGE', 'en')
    })

    const getFilms = () => {

        setIsLoading(true)

        //let yrl = ID ? 'http://192.168.0.108:8080/film/eng' : `http://192.168.0.108:8080/film/eng/${ID}`

        fetch(`http://${IP}:8080/film/eng`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                startDate: "1000-10-31",
                endDate: "2220-10-31",
                mood: null,
                genreIds: [null]
            })
        })
            .then((responce) => {
                return responce.json()
            })
            .then((responceData) => {
                setId(responceData.id)
                setImdbUrl(responceData.imdbUrl)
                setImageUrl(responceData.imageUrl)
                setTrailerUrl(responceData.trailerUrl)
                setGenres(responceData.genres)
                setMood(responceData.mood)
                setName(responceData.name)
                setDescription(responceData.description)
                setReleaseDate(responceData.releaseDate)
                setGenres(responceData.genres)
            })
            .then(setTimeout(() => { setIsLoading(false), setTrailerLoading(false) }, 200))
    }

    const getChosenFilm = () => {

        if (chosenID != null) {

            console.log(chosenID)

            setIsLoading(true)

            fetch(`http://${IP}:8080/film/eng/${chosenID}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then((responce) => {
                    return responce.json()
                })
                .then((responceData) => {
                    setId(responceData.id)
                    setImdbUrl(responceData.imdbUrl)
                    setImageUrl(responceData.imageUrl)
                    setTrailerUrl(responceData.trailerUrl)
                    setGenres(responceData.genres)
                    setMood(responceData.mood)
                    setName(responceData.name)
                    setDescription(responceData.description)
                    setReleaseDate(responceData.releaseDate)
                    setGenres(responceData.genres)
                })
                .then(setTimeout(() => { setIsLoading(false), setTrailerLoading(false) }, 200))
        }
    }


    const webLoaded = trailerLoading ? 175 : 0;

    let image;
    let video;

    if (imageUrl != null) {
        image =
            <View style={[styles.container, { alignItems: 'center', marginLeft: 0, marginRight: 0 , flex: 0, flexGrow: 0}]}>
                <Image style={[styles.image]} source={{ uri: imageUrl }}></Image>
            </View>


    }

    if (trailerUrl != null) {
        video =
            <View style={styles.container}>
                <Text style={styles.trailerLabel}>{t('trailer')}</Text>
                <WebView
                    containerStyle={{ height: webLoaded, flex: 0 }}
                    style={[styles.webView]}
                    source={{ uri: trailerUrl }}
                    javaScriptEnabled={true}
                    onLoadStart={() => setTrailerLoading(true)}
                    startInLoadingState={true}
                    scalesPageToFit={true}
                    allowsFullscreenVideo={true}
                    directionalLockEnabled={true}
                    renderLoading={() => null}
                ></WebView>
            </View>
    }


    if (!isLoading) {
        return (

            <View style={{ flex: 1, justifyContent: 'space-around' }}>
                <ScrollView style={{ flex: 0.9, marginTop: '10%', }}>
                    <View style={[styles.container, { alignItems: 'center' }]}>
                        <Text style={styles.filmLabel}>{name}</Text>
                    </View>
                    {image}
                    <View style={styles.container}>
                        <Text style={styles.screenfont}>{releaseDate}</Text>
                        {genres && genres.map((item, index) => {
                            return <Text style={styles.screenfont} key={index}>{t(Genres[item - 1])}</Text>
                        })}
                    </View>
                    <View style={styles.container}>
                        <Text style={{ fontSize: 20 }}>{description}</Text>
                    </View>
                    {video}
                </ScrollView>
                <TouchableHighlight style={{ marginTop: '5%', position: 'absolute', top: 100, right: 30 }} onPress={() => navigation.navigate('Filter')}>
                    <View style={[styles.filterButton, { flex: 1, width: 50, height: 25, borderRadius: 25, opacity: 0.6 }]}>
                        <Text>Filter</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight style={{ flex: 0.1, marginTop: '5%' }} onPress={getFilms}>
                    <View style={[styles.filterButton, { flex: 1, borderRadius: 25 }]}>
                        <Text>New Film</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight style={{ flex: 0.1, marginTop: '5%' }} onPress={() => { navigation.openDrawer() }}>
                    <View style={[styles.filterButton, { flex: 1, borderRadius: 25 }]}>
                        <Text>New Film</Text>
                    </View>
                </TouchableHighlight>
            </View>
        );

    } else {
        return (
            <View style={styles.activityContainer}>
                <Text>LAODING</Text>
                <ActivityIndicator size={40} color={'cyan'}></ActivityIndicator>
            </View>
        )
    }


}

export default MainWindow;

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginLeft: '10%',
        marginRight: '10%',
        marginTop: 10//'4%'

    },
    activityContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageScroll: {
        flex: 0.2,
        height: '30%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        resizeMode: 'stretch',
        height: HEIGHT * 0.6,
        width: WIDTH * 0.8,
        margin: 15,
        flexGrow: 1
    },
    filmLabel: {
        fontSize: 40,
        textTransform: 'uppercase'
    },
    trailerLabel: {
        flex: 0.2,
        fontSize: 24,
        textTransform: 'uppercase'
    }
    ,
    filterButton: {
        backgroundColor: 'cyan',
        justifyContent: 'center',
        alignItems: 'center',
    },
    thumbnail: {
        flex: 0.8,
        alignSelf: 'flex-start',
        height: HEIGHT * 0.3,
        width: WIDTH * 0.7,
    },
    screenfont: {
        fontSize: 16
    },
    webView: {
        width: WIDTH * 0.8,
        flex: 0,
        height: 275,
        backgroundColor: 'red',
        transform: [{
            translateY: -100
        }]
    }
});
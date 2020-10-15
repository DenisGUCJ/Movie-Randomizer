import React, { useState, useEffect, useContext, PureComponent } from 'react'
import {
    FlatList,
    Text,
    View,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { _ } from 'lodash'
import { useChosenID } from '../components/ContextProvider'


const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height



class Film extends PureComponent {

    constructor(props) {
        super(props)
        //this.props.setChosenID = this.props.setChosenID.bind(this)
    }

    setAndNavigate = (index) => {
        const { setChosenID } = this.props
        setChosenID(index)
        this.props.navigation.navigate("Main")
    }

    render() {
        const { item } = this.props

        return (
            <View style={styles.itemContainer}>
                <TouchableOpacity onPress={()=>this.setAndNavigate(item.id)}>
                    <Image source={{ uri: item.imageUrl }} style={styles.image} />
                </TouchableOpacity>
                <Text style={styles.text}>{item.name}</Text>
            </View>
        )
    }
}


const LastFilms = ({ navigation }) => {

    const [films, setFilms] = useState([])
    const [update, setUpdate] = useState(false)

    const { chosenID,setChosenID } = useChosenID()

    useEffect(() => {
        getFilms()
    }, [update])



    const getFilms = async () => {

        let storage = await AsyncStorage.getItem('LAST_FILMS')
        storage = JSON.parse(storage)

        if (!_.isEqual(films, storage)) {
            setFilms(storage)
        }

        setUpdate(prev => !prev)

    }

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.list}
                data={films}
                renderItem={({ item }) => {
                    return (
                        <Film item={item} navigation={navigation} setChosenID={setChosenID}></Film>
                    )

                }}//{_renderListItem}
                keyExtractor={(_, index) => index.toString()}

            />
        </View>
    )
}

export default LastFilms;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemContainer: {
        flex: 0.3,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingLeft: '10%',
        marginRight: '30%'
    },
    image: {
        height: HEIGHT * 0.3,
        width: WIDTH * 0.3,
        resizeMode: 'contain'
    },
    list: {
        flex: 0.8,
    },
    text: {
        fontSize: 30,
        fontWeight: 'bold',
        paddingLeft: '10%',
    }
})
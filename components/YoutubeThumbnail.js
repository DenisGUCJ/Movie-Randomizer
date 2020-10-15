import React, { useCallback } from 'react'
import {
    TouchableOpacity,
    StyleSheet,
    Image,
    ImageBackground,
    Linking,
    View
} from 'react-native'


const getVideoId = url => {
    const result = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    const videoIdWithParams = result[2];

    if (videoIdWithParams !== undefined) {
        const cleanVideoId = videoIdWithParams.split(/[^0-9a-z_-]/i)[0];

        return cleanVideoId;
    }

    return null;
}

const YoutubeThumbnail = ({ url, style }) => {

    const videoId = getVideoId(url)

    const imageUrl = `http://i3.ytimg.com/vi/${videoId}/hqdefault.jpg`

    const handlePress = useCallback(async () => {
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(`Don't know how to open this URL: ${url}`);
        }
    }, [url])

    return (
        <TouchableOpacity
          style={style}
            onPress={handlePress} >
            <ImageBackground
                style={styles.backCanvas}
                imageStyle={styles.backImage}
                source={{ uri: imageUrl }}
            >
                <View style={styles.child}>
                    <Image source={require('../assets/play.png')}/>
                </View>
            </ImageBackground>
        </TouchableOpacity >)
}

export default YoutubeThumbnail

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    }
    ,
    backCanvas: {
        height: '100%',
        width: '100%',
    },
    backImage:{

        resizeMode: 'stretch'
    },
    child:{
        flex:1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    playButton:{
        flex: 1,
        height: '100%',
        width: '100%',
        resizeMode: 'cover'
    }

})
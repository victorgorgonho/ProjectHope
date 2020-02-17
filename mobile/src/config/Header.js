import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';


export default class Header extends Component {
    render() {
        return(
            <View style={styles.containerHeader}>
                <TouchableOpacity onPress={this.props.onPressBack}>
                    <Image
                        style={styles.imageBack}
                        source={require('../icons/arrow.png')}
                    />
                </TouchableOpacity>

                <Text
                    numberOfLines={1}
                    style={styles.title}
                >
                    {this.props.title}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginTop: 10,
        width: '100%',
        height: 80,
        backgroundColor: '#FFF',
    },
    title: {
        color: '#4B0082',
        fontSize: 20,
        fontWeight: 'bold',
    },
    imageBack: {
        marginRight: 15,
        width: 45,
        height: 45,
    },
});
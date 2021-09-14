import React from 'react';
import { ScrollView, View, Platform, Image, Dimensions, TouchableWithoutFeedback, AsyncStorage } from 'react-native';
import { Header, Title, Content, Toast, Left, Right, Text, Container, Footer, Button } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { NavigationEvents } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
export default class SelectLocationComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addresses: [],
            loading: false,
            user: null
        }
    }
    componentDidMount = () => {
        const { navigation } = this.props;
        let user = navigation.getParam('user');
        this.setState({ addresses: user.location, user: user });
    }
    selectAddress = (address) => {
        let addresses = this.state.addresses;
        let Newindex = addresses.findIndex(x => x.locationid === address.locationid);
        let changeSelected = addresses.findIndex(y => y.isSelected === true);
        if (changeSelected > -1) {
            addresses[changeSelected].isSelected = false;
        }
        if (Newindex > -1) {
            if (addresses[Newindex].isSelected) {
                addresses[Newindex].isSelected = false
            } else {
                addresses[Newindex].isSelected = true
            }
        }
        this.setState({ addresses: addresses });
    }
    selectThisLocation = () => {
        let index = this.state.addresses.findIndex(a => a.isSelected === true);
        if (index > -1) {
            this.props.navigation.navigate('CompanyProfile', { location: this.state.addresses[index] });
        }

    }
    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: '#283a97', height: 80 }}>
                    <Left style={{ marginTop: Platform.OS === 'android' ? 25 : 6, marginLeft: 10 }}>
                        <Ionicons onPress={() => this.props.navigation.goBack()} name={'ios-arrow-back'} size={30} color={'white'} />
                    </Left>
                    <Title style={{ color: 'white', position: 'absolute', top: Platform.OS === 'android' ? 40.5 : 40, fontSize: 18 }}>Select Location</Title>
                    <Right />
                </Header>
                <Content>
                    {
                        <NavigationEvents
                            onWillFocus={() => {
                                this.componentDidMount();
                            }}
                        />
                    }
                    {
                        this.state.addresses && this.state.addresses.map(function (address, index) {
                            return <TouchableWithoutFeedback onPress={() => this.selectAddress(address)} key={index}>
                                <View style={{ marginLeft: 6, marginRight: 6, borderBottomWidth: 1, height: 60, flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ marginTop: 20 }}>{address.addressname}</Text>
                                    {address.isSelected && address.isSelected === true ? (
                                        <View style={{ marginTop: 15 }}>
                                            <Ionicons name="ios-checkmark-circle" size={22} color="#283a97" />
                                        </View>
                                    ) : (
                                            <View style={{ marginTop: 15 }}>
                                                <Ionicons name="ios-checkmark-circle-outline" size={22} color="#283a97" />
                                            </View>
                                        )
                                    }
                                </View>
                            </TouchableWithoutFeedback>
                        }.bind(this))
                    }
                </Content>
                <Footer style={{ height: 200, backgroundColor: 'white', flexDirection: 'column' }}>
                    <View style={{ alignSelf: 'center', height: 38, marginBottom: 35 }}>
                        <Button onPress={() => this.props.navigation.navigate("GoogleMap", { user: this.state.user, route: 'SelectLocation' })} style={{ backgroundColor: '#283a97' }}>
                            <Text style={{ color: 'white' }}>Add New Address</Text>
                        </Button>
                    </View>
                    <View style={{ marginBottom: 12, width: 120, alignSelf: 'center' }}>
                        <Button onPress={this.selectThisLocation} small rounded style={{ height: 40, backgroundColor: '#283a97' }}>
                            <View>
                                <Text style={{ color: 'white', marginLeft: 24 }}>Select</Text>
                            </View>
                        </Button>
                    </View>
                </Footer>
            </Container>
        )
    }
}
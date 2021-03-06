import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addDeck } from '../actions';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Alert
} from 'react-native';

class ManageDeck extends Component {
  constructor() {
    super();
    this._isStoreExist = this._isStoreExist.bind(this);
    this._createStore = this._createStore.bind(this);
    this._addDeck = this._addDeck.bind(this);
  }
  state = {
    title: ''
  };
  static KEY_STORAGE = 'decks';
  
  handleChange = title => {
    this.setState({ title });
  };

  async _isStoreExist() {
    const keyValue = await AsyncStorage.getItem(ManageDeck.KEY_STORAGE);
    return keyValue;
  }
  async _createStore() {
    const store = {};
    try {
      await AsyncStorage.setItem(ManageDeck.KEY_STORAGE, JSON.stringify(store));
      return JSON.stringify(store);
    } catch (e) {
      throw new Error(`Error creating a store: ${e}`);
    }
  }
  async _addDeck(store) {
    const DECK = this.state.title
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
    if (Object.keys(store).includes(DECK)) {
      //Alert.alert(`Deck ${DECK} successfully added!`);
      Alert.alert(`Deck ${DECK} is already existing!`);
      return store;
    } else {
      store[`${DECK}`] = {
        title: `${DECK}`,
        questions: []
      };
      const serializedStore = JSON.stringify(store);
      await AsyncStorage.setItem(
        `${ManageDeck.KEY_STORAGE}`,
        serializedStore,
        () => {
          Alert.alert(`Deck ${DECK} successfully added!`);
        }
      );
      return store;
    }
  }

  _addDeck = title => {
    this.props.newDeck(title);
  };

  handleSubmit = () => {
    const { decks } = this.props;
    const title = this.state.title;
    if (title.length !== 0) {
      if (Object.keys(decks).includes(`{title}`)) {
        Alert.alert(`Deck ${DECK} is already existing!`);
      } else {
        this.props.newDeck(title);
        this.setState({ title: '' });
      }
    }
  };

  render() {
    return (
      <View style={Styles.container}>
        <Text style={Styles.textStyle}>
          What is the title of your new deck?
        </Text>
        <TextInput
          placeholder="Deck Title"
          placeholderTextColor="#9a73ef"
          style={Styles.textInputStyle}
          onChangeText={this.handleChange}
          value={this.state.title}
        />
        <TouchableOpacity
          onPress={this.handleSubmit}
          style={Styles.submitButton}
        >
          <Text style={Styles.submitButtonText}> Submit </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    decks: state.decks
  };
}
function mapDispatchToActions(dispatch) {
  return {
    newDeck(title, question, choices) {
      dispatch(addDeck(title));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToActions)(ManageDeck);

const Styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textStyle: {
    fontSize: 40,
    padding: 5
  },
  textInputStyle: {
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
    padding: 5,
    alignSelf: 'stretch',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5
  },
  submitButton: {
    backgroundColor: '#7a42f4',
    padding: 10,
    margin: 15,
    height: 40
  },
  submitButtonText: {
    color: 'white'
  }
};

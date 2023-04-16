import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
  TextInput,
  FlatList,
  Modal,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import nfcManager, {Ndef, NfcTech} from 'react-native-nfc-manager';

const HomeScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [keyName, setKeyName] = useState('');
  const [keyPassword, setKeyPassword] = useState('');
  const [keys, setKeys] = useState([]);
  const [showModal, setshowModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [password, setPassword] = useState('');
  const [hasNfc, setHasNfc] = React.useState(null);
  const [enable, setEnable] = React.useState(null);

  const handleCardPress = key => {
    setSelectedKey(key);
    setModalVisible(true);
  };

  const handlePasswordChange = text => {
    setPassword(text);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedKey(null);
    setPassword('');
  };

  //NFC Things

  React.useEffect(() => {
    async function checkNfc() {
      const supported = await nfcManager.isSupported();
      if (supported) {
        await nfcManager.start();
        setEnable(await nfcManager.isEnabled());
      }
      setHasNfc(supported);
    }

    checkNfc();
  }, []);

  async function readNdef() {
    try {
      await nfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await nfcManager.getTag();
      navigation.navigate('Tap', {tag});
    } catch (ex) {
      //bypass
    } finally {
      nfcManager.cancelTechnologyRequest();
    }
  }

  function renderNfcButtons() {
    if (hasNfc === null) {
      return null;
    } else if (!hasNfc) {
      return (
        <View className="bg-slate-100 w-full h-1/3 absolute bottom-0 left-0 flex-1 justify-center items-center">
          <Text>Your device doesnt support NFC</Text>
        </View>
      );
    } else if (!enable) {
      return (
        <View className="bg-slate-100 w-full h-1/3 absolute bottom-0 left-0 flex-1 justify-center items-center">
          <Text className="font-bold text-base mt-2">
            Your NFC is not enabled
          </Text>
          <View className="w-3/5 justify-center items-center mt-10">
            <TouchableOpacity
              onPress={() => {
                nfcManager.goToNfcSetting();
              }}
              className=" bg-blue-600 w-full p-4 rounded-md items-center">
              <Text className=" text-white font-bold text-base">
                GO TO SETTINGS
              </Text>
            </TouchableOpacity>
          </View>
          <View className="w-3/5 justify-center items-center mt-10">
            <TouchableOpacity
              onPress={async () => {
                setEnable(await nfcManager.isEnabled());
              }}
              className=" bg-blue-600 w-full p-4 rounded-md items-center">
              <Text className=" text-white font-bold text-base">
                CHECK AGAIN
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      <>
        <View className="bg-slate-100 w-full h-1/3 absolute bottom-0 left-0 flex-1 justify-center items-center">
          <Text className=" ml-6 font-bold text-lg my-3">
            {selectedKey?.name}
          </Text>
          <TextInput
            value={selectedKey?.password}
            className="bg-white px-3 py-2 mt-1 rounded w-11/12"
            // onChangeText={handlePasswordChange}
            placeholder={selectedKey?.password}
          />
          <TouchableOpacity
            onPress={() => {
              writeNdef();
              handleModalClose();
            }}
            className="bg-blue-600 p-4 mt-3 rounded-md items-center w-1/2">
            <Text className="text-white font-bold text-base">Write</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className=" bg-blue-600 p-4 my-3 rounded-md items-center w-1/2"
            onPress={() => {
              readNdef();
            }}>
            <Text className=" text-white font-bold text-base">TAP</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  async function writeNdef() {
    const uriRecord = Ndef.textRecord(`${selectedKey?.password}`);
    console.log(uriRecord);
    const bytes = Ndef.encodeMessage([uriRecord]);
    console.warn(bytes);

    try {
      await nfcManager.requestTechnology(NfcTech.Ndef);
      await nfcManager.ndefHandler.writeNdefMessage(bytes);
    } catch (ex) {
      // bypass
    } finally {
      nfcManager.cancelTechnologyRequest();
    }
  }

  useEffect(() => {
    firestore()
      .collection('user')
      .doc(auth().currentUser.uid)
      .get()
      .then(snapshot => {
        if (snapshot.exists) {
          setName(snapshot.data());
        } else {
          console.log('User does not exist');
        }
      });
  }, []);

  useEffect(() => {
    firestore()
      .collection('keys')
      .doc(auth().currentUser.uid)
      .get()
      .then(snapshot => {
        if (snapshot.exists) {
          const keysData = snapshot.data().keys || [];
          // console.log(keysData);
          setKeys(keysData);
        } else {
          console.log('User does not exist');
        }
      });
  }, []);

  AddNewCard = async (keyName, keyPassword) => {
    if (!keyName || !keyPassword) {
      alert('Please provide a key name and password');
      return;
    }

    const keyDocRef = firestore()
      .collection('keys')
      .doc(auth().currentUser.uid);
    try {
      const keyDoc = await keyDocRef.get();
      if (!keyDoc.exists) {
        await keyDocRef.set({keys: [{name: keyName, password: keyPassword}]});
        console.log('New key added to Firestore:', {
          name: keyName,
          password: keyPassword,
        });
      } else {
        const currentKeys = keyDoc.data().keys || [];
        const updatedKeys = [
          ...currentKeys,
          {name: keyName, password: keyPassword},
        ];
        await keyDocRef.update({keys: updatedKeys});
        console.log('New key added to Firestore:', {
          name: keyName,
          password: keyPassword,
        });
        setKeys(updatedKeys); // Update the state with the new keys
        setKeyName('');
        setKeyPassword('');
      }
    } catch (error) {
      alert(error);
    }
  };

  // const handleCardPress = key => {
  //   console.log('Name:', key.name);
  //   console.log('Password:', key.password);
  // };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="bg-slate-100">
        <View className="flex-row justify-between p-5">
          <View>
            <View className="flex-row items-center">
              <ImageBackground
                source={require('../assets/rsz_1logos.png')}
                className="w-9 h-7 mr-1"
                imageStyle={{borderRadius: 5}}
              />
              <Text className="text-blue-600 font-bold text-sm">SmartNFC</Text>
            </View>
            <Text className="font-bold text-base mt-2">
              Hello, {name.firstName} {name.lastName}
            </Text>
          </View>
          <TouchableOpacity onPress={() => auth().signOut()}>
            <ImageBackground
              source={require('../assets/profile1.png')}
              className="w-10 h-10"
              imageStyle={{borderRadius: 25}}
            />
          </TouchableOpacity>
        </View>

        <View className=" mx-6 flex-row justify-between mb-4">
          <Text className="font-bold text-xl">My Keys</Text>
          <TouchableOpacity>
            <Text className="text-blue-700 font-500">See all</Text>
          </TouchableOpacity>
        </View>

        <View className="flex justify-center items-center px-5">
          <FlatList
            data={keys}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => {
              return (
                <TouchableOpacity onPress={() => handleCardPress(item)}>
                  <Image
                    source={require('../assets/card.png')}
                    className="mx-2 relative"
                  />
                  <Text className="mx-2 absolute top-3 left-3 text-white font-bold text-base">
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <Modal
          animationType={'slide'}
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleModalClose}>
          {renderNfcButtons()}
        </Modal>

        <Modal
          animationType={'slide'}
          visible={showModal}
          transparent={true}
          onRequestClose={() => {}}>
          <View className="bg-slate-100 w-full h-1/3 absolute bottom-0 left-0">
            <Text className=" ml-6 font-bold text-lg my-3">Add New Key</Text>
            <View className="flex justify-center items-center ">
              <TextInput
                className="bg-white px-3 py-2 mt-1 rounded w-11/12"
                placeholder="Enter Key Name"
                value={keyName}
                onChangeText={value => setKeyName(value)}
              />
              <TextInput
                className="bg-white px-3 py-2 mt-3 rounded w-11/12"
                placeholder="Password"
                value={keyPassword}
                onChangeText={value => setKeyPassword(value)}
              />
              <TouchableOpacity
                className="bg-blue-600 p-4 my-3 rounded-md items-center w-1/2"
                onPress={() => {
                  AddNewCard(keyName, keyPassword);
                  setshowModal(!showModal);
                }}>
                <Text className="text-white font-bold text-base">ADD</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View className="flex-1 justify-center items-center mt-7 mx-6 h-96">
          <ImageBackground
            source={require('../assets/bg.jpg')}
            className="w-full h-full relative"
            imageStyle={{borderRadius: 20}}
          />
          <Text className="text-white font-bold text-2xl absolute top-7 left-5">
            Got new locks ?
          </Text>

          <ImageBackground
            source={require('../assets/tags2.png')}
            className="w-5/6 h-3/5 absolute"
            imageStyle={{borderRadius: 20}}
          />

          <TouchableOpacity
            className="my-3 rounded-md items-center w-1/2 absolute"
            onPress={() => {
              setshowModal(!showModal);
            }}>
            <Text className="text-white font-bold text-lg">
              Add your new key !
            </Text>
          </TouchableOpacity>
          <Text className="text-white text-sm absolute mx-6 bottom-8">
            Tap on "Add your new key !" you get a popup. Enter the key name and
            password, Then hit ADD Button. Now Press on the key card you created
            now and confirm the password Then Tap the phone on the LOCK! Done!!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

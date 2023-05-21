import React, {useState} from 'react';

import {
  Button,
  TextInput,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';

import nfcManager, {Ndef, NfcTech} from 'react-native-nfc-manager';

import {Base64} from 'js-base64';

const GuestScreen = ({navigation}) => {
  const [inputPwd, setInputPwd] = useState();
  const [encPwd, setEncPwd] = useState();
  const [decPwd, setDecPwd] = useState();
  const [password, setPassword] = useState('');
  const handleInpChange = e => {
    setInputPwd(e);
  };

  const handleEncrypt = () => {
    console.log(inputPwd);
    setEncPwd(Base64.encode(inputPwd));
  };

  async function writeNdef() {
    const uriRecord = Ndef.textRecord(`${decPwd}`);
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

  return (
    <ScrollView>
      <View className="flex-1 mt-5">
        <View className="flex-1 items-center">
          <Text className="text-blue-600 font-bold text-3xl mt-2 align-middle">
            Guest Key
          </Text>
        </View>

        {/* <TextInput
          className="bg-white px-3 py-2 mt-1 rounded-md text-black"
          autoCapitalize="none"
          placeholderTextColor="#000"
          onChangeText={e => {
            handleInpChange(e);
          }}
          placeholder="Password"
          secureTextEntry
        /> */}
        {/* <TouchableOpacity
          onPress={() => handleEncrypt()}
          className=" bg-blue-600 w-1/2 p-4 rounded-md items-center">
          <Text className=" text-white font-bold text-base">Encrypt</Text>
        </TouchableOpacity> */}

        {/* <Text style={{fontSize: 20, textAlign: 'center', marginTop: 10}}>
          {encPwd}
        </Text> */}
        <View className="flex-1 items-center">
          <TextInput
            className="bg-white px-3 py-2 mt-1 w-4/5 rounded-md text-black m-5"
            value={encPwd}
            onChangeText={text => setEncPwd(text)}
            placeholderTextColor="#000"
            placeholder="Encryped Password"></TextInput>
          <TouchableOpacity
            onPress={() => setDecPwd(Base64.decode(encPwd))}
            className=" bg-blue-600 w-1/2 p-4 rounded-md items-center">
            <Text className=" text-white font-bold text-base">Decrypt</Text>
          </TouchableOpacity>

          {/* <Text style={{fontSize: 20, textAlign: 'center', marginTop: 10}}>
          {decPwd}
        </Text> */}
          <TextInput
            value={decPwd}
            className="bg-white px-3 py-2 mt-1 rounded-md w-4/5 text-black m-5"
            onChangeText={text => setDecPwd(text)}
            placeholder="password"
            placeholderTextColor="#000"
            secureTextEntry
          />
          <TouchableOpacity
            onPress={() => {
              writeNdef();
              alert('Scan lock for unlocking it!');
            }}
            className="bg-blue-600 p-4 mt-3 rounded-md items-center w-1/2">
            <Text className="text-white font-bold text-base">Write</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default GuestScreen;

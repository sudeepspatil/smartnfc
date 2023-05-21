import React, {useState} from 'react';
import Clipboard from '@react-native-clipboard/clipboard';

import {
  Button,
  TextInput,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';

import {Base64} from 'js-base64';

const ShareScreen = ({navigation}) => {
  const [inputPwd, setInputPwd] = useState();
  const [encPwd, setEncPwd] = useState();
  const [decPwd, setDecPwd] = useState();
  const handleInpChange = e => {
    setInputPwd(e);
  };

  const handleEncrypt = () => {
    console.log(inputPwd);
    setEncPwd(Base64.encode(inputPwd));
  };

  const handleShare = () => {
    Clipboard.setString(encPwd); // Set the encrypted password to the clipboard
  };
  return (
    <ScrollView>
      <View className="flex-1 mt-5">
        <View className="flex-1 items-center">
          <Text className="text-blue-600 font-bold text-3xl mt-2 align-middle">
            Share Your Password
          </Text>
        </View>

        <View className="flex-1 items-center">
          <TextInput
            className="bg-white px-3 py-2 mt-1 w-4/5 rounded-md text-black m-5"
            autoCapitalize="none"
            placeholderTextColor="#000"
            onChangeText={e => {
              handleInpChange(e);
            }}
            placeholder="Password"
            secureTextEntry
          />
          <TouchableOpacity
            onPress={() => handleEncrypt()}
            className=" bg-blue-600 w-1/2 p-4 rounded-md items-center">
            <Text className=" text-white font-bold text-base">Encrypt</Text>
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              marginTop: 10,
              color: 'black',
            }}>
            {encPwd}
          </Text>
          <TouchableOpacity
            onPress={() => handleShare()}
            className=" bg-blue-600 w-1/2 p-4 rounded-md items-center">
            <Text className=" text-white font-bold text-base">Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ShareScreen;

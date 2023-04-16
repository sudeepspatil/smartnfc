import {View, Text, TouchableOpacity, TextInput, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  login = async (email, password) => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View className="flex-1 justify-center items-center">
      <View className="flex items-center mb-3">
        <Image source={require('../assets/rsz_1logos.png')} />
        <Text className="text-blue-600 font-bold text-3xl mt-2">SmartNFC</Text>
      </View>
      <View className="w-4/5">
        <TextInput
          placeholder="Email"
          value={email}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={text => setEmail(text)}
          className="bg-white px-3 py-2 mt-1 rounded text-black"
        />
        <TextInput
          placeholder="Password"
          value={password}
          autoCapitalize="none"
          onChangeText={text => setPassword(text)}
          className="bg-white px-3 py-2 mt-1 rounded-md text-black"
          secureTextEntry
        />
      </View>

      <View className="w-3/5 justify-center items-center mt-10">
        <TouchableOpacity
          onPress={() => login(email, password)}
          className=" bg-blue-600 w-full p-4 rounded-md items-center">
          <Text className=" text-white font-bold text-base">Login</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => {}}
        className="mt-5"
        // className=' bg-white w-full p-4 rounded-md items-center mt-1 border-blue-600 border-2'
      >
        <Text className=" text-blue-600 font-bold text-base">
          Forget Password?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Registration')}
        className="mt-5"
        // className=' bg-white w-full p-4 rounded-md items-center mt-1 border-blue-600 border-2'
      >
        <Text className=" text-blue-600 font-bold text-base">
          Don't have an account? Register Now
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

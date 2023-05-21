import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Registration = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        navigation.navigate('Home');
      }
    });
  });

  registerUser = async (email, password, firstName, lastName) => {
    await auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        firestore().collection('user').doc(auth().currentUser.uid).set({
          firstName,
          lastName,
          email,
        });
      })
      .catch(error => {
        alert(error);
      });
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-blue-600 font-bold text-3xl mb-5">
        Register Here
      </Text>
      <View className="w-4/5">
        <TextInput
          placeholder="First Name"
          placeholderTextColor="#000"
          value={firstName}
          onChangeText={text => setFirstName(text)}
          autoCorrect={false}
          className="bg-white px-3 py-2 mt-1 rounded text-black"
        />
        <TextInput
          placeholder="Last Name"
          placeholderTextColor="#000"
          value={lastName}
          onChangeText={text => setLastName(text)}
          autoCorrect={false}
          className="bg-white px-3 py-2 mt-1 rounded text-black"
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#000"
          value={email}
          onChangeText={text => setEmail(text)}
          autoCorrect={false}
          autoCapitalize="none"
          keyboardType="email-address"
          className="bg-white px-3 py-2 mt-1 rounded text-black"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#000"
          value={password}
          onChangeText={text => setPassword(text)}
          autoCorrect={false}
          autoCapitalize="none"
          className="bg-white px-3 py-2 mt-1 rounded-md text-black"
          secureTextEntry
        />
      </View>

      <View className="w-3/5 justify-center items-center mt-10">
        <TouchableOpacity
          onPress={() => registerUser(email, password, firstName, lastName)}
          className=" bg-blue-600 w-full p-4 rounded-md items-center">
          <Text className=" text-white font-bold text-base">Register</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        className="mt-5"
        // className=' bg-white w-full p-4 rounded-md items-center mt-1 border-blue-600 border-2'
      >
        <Text className=" text-blue-600 font-bold text-base">
          Already have an account? Login Now
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Registration;

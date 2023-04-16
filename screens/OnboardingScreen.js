import {View, Text, Button, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';

const Done = ({...props}) => (
  <TouchableOpacity className=" mx-5" {...props}>
    <Text className="text-base">Done</Text>
  </TouchableOpacity>
);

const OnboardingScreen = ({navigation}) => {
  return (
    <Onboarding
      DoneButtonComponent={Done}
      onSkip={() => navigation.replace('Login')}
      onDone={() => navigation.replace('Login')}
      pages={[
        {
          backgroundColor: '#a6e4d0',
          image: <Image source={require('../assets/logo1.png')} />,
          title: 'NFC Technology',
          subtitle: 'The Power of NFC Technology  for Smart Door Locks',
        },
        {
          backgroundColor: '#fdeb93',
          image: <Image source={require('../assets/logo1.png')} />,
          title: 'Highly Secure',
          subtitle: 'The Unmatched Security of NFC Technology',
        },
        {
          backgroundColor: '#e9bcbe',
          image: <Image source={require('../assets/logo1.png')} />,
          title: 'User Friendly',
          subtitle: 'Intuitive and Effortless',
        },
      ]}
    />
  );
};

export default OnboardingScreen;

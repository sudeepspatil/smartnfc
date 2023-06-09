import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';

import Registration from './screens/Registration';
import HomeScreen from './screens/HomeScreen';
import auth from '@react-native-firebase/auth';
import TagDetailScreen from './screens/TagDetailScreen';
import Share from './screens/ShareScreen';
import Guest from './screens/GuestScreen';
const Stack = createNativeStackNavigator();

const App = () => {
  const [initializing, setInitializing] = React.useState(true);
  const [user, setUser] = React.useState(null);

  function onAuthStateChange(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscribe = auth().onAuthStateChanged(onAuthStateChange);
    return subscribe;
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registration" component={Registration} />
          <Stack.Screen name="Guest" component={Guest} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          options={{headerShown: false}}
          name="Tap"
          component={TagDetailScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Share"
          component={Share}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

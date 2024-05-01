import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import HomeScreen from './screens/HomeScreen';
import DaysDetailScreen from './screens/DaysDetailScreen';
import AdminPanel from './screens/AdminPanel';
import GoogleSignIn from './screens/Login';
import UserDetails from './screens/UserDetails';
import firestore from '@react-native-firebase/firestore';

const Stack = createNativeStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const onAuthStateChanged = user => {
    setUser(user);
    setInitializing(false);
  };

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const userDocs = await firestore()
            .collection('users')
            .where('id', '==', user.uid)
            .get();

          if (!userDocs.empty) {
            userDocs.forEach(doc => {
              const userData = doc.data();
              setUserData(userData);
              setIsAdmin(userData?.isAdmin || false);
            });
          } else {
            console.log('User document not found');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    } else {
      setUserData(null);
      setIsAdmin(false);
    }
  }, [user]);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {!user || !isAdmin ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : null}
        {isAdmin ? <Stack.Screen name="Admin" component={AdminPanel} /> : null}
        {!user ? <Stack.Screen name="Login" component={GoogleSignIn} /> : null}
        <Stack.Screen name="DaysDetail" component={DaysDetailScreen} />
        <Stack.Screen name="UserDetail" component={UserDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

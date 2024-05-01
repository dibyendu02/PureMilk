import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React, {useState, useEffect} from 'react';
import {Button, View, Alert, Text, Image} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import logo from '../assets/milkLogo.png';

GoogleSignin.configure({
  webClientId:
    '271282196623-gevoshscs2g1m0uh8bp2n6b7k7kimds4.apps.googleusercontent.com',
});

export default function GoogleSignIn({navigation}) {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Fetch user data when component mounts
    const fetchUserData = async () => {
      try {
        const currentUser = await GoogleSignin.getCurrentUser();
        if (currentUser) {
          setUserEmail(currentUser.user.email);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  async function onGoogleButtonPress() {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

      // Revoke access to clear any existing authentication state
      await GoogleSignin.revokeAccess();

      // Get the users ID token
      const {idToken} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const {user} = await auth().signInWithCredential(googleCredential);

      console.log('Signed in with Google!');

      // Create user document in Firestore
      await createUserDocument(user);

      // Navigate to the home screen
      // navigation.replace('Home'); // Replace the sign-in screen with the home screen
    } catch (error) {
      if (error.code === 'SIGN_IN_CANCELLED') {
        // User canceled sign-in process
        console.log('Google sign-in canceled.');
      } else {
        // Other errors
        console.error('Error signing in with Google:', error);
        Alert.alert(
          'Error',
          'Failed to sign in with Google. Please try again later.',
        );
      }
    }
  }

  async function createUserDocument(user) {
    try {
      // Check if the user document already exists
      const usersRef = firestore().collection('users');
      const querySnapshot = await usersRef.where('id', '==', user.uid).get();

      console.log(querySnapshot);
      console.log('snapshot');

      if (querySnapshot.empty) {
        // User document doesn't exist, create a new one
        await usersRef.doc(user.uid).set({
          id: user.uid,
          isAdmin: false,
          username: user.displayName || 'Anonymous',
          image: user.photoURL || null,
          rate: 0, // Default value for rate
          days: 0, // Default value for days
          totalQuantity: 0, // Default value for total quantity
          deliveries: [], // Array to store delivery data
        });
        console.log('User document created successfully.');
      } else {
        // User document already exists
        querySnapshot.forEach(doc => {
          const userData = doc.data();
          console.log('userData ', userData);
          setTimeout(() => {
            if (userData.isAdmin) {
              // User is admin, navigate to admin page
              navigation.replace('Admin');
            } else {
              // User is not admin, navigate to home page
              navigation.replace('Home');
            }
          }, 5000);
        });
      }
    } catch (error) {
      console.error('Error creating user document:', error);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          width: '50%',
          // backgroundColor: 'red',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: 'gray',
            fontSize: 20,
            fontWeight: '600',
            textAlign: 'center',
          }}>
          Get started with
        </Text>

        <Image source={logo} style={{width: '100%', height: '50%'}} />

        <Button
          title="Google Sign-In"
          onPress={onGoogleButtonPress}
          color="#4285F4" // Set the button color
          accessibilityLabel="Sign in with Google" // Accessibility label
        />
      </View>
    </View>
  );
}

import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import logo from '../assets/milkLogo.png';

const AdminPanel = () => {
  const navigation = useNavigation();
  const [customerData, setCustomerData] = useState([]);
  const [userData, setUserData] = useState(null);

  // Fetch user data from Firestore
  const fetchUserData = async () => {
    try {
      const snapshot = await firestore()
        .collection('users')
        .where('isAdmin', '!=', true)
        .get();
      const users = snapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data(),
      }));
      setCustomerData(users);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // fetch user data
  useEffect(() => {
    // Fetch user data when component mounts
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        // User is signed in
        try {
          const userDocs = await firestore()
            .collection('users')
            .where('id', '==', user.uid)
            .get();

          if (!userDocs.empty) {
            userDocs.forEach(doc => {
              const userData = doc.data();
              const {rate, days, totalQuantity} = userData;

              // Set user data
              setUserData(userData);
            });
          } else {
            console.log('User document not found');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        // No user is signed in
        setUserData(null);
      }
    });

    // Unsubscribe from auth state changes when component unmounts
    return unsubscribe;
  }, []);

  // Re-fetch user data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, []),
  );

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('UserDetail', {userData: item});
      }}
      style={styles.customerItem}>
      <Text style={styles.customerName}>{item.username}</Text>
      <Image source={{uri: item.image}} style={styles.customerImage} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* navbar */}
      <View
        style={{
          width: '100%',
          paddingHorizontal: 15,
          paddingVertical: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Image source={logo} style={{width: 60, height: 60}} />
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
          {userData ? (
            <TouchableOpacity
              onPress={() => {
                auth().signOut();
              }}
              style={{
                backgroundColor: 'orange',
                padding: 5,
                borderRadius: 10,
                paddingHorizontal: 10,
              }}>
              <Text style={{color: 'white'}}>Logout</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Login');
              }}
              style={{
                backgroundColor: 'skyblue',
                padding: 5,
                borderRadius: 10,
                paddingHorizontal: 10,
              }}>
              <Text style={{color: 'white'}}>Login</Text>
            </TouchableOpacity>
          )}
          {userData && (
            <Image
              source={
                userData.image ? {uri: userData.image} : profileImgPlaceholder
              }
              style={{width: 40, height: 40, borderRadius: 50}}
            />
          )}
        </View>
      </View>

      <View style={{width: '100%', flexDirection: 'row'}}>
        <View>
          {/* <Text style={{fontSize: 18, fontWeight: '600', color: '#808080'}}>
            Admin Panel
          </Text> */}
          <Text style={{fontSize: 20, fontWeight: '600', color: '#808080'}}>
            Customer List
          </Text>
        </View>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={customerData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.scrollViewContent}
      />
    </View>
  );
};

export default AdminPanel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
  },
  scrollViewContent: {
    paddingVertical: 15,
  },
  customerItem: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    marginVertical: 15,
    padding: 10,
    height: 80, // Adjust height as needed
    borderRadius: 12,
  },
  customerName: {
    fontSize: 20,
    color: 'black',
  },
  customerImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
});

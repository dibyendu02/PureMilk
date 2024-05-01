import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import logo from '../assets/milkLogo.png';
import profileImgPlaceholder from '../assets/profile.png';
import cowImage from '../assets/cow.png';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = () => {
  const [milkQuantity, setMilkQuantity] = useState(0);
  const [daysCount, setDaysCount] = useState(0);
  const [rate, setRate] = useState(0);
  const [userData, setUserData] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    // Fetch user data when component mounts
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        // User is signed in
        try {
          const userDocs = await firestore()
            .collection('users')
            .where('id', '==', user.uid)
            .onSnapshot(snapshot => {
              snapshot.docs.forEach(doc => {
                const userData = doc.data();
                const {rate, days, totalQuantity} = userData;

                // Set user data
                setUserData(userData);

                // Set rate, days, and total quantity
                setRate(rate);
                setDaysCount(days);
                setMilkQuantity(totalQuantity);
              });
            });
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

      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        {/* Hero section */}
        <View
          style={{
            // width: '93%',
            // height: '30%',
            backgroundColor: 'skyblue',
            minHeight: 150, // Adjusted height
            // padding: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: '#D3D3D3',
            marginHorizontal: 15,
            borderRadius: 15,
          }}>
          <View style={{padding: 20}}>
            <Text
              style={{
                color: 'white',
                fontWeight: '600',
                fontSize: 14,
              }}>
              Hello,{' '}
              {userData?.username ? userData?.username.split(' ')[0] : ''}
            </Text>
            <Text
              style={{
                color: 'white',
                fontWeight: '600',
                fontSize: 24,
              }}>
              Your Friendly
            </Text>
            <Text
              style={{
                color: 'white',
                fontWeight: '600',
                fontSize: 20,
              }}>
              Milk Partner here
            </Text>
          </View>

          <Image
            source={cowImage}
            style={{width: '40%', height: '100%', borderBottomRightRadius: 15}}
          />
        </View>
        {/* main section */}
        <View
          style={{
            width: '100%',
            minHeight: 200, // Adjusted height
            padding: 15,
            flexDirection: 'column',
            gap: 10,
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 18, fontWeight: '800', color: '#808080'}}>
              Your Total Milk Count
            </Text>
            <Text style={{fontSize: 14, color: '#808080'}}>View Details</Text>
          </View>

          <View
            style={{
              borderWidth: 5,
              paddingHorizontal: 15,
              borderColor: '#D3D3D3',
              borderRadius: 20,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}>
              <Text style={{fontSize: 72, fontWeight: 600, color: '#808080'}}>
                {milkQuantity}
              </Text>
              <Text style={{fontSize: 18, fontWeight: 600, color: '#808080'}}>
                liters
              </Text>
            </View>
          </View>
        </View>

        {/* Days Count */}

        <View
          style={{
            width: '100%',
            minHeight: 200, // Adjusted height
            padding: 15,
            flexDirection: 'column',
            gap: 10,
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 18, fontWeight: '800', color: '#808080'}}>
              Days Count
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('DaysDetail');
              }}>
              <Text style={{fontSize: 14, color: '#808080'}}>View Details</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              borderWidth: 5,
              paddingHorizontal: 15,
              borderColor: '#D3D3D3',
              borderRadius: 20,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}>
              <Text style={{fontSize: 72, fontWeight: 600, color: '#808080'}}>
                {daysCount}
              </Text>
              <Text style={{fontSize: 18, fontWeight: 600, color: '#808080'}}>
                days
              </Text>
            </View>
          </View>
        </View>

        {/* Total Amount */}
        <View
          style={{
            width: '100%',
            minHeight: 150, // Adjusted height
            padding: 15,
            flexDirection: 'column',
            gap: 10,
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 18, fontWeight: '800', color: '#808080'}}>
              Total Amount Payable
            </Text>
            <Text style={{fontSize: 14, color: '#808080'}}>View Details</Text>
          </View>

          <View
            style={{
              borderWidth: 5,
              paddingHorizontal: 15,
              borderColor: '#D3D3D3',
              borderRadius: 20,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}>
              <Text style={{fontSize: 72, fontWeight: 600, color: '#808080'}}>
                {milkQuantity * rate}
              </Text>
              <Text style={{fontSize: 18, fontWeight: 600, color: '#808080'}}>
                Rs
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

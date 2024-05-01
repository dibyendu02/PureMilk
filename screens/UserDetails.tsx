import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import firestore from '@react-native-firebase/firestore';

const Weight = ({route, navigation}) => {
  const {userData} = route.params;
  const [name, setName] = useState(userData.username);
  const [rate, setRate] = useState(userData.rate.toString());
  const [days, setDays] = useState(userData.days.toString());
  const [totalQuantity, setTotalQuantity] = useState(
    userData.totalQuantity.toString(),
  );

  const handleUpdate = async () => {
    try {
      const userRef = firestore().collection('users').doc(userData.docId);

      // Check if the document exists
      const doc = await userRef.get();
      if (!doc.exists) {
        throw new Error('Document not found in Firestore');
      }

      // Convert rate, days, and totalQuantity to numbers
      const rateValue = parseInt(rate);
      const daysValue = parseInt(days);
      const totalQuantityValue = parseInt(totalQuantity);

      // Update user data in Firestore
      await userRef.update({
        name,
        rate: rateValue,
        days: daysValue,
        totalQuantity: totalQuantityValue,
      });

      console.log('User data updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating user data:', error);
      // Handle error appropriately (e.g., display error message to user)
    }
  };

  return (
    <View style={styles.container}>
      <View style={{marginBottom: 10}}></View>
      <Text style={styles.subtitle}>User Details</Text>
      <Text style={styles.title}>Update the user datas here</Text>

      <View style={{width: '100%', marginBottom: 5}}>
        <Text style={styles.label}>Name</Text>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>
      </View>

      <ScrollView style={styles.subcontainer}>
        <View style={{width: '100%'}}>
          <Text style={styles.label}>Rate</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={rate}
              onChangeText={setRate}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={{backgroundColor: 'red', paddingHorizontal: 15}}
              onPress={() => {
                setRate(prevRate => {
                  const numericRate = parseInt(prevRate); // Convert string to number
                  return (numericRate - 1).toString();
                });
              }}>
              <Text style={{color: 'black', fontSize: 24}}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{backgroundColor: 'skyblue', paddingHorizontal: 10}}
              onPress={() => {
                setRate(prevRate => {
                  const numericRate = parseInt(prevRate); // Convert string to number
                  return (numericRate + 1).toString();
                });
              }}>
              <Text style={{color: 'white', fontSize: 24}}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{width: '100%'}}>
          <Text style={styles.label}>Days</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={days}
              onChangeText={setDays}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={{backgroundColor: 'red', paddingHorizontal: 15}}
              onPress={() => {
                setDays(prevDays => {
                  const numericDays = parseInt(prevDays); // Convert string to number
                  return (numericDays - 1).toString();
                });
              }}>
              <Text style={{color: 'black', fontSize: 24}}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{backgroundColor: 'skyblue', paddingHorizontal: 10}}
              onPress={() => {
                setDays(prevDays => {
                  const numericDays = parseInt(prevDays); // Convert string to number
                  return (numericDays + 1).toString();
                });
              }}>
              <Text style={{color: 'white', fontSize: 24}}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{width: '100%'}}>
          <Text style={styles.label}>Total Quantity</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={totalQuantity}
              onChangeText={setTotalQuantity}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={{backgroundColor: 'red', paddingHorizontal: 15}}
              onPress={() => {
                setTotalQuantity(prevQuantity => {
                  const numericQuantity = parseInt(prevQuantity); // Convert string to number
                  return (numericQuantity - 1).toString();
                });
              }}>
              <Text style={{color: 'black', fontSize: 24}}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{backgroundColor: 'skyblue', paddingHorizontal: 10}}
              onPress={() => {
                setTotalQuantity(prevQuantity => {
                  const numericQuantity = parseInt(prevQuantity); // Convert string to number
                  return (numericQuantity + 1).toString();
                });
              }}>
              <Text style={{color: 'white', fontSize: 24}}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Weight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  subcontainer: {
    flex: 1,
    // alignItems: 'center',
    flexDirection: 'column',
    // justifyContent: 'center',
    // backgroundColor: 'red',
    gap: 5,
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    // paddingLeft: 20,
    color: 'black',
  },
  subtitle: {
    fontSize: 16,
    // paddingLeft: 20,
    color: 'black',
  },
  button: {
    backgroundColor: 'skyblue',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: '10%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#eee',
    borderRadius: 20,
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '100%',
    // justifyContent: 'center',
    // backgroundColor: 'red',
  },
  input: {
    width: '80%',
    height: 40,
    paddingHorizontal: 10,
    // backgroundColor: 'blue',
    color: 'black',
  },
  unit: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  label: {
    fontSize: 16,
    // marginBottom: 5,
    color: '#808080',
  },
});

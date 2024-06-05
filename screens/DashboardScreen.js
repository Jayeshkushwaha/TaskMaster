import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, Alert, TextInput, ActivityIndicator } from 'react-native';
import { getInvestments, deleteInvestment, addInvestment } from '../database';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const DashboardScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInvestments = () => {
    setLoading(true)
    getInvestments(
      userId,
      investmentData => {
        setInvestments(investmentData);
        setLoading(false);
      },
      error => {
        Alert.alert(error);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    fetchInvestments()
  }, [])

  const handleDeleteInvestment = (investmentId) => {
    Alert.alert(
      'Delete Investment',
      'Are you sure you want to delete this investment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            deleteInvestment(
              investmentId,
              () => {
                fetchInvestments();
              },
              error => Alert.alert(error.message)
            );
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleAddInvestment = () => {
    if (name === '' || amount === '') {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    addInvestment(
      userId,
      name,
      parseFloat(amount),
      () => {
        fetchInvestments();
      },
      error => Alert.alert('Error', error.message)
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Investment Tracker</Text>
      <TextInput
        style={styles.input}
        placeholder="Investment Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <Button title="Add Investment" onPress={handleAddInvestment} />
      {loading ? (
        <View style={[styles.loadingContainer, styles.horizontal]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={investments}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.investmentItem}>
              <Text>{item.name}: Rs{item.amount}</Text>
              <Button title="Delete" onPress={() => handleDeleteInvestment(item.id)} />
            </View>
          )}
        />
      )}
      {investments.length != 0 && (
        <LineChart
          data={{
            labels: investments.map(i => i.name),
            datasets: [
              {
                data: investments.map(i => i.amount),
              },
            ],
          }}
          width={Dimensions.get('window').width - 40} // Adjusted width dynamically
          height={220}
          yAxisLabel="Rs"
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 5,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 5,
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  investmentItem: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default DashboardScreen;

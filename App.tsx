// App.js
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { createTable, getItems, addItem, deleteItem, updateItem } from './database';

const App = () => {
  const [name, setName] = useState('');
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    createTable();
    getItems(setItems);
  }, []);

  const handleAddOrUpdateItem = () => {
    if (name.length > 0) {
      if (editingId === null) {
        addItem(name, () => getItems(setItems));
      } else {
        updateItem(editingId, name, () => getItems(setItems));
        setEditingId(null);
      }
      setName('');
    }
  };

  const handleEditItem = (item) => {
    setName(item.name);
    setEditingId(item.id);
  };

  const handleDeleteItem = (id) => {
    deleteItem(id, () => {
      getItems(setItems);
      setName('');
      setEditingId(null);
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.name}</Text>
      <View style={styles.buttons}>
        <Button title="Edit" onPress={() => handleEditItem(item)} />
        <Button title="Delete" onPress={() => handleDeleteItem(item.id)} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="Enter item name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <Button
        title={editingId === null ? "Add Item" : "Update Item"}
        onPress={handleAddOrUpdateItem}
      />
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
  },
});

export default App;

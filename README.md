# CRUD operations (GET, POST, PUT, PATCH, DELETE) with a RESTful API using Axios

### Step 1:- yarn add axios

### Step 2:- App.js

```
import React, { useState } from 'react';
import { View, Text, Button, FlatList, TextInput, StyleSheet } from 'react-native';
import axios from 'axios';

const AxiosExample = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const postData = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
        title,
        body,
        userId: 1,
      });
      setData((prevData) => [...prevData, response.data]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateData = async (id) => {
    setLoading(true);
    try {
      const response = await axios.put(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        title: 'Updated Title',
        body: 'Updated Body',
        userId: 1,
      });
      setData((prevData) => prevData.map((item) => (item.id === id ? response.data : item)));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const patchData = async (id) => {
    setLoading(true);
    try {
      const response = await axios.patch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        title: 'Patched Title',
      });
      setData((prevData) => prevData.map((item) => (item.id === id ? response.data : item)));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteData = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Fetch Data" onPress={fetchData} />
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Body"
        value={body}
        onChangeText={setBody}
      />
      <Button title="Post Data" onPress={postData} />
      <Button title="Clear Data" onPress={()=>setData([])} />
      {loading ? <Text>Loading...</Text> : null}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.body}</Text>
            <Button title="Update" onPress={() => updateData(item.id)} />
            <Button title="Patch" onPress={() => patchData(item.id)} />
            <Button title="Delete" onPress={() => deleteData(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AxiosExample;
```

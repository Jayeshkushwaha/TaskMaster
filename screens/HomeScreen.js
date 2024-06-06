import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);

    const loadTasks = async () => {
        try {
            const storedTasks = await AsyncStorage.getItem('tasks');
            if (storedTasks) {
                setTasks(JSON.parse(storedTasks));
            }
        } catch (e) {
            console.error("Failed to load tasks", e);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const addTask = async () => {
        if (task.length > 0) {
            const storedTasks = await AsyncStorage.getItem('tasks');
            const tasks = storedTasks ? JSON.parse(storedTasks) : [];
            if (editingIndex !== null) {
                tasks[editingIndex] = task;
                setEditingIndex(null);
            } else {
                tasks.push(task);
            }
            await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
            setTask('');
            loadTasks();
        }
    };

    const deleteTask = async (index) => {
        const newTasks = tasks.filter((_, i) => i !== index);
        setTasks(newTasks);
        await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
    };

    const editTask = (index) => {
        setTask(tasks[index]);
        setEditingIndex(index);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Enter Task"
                value={task}
                onChangeText={setTask}
            />
            <Button title={editingIndex !== null ? "Update Task" : "Add Task"} onPress={addTask} />
            <FlatList
                data={tasks}
                renderItem={({ item, index }) => (
                    <View style={styles.taskContainer}>
                        <Text style={styles.taskText}>{item}</Text>
                        <View style={styles.buttonGroup}>
                            <Button title="Edit" onPress={() => editTask(index)} />
                            <Button title="Delete" onPress={() => deleteTask(index)} />
                        </View>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    taskContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    taskText: {
        fontSize: 18,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});

export default HomeScreen;

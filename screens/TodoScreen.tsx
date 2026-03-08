import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useState } from 'react';
import { TodoItem } from '../components/TodoItem';
import { addDoc, firestore, collection, TASKS, serverTimestamp, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc} from '../firebase/Config';
import { Todo } from '../types/Todo';
const TodoScreen = () => {
  const [inputText, setInputText] = useState('');
  const [tasks, setTasks] = useState<Todo[]>([]);

  useEffect(() => {
    const colRef = collection(firestore, TASKS);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const rows: Todo[] = snap.docs.map(d => {
        const data = d.data() as any;
        const id = d.id;
        const text = data.text ?? '';
        const completed = data.completed ?? false;
        const created = data.createdAt?.toDate?.() ?? null;

        return { id, text, completed, createdAt: created };
      });
      setTasks(rows);
    }, (err) => {
      console.error('onSnapshot error', err);
    });
    return () => { unsubscribe(); };
  }, [])

  async function handleSendTask(text: string): Promise<void> {
    if (!text.trim()) return;

    try {
      const colRef = collection(firestore, TASKS);
      const docRef = await addDoc(colRef, {
        text: text,
        completed: false,
        createdAt: serverTimestamp(),
      });
      console.log("Doc ID:", docRef.id);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }

  const toggleTodo = async (id: string) => {
    const docRef = doc(firestore, TASKS, id);

    await updateDoc(docRef, {
      completed: !tasks.find(t => t.id === id)?.completed
    });
  }

  const deleteTodo = async (id: string) => {  
    const docRef = doc(firestore, TASKS, id);

    await deleteDoc(docRef);
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a todo..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={(e) => {
            handleSendTask(inputText)
            setInputText("");
          }}
        />
        <TouchableOpacity style={styles.addButton} onPress={(e) => {
          handleSendTask(inputText)
          setInputText("");
        }}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        renderItem={({ item }) => (
          <TodoItem item={item} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
        )}
      />

      <StatusBar style="auto" />
    </View>
  );
};

 


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  todoItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  todoText: {
    flex: 1,
  },
  todoTextContent: {
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default TodoScreen;
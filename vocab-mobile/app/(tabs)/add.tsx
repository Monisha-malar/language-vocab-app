import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { api } from '@/src/services/api';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddPage() {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');
  const router = useRouter();

  const handleAdd = async () => {
    if (!word || !meaning || !example) {
      alert('⚠️ Please fill all fields!');
      return;
    }

    try {
      await api.post('/words', { word, meaning, example });
      alert('✅ Word added successfully!');

      // Save locally for ProfilePage
      const existingWords = await AsyncStorage.getItem('words');
      const wordList = existingWords ? JSON.parse(existingWords) : [];
      wordList.push({ word, meaning, example });
      await AsyncStorage.setItem('words', JSON.stringify(wordList));

      // Clear inputs
      setWord('');
      setMeaning('');
      setExample('');

      router.push('/learn');
    } catch (error: any) {
      console.log('Add Word Error:', error.response?.data || error.message);
      alert('❌ Failed to add word.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        📘 Add a New Word
      </ThemedText>

      <View style={styles.inputContainer}>
        <Ionicons name="text" size={20} color="#8e4d71ff" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Word"
          value={word}
          onChangeText={setWord}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="book" size={20} color="#8e4d71ff" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Meaning"
          value={meaning}
          onChangeText={setMeaning}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="reader" size={20} color="#8e4d71ff" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Example"
          value={example}
          onChangeText={setExample}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Ionicons name="add-circle" size={20} color="#fff" />
        <ThemedText style={styles.buttonText}> Add Word</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    gap: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2E4057',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 12,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  icon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 12, fontSize: 16 },
  button: {
    flexDirection: 'row',
    backgroundColor: '#8e4d71ff',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});






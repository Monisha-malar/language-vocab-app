import React, { useState, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { api } from '@/src/services/api';
import { useFocusEffect } from '@react-navigation/native';

type Word = {
  id: number;
  word: string;
  meaning: string;
  example: string;
};

export default function LearnPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchWords = async () => {
    try {
      setLoading(true);
      const res = await api.get<Word[]>('/words'); // ✅ Correct route
      setWords(res.data);
      setCurrentIndex(0);
    } catch (error) {
      console.log('LearnPage Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWords();
    }, [])
  );

  const nextWord = () => currentIndex < words.length - 1 && setCurrentIndex(currentIndex + 1);
  const prevWord = () => currentIndex > 0 && setCurrentIndex(currentIndex - 1);
  const markLearned = () => alert(`You learned "${words[currentIndex].word}"!`);
  const markFavorite = () => alert(`"${words[currentIndex].word}" added to favorites!`);

  if (loading) return <ThemedView style={styles.container}><ThemedText>Loading...</ThemedText></ThemedView>;
  if (words.length === 0) return <ThemedView style={styles.container}><ThemedText>No words found.</ThemedText></ThemedView>;

  const currentWord = words[currentIndex];

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.card}>
        <ThemedText type="title" style={styles.wordText}>{currentWord.word}</ThemedText>
        <ThemedText type="subtitle" style={styles.meaningText}>{currentWord.meaning}</ThemedText>
        <ThemedText style={styles.exampleText}>Example: {currentWord.example}</ThemedText>
      </ThemedView>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#4ECDC4' }]} onPress={prevWord}>
          <ThemedText style={styles.buttonText}>Previous</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#24249c' }]} onPress={nextWord}>
          <ThemedText style={styles.buttonText}>Next</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomActions}>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#cd74b8ff' }]} onPress={markLearned}>
          <ThemedText style={styles.buttonText}>Mark Learned</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#ce586bff' }]} onPress={markFavorite}>
          <ThemedText style={styles.buttonText}>Favorite</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'space-between', backgroundColor: '#FFFFFF' },
  card: { padding: 20, borderRadius: 16, backgroundColor: '#F0F0F0', alignItems: 'center' },
  wordText: { fontSize: 28, fontWeight: 'bold', color: '#2E4057' },
  meaningText: { fontSize: 18, color: '#34495E', marginTop: 12, textAlign: 'center' },
  exampleText: { fontSize: 16, color: '#555', marginTop: 8, fontStyle: 'italic', textAlign: 'center' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  bottomActions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, marginTop: 20 },
  button: { paddingVertical: 15, paddingHorizontal: 20, borderRadius: 12, alignItems: 'center', minWidth: 140 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});


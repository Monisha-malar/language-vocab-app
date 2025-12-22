import React, { useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfilePage() {
  const [totalWords, setTotalWords] = useState(0);
  const [practiceCount, setPracticeCount] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const loadProfileData = async () => {
    // total words
    const words = await AsyncStorage.getItem('words');
    const wordList = words ? JSON.parse(words) : [];
    setTotalWords(wordList.length);

    // practice stats
    const stats = await AsyncStorage.getItem('practiceStats');
    const parsed = stats ? JSON.parse(stats) : { count: 0, correct: 0 };
    setPracticeCount(parsed.count);
    setCorrectAnswers(parsed.correct);
  };

  // Reload data every time page is focused
  useFocusEffect(useCallback(() => {
    loadProfileData();
  }, []));

  const accuracy = practiceCount === 0 ? 0 : Math.round((correctAnswers / practiceCount) * 100);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        My Profile 📊
      </ThemedText>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: '#cea9c3ff' }]}>
          <ThemedText style={styles.label}>Total Words Learned</ThemedText>
          <ThemedText style={styles.value}>{totalWords}</ThemedText>
        </View>

        <View style={[styles.card, { backgroundColor: '#627a7dff' }]}>
          <ThemedText style={styles.label}>Practice Attempts</ThemedText>
          <ThemedText style={styles.value}>{practiceCount}</ThemedText>
        </View>

        <View style={[styles.card, { backgroundColor: '#aeb7dcff' }]}>
          <ThemedText style={styles.label}>Correct Answers</ThemedText>
          <ThemedText style={styles.value}>{correctAnswers}</ThemedText>
        </View>

        <View style={[styles.card, { backgroundColor: '#FECACA' }]}>
          <ThemedText style={styles.label}>Accuracy</ThemedText>
          <ThemedText style={styles.value}>{accuracy}%</ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFFFFF' },
  title: { marginBottom: 20, textAlign: 'center', color: '#2E4057' },
  card: {
    padding: 20,
    borderRadius: 16,
    marginVertical: 10,
    shadowColor: '#f0ededff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  label: { fontSize: 15, color: '#4B5563' },
  value: { fontSize: 26, fontWeight: 'bold', color: '#1F2937', marginTop: 6 },
});

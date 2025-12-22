import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { api } from '@/src/services/api';

type PracticeQuestion = {
  word: string;
  options: string[];
  answer: string;
};

export default function PracticePage() {
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    loadPractice();
  }, []);

  // ✅ Load practice questions from backend
  const loadPractice = async () => {
    try {
      const res = await api.get<PracticeQuestion[]>('/practice'); // ✅ Correct backend route
      setQuestions(res.data);
    } catch (error) {
      console.log('PracticePage Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save practice stats in AsyncStorage
  const savePracticeStats = async () => {
    const existing = await AsyncStorage.getItem('practiceStats');
    const stats = existing ? JSON.parse(existing) : { count: 0, correct: 0 };
    stats.count += questions.length;
    stats.correct += score;
    await AsyncStorage.setItem('practiceStats', JSON.stringify(stats));
  };

  const handleAnswer = (option: string) => {
    if (selected) return; // prevent double selection
    setSelected(option);

    // Animate selection
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
    ]).start();

    if (option === questions[currentIndex].answer) setScore(score + 1);

    setTimeout(() => {
      const next = currentIndex + 1;
      if (next < questions.length) {
        setCurrentIndex(next);
        setSelected(null);
      } else {
        setShowResult(true);
        savePracticeStats();
      }
    }, 800);
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (questions.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Add at least 4 words to practice.</ThemedText>
      </ThemedView>
    );
  }

  if (showResult) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Practice Completed 🎉</ThemedText>
        <ThemedText style={styles.score}>
          Your Score: {score} / {questions.length} 🏆
        </ThemedText>

        <TouchableOpacity
          style={styles.restartBtn}
          onPress={() => {
            setCurrentIndex(0);
            setScore(0);
            setSelected(null);
            setShowResult(false);
          }}
        >
          <ThemedText style={styles.optionText}>🔄 Restart Practice</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const current = questions[currentIndex];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.word}>
        ✏️ {current.word}
      </ThemedText>

      <View style={styles.options}>
        {current.options.map((option, index) => {
          const isCorrect = option === current.answer;
          const isSelected = option === selected;

          let bgColor = '#498189ff';
          let borderColor = 'transparent';
          let symbol = '';

          if (selected) {
            if (isCorrect) {
              bgColor = '#22c55e';
              borderColor = '#000';
              symbol = '✅ ';
            } else if (isSelected) {
              bgColor = '#ef4444';
              symbol = '❌ ';
            }
          }

          return (
            <Animated.View key={index} style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={[styles.optionButton, { backgroundColor: bgColor, borderWidth: borderColor !== 'transparent' ? 2 : 0, borderColor }]}
                onPress={() => handleAnswer(option)}
              >
                <ThemedText style={styles.optionText}>{symbol}{option}</ThemedText>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      <ThemedText style={styles.score}>
        Score: {score} / {questions.length} 🏅
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#FFFFFF' },
  word: { textAlign: 'center', marginBottom: 30, color: '#c27f92ff', fontSize: 22, fontWeight: 'bold' },
  options: { gap: 15 },
  optionButton: { padding: 15, borderRadius: 12 },
  optionText: { color: '#FFFFFF', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
  score: { marginTop: 30, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#2E4057' },
  restartBtn: { marginTop: 30, backgroundColor: '#216f7dff', padding: 15, borderRadius: 12, alignItems: 'center' },
});

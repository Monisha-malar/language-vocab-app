import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ThemedView style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Welcome to VocaBoost!
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Learn, practice, and expand your vocabulary every day.
        </ThemedText>
      </ThemedView>

      {/* Action Buttons */}
      <ThemedView style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#2E86AB' }]}
          onPress={() => router.push('/learn')}
        >
          <ThemedText type="button" style={styles.buttonText}>
            Start Learning
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#7D3C98' }]}
          onPress={() => router.push('/add')}
        >
          <ThemedText type="button" style={styles.buttonText}>
            Add Words
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#E59866' }]}
          onPress={() => router.push('/practice')}
        >
          <ThemedText type="button" style={styles.buttonText}>
            Practice
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#C70039' }]}
          onPress={() => router.push('/profile')}
        >
          <ThemedText type="button" style={styles.buttonText}>
            My Profile
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Footer */}
      <ThemedView style={styles.footer}>
        <ThemedText style={styles.footerText}>
          “A new word a day keeps your vocabulary sharp!”
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    color: '#2E4057',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#34495E',
    marginTop: 8,
    textAlign: 'center',
  },
  actions: {
    marginVertical: 40,
    gap: 20,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  footerText: {
    fontStyle: 'italic',
    color: '#555',
    fontSize: 16,
    textAlign: 'center',
  },
});





import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  CaretLeft,
  SignOut,
} from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';

const SESSIONS = [
  {
    id: '1',
    device: 'Realme RMX3241',
    timestamp: '2026-01-08 15:17:48',
  },
  {
    id: '2',
    device: 'Windows Chrome',
    timestamp: '2026-02-13 13:23:49',
  },
  {
    id: '3',
    device: 'Windows Edge',
    timestamp: '2026-02-13 13:25:06',
  },
];

export default function SessionsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <CaretLeft size={28} color={theme.text} weight="bold" />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Logged in devices</Text>
        </View>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          ID: 20202954 • Muggs Cafe, Balotra Locality, Balotra
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.surfaceSecondary + '50' }]}>
          <Image
            source={require('@/assets/images/react-logo.png')}
            style={[styles.avatar, { borderColor: theme.primary, borderWidth: 1 }]}
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.text }]}>Sunil Lalwani</Text>
            <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>lsunil96@gmail.com</Text>
          </View>
        </View>

        {/* Devices Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Devices ({SESSIONS.length})</Text>
        </View>

        <View style={styles.deviceList}>
          {SESSIONS.map((session, index) => (
            <View 
              key={session.id} 
              style={[
                styles.deviceCard, 
                { 
                  backgroundColor: theme.surfaceSecondary + '50',
                  borderTopLeftRadius: index === 0 ? 16 : 0,
                  borderTopRightRadius: index === 0 ? 16 : 0,
                  borderBottomLeftRadius: index === SESSIONS.length - 1 ? 16 : 0,
                  borderBottomRightRadius: index === SESSIONS.length - 1 ? 16 : 0,
                  borderBottomWidth: index === SESSIONS.length - 1 ? 0 : 1,
                  borderBottomColor: theme.border + '10',
                }
              ]}
            >
              <View style={styles.deviceInfo}>
                <Text style={[styles.deviceName, { color: theme.text }]}>{session.device}</Text>
                <Text style={[styles.deviceTime, { color: theme.textSecondary }]}>
                  Logged in on {session.timestamp}
                </Text>
              </View>
              <Pressable style={styles.logoutBtn}>
                <SignOut size={18} color={theme.error} weight="bold" />
                <Text style={[styles.logoutText, { color: theme.error }]}>Log-out</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    ...Typography.H1,
    fontSize: 22,
  },
  headerSubtitle: {
    ...Typography.Caption,
    fontSize: 13,
    paddingLeft: 44,
  },
  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 32,
    gap: 16,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#333',
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    ...Typography.H2,
    fontSize: 18,
    fontWeight: '700',
  },
  profileEmail: {
    ...Typography.BodyRegular,
    fontSize: 14,
    opacity: 0.8,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    ...Typography.H2,
    fontSize: 18,
    fontWeight: '700',
  },
  deviceList: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    gap: 12,
  },
  deviceInfo: {
    flex: 1,
    gap: 4,
  },
  deviceName: {
    ...Typography.H3,
    fontSize: 16,
    fontWeight: '600',
  },
  deviceTime: {
    ...Typography.Caption,
    fontSize: 12,
    opacity: 0.7,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  logoutText: {
    ...Typography.H3,
    fontSize: 14,
    fontWeight: '700',
  },
});

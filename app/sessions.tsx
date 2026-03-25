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
  Monitor,
  Devices,
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
  const { colorScheme, isDark } = useAppTheme();
  const theme = Colors[colorScheme];

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('windows') || device.toLowerCase().includes('mac')) {
      return <Monitor size={22} color={theme.text} weight="duotone" />;
    }
    return <Devices size={22} color={theme.text} weight="duotone" />;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: theme.surface, borderBottomColor: theme.border + '26' }]}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <CaretLeft size={24} color={theme.text} weight="bold" />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Security & Sessions</Text>
        </View>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          ID: 20202954 • Muggs Cafe
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.surface, borderColor: theme.border + '20', borderWidth: 1 }]}>
          <View style={[styles.avatarContainer, { backgroundColor: theme.primary + '10' }]}>
            <Image
              source={require('@/assets/images/react-logo.png')}
              style={styles.avatar}
            />
            <View style={[styles.onlineIndicator, { backgroundColor: theme.success, borderColor: theme.background }]} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.text }]}>Sunil Lalwani</Text>
            <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>lsunil96@gmail.com</Text>
          </View>
          <View style={[styles.roleBadge, { backgroundColor: theme.info + '15' }]}>
            <Text style={[styles.roleBadgeText, { color: theme.info }]}>Owner</Text>
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
                  backgroundColor: theme.surface,
                  borderColor: theme.border + '15',
                  borderWidth: 1,
                  marginBottom: 12,
                  borderRadius: 20,
                }
              ]}
            >
              <View style={[styles.deviceIconBox, { backgroundColor: theme.surfaceSecondary + '40' }]}>
                {getDeviceIcon(session.device)}
              </View>
              <View style={styles.deviceInfo}>
                <View style={styles.deviceNameRow}>
                  <Text style={[styles.deviceName, { color: theme.text }]}>{session.device}</Text>
                  {index === 0 && (
                    <View style={[styles.currentBadge, { backgroundColor: theme.success + '15' }]}>
                      <Text style={[styles.currentBadgeText, { color: theme.success }]}>Current</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.deviceTime, { color: theme.textSecondary }]}>
                  {index === 0 ? 'Active now' : `Logged in on ${session.timestamp}`}
                </Text>
              </View>
              <Pressable style={[styles.logoutBtn, { backgroundColor: theme.error + '10' }]}>
                <SignOut size={18} color={theme.error} weight="bold" />
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
    borderBottomWidth: 1,
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
    ...Typography.H2,
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    ...Typography.Caption,
    fontSize: 13,
    paddingLeft: 40,
    opacity: 0.6,
  },
  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    marginBottom: 32,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  onlineIndicator: {
    position: 'absolute',
    right: 1,
    bottom: 1,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    ...Typography.H2,
    fontSize: 18,
    fontWeight: '800',
  },
  profileEmail: {
    ...Typography.BodyRegular,
    fontSize: 14,
    opacity: 0.7,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    ...Typography.H3,
    fontSize: 16,
    fontWeight: '700',
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  deviceList: {
    gap: 0,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  deviceIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceInfo: {
    flex: 1,
    gap: 4,
  },
  deviceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deviceName: {
    ...Typography.H3,
    fontSize: 16,
    fontWeight: '700',
  },
  currentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  currentBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  deviceTime: {
    ...Typography.Caption,
    fontSize: 13,
    opacity: 0.6,
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

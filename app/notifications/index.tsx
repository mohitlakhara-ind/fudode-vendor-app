import React from 'react';
import { StyleSheet, View, ScrollView, Pressable, Platform, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretLeft, X, ShieldCheck, ThumbsUp } from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';

const NotificationCard = ({ 
  icon: Icon, 
  iconColor, 
  iconBg, 
  title, 
  subtitle, 
  actionLabel, 
  onAction, 
  onClose 
}: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.card, { backgroundColor: theme.surfaceSecondary }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconWrapper, { backgroundColor: iconBg }]}>
          <Icon size={24} color={iconColor} weight="fill" />
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <X size={20} color="#999" weight="bold" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.cardBody}>
        <ThemedText style={[styles.cardTitle, { color: theme.text }]}>{title}</ThemedText>
        <ThemedText style={[styles.cardSubtitle, { color: theme.textSecondary }]}>{subtitle}</ThemedText>
        
        <TouchableOpacity onPress={onAction} style={styles.actionBtn}>
          <ThemedText style={styles.actionText}>{actionLabel}</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'ios' ? 0 : 10), backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <CaretLeft size={28} color={theme.text} weight="bold" />
        </Pressable>
        <ThemedText style={[styles.headerTitle, { color: theme.text }]}>Notifications</ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <NotificationCard 
          icon={ShieldCheck}
          iconColor="#3B82F6"
          iconBg="rgba(59, 130, 246, 0.1)"
          title="Check your contact details"
          subtitle="Avoid unauthorised access"
          actionLabel="CHECK NOW"
          onAction={() => console.log('Check contact')}
          onClose={() => console.log('Close security notification')}
        />

        <NotificationCard 
          icon={ThumbsUp}
          iconColor="#2DD4BF"
          iconBg="rgba(45, 212, 191, 0.1)"
          title="We value your feedback"
          subtitle="How can we improve?"
          actionLabel="Tell us"
          onAction={() => console.log('Tell us')}
          onClose={() => console.log('Close feedback notification')}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 16,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 120,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    padding: 4,
  },
  cardBody: {
    gap: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF',
    lineHeight: 28,
  },
  cardSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#999',
    lineHeight: 22,
    marginBottom: 16,
  },
  actionBtn: {
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#3B82F6',
    textTransform: 'uppercase',
  },
});

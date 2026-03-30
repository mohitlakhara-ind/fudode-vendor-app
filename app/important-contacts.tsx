import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  CaretLeft,
  Users,
  Phone,
  PencilSimple,
  ArrowRight,
} from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';

const SECTION_SPACING = 20;

const ContactRow = ({ label, number }: { label: string; number: string }) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={styles.contactRow}>
      <View style={styles.contactInfo}>
        <Text style={[styles.contactLabel, { color: theme.textSecondary }]}>{label}</Text>
        <Text style={[styles.contactNumber, { color: theme.text }]}>{number}</Text>
      </View>
      <Pressable style={styles.editIcon}>
        <PencilSimple size={20} color={theme.info} weight="regular" />
      </Pressable>
    </View>
  );
};

export default function ImportantContactsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <CaretLeft size={28} color={theme.text} weight="bold" />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Important contacts</Text>
        </View>
        <Pressable>
          <Text style={[styles.headerLink, { color: theme.info }]}>View permissions</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Reminder Numbers Section */}
        <View style={[styles.card, { borderColor: theme.border + '20', backgroundColor: 'transparent' }]}>
          <View style={styles.cardHeader}>
            <Users size={20} color={theme.text} weight="regular" />
            <Text style={[styles.cardTitle, { color: theme.text }]}>Order reminder numbers</Text>
          </View>
          <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
            Should always be available for Fudode to reach out for live order support and order reminders
          </Text>
          
          <View style={styles.cardDivider} />
          
          <ContactRow label="Order reminder number #1" number="+91-9376273686" />
          <View style={[styles.rowDivider, { backgroundColor: theme.border + '10' }]} />
          <ContactRow label="Order reminder number #2" number="+91-9376273686" />
        </View>

        <View style={{ height: SECTION_SPACING }} />

        {/* Restaurant Page Number Section */}
        <View style={[styles.card, { borderColor: theme.border + '20', backgroundColor: 'transparent' }]}>
          <View style={styles.cardHeader}>
            <Phone size={20} color={theme.text} weight="regular" />
            <Text style={[styles.cardTitle, { color: theme.text }]}>Restaurant page number</Text>
          </View>
          <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
            Number for Fudode customers to call your restaurant
          </Text>
          
          <View style={styles.cardDivider} />
          
          <ContactRow label="" number="+91-9376273686" />
        </View>

        <View style={{ height: SECTION_SPACING }} />

        {/* Manage Staff Link */}
        <Pressable 
          onPress={() => router.push('/contact-details')}
          style={[styles.linkWrapper, { borderColor: theme.border + '20' }]}
        >
          <Text style={[styles.linkText, { color: theme.info }]}>Manage contact details for your staff</Text>
          <ArrowRight size={18} color={theme.info} weight="bold" />
        </Pressable>
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
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    ...Typography.H1,
    fontSize: 22,
  },
  headerLink: {
    ...Typography.H3,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    ...Typography.H2,
    fontSize: 16,
    fontWeight: '700',
  },
  cardSubtitle: {
    ...Typography.Caption,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
  },
  cardDivider: {
    height: 1,
    marginTop: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  contactInfo: {
    gap: 4,
  },
  contactLabel: {
    ...Typography.Caption,
    fontSize: 12,
    fontWeight: '600',
  },
  contactNumber: {
    ...Typography.H2,
    fontSize: 17,
    fontWeight: '700',
  },
  editIcon: {
    padding: 4,
  },
  rowDivider: {
    height: 1,
  },
  linkWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderWidth: 1,
    borderRadius: 12,
  },
  linkText: {
    ...Typography.H3,
    fontSize: 15,
    fontWeight: '600',
  },
});

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
  CaretRight,
  PencilSimple,
} from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';

const SECTION_SPACING = 24;

const RoleSectionHeader = ({ title }: { title: string }) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  return (
    <View style={[styles.roleSectionHeader, { backgroundColor: theme.surfaceSecondary + '30' }]}>
      <Text style={[styles.roleSectionTitle, { color: theme.text }]}>{title}</Text>
    </View>
  );
};

export default function StaffScreen() {
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
          <Text style={[styles.headerTitle, { color: theme.text }]}>Contact details</Text>
        </View>
        <Pressable>
          <Text style={[styles.headerLink, { color: theme.info }]}>View permissions</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Owner Section */}
        <RoleSectionHeader title="Owner" />
        <View style={styles.sectionContent}>
          <View style={[styles.ownerCard, { backgroundColor: theme.surfaceSecondary + '50' }]}>
            <View style={styles.ownerCardTop}>
              <View style={styles.ownerInfoRow}>
                <Image
                  source={require('@/assets/images/react-logo.png')}
                  style={[styles.avatar, { borderColor: theme.primary, borderWidth: 1 }]}
                />
                <View style={styles.ownerInfo}>
                  <Text style={[styles.ownerName, { color: theme.text }]}>Sunil Lalwani</Text>
                  <Text style={[styles.ownerPhone, { color: theme.textSecondary }]}>+91-9376273686</Text>
                  <Text style={[styles.ownerEmail, { color: theme.textSecondary }]}>lsunil96@gmail.com</Text>
                </View>
              </View>
              <Pressable style={styles.editBtn}>
                <PencilSimple size={20} color={theme.info} weight="regular" />
              </Pressable>
            </View>
            
            <Pressable 
              onPress={() => router.push('/sessions')}
              style={styles.sessionsLink}
            >
              <Text style={[styles.sessionsLinkText, { color: theme.textSecondary }]}>
                Logged in 3 devices 
              </Text>
              <CaretRight size={14} color={theme.info} weight="bold" />
            </Pressable>
          </View>
        </View>

        <View style={{ height: SECTION_SPACING }} />

        {/* Manager Section */}
        <RoleSectionHeader title="Manager" />
        <View style={styles.emptySectionContent}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No one added as manager yet. 
            <Text 
              onPress={() => router.push('/invite-user')} 
              style={[styles.inviteLink, { color: theme.info }]}
            > Invite someone now</Text>
          </Text>
        </View>

        <View style={{ height: SECTION_SPACING }} />

        {/* Staff Section */}
        <RoleSectionHeader title="Staff" />
        <View style={styles.emptySectionContent}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No one added as staff yet. 
            <Text 
              onPress={() => router.push('/invite-user')} 
              style={[styles.inviteLink, { color: theme.info }]}
            > Invite someone now</Text>
          </Text>
        </View>
      </ScrollView>

      {/* Floating Invite Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable 
          onPress={() => router.push('/invite-user')}
          style={[styles.inviteBtn, { backgroundColor: theme.info }]}
        >
          <Text style={styles.inviteBtnText}>Invite user</Text>
        </Pressable>
      </View>
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
    justifyContent: 'space-between',
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
    paddingTop: 16,
  },
  roleSectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 8,
  },
  roleSectionTitle: {
    ...Typography.H2,
    fontSize: 17,
    fontWeight: '700',
  },
  sectionContent: {
    paddingHorizontal: 16,
  },
  ownerCard: {
    borderRadius: 20,
    padding: 16,
  },
  ownerCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  ownerInfoRow: {
    flexDirection: 'row',
    gap: 16,
    flex: 1,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#333',
  },
  ownerInfo: {
    flex: 1,
    gap: 2,
  },
  ownerName: {
    ...Typography.H2,
    fontSize: 18,
    fontWeight: '700',
  },
  ownerPhone: {
    ...Typography.BodyRegular,
    fontSize: 14,
    opacity: 0.8,
  },
  ownerEmail: {
    ...Typography.BodyRegular,
    fontSize: 14,
    opacity: 0.8,
  },
  editBtn: {
    padding: 4,
  },
  sessionsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingLeft: 80, // Offset for avatar
    gap: 4,
  },
  sessionsLinkText: {
    ...Typography.Caption,
    fontSize: 13,
    fontWeight: '600',
  },
  emptySectionContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  emptyText: {
    ...Typography.BodyRegular,
    fontSize: 14,
    lineHeight: 20,
  },
  inviteLink: {
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  inviteBtn: {
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    width: 140,
  },
  inviteBtnText: {
    ...Typography.H3,
    color: '#FFF',
    fontWeight: '700',
  },
});

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
  const { colorScheme, isDark } = useAppTheme();
  const theme = Colors[colorScheme];
  return (
    <View style={[styles.roleSectionHeader, { backgroundColor: isDark ? theme.surfaceSecondary + '40' : theme.surfaceSecondary + '10', borderBottomWidth: 1, borderBottomColor: theme.border + '15' }]}>
      <Text style={[styles.roleSectionTitle, { color: theme.text }]}>{title}</Text>
    </View>
  );
};

export default function StaffScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme, isDark } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: theme.surface, borderBottomColor: theme.border + '26' }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <CaretLeft size={24} color={theme.text} weight="bold" />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Contact Details</Text>
        </View>
        <Pressable style={styles.headerRightAction}>
          <Text style={[styles.headerLink, { color: theme.info }]}>View Permissions</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Owner Section */}
        <RoleSectionHeader title="Owner" />
        <View style={styles.sectionContent}>
          <View style={[styles.ownerCard, { backgroundColor: theme.surface, borderColor: theme.border + '20', borderWidth: 1 }]}>
            <View style={styles.ownerCardTop}>
              <View style={styles.ownerInfoRow}>
                <View style={[styles.avatarContainer, { backgroundColor: theme.primary + '10' }]}>
                  <Image
                    source={require('@/assets/images/icon.png')}
                    style={styles.avatar}
                  />
                  <View style={[styles.onlineIndicator, { backgroundColor: theme.success, borderColor: theme.background }]} />
                </View>
                <View style={styles.ownerInfo}>
                  <Text style={[styles.ownerName, { color: theme.text }]}>Sunil Lalwani</Text>
                  <View style={styles.infoBadgeRow}>
                    <Text style={[styles.ownerPhone, { color: theme.textSecondary }]}>+91 93762 73686</Text>
                    <View style={[styles.dot, { backgroundColor: theme.textSecondary + '40' }]} />
                    <Text style={[styles.ownerEmail, { color: theme.textSecondary }]}>lsunil96@gmail.com</Text>
                  </View>
                </View>
              </View>
              <Pressable style={[styles.editBtn, { backgroundColor: theme.surfaceSecondary + '40' }]}>
                <PencilSimple size={20} color={theme.textSecondary} weight="regular" />
              </Pressable>
            </View>
            
            <View style={[styles.divider, { backgroundColor: theme.border + '10' }]} />

            <Pressable 
              onPress={() => router.push('/sessions')}
              style={styles.sessionsLink}
            >
              <View style={styles.sessionsLeft}>
                <Text style={[styles.sessionsLinkText, { color: theme.textSecondary }]}>
                  Active Sessions
                </Text>
                <View style={[styles.sessionBadge, { backgroundColor: theme.info + '15' }]}>
                  <Text style={[styles.sessionBadgeText, { color: theme.info }]}>3 Devices</Text>
                </View>
              </View>
              <CaretRight size={16} color={theme.textSecondary} weight="bold" />
            </Pressable>
          </View>
        </View>

        <View style={{ height: SECTION_SPACING }} />

        {/* Manager Section */}
        <RoleSectionHeader title="Manager" />
        <View style={styles.sectionContent}>
          <View style={[styles.emptyStateCard, { backgroundColor: theme.surface, borderStyle: 'dashed', borderColor: theme.border + '40', borderWidth: 1.5 }]}>
            <View style={[styles.emptyIconBg, { backgroundColor: theme.info + '10' }]}>
              <Text style={{ fontSize: 24 }}>👤</Text>
            </View>
            <Text style={[styles.emptyStateTitle, { color: theme.text }]}>No manager assigned</Text>
            <Text style={[styles.emptyStateDesc, { color: theme.textSecondary }]}>
              Managers can handle orders, update inventory, and view analytics.
            </Text>
            <Pressable 
              onPress={() => router.push('/invite-user')}
              style={[styles.inlineInviteBtn, { borderColor: theme.info, borderWidth: 1 }]}
            >
              <Text style={[styles.inlineInviteText, { color: theme.info }]}>Invite Manager</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ height: SECTION_SPACING }} />

        {/* Staff Section */}
        <RoleSectionHeader title="Staff" />
        <View style={styles.sectionContent}>
          <View style={[styles.emptyStateCard, { backgroundColor: theme.surface, borderStyle: 'dashed', borderColor: theme.border + '40', borderWidth: 1.5 }]}>
            <View style={[styles.emptyIconBg, { backgroundColor: theme.info + '10' }]}>
              <Text style={{ fontSize: 24 }}>🤝</Text>
            </View>
            <Text style={[styles.emptyStateTitle, { color: theme.text }]}>No staff added</Text>
            <Text style={[styles.emptyStateDesc, { color: theme.textSecondary }]}>
              Staff members can process orders and assist in daily operations.
            </Text>
            <Pressable 
              onPress={() => router.push('/invite-user')}
              style={[styles.inlineInviteBtn, { borderColor: theme.info, borderWidth: 1 }]}
            >
              <Text style={[styles.inlineInviteText, { color: theme.info }]}>Invite Staff</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Floating Invite Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable 
          onPress={() => router.push('/invite-user')}
          style={[styles.inviteBtn, { backgroundColor: theme.info }]}
        >
          <Text style={[styles.inviteBtnText, { color: isDark ? '#000' : '#FFF' }]}>Invite user</Text>
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
    paddingBottom: 20,
    borderBottomWidth: 1,
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
    ...Typography.H2,
    fontSize: 20,
    fontWeight: '700',
  },
  headerRightAction: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  headerLink: {
    ...Typography.H3,
    fontSize: 14,
    fontWeight: '700',
  },
  scrollContent: {
    paddingTop: 8,
  },
  roleSectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 4,
  },
  roleSectionTitle: {
    ...Typography.H3,
    fontSize: 15,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.6,
  },
  sectionContent: {
    paddingHorizontal: 16,
  },
  ownerCard: {
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
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
  avatarContainer: {
    position: 'relative',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicator: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  ownerInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  ownerName: {
    ...Typography.H2,
    fontSize: 20,
    fontWeight: '800',
  },
  infoBadgeRow: {
    flexDirection: 'column',
    gap: 2,
  },
  ownerPhone: {
    ...Typography.BodyRegular,
    fontSize: 14,
    fontWeight: '500',
  },
  ownerEmail: {
    ...Typography.BodyRegular,
    fontSize: 14,
    opacity: 0.7,
  },
  dot: {
    display: 'none', // Removed dot for column layout
  },
  editBtn: {
    padding: 8,
    borderRadius: 12,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  sessionsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  sessionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sessionsLinkText: {
    ...Typography.Caption,
    fontSize: 14,
    fontWeight: '600',
  },
  sessionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  sessionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyStateCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  emptyStateTitle: {
    ...Typography.H3,
    fontSize: 17,
    fontWeight: '700',
  },
  emptyStateDesc: {
    ...Typography.BodyRegular,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.7,
    paddingHorizontal: 20,
  },
  inlineInviteBtn: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
  },
  inlineInviteText: {
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: 'transparent',
  },
  inviteBtn: {
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  inviteBtnText: {
    ...Typography.H2,
    fontSize: 18,
    fontWeight: '800',
  },
});

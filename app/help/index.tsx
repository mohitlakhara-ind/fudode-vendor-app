import { FeedbackSheet, TechnicalIssueSheet } from '@/components/help/HelpBottomSheets';
import { GlassView } from '@/components/ui/GlassView';
import { Colors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import {
  Bell,
  Bug,
  CaretLeft,
  CaretRight,
  ChatDots,
  MagnifyingGlass,
  NotePencil,
  Plus,
  Power,
  Storefront,
  Ticket,
  Translate,
  Wallet
} from 'phosphor-react-native';
import React from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const CategoryItem = ({ icon: Icon, title, subtitle, onPress }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.categoryItem,
        { borderBottomColor: theme.border + '15' },
        pressed && { backgroundColor: theme.surfaceSecondary + '50' }
      ]}
    >
      <View style={styles.categoryLeft}>
        <View
          style={[styles.iconContainer, { backgroundColor: theme.surfaceSecondary }]}
        >
          <Icon size={24} color={theme.text} weight="regular" />
        </View>
        <View style={styles.categoryText}>
          <Text style={[styles.categoryTitle, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.categorySubtitle, { color: theme.textSecondary }]}>
            {subtitle}
          </Text>
        </View>
      </View>
      <CaretRight size={18} color={theme.textSecondary} weight="bold" />
    </Pressable>
  );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Pressable
      onPress={() => setExpanded(!expanded)}
      style={[styles.faqItem, { backgroundColor: theme.surface + '50', borderColor: theme.border + '20' }]}
    >
      <View style={styles.faqHeader}>
        <Text style={[styles.faqQuestion, { color: theme.text }]}>{question}</Text>
        <Plus
          size={18}
          color={theme.primary}
          weight="bold"
          style={{ transform: [{ rotate: expanded ? '45deg' : '0deg' }] }}
        />
      </View>
      {expanded && (
        <Text style={[styles.faqAnswer, { color: theme.textSecondary }]}>{answer}</Text>
      )}
    </Pressable>
  );
};

export default function HelpCenterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  const [techSheetVisible, setTechSheetVisible] = React.useState(false);
  const [feedbackSheetVisible, setFeedbackSheetVisible] = React.useState(false);

  const categories = [
    {
      id: 'status',
      title: 'Outlet online / offline status',
      subtitle: 'Issues changing status or scheduling',
      icon: Power,
      type: 'sheet'
    },
    {
      id: 'orders',
      title: 'Order related issues',
      subtitle: 'Cancellations, delivery problems, rider issues',
      icon: Bell,
      type: 'screen',
      route: '/orders/history'
    },
    {
      id: 'restaurant',
      title: 'Restaurant Settings',
      subtitle: 'Timings, FSSAI, bank details, location',
      icon: Storefront
    },
    {
      id: 'menu',
      title: 'Menu & Prices',
      subtitle: 'Items, photos, prices, charges',
      icon: NotePencil
    },
    {
      id: 'payments',
      title: 'Payments & Payouts',
      subtitle: 'Statement of account, invoices, payout status',
      icon: Wallet
    },
    {
      id: 'tech',
      title: 'Report a technical issue',
      subtitle: 'App crashing, UI bugs, notification issues',
      icon: Bug,
      type: 'sheet'
    },
    {
      id: 'feedback',
      title: 'Send Feedback',
      subtitle: 'Help us improve the vendor experience',
      icon: ChatDots,
      type: 'sheet'
    }
  ];

  const faqs = [
    {
      question: "How do I change my payout account?",
      answer: "Go to Restaurant Settings > Bank Details and upload your updated bank documents for verification."
    },
    {
      question: "Why is my outlet showing offline?",
      answer: "Check if you have any overdue orders or if your FSSAI license has expired. You can also manually toggle status in the dashboard."
    },
    {
      question: "How to report a wrong item cancellation?",
      answer: "Select the order from Order History and click on 'Dispute Cancellation' to raise a ticket."
    }
  ];

  const handlePress = (cat: any) => {
    if (cat.type === 'sheet') {
      if (cat.id === 'tech' || cat.id === 'status') setTechSheetVisible(true);
      if (cat.id === 'feedback') setFeedbackSheetVisible(true);
    } else if (cat.type === 'screen' && cat.route) {
      router.push(cat.route as any);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <CaretLeft size={28} color={theme.text} weight="bold" />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Help centre</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.headerIcon}>
            <Translate size={24} color={theme.primary} weight="fill" />
          </Pressable>
          <Pressable style={styles.headerIcon}>
            <Ticket size={24} color={theme.primary} weight="fill" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchSection}>
          <Text style={[styles.howCanHelp, { color: theme.text }]}>How can we help you</Text>

          <View style={[styles.searchBar, { backgroundColor: theme.surfaceSecondary + '80', borderColor: theme.border + '20' }]}>
            <MagnifyingGlass size={20} color={theme.textSecondary} />
            <TextInput
              placeholder="Search by issue"
              placeholderTextColor={theme.textSecondary}
              style={[styles.searchInput, { color: theme.text }]}
            />
          </View>
        </View>

        <View style={styles.categoryList}>
          {categories.map((cat) => (
            <CategoryItem
              key={cat.id}
              icon={cat.icon}
              title={cat.title}
              subtitle={cat.subtitle}
              onPress={() => handlePress(cat)}
            />
          ))}
        </View>

        {/* FAQs Section */}
        <View style={styles.faqSection}>
          <View style={styles.faqSectionHeader}>
            <Text style={[styles.faqSectionTitle, { color: theme.text }]}>Quick Help & FAQs</Text>
            <Pressable>
              <Text style={[styles.viewAll, { color: theme.primary }]}>View all</Text>
            </Pressable>
          </View>

          <View style={styles.faqList}>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </View>
        </View>

        <View style={styles.contactCard}>
          <View style={[styles.supportCard, { backgroundColor: theme.primary + '15', borderColor: theme.primary + '30' }]}>
            <View style={styles.supportInfo}>
              <Text style={[styles.supportTitle, { color: theme.text }]}>Still need help?</Text>
              <Text style={[styles.supportSubtitle, { color: theme.textSecondary }]}>Our support team is available 24/7</Text>
            </View>
            <Pressable style={[styles.contactButton, { backgroundColor: theme.primary }]}>
              <Text style={styles.contactButtonText}>Contact Support</Text>
            </Pressable>
          </View>
        </View>

      </ScrollView>

      <TechnicalIssueSheet
        visible={techSheetVisible}
        onClose={() => setTechSheetVisible(false)}
        onFinish={(data: any) => {
          console.log('Issue reported:', data);
          setTechSheetVisible(false);
        }}
      />

      <FeedbackSheet
        visible={feedbackSheetVisible}
        onClose={() => setFeedbackSheetVisible(false)}
        onFinish={(msg: string) => {
          console.log('Feedback sent:', msg);
          setFeedbackSheetVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIcon: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchSection: {
    padding: 20,
    paddingTop: 10,
  },
  howCanHelp: {
    ...Typography.H2,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    ...Typography.BodyLarge,
    height: '100%',
  },
  categoryList: {
    marginTop: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    flex: 1,
    gap: 2,
  },
  categoryTitle: {
    ...Typography.H3,
    fontSize: 15,
  },
  categorySubtitle: {
    ...Typography.Caption,
    fontSize: 12,
    lineHeight: 16,
  },
  faqSection: {
    padding: 20,
    marginTop: 20,
  },
  faqSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  faqSectionTitle: {
    ...Typography.H2,
    fontSize: 18,
  },
  viewAll: {
    ...Typography.H3,
    fontSize: 14,
  },
  faqList: {
    gap: 12,
  },
  faqItem: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    ...Typography.H3,
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  faqAnswer: {
    ...Typography.BodyRegular,
    fontSize: 13,
    marginTop: 12,
    lineHeight: 18,
  },
  contactCard: {
    padding: 20,
    marginTop: 10,
  },
  supportCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  supportInfo: {
    flex: 1,
  },
  supportTitle: {
    ...Typography.H2,
    fontSize: 18,
    marginBottom: 4,
  },
  supportSubtitle: {
    ...Typography.Caption,
    fontSize: 12,
  },
  contactButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  contactButtonText: {
    color: '#fff',
    ...Typography.H3,
    fontSize: 13,
  }
});

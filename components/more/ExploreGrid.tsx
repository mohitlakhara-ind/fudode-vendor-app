import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, ScrollView } from 'react-native';
import { 
  FileText, 
  Star, 
  Lightning,
  Storefront,
  NotePencil,
  Users,
  CurrencyInr,
  Bank,
  Receipt,
  Wrench,
  Question,
  Phone,
  ChatDots,
  Bell,
  Globe,
  ShieldCheck,
  IconProps,
  CaretRight
} from 'phosphor-react-native';
import { Colors, Fonts, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2; // 2-column grid for a more premium look

interface GridItemProps {
  label: string;
  icon: React.ElementType<IconProps>;
  onPress?: () => void;
}

const GridItem = ({ label, icon: Icon, onPress }: GridItemProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.itemCard,
        { 
          backgroundColor: theme.surface, 
          borderColor: theme.border,
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }]
        }
      ]} 
      onPress={onPress}
    >
      <View style={[styles.iconBox, { backgroundColor: theme.surfaceSecondary }]}>
        <Icon size={24} weight="bold" color={theme.text} />
      </View>
      <View style={styles.itemContent}>
        <Text style={[styles.itemLabel, { color: theme.text }]}>
          {label}
        </Text>
      </View>
      <CaretRight size={14} color={theme.textSecondary} weight="bold" />
    </Pressable>
  );
};

interface SectionProps {
  title: string;
  items: { label: string; icon: any; action?: string }[];
  onItemPress: (action?: string) => void;
}

const Section = ({ title, items, onItemPress }: SectionProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: theme.textSecondary, fontFamily: Fonts.bold }]}>{title}</Text>
      <View style={styles.grid}>
        {items.map((item, index) => (
          <GridItem 
            key={index} 
            label={item.label} 
            icon={item.icon} 
            onPress={() => onItemPress(item.action)} 
          />
        ))}
      </View>
    </View>
  );
};

export const ExploreGrid = ({ onItemPress }: { onItemPress: (action?: string) => void }) => {
  const sections = [
    {
      title: 'OPERATIONS',
      items: [
        { label: 'Order History', icon: FileText, action: 'order-history' },
        { label: 'Complaints', icon: Star, action: 'complaints' },
        { label: 'Rush in kitchen', icon: Lightning, action: 'rush' },
      ]
    },
    {
      title: 'OUTLET MANAGEMENT',
      items: [
        { label: 'Outlet Info', icon: Storefront, action: 'outlet-info' },
        { label: 'Timings', icon: NotePencil, action: 'timings' },
        { label: 'Contact details', icon: Users, action: 'contact-details' },
      ]
    },
    {
      title: 'ACCOUNTING',
      items: [
        { label: 'Payouts', icon: CurrencyInr, action: 'payout' },
        { label: 'Bank Details', icon: Bank, action: 'bank' },
        { label: 'Tax Settings', icon: Receipt, action: 'taxes' },
      ]
    },
    {
      title: 'SUPPORT',
      items: [
        { label: 'Troubleshoot', icon: Wrench, action: 'troubleshoot' },
        { label: 'Help Centre', icon: Question, action: 'help' },
        { label: 'Call Support', icon: Phone, action: 'call' },
        { label: 'Feedback', icon: ChatDots, action: 'feedback' },
      ]
    },
    {
      title: 'APP SETTINGS',
      items: [
        { label: 'Notifications', icon: Bell, action: 'notifications' },
        { label: 'Communications', icon: ChatDots, action: 'communications' },
        { label: 'Settings', icon: NotePencil, action: 'settings' },
        { label: 'Language', icon: Globe, action: 'language' },
        { label: 'Security', icon: ShieldCheck, action: 'security' },
      ]
    }
  ];

  return (
    <View style={styles.container}>
      {sections.map((section, index) => (
        <Section 
          key={index} 
          title={section.title} 
          items={section.items} 
          onItemPress={onItemPress} 
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 40,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 12,
    letterSpacing: 1.2,
    marginBottom: 16,
    paddingLeft: 4,
    opacity: 0.6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  itemCard: {
    width: (width - 52) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    ...Typography.Caption,
    fontSize: 13,
    fontWeight: '800',
  },
});

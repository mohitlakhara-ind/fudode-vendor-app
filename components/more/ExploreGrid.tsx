import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, ScrollView } from 'react-native';
import { 
  FileText, 
  Star, 
  ChatCircleDots, 
  Question, 
  Lightbulb, 
  NotePencil, 
  CurrencyInr, 
  Files, 
  Receipt,
  ArrowUp,
  IconProps,
  Users,
  Lightning,
  Bell,
  Globe,
  ShieldCheck,
  Storefront,
  Phone,
  ChatDots,
  Briefcase,
  Bank,
  Wrench
} from 'phosphor-react-native';
import { Colors, Fonts, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Separator } from '@/components/ui/Separator';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 3;

interface GridItemProps {
  label: string;
  icon: React.ElementType<IconProps>;
  onPress?: () => void;
  showArrow?: boolean;
}

const GridItem = ({ label, icon: Icon, onPress, showArrow }: GridItemProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <Pressable 
      style={styles.itemContainer} 
      onPress={onPress}
    >
      <View style={[styles.iconBox, { backgroundColor: theme.surface }]}>
        <Icon size={28} weight="light" color={theme.text} />
        {showArrow && (
          <View style={styles.arrowSmall}>
            <ArrowUp size={10} weight="bold" color={theme.primary} />
          </View>
        )}
      </View>
      <Text style={[styles.itemLabel, { color: theme.text }]} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
};

interface SectionProps {
  title: string;
  items: { label: string; icon: any; action?: string; showArrow?: boolean }[];
  onItemPress: (action?: string) => void;
}

const Section = ({ title, items, onItemPress }: SectionProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      <View style={styles.grid}>
        {items.map((item, index) => (
          <GridItem 
            key={index} 
            label={item.label} 
            icon={item.icon} 
            showArrow={item.showArrow}
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
      title: 'Operations',
      items: [
        { label: 'Order history', icon: FileText, action: 'order-history' },
        { label: 'Complaints', icon: Star, action: 'complaints' },
        { label: 'Rush in kitchen', icon: Lightning, action: 'rush' },
      ]
    },
    {
      title: 'Outlet Management',
      items: [
        { label: 'Outlet info', icon: Storefront, action: 'outlet-info' },
        { label: 'Timings', icon: NotePencil, action: 'timings' },
        { label: 'Contact details', icon: Users, action: 'contact-details' },
      ]
    },
    {
      title: 'Accounting',
      items: [
        { label: 'Payouts', icon: CurrencyInr, action: 'payout', showArrow: true },
        { label: 'Bank Details', icon: Bank, action: 'bank' },
        { label: 'Tax Settings', icon: Receipt, action: 'taxes' },
      ]
    },
    {
      title: 'Support & Help',
      items: [
        { label: 'Troubleshoot', icon: Wrench, action: 'troubleshoot' },
        { label: 'Help Centre', icon: Question, action: 'help' },
        { label: 'Call Support', icon: Phone, action: 'call' },
        { label: 'Send Feedback', icon: ChatDots, action: 'feedback' },
      ]
    },
    {
      title: 'App Settings',
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {sections.map((section, index) => (
        <React.Fragment key={index}>
          <Section 
            title={section.title} 
            items={section.items} 
            onItemPress={onItemPress} 
          />
          {index < sections.length - 1 && <Separator marginVertical={8} opacity={0.1} />}
        </React.Fragment>
      ))}
      <View style={{ height: 120 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionContainer: {
    padding: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    ...Typography.H2,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBox: {
    width: ITEM_WIDTH - 12,
    height: ITEM_WIDTH - 12,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  itemLabel: {
    ...Typography.Caption,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  arrowSmall: {
    position: 'absolute',
    top: 10,
    right: 10,
  }
});

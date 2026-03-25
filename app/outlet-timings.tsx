import React, { useState } from 'react';
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
  CaretDown,
  CaretUp,
  Clock,
} from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';
import { PremiumSwitch } from '@/components/ui/PremiumSwitch';
import { TimeOffReasonModal } from '@/components/more/TimeOffReasonModal';
import { RushKitchenModal } from '@/components/more/RushKitchenModal';

const DAYS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const DayRow = ({ day, isExpanded, onToggleExpand, isOpen, onToggleOpen, onEditTime }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.dayCard, { borderColor: isExpanded ? theme.border + '30' : theme.border + '10' }]}>
      <Pressable 
        onPress={onToggleExpand}
        style={styles.dayHeader}
      >
        <View style={styles.dayHeaderLeft}>
          {isExpanded ? (
            <CaretUp size={18} color={theme.text} />
          ) : (
            <CaretDown size={18} color={theme.text} />
          )}
          <Text style={[styles.dayName, { color: theme.text }]}>{day}</Text>
        </View>
        <View style={styles.dayHeaderRight}>
          <Text style={[styles.openStatus, { color: theme.text }]}>{isOpen ? 'Open' : 'Closed'}</Text>
          <PremiumSwitch 
            value={isOpen} 
            onValueChange={onToggleOpen} 
            activeColor={theme.success}
          />
        </View>
      </Pressable>

      {isExpanded && isOpen && (
        <View style={[styles.expandedContent, { borderTopColor: theme.border + '10' }]}>
          <View style={styles.slotContainer}>
            <Text style={[styles.slotLabel, { color: theme.textSecondary }]}>Slot 1</Text>
            <View style={styles.timeRow}>
              <Text style={[styles.timeText, { color: theme.text }]}>11:15 AM  to  10:30 PM</Text>
              <View style={styles.durationBox}>
                <Clock size={14} color={theme.textSecondary} />
                <Text style={[styles.durationText, { color: theme.textSecondary }]}>11 hrs 15 mins</Text>
              </View>
            </View>
            <Pressable 
              onPress={onEditTime}
              style={styles.editTimeBtn}
            >
              <Text style={[styles.editTimeText, { color: theme.info }]}>+ Add / Edit time</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

export default function OutletTimingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  const [expandedDay, setExpandedDay] = useState('Wednesday');
  const [openDays, setOpenDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
  
  const [timeOffVisible, setTimeOffVisible] = useState(false);
  const [rushVisible, setRushVisible] = useState(false);

  const toggleExpand = (day: string) => {
    setExpandedDay(expandedDay === day ? '' : day);
  };

  const toggleOpen = (day: string) => {
    const isCurrentlyOpen = openDays.includes(day);
    if (isCurrentlyOpen) {
      // Prompt for reason if closing
      setTimeOffVisible(true);
    }
    setOpenDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <CaretLeft size={28} color={theme.text} weight="bold" />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Outlet timings</Text>
        </View>
        
        <View style={styles.tabBar}>
          <View style={[styles.tab, { borderBottomColor: theme.info }]}>
            <Text style={[styles.tabText, { color: theme.info }]}>Fudode delivery</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.quickActions}>
          <Pressable 
            onPress={() => setRushVisible(true)}
            style={[styles.quickActionCard, { backgroundColor: theme.surfaceSecondary + '50' }]}
          >
            <Text style={[styles.quickActionTitle, { color: theme.text }]}>Kitchen Rush?</Text>
            <Text style={[styles.quickActionSub, { color: theme.textSecondary }]}>Add extra prep time</Text>
          </Pressable>
          <Pressable 
            onPress={() => setTimeOffVisible(true)}
            style={[styles.quickActionCard, { backgroundColor: theme.surfaceSecondary + '50' }]}
          >
            <Text style={[styles.quickActionTitle, { color: theme.text }]}>Plan Time Off</Text>
            <Text style={[styles.quickActionSub, { color: theme.textSecondary }]}>Schedule closures</Text>
          </Pressable>
        </View>

        <View style={styles.daysList}>
          {DAYS.map((day) => (
            <DayRow 
              key={day}
              day={day}
              isExpanded={expandedDay === day}
              isOpen={openDays.includes(day)}
              onToggleExpand={() => toggleExpand(day)}
              onToggleOpen={() => toggleOpen(day)}
              onEditTime={() => setTimeOffVisible(true)}
            />
          ))}
        </View>
      </ScrollView>

      <TimeOffReasonModal 
        visible={timeOffVisible} 
        onClose={() => setTimeOffVisible(false)} 
        onContinue={(reason) => {
          setTimeOffVisible(false);
          // Handle navigation or next step if needed
        }}
      />

      <RushKitchenModal 
        visible={rushVisible} 
        onClose={() => setRushVisible(false)} 
        onConfirm={(mins) => {
          setRushVisible(false);
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
    backgroundColor: 'transparent',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    ...Typography.H1,
    fontSize: 22,
  },
  tabBar: {
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  tab: {
    paddingVertical: 12,
    borderBottomWidth: 3,
    alignSelf: 'flex-start',
  },
  tabText: {
    ...Typography.H3,
    fontSize: 15,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  quickActionCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    gap: 4,
  },
  quickActionTitle: {
    ...Typography.H3,
    fontSize: 15,
    fontWeight: '700',
  },
  quickActionSub: {
    ...Typography.Caption,
    fontSize: 12,
  },
  daysList: {
    gap: 12,
  },
  dayCard: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  dayHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dayName: {
    ...Typography.H2,
    fontSize: 16,
    fontWeight: '700',
  },
  dayHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  openStatus: {
    ...Typography.H3,
    fontSize: 14,
    fontWeight: '600',
  },
  expandedContent: {
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  slotContainer: {
    gap: 12,
  },
  slotLabel: {
    ...Typography.Caption,
    fontSize: 12,
    fontWeight: '600',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeText: {
    ...Typography.H2,
    fontSize: 17,
    fontWeight: '700',
  },
  durationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  durationText: {
    ...Typography.Caption,
    fontSize: 12,
  },
  editTimeBtn: {
    marginTop: 4,
  },
  editTimeText: {
    ...Typography.H3,
    fontSize: 14,
    fontWeight: '600',
  },
});

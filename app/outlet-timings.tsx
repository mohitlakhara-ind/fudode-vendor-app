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
import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';
import { DateTimePicker } from '@/components/ui/DateTimePicker';

const INITIAL_TIMINGS: Record<string, { open: string, close: string }> = {
  'Monday': { open: '11:15 AM', close: '10:30 PM' },
  'Tuesday': { open: '11:15 AM', close: '10:30 PM' },
  'Wednesday': { open: '11:15 AM', close: '10:30 PM' },
  'Thursday': { open: '11:15 AM', close: '10:30 PM' },
  'Friday': { open: '11:15 AM', close: '10:30 PM' },
  'Saturday': { open: '11:15 AM', close: '10:30 PM' },
  'Sunday': { open: '11:15 AM', close: '10:30 PM' },
};

const DAYS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const DayRow = ({ day, isExpanded, onToggleExpand, isOpen, onToggleOpen, onEditTime, timings }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.dayCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Pressable 
        onPress={onToggleExpand}
        style={styles.dayHeader}
      >
        <View style={styles.dayHeaderLeft}>
          {isExpanded ? (
            <CaretUp size={18} color={theme.text} weight="bold" />
          ) : (
            <CaretDown size={18} color={theme.text} weight="bold" />
          )}
          <ThemedText style={[styles.dayName, { color: theme.text }]}>{day}</ThemedText>
        </View>
        <View style={styles.dayHeaderRight}>
          <ThemedText style={[styles.openStatus, { color: isOpen ? theme.success : theme.textSecondary }]}>{isOpen ? 'Open' : 'Closed'}</ThemedText>
          <PremiumSwitch 
            value={isOpen} 
            onValueChange={onToggleOpen} 
            activeColor={theme.success}
          />
        </View>
      </Pressable>

      {isExpanded && isOpen && (
        <View style={[styles.expandedContent, { borderTopColor: theme.border }]}>
          <View style={styles.slotContainer}>
            <ThemedText style={[styles.slotLabel, { color: theme.textSecondary }]}>Slot 1</ThemedText>
            <View style={styles.timeRow}>
              <ThemedText style={[styles.timeText, { color: theme.text }]}>
                {timings.open}  to  {timings.close}
              </ThemedText>
              <View style={styles.durationBox}>
                <Clock size={16} color={theme.textSecondary} weight="bold" />
                <ThemedText style={[styles.durationText, { color: theme.textSecondary }]}>Approx. 11 hrs</ThemedText>
              </View>
            </View>
            <View style={styles.editActionsRow}>
              <Pressable 
                onPress={() => onEditTime('open')}
                style={styles.editTimeBtn}
              >
                <ThemedText style={[styles.editTimeText, { color: theme.primary }]}>+ Edit Open Time</ThemedText>
              </Pressable>
              <Pressable 
                onPress={() => onEditTime('close')}
                style={styles.editTimeBtn}
              >
                <ThemedText style={[styles.editTimeText, { color: theme.primary }]}>+ Edit Close Time</ThemedText>
              </Pressable>
            </View>
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
  const [timings, setTimings] = useState(INITIAL_TIMINGS);
  
  const [timeOffVisible, setTimeOffVisible] = useState(false);
  const [rushVisible, setRushVisible] = useState(false);

  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time' | 'datetime'>('time');
  const [editingContext, setEditingContext] = useState<{ day: string, type: 'open' | 'close' | 'timeoff' } | null>(null);

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

  const handleEditTime = (day: string, type: 'open' | 'close') => {
    setPickerMode('time');
    setEditingContext({ day, type });
    setPickerVisible(true);
  };

  const handlePickerConfirm = (date: Date) => {
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    
    if (editingContext) {
      if (editingContext.type === 'open' || editingContext.type === 'close') {
        setTimings(prev => ({
          ...prev,
          [editingContext.day]: {
            ...prev[editingContext.day],
            [editingContext.type]: timeStr
          }
        }));
      }
    }
    setPickerVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10, borderBottomColor: theme.border }]}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <CaretLeft size={28} color={theme.text} weight="bold" />
          </Pressable>
          <ThemedText style={[styles.headerTitle, { color: theme.text, fontFamily: Fonts.rounded }]}>Outlet timings</ThemedText>
        </View>
        
        <View style={styles.tabBar}>
          <View style={[styles.tab, { borderBottomColor: theme.primary }]}>
            <ThemedText style={[styles.tabText, { color: theme.primary }]}>Fudode delivery</ThemedText>
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
            style={[styles.quickActionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
          >
            <ThemedText style={[styles.quickActionTitle, { color: theme.text }]}>Kitchen Rush?</ThemedText>
            <ThemedText style={[styles.quickActionSub, { color: theme.textSecondary }]}>Add extra prep time</ThemedText>
          </Pressable>
          <Pressable 
            onPress={() => {
              setPickerMode('datetime');
              setEditingContext({ day: '', type: 'timeoff' });
              setPickerVisible(true);
            }}
            style={[styles.quickActionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
          >
            <ThemedText style={[styles.quickActionTitle, { color: theme.text }]}>Plan Time Off</ThemedText>
            <ThemedText style={[styles.quickActionSub, { color: theme.textSecondary }]}>Schedule closures</ThemedText>
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
              onEditTime={(type: 'open' | 'close') => handleEditTime(day, type)}
              timings={timings[day]}
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

      <DateTimePicker 
        visible={pickerVisible}
        mode={pickerMode}
        onClose={() => setPickerVisible(false)}
        onConfirm={handlePickerConfirm}
        title={editingContext?.type === 'open' ? 'Outlet Opening Time' : editingContext?.type === 'close' ? 'Outlet Closing Time' : 'Plan Time Off'}
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
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    ...Typography.H1,
    fontSize: 24,
  },
  tabBar: {
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 14,
    borderBottomWidth: 3,
    alignSelf: 'flex-start',
  },
  tabText: {
    ...Typography.H3,
    fontSize: 15,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 20,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickActionCard: {
    flex: 1,
    padding: 20,
    borderRadius: 24,
    gap: 6,
    borderWidth: 1.5,
  },
  quickActionTitle: {
    ...Typography.H3,
    fontSize: 16,
    fontWeight: '800',
  },
  quickActionSub: {
    ...Typography.Caption,
    fontSize: 12,
    fontWeight: '600',
  },
  daysList: {
    gap: 16,
  },
  dayCard: {
    borderRadius: 24,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  dayHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  dayName: {
    ...Typography.H2,
    fontSize: 17,
    fontWeight: '800',
  },
  dayHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  openStatus: {
    ...Typography.H3,
    fontSize: 14,
    fontWeight: '800',
  },
  expandedContent: {
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1.5,
  },
  slotContainer: {
    gap: 14,
  },
  slotLabel: {
    ...Typography.Caption,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeText: {
    ...Typography.H2,
    fontSize: 16,
    fontWeight: '800',
  },
  durationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  durationText: {
    ...Typography.Caption,
    fontSize: 12,
    fontWeight: '600',
  },
  editTimeBtn: {
    marginTop: 8,
    marginRight: 16,
  },
  editTimeText: {
    ...Typography.H3,
    fontSize: 14,
    fontWeight: '800',
  },
  editActionsRow: {
    flexDirection: 'row',
  },
});

import { Colors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import {
  CalendarBlank,
  CaretDown,
  CaretRight,
  Clock,
  Info,
  Lightning,
  MapPin,
  Receipt
} from 'phosphor-react-native';
import React, { useState, useMemo } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GlassView } from '../ui/GlassView';
import { ModalWrapper } from '../ui/ModalWrapper';
import { RadioButton } from '../ui/RadioButton';
import { WheelPicker } from '../ui/WheelPicker';

const { width } = Dimensions.get('window');

// --- Reusable Option Item for Sheets ---
const SheetOption = ({ label, icon, selected, onPress, showArrow = true }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.optionItem,
        { borderBottomColor: theme.border + '10' }
      ]}
    >
      <View style={styles.optionLeft}>
        {icon && <View style={styles.optionIcon}>{icon}</View>}
        <Text style={[styles.optionLabel, { color: theme.text }]}>{label}</Text>
      </View>
      <View style={styles.optionRight}>
        {selected !== undefined ? (
          <RadioButton selected={selected} onPress={onPress} size={22} />
        ) : (
          showArrow && <CaretRight size={18} color={theme.textSecondary} weight="bold" />
        )}
      </View>
    </Pressable>
  );
};

// --- Offline Timing Sheet ---
export const OfflineTimingSheet = ({ visible, onClose, onSelect }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  return (
    <ModalWrapper visible={visible} onClose={onClose} title="Go offline">
      <View style={styles.sheetContent}>
        <Text style={[styles.sheetSubtitle, { color: theme.textSecondary }]}>
          When do you want to go offline?
        </Text>
        <SheetOption
          label="Go offline now"
          icon={<Clock size={24} color={theme.text} />}
          onPress={() => onSelect('now')}
        />
        <SheetOption
          label="Schedule off"
          icon={<CalendarBlank size={24} color={theme.text} />}
          onPress={() => onSelect('schedule')}
        />
      </View>
    </ModalWrapper>
  );
};

// --- Reopen Timing Sheet ---
const REOPEN_OPTIONS = [
  { id: '30m', label: 'In 30 minutes' },
  { id: '2h', label: 'In 2 hours' },
  { id: 'tomorrow', label: 'Until tomorrow online time' },
  { id: 'manual', label: 'Until I switch to online' },
  { id: 'custom', label: 'Custom time' },
];

export const ReopenTimingSheet = ({ visible, onClose, onSelect }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const [selected, setSelected] = useState('manual');

  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title="Open again"
      footer={
        <Pressable
          style={[styles.confirmBtn, { backgroundColor: theme.primary }]}
          onPress={() => onSelect(selected)}
        >
          <Text style={[styles.confirmBtnText, { color: '#000' }]}>Continue</Text>
        </Pressable>
      }
    >
      <View style={styles.sheetContent}>
        <Text style={[styles.sheetSubtitle, { color: theme.textSecondary }]}>
          When do you want to open again?
        </Text>
        {REOPEN_OPTIONS.map(opt => (
          <SheetOption
            key={opt.id}
            label={opt.label}
            selected={selected === opt.id}
            onPress={() => setSelected(opt.id)}
          />
        ))}
      </View>
    </ModalWrapper>
  );
};

// --- Offline Reason Sheet ---
const REASONS = [
  { id: 'stock', label: 'Item out of stock', icon: <Receipt size={22} /> },
  { id: 'kitchen', label: 'Kitchen is full', icon: <Lightning size={22} /> },
  { id: 'timings', label: 'Incorrect restaurant timings', icon: <Clock size={22} /> },
  { id: 'menu', label: 'Issues with menu', icon: <Info size={22} /> },
  { id: 'staff', label: 'Delivery staff unavailable', icon: <MapPin size={22} /> },
];

export const OfflineReasonSheet = ({ visible, onClose, onSelect }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <ModalWrapper visible={visible} onClose={onClose} title="Reason">
      <View style={styles.sheetContent}>
        <Text style={[styles.sheetSubtitle, { color: theme.textSecondary }]}>
          Why are you going offline?
        </Text>
        {REASONS.map(reason => (
          <SheetOption
            key={reason.id}
            label={reason.label}
            icon={reason.icon}
            onPress={() => onSelect(reason.id)}
          />
        ))}
      </View>
    </ModalWrapper>
  );
};

// --- Schedule Timing Sheet ---
export const ScheduleTimingSheet = ({ visible, onClose, onConfirm }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  const [startTime, setStartTime] = useState('11:00 am');
  const [startDate, setStartDate] = useState('Today');
  const [endTime, setEndTime] = useState('06:00 pm');
  const [endDate, setEndDate] = useState('Today');

  const [showPicker, setShowPicker] = useState(false);
  const [pickerType, setPickerType] = useState<'start' | 'end'>('start');

  const handleOpenPicker = (type: 'start' | 'end') => {
    setPickerType(type);
    setShowPicker(true);
  };

  const handleSelect = (date: string, time: string) => {
    if (pickerType === 'start') {
      setStartDate(date);
      setStartTime(time);
    } else {
      setEndDate(date);
      setEndTime(time);
    }
    setShowPicker(false);
  };

  return (
    <>
      <ModalWrapper
        visible={visible}
        onClose={onClose}
        title="Scheduled offline"
        footer={
          <Pressable
            style={[styles.confirmBtn, { backgroundColor: theme.primary }]}
            onPress={onConfirm}
          >
            <Text style={[styles.confirmBtnText, { color: '#000' }]}>Confirm Schedule</Text>
          </Pressable>
        }
      >
        <View style={styles.sheetContent}>
          <Text style={[styles.sheetSubtitle, { color: theme.textSecondary }]}>
            Select your offline duration
          </Text>

          <View style={styles.timeCardContainer}>
            <TimePickerCard
              title="Starts"
              date={startDate}
              time={startTime}
              onPress={() => handleOpenPicker('start')}
            />
            <View style={styles.connectorContainer}>
              <View style={[styles.connector, { backgroundColor: theme.border + '20' }]} />
            </View>
            <TimePickerCard
              title="Ends"
              date={endDate}
              time={endTime}
              onPress={() => handleOpenPicker('end')}
            />
          </View>
        </View>
      </ModalWrapper>

      <TimeSelectionSheet
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        selectedDate={pickerType === 'start' ? startDate : endDate}
        selectedTime={pickerType === 'start' ? startTime : endTime}
        onSelect={handleSelect}
        title={pickerType === 'start' ? "Select start date & time" : "Select end date & time"}
      />
    </>
  );
};

// --- Time Selection Sheet ---
export const TimeSelectionSheet = ({ visible, onClose, selectedDate, selectedTime, onSelect, title }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  const [tmpDate, setTmpDate] = useState(selectedDate);
  const [tmpTime, setTmpTime] = useState(selectedTime);

  React.useEffect(() => {
    if (visible) {
      setTmpDate(selectedDate);
      setTmpTime(selectedTime);
    }
  }, [visible, selectedDate, selectedTime]);

  // Reduced set for better UI density
  const DATES = ['Today', 'Tomorrow', '23 Mar', '24 Mar', '25 Mar'];

  const allTimes = useMemo(() => Array.from({ length: 48 }, (_, i) => {
    const h = Math.floor(i / 2);
    const m = i % 2 === 0 ? '00' : '30';
    const ampm = h >= 12 ? 'pm' : 'am';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH}:${m} ${ampm}`;
  }), []);

  const times = useMemo(() => {
    if (tmpDate !== 'Today') return allTimes;
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    
    return allTimes.filter((timeStr: string) => {
      const [time, period] = timeStr.split(' ');
      let [h, m] = time.split(':').map(Number);
      if (period === 'pm' && h < 12) h += 12;
      if (period === 'am' && h === 12) h = 0;
      
      if (h > currentHour) return true;
      if (h === currentHour && m >= currentMin) return true;
      return false;
    });
  }, [tmpDate, allTimes]);

  // Ensure selected time is still valid when list changes
  React.useEffect(() => {
    if (!times.includes(tmpTime) && times.length > 0) {
      setTmpTime(times[0]);
    }
  }, [times, tmpTime]);

  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title={title}
      scrollEnabled={false}
      footer={
        <Pressable
          style={[styles.confirmBtn, { backgroundColor: theme.primary, borderRadius: 14 }]}
          onPress={() => onSelect(tmpDate, tmpTime)}
        >
          <Text style={{ fontWeight: '700', color: '#000', fontSize: 16 }}>Set Schedule</Text>
        </Pressable>
      }
    >
      <View style={{ paddingBottom: 10 }}>
        <View style={styles.dualWheelContainer}>
          <View style={styles.wheelWrapper}>
            <Text style={[styles.miniHeader, { color: theme.textSecondary, textAlign: 'center' }]}>DATE</Text>
            <WheelPicker 
              items={DATES}
              selectedIndex={DATES.indexOf(tmpDate)}
              onIndexChange={(index) => setTmpDate(DATES[index])}
              containerHeight={250}
              itemHeight={50}
            />
          </View>
          
          <View style={styles.wheelWrapper}>
            <Text style={[styles.miniHeader, { color: theme.textSecondary, textAlign: 'center' }]}>TIME</Text>
            <WheelPicker 
              items={times}
              selectedIndex={times.indexOf(tmpTime)}
              onIndexChange={(index) => setTmpTime(times[index])}
              containerHeight={250}
              itemHeight={50}
            />
          </View>
        </View>
      </View>
    </ModalWrapper>
  );
};



// --- Rush Duration Sheet ---
const RUSH_OPTIONS = [
  { id: '30m', label: '30 minutes' },
  { id: '1h', label: '1 hour' },
  { id: '1h30m', label: '1 hour 30 minutes' },
  { id: '2h', label: '2 hours' },
];

export const RushDurationSheet = ({ visible, onClose, onSelect }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const [selected, setSelected] = useState('30m');

  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title="Rush in kitchen"
      footer={
        <Pressable
          style={[styles.confirmBtn, { backgroundColor: theme.primary }]}
          onPress={() => onSelect(selected)}
        >
          <Text style={[styles.confirmBtnText, { color: '#000' }]}>Activate Rush Mode</Text>
        </Pressable>
      }
    >
      <View style={styles.sheetContent}>
        <GlassView style={[styles.rushBanner, { backgroundColor: theme.primary + '10' }]}>
          <Lightning size={24} color={theme.primary} weight="fill" />
          <Text style={[styles.rushBannerText, { color: theme.text }]}>
            We'll add more prep time to your next orders to help your kitchen catch up.
          </Text>
        </GlassView>

        <Text style={[styles.sheetSubtitle, { color: theme.textSecondary, marginTop: 24 }]}>
          Extend prep time for next
        </Text>

        {RUSH_OPTIONS.map(opt => (
          <SheetOption
            key={opt.id}
            label={opt.label}
            selected={selected === opt.id}
            onPress={() => setSelected(opt.id)}
          />
        ))}
      </View>
    </ModalWrapper>
  );
};

// --- Internal Helper Components ---
const TimePickerCard = ({ title, date, time, onPress }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  return (
    <Pressable onPress={onPress} style={styles.timePickerCard}>
      <Text style={[styles.timePickerTitle, { color: theme.textSecondary }]}>{title}</Text>
      <View style={styles.timePickerRow}>
        <View style={styles.timePickerInfo}>
          <Text style={[styles.timePickerValue, { color: theme.text }]}>{time}</Text>
          <Text style={[styles.timePickerDate, { color: theme.textSecondary }]}>{date}</Text>
        </View>
        <CaretDown size={20} color={theme.textSecondary} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  sheetContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sheetSubtitle: {
    ...Typography.BodyRegular,
    marginBottom: 16,
    opacity: 0.8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  optionIcon: {
    width: 24,
    alignItems: 'center',
  },
  optionLabel: {
    ...Typography.H3,
    fontSize: 16,
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confirmBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnText: {
    ...Typography.H3,
    fontSize: 18,
  },
  rushBanner: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    alignItems: 'center',
  },
  rushBannerText: {
    ...Typography.Caption,
    flex: 1,
    fontSize: 13,
  },
  timeCardContainer: {
    gap: 0,
  },
  timePickerCard: {
    padding: 16,
    borderRadius: 16,
  },
  timePickerTitle: {
    ...Typography.Caption,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  timePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timePickerInfo: {
    gap: 2,
  },
  timePickerValue: {
    ...Typography.H2,
    fontSize: 22,
  },
  timePickerDate: {
    ...Typography.Caption,
  },
  connectorContainer: {
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connector: {
    width: 2,
    height: '100%',
  },
  sectionTitle: {
    ...Typography.Caption,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  dateScroll: {
    marginBottom: 8,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  datePill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  datePillText: {
    ...Typography.BodyRegular,
    fontWeight: '700',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 8,
  },
  timeChip: {
    width: (width - 64) / 3,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  timeChipText: {
    ...Typography.Caption,
    fontWeight: '700',
    fontSize: 13,
  },
  miniHeader: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 12,
    textTransform: 'uppercase'
  },
  modernPill: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
  },
  modernTimeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  modernTimeChip: {
    width: '31%', // Three column layout
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  wheelContainer: {
    marginTop: 8,
    marginHorizontal: -20,
  },
  dualWheelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: -10,
  },
  wheelWrapper: {
    flex: 1,
  }
});

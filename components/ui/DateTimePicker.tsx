import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Dimensions } from 'react-native';
import { ModalWrapper } from './ModalWrapper';
import { WheelPicker } from './WheelPicker';
import { Colors, Typography, Fonts } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { PremiumButton } from './PremiumButton';

const { width } = Dimensions.get('window');

interface DateTimePickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  initialDate?: Date;
  mode?: 'date' | 'time' | 'datetime';
  title?: string;
}

export const DateTimePicker = ({
  visible,
  onClose,
  onConfirm,
  initialDate = new Date(),
  mode = 'datetime',
  title
}: DateTimePickerProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  const [tempDate, setTempDate] = useState(new Date(initialDate));

  // Date constants
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 11 }, (_, i) => (currentYear + i).toString());
  }, []);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const days = useMemo(() => {
    const count = getDaysInMonth(tempDate.getMonth(), tempDate.getFullYear());
    return Array.from({ length: count }, (_, i) => (i + 1).toString().padStart(2, '0'));
  }, [tempDate.getMonth(), tempDate.getFullYear()]);

  // Time constants
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const ampm = ['AM', 'PM'];

  // Current indices
  const getDayIndex = () => {
    const d = tempDate.getDate().toString().padStart(2, '0');
    const idx = days.indexOf(d);
    return idx >= 0 ? idx : 0;
  };
  
  const dayIndex = getDayIndex();
  const monthIndex = tempDate.getMonth();
  const yearIndex = years.indexOf(tempDate.getFullYear().toString());

  const currentHour = tempDate.getHours();
  const displayHour = currentHour % 12 || 12;
  const hourIndex = hours.indexOf(displayHour.toString().padStart(2, '0'));
  const minuteIndex = tempDate.getMinutes();
  const ampmIndex = currentHour >= 12 ? 1 : 0;

  const handleDateChange = (type: 'day' | 'month' | 'year', index: number) => {
    const newDate = new Date(tempDate);
    if (type === 'day') {
      const dayVal = parseInt(days[index]);
      newDate.setDate(dayVal);
    } else if (type === 'month') {
      // Handle edge case: switching to a month with fewer days
      const targetMonth = index;
      const daysInTargetMonth = getDaysInMonth(targetMonth, newDate.getFullYear());
      if (newDate.getDate() > daysInTargetMonth) {
        newDate.setDate(daysInTargetMonth);
      }
      newDate.setMonth(targetMonth);
    } else if (type === 'year') {
      newDate.setFullYear(parseInt(years[index]));
    }
    setTempDate(newDate);
  };

  const handleTimeChange = (type: 'hour' | 'minute' | 'ampm', index: number) => {
    const newDate = new Date(tempDate);
    let h = newDate.getHours();

    if (type === 'hour') {
      const isPM = h >= 12;
      h = parseInt(hours[index]);
      if (isPM && h !== 12) h += 12;
      if (!isPM && h === 12) h = 0;
    } else if (type === 'minute') {
      newDate.setMinutes(index);
      setTempDate(newDate);
      return;
    } else if (type === 'ampm') {
      if (index === 1 && h < 12) h += 12;
      if (index === 0 && h >= 12) h -= 12;
    }
    newDate.setHours(h);
    setTempDate(newDate);
  };

  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title={title || (mode === 'date' ? 'Select Date' : mode === 'time' ? 'Select Time' : 'Select Date & Time')}
      scrollEnabled={false}
    >
      <View style={styles.container}>
        {(mode === 'date' || mode === 'datetime') && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>DATE</Text>
            <View style={styles.pickerRow}>
              <View style={styles.pickerColumn}>
                <WheelPicker items={days} selectedIndex={dayIndex} onIndexChange={(i) => handleDateChange('day', i)} />
              </View>
              <View style={[styles.pickerColumn, { flex: 1.5 }]}>
                <WheelPicker items={months} selectedIndex={monthIndex} onIndexChange={(i) => handleDateChange('month', i)} />
              </View>
              <View style={[styles.pickerColumn, { flex: 1.2 }]}>
                <WheelPicker items={years} selectedIndex={yearIndex} onIndexChange={(i) => handleDateChange('year', i)} />
              </View>
            </View>
          </View>
        )}

        {(mode === 'time' || mode === 'datetime') && (
          <View style={[styles.section, mode === 'datetime' && { marginTop: 24 }]}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>TIME</Text>
            <View style={styles.pickerRow}>
              <View style={styles.pickerColumn}>
                <WheelPicker items={hours} selectedIndex={hourIndex} onIndexChange={(i) => handleTimeChange('hour', i)} />
              </View>
              <View style={styles.pickerColumn}>
                <WheelPicker items={minutes} selectedIndex={minuteIndex} onIndexChange={(i) => handleTimeChange('minute', i)} />
              </View>
              <View style={styles.pickerColumn}>
                <WheelPicker items={ampm} selectedIndex={ampmIndex} onIndexChange={(i) => handleTimeChange('ampm', i)} />
              </View>
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <PremiumButton
            label="Cancel"
            variant="ghost"
            onPress={onClose}
            style={styles.footerBtn}
          />
          <PremiumButton
            label="Set Date & Time"
            variant="primary"
            onPress={() => onConfirm(tempDate)}
            style={[styles.footerBtn, { flex: 2 }]}
          />
        </View>
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  section: {
    gap: 12,
  },
  sectionLabel: {
    ...Typography.Caption,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    paddingLeft: 4,
  },
  pickerRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerColumn: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  footerBtn: {
    flex: 1,
    height: 56,
  },
});

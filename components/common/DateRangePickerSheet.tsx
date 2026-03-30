import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import { RadioButton } from '@/components/ui/RadioButton';
import { Colors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { PremiumButton } from '@/components/ui/PremiumButton';

interface DateRangePickerSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (range: string) => void;
  selectedRange?: string;
}

export const DateRangePickerSheet = ({
  visible,
  onClose,
  onApply,
  selectedRange = 'today'
}: DateRangePickerSheetProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  const [localSelected, setLocalSelected] = useState(selectedRange);

  const ranges = [
    { id: 'today', label: 'Today so far', date: 'Mon, 23 Mar 26' },
    { id: 'yesterday', label: 'Yesterday', date: 'Sun, 22 Mar 26' },
    { id: 'week', label: 'This week so far', date: 'Mon, 23 Mar 26' },
    { id: 'last_week', label: 'Last week', date: 'Mon, 16 Mar 26 - Sun, 22 Mar 26' },
    { id: 'month', label: 'This month so far', date: 'Sun, 01 Mar 26 - Mon, 23 Mar 26' },
    { id: 'last_month', label: 'Last month', date: 'Sun, 01 Feb 26 - Sat, 28 Feb 26' },
  ];

  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title="Date range selection"
    >
      <View style={styles.container}>
        <View style={styles.optionsList}>
          {ranges.map((range, index) => (
            <Pressable
              key={range.id}
              style={[
                styles.optionRow,
                index === ranges.length - 1 && { borderBottomWidth: 0 },
                { borderBottomColor: theme.border }
              ]}
              onPress={() => setLocalSelected(range.id)}
            >
              <View style={styles.rangeInfo}>
                <Text style={[styles.rangeLabel, { color: theme.text }]}>{range.label}</Text>
                <Text style={[styles.rangeDate, { color: theme.textSecondary }]}>{range.date}</Text>
              </View>
              <RadioButton
                selected={localSelected === range.id}
                onPress={() => setLocalSelected(range.id)}
                size={24}
              />
            </Pressable>
          ))}
        </View>

        <View style={styles.footer}>
          <PremiumButton
            label="Cancel"
            variant="ghost"
            onPress={onClose}
            style={styles.footerBtn}
          />
          <PremiumButton
            label="Apply"
            variant="primary"
            onPress={() => onApply(localSelected)}
            style={styles.footerBtn}
          />
        </View>
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
  },
  optionsList: {
    marginBottom: 24,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  rangeInfo: {
    flex: 1,
    gap: 4,
  },
  rangeLabel: {
    ...Typography.H3,
    fontSize: 17,
  },
  rangeDate: {
    ...Typography.Caption,
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  footerBtn: {
    flex: 1,
    height: 56,
  },
});

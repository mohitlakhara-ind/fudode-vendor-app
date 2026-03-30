import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import { RadioButton } from '@/components/ui/RadioButton';
import { Colors, Fonts, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Minus, Plus, CaretDown, Clock, CalendarBlank, MinusCircle, PlusCircle } from 'phosphor-react-native';
import { PremiumButton } from '@/components/ui/PremiumButton';

import { DateTimePicker } from '@/components/ui/DateTimePicker';

interface MarkOutOfStockSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  itemTitle?: string;
  itemSubtitle?: string;
  type: 'item' | 'subcategory';
}

export const MarkOutOfStockSheet = ({
  visible,
  onClose,
  onConfirm,
  itemTitle,
  itemSubtitle,
  type
}: MarkOutOfStockSheetProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const [selectedOption, setSelectedOption] = useState('specific_time');
  const [hours, setHours] = useState(5);
  
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const formatDate = (date: Date) => {
    const d = date.getDate().toString().padStart(2, '0');
    const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
    const y = date.getFullYear();
    return `${d} ${m} ${y}`;
  };

  const formatTime = (date: Date) => {
    let h = date.getHours();
    const m = date.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h.toString().padStart(2, '0')}:${m} ${ampm}`;
  };

  const options = [
    { 
      id: 'specific_time', 
      label: 'For specific time', 
      icon: <Clock size={20} color={theme.text} />
    },
    { 
      id: 'business_day', 
      label: 'Next business day', 
      sublabel: 'Until opening time',
      icon: <CalendarBlank size={20} color={theme.text} />
    },
    { 
      id: 'custom', 
      label: 'Custom date & time',
      icon: <CalendarBlank size={20} color={theme.text} />
    },
    { 
      id: 'manual', 
      label: 'Turn on manually', 
      sublabel: "Hidden until you mark it back in stock",
      icon: <MinusCircle size={20} color={theme.text} />
    },
  ];

  const handleConfirm = () => {
    onConfirm({
      option: selectedOption,
      hours: selectedOption === 'specific_time' ? hours : null,
      customDate: selectedOption === 'custom' ? formatDate(selectedDateTime) : null,
      customTime: selectedOption === 'custom' ? formatTime(selectedDateTime) : null,
      dateObject: selectedOption === 'custom' ? selectedDateTime : null,
    });
  };

  return (
    <>
      <ModalWrapper
      visible={visible}
      onClose={onClose}
      title={type === 'item' ? 'Mark Out of Stock' : 'Mark Sub-category Out of Stock'}
    >
      <View style={styles.container}>
        {itemTitle && (
          <View style={[styles.itemHeader, { backgroundColor: theme.surfaceSecondary + '50' }]}>
            <View style={styles.itemHeaderInfo}>
              <Text style={[styles.itemTitle, { color: theme.text }]} numberOfLines={1}>{itemTitle}</Text>
              {itemSubtitle && (
                <Text style={[styles.itemSubtitle, { color: theme.textSecondary }]} numberOfLines={1}>
                  {itemSubtitle}
                </Text>
              )}
            </View>
          </View>
        )}

        <View style={styles.optionsList}>
          {options.map((option) => (
            <Pressable
              key={option.id}
              style={[
                styles.optionCard, 
                { 
                  borderColor: selectedOption === option.id ? theme.primary : theme.border,
                  backgroundColor: selectedOption === option.id ? theme.primary + '05' : 'transparent'
                }
              ]}
              onPress={() => setSelectedOption(option.id)}
            >
              <View style={styles.optionContent}>
                <View style={[styles.optionIcon, { backgroundColor: theme.surfaceSecondary }]}>
                  {option.icon}
                </View>
                <View style={styles.optionText}>
                  <Text style={[styles.optionLabel, { color: theme.text }]}>{option.label}</Text>
                  {option.sublabel && (
                    <Text style={[styles.optionSublabel, { color: theme.textSecondary }]}>{option.sublabel}</Text>
                  )}
                </View>
                <RadioButton
                  selected={selectedOption === option.id}
                  onPress={() => setSelectedOption(option.id)}
                  size={20}
                />
              </View>

              {option.id === 'specific_time' && selectedOption === 'specific_time' && (
                <View style={[styles.stepperContainer, { borderTopColor: theme.border }]}>
                  <Text style={[styles.stepperLabel, { color: theme.textSecondary }]}>Select duration</Text>
                  <View style={[styles.stepper, { backgroundColor: theme.surfaceSecondary }]}>
                    <Pressable onPress={() => setHours(Math.max(1, hours - 1))} style={styles.stepperBtn}>
                      <Minus size={18} color={theme.text} weight="bold" />
                    </Pressable>
                    <View style={styles.stepperValueContainer}>
                      <Text style={[styles.stepperValue, { color: theme.text }]}>{hours} {hours === 1 ? 'hour' : 'hours'}</Text>
                    </View>
                    <Pressable onPress={() => setHours(hours + 1)} style={styles.stepperBtn}>
                      <Plus size={18} color={theme.text} weight="bold" />
                    </Pressable>
                  </View>
                </View>
              )}

              {option.id === 'custom' && selectedOption === 'custom' && (
                <View style={[styles.customPickers, { borderTopColor: theme.border }]}>
                  <Pressable 
                    onPress={() => setIsPickerVisible(true)}
                    style={[styles.pickerField, { backgroundColor: theme.surfaceSecondary }]}
                  >
                    <Text style={[styles.pickerText, { color: theme.text }]}>{formatDate(selectedDateTime)}</Text>
                    <CaretDown size={14} color={theme.textSecondary} />
                  </Pressable>
                  <Pressable 
                    onPress={() => setIsPickerVisible(true)}
                    style={[styles.pickerField, { backgroundColor: theme.surfaceSecondary }]}
                  >
                    <Text style={[styles.pickerText, { color: theme.text }]}>{formatTime(selectedDateTime)}</Text>
                    <CaretDown size={14} color={theme.textSecondary} />
                  </Pressable>
                </View>
              )}
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
            label="Confirm Out of Stock"
            variant="primary"
            onPress={handleConfirm}
            style={[styles.footerBtn, { flex: 2 }]}
          />
        </View>
      </View>
    </ModalWrapper>
      <DateTimePicker
        visible={isPickerVisible}
        mode="datetime"
        initialDate={selectedDateTime}
        onClose={() => setIsPickerVisible(false)}
        onConfirm={(date) => {
          setSelectedDateTime(date);
          setIsPickerVisible(false);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  itemHeader: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  itemHeaderInfo: {
    gap: 2,
  },
  itemTitle: {
    ...Typography.H3,
    fontSize: 18,
    fontWeight: '700',
  },
  itemSubtitle: {
    ...Typography.Caption,
    fontSize: 14,
  },
  optionsList: {
    gap: 12,
    marginBottom: 24,
  },
  optionCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    ...Typography.H3,
    fontSize: 16,
    fontWeight: '600',
  },
  optionSublabel: {
    ...Typography.Caption,
    fontSize: 12,
  },
  stepperContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperLabel: {
    ...Typography.Caption,
    fontSize: 13,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 2,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperValueContainer: {
    minWidth: 80,
    alignItems: 'center',
  },
  stepperValue: {
    ...Typography.BodyRegular,
    fontSize: 14,
    fontWeight: '700',
  },
  customPickers: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 12,
  },
  pickerField: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  pickerText: {
    ...Typography.BodyRegular,
    fontSize: 13,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  footerBtn: {
    height: 54,
  },
});

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';
import { ModalWrapper } from '../ui/ModalWrapper';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';
import { RadioButton } from '../ui/RadioButton';
import { Bug, ChatDots, CheckCircle } from 'phosphor-react-native';

// --- Technical Issue Sheet ---
const ISSUE_TYPES = [
  { id: 'app_crash', label: 'App is crashing' },
  { id: 'ui_bug', label: 'UI layout issue' },
  { id: 'order_sync', label: 'Orders not syncing' },
  { id: 'notification', label: 'Notification issues' },
  { id: 'other', label: 'Other technical issue' },
];

export const TechnicalIssueSheet = ({ visible, onClose, onFinish }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const [selected, setSelected] = useState('app_crash');
  const [description, setDescription] = useState('');

  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title="Report a Technical Issue"
      footer={
        <Pressable
          style={[styles.confirmBtn, { backgroundColor: theme.primary }]}
          onPress={() => onFinish({ type: selected, description })}
        >
          <Text style={[styles.confirmBtnText, { color: '#000' }]}>Submit Report</Text>
        </Pressable>
      }
    >
      <View style={styles.sheetContent}>
        <Text style={[styles.sheetSubtitle, { color: theme.textSecondary }]}>
          What kind of technical issue are you facing?
        </Text>
        {ISSUE_TYPES.map((type) => (
          <Pressable
            key={type.id}
            onPress={() => setSelected(type.id)}
            style={styles.optionItem}
          >
            <Text style={[styles.optionLabel, { color: theme.text }]}>{type.label}</Text>
            <RadioButton selected={selected === type.id} onPress={() => setSelected(type.id)} />
          </Pressable>
        ))}
        
        <Text style={[styles.inputLabel, { color: theme.text, marginTop: 20 }]}>
          Describe the issue
        </Text>
        <TextInput
          placeholder="e.g. The app closes when I try to accept an order..."
          placeholderTextColor={theme.textSecondary}
          multiline
          numberOfLines={4}
          style={[styles.textArea, { 
            backgroundColor: theme.surfaceSecondary, 
            color: theme.text,
            borderColor: theme.border + '20'
          }]}
          value={description}
          onChangeText={setDescription}
        />
      </View>
    </ModalWrapper>
  );
};

// --- Feedback Sheet ---
export const FeedbackSheet = ({ visible, onClose, onFinish }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const [feedback, setFeedback] = useState('');

  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title="Send Feedback"
      footer={
        <Pressable
          style={[styles.confirmBtn, { backgroundColor: theme.primary }]}
          onPress={() => onFinish(feedback)}
        >
          <Text style={[styles.confirmBtnText, { color: '#000' }]}>Send Feedback</Text>
        </Pressable>
      }
    >
      <View style={styles.sheetContent}>
        <View style={[styles.iconHeader, { backgroundColor: theme.primary + '10' }]}>
          <ChatDots size={32} color={theme.primary} weight="fill" />
        </View>
        <Text style={[styles.sheetTitle, { color: theme.text }]}>We value your input!</Text>
        <Text style={[styles.sheetSubtitle, { color: theme.textSecondary, textAlign: 'center' }]}>
          Tell us how we can make the experience better for you.
        </Text>
        
        <TextInput
          placeholder="Enter your suggestions here..."
          placeholderTextColor={theme.textSecondary}
          multiline
          numberOfLines={6}
          style={[styles.textArea, { 
            backgroundColor: theme.surfaceSecondary, 
            color: theme.text,
            borderColor: theme.border + '20',
            marginTop: 10,
            height: 150
          }]}
          value={feedback}
          onChangeText={setFeedback}
        />
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  sheetContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sheetTitle: {
    ...Typography.H2,
    textAlign: 'center',
    marginBottom: 8,
  },
  sheetSubtitle: {
    ...Typography.BodyRegular,
    marginBottom: 20,
    opacity: 0.8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  optionLabel: {
    ...Typography.H3,
  },
  inputLabel: {
    ...Typography.H3,
    fontSize: 14,
    marginBottom: 10,
  },
  textArea: {
    borderRadius: 12,
    padding: 16,
    ...Typography.BodyRegular,
    fontSize: 16,
    borderWidth: 1,
    textAlignVertical: 'top',
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
  iconHeader: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  }
});

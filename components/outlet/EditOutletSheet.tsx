import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, ScrollView } from 'react-native';
import { Colors, Fonts, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { ThemedText } from '@/components/themed-text';
import { X } from 'phosphor-react-native';

interface EditOutletSheetProps {
  visible: boolean;
  onClose: () => void;
  initialName: string;
  initialCuisines: string;
  initialAddress: string;
  onSave: (name: string, cuisines: string, address: string) => void;
}

export const EditOutletSheet = ({
  visible,
  onClose,
  initialName,
  initialCuisines,
  initialAddress,
  onSave,
}: EditOutletSheetProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const [name, setName] = useState(initialName);
  const [cuisines, setCuisines] = useState(initialCuisines);
  const [address, setAddress] = useState(initialAddress);

  const handleSave = () => {
    onSave(name, cuisines, address);
    onClose();
  };

  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title="Edit Outlet Details"
      footer={
        <PremiumButton
          label="Save Changes"
          onPress={handleSave}
          variant="primary"
          style={styles.saveBtn}
        />
      }
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.inputGroup}>
          <ThemedText style={[styles.label, { color: theme.textSecondary }]}>RESTAURANT NAME</ThemedText>
          <View style={[styles.inputContainer, { backgroundColor: theme.surfaceSecondary + '30', borderColor: theme.border }]}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter restaurant name"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.text }]}
            />
            {name.length > 0 && (
              <Pressable onPress={() => setName('')}>
                <X size={18} color={theme.textSecondary} weight="bold" />
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <ThemedText style={[styles.label, { color: theme.textSecondary }]}>CUISINE TAGS</ThemedText>
          <View style={[styles.inputContainer, { backgroundColor: theme.surfaceSecondary + '30', borderColor: theme.border, height: 100, alignItems: 'flex-start', paddingTop: 12 }]}>
            <TextInput
              value={cuisines}
              onChangeText={setCuisines}
              placeholder="e.g. Cafe, Pizza, Chinese"
              placeholderTextColor={theme.textSecondary}
              multiline
              textAlignVertical="top"
              style={[styles.input, { color: theme.text, height: '100%' }]}
            />
          </View>
          <ThemedText style={[styles.hint, { color: theme.textSecondary }]}>Separate tags with commas</ThemedText>
        </View>

        <View style={styles.inputGroup}>
          <ThemedText style={[styles.label, { color: theme.textSecondary }]}>RESTAURANT ADDRESS</ThemedText>
          <View style={[styles.inputContainer, { backgroundColor: theme.surfaceSecondary + '30', borderColor: theme.border, height: 100, alignItems: 'flex-start', paddingTop: 12 }]}>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Enter complete restaurant address"
              placeholderTextColor={theme.textSecondary}
              multiline
              textAlignVertical="top"
              style={[styles.input, { color: theme.text, height: '100%' }]}
            />
          </View>
        </View>
      </ScrollView>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 11,
    fontFamily: Fonts.inter.bold,
    letterSpacing: 1.2,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: Fonts.inter.semibold,
  },
  hint: {
    fontSize: 12,
    fontFamily: Fonts.inter.medium,
    marginTop: 8,
    paddingHorizontal: 4,
    opacity: 0.7,
  },
  saveBtn: {
    height: 56,
    borderRadius: 18,
  },
});

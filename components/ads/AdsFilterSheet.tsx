import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Modal, Animated, Dimensions } from 'react-native';
import { X } from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/PrimaryButton';

const { height } = Dimensions.get('window');

interface AdsFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

export const AdsFilterSheet = ({ visible, onClose, onApply }: AdsFilterSheetProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const [activeCategory, setActiveCategory] = useState<'Duration' | 'Outlets'>('Duration');
  const [selectedDuration, setSelectedDuration] = useState('All');

  const durations = ['All', 'Present Week', 'Present Month', 'Previous Week', 'Previous Month'];

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: theme.surface }]}>
          <View style={[styles.header, { borderBottomColor: theme.border + '15' }]}>
            <ThemedText style={[styles.headerTitle, { color: theme.text }]}>Filters</ThemedText>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <View style={[styles.closeIconBg, { backgroundColor: '#333' }]}>
                <X size={16} color="#FFF" weight="bold" />
              </View>
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={[styles.sidebar, { backgroundColor: theme.surfaceSecondary + '50' }]}>
              <Pressable 
                onPress={() => setActiveCategory('Duration')}
                style={[styles.sidebarItem, activeCategory === 'Duration' && styles.activeSidebarItem]}
              >
                {activeCategory === 'Duration' && <View style={[styles.activeIndicator, { backgroundColor: theme.primary }]} />}
                <ThemedText style={[styles.sidebarText, { color: activeCategory === 'Duration' ? theme.text : theme.textSecondary }]}>
                  Duration
                </ThemedText>
              </Pressable>
              
              <Pressable 
                onPress={() => setActiveCategory('Outlets')}
                style={[styles.sidebarItem, activeCategory === 'Outlets' && styles.activeSidebarItem]}
              >
                {activeCategory === 'Outlets' && <View style={[styles.activeIndicator, { backgroundColor: theme.primary }]} />}
                <ThemedText style={[styles.sidebarText, { color: activeCategory === 'Outlets' ? theme.text : theme.textSecondary }]}>
                  Outlets
                </ThemedText>
              </Pressable>
            </View>

            <View style={styles.mainContent}>
              {activeCategory === 'Duration' ? (
                <View style={styles.optionsList}>
                  {durations.map((duration) => (
                    <Pressable 
                      key={duration} 
                      onPress={() => setSelectedDuration(duration)}
                      style={styles.radioRow}
                    >
                      <View style={[styles.radioOuter, { borderColor: selectedDuration === duration ? theme.primary : theme.textSecondary + '40' }]}>
                        {selectedDuration === duration && <View style={[styles.radioInner, { backgroundColor: theme.primary }]} />}
                      </View>
                      <ThemedText style={[styles.radioLabel, { color: theme.text }]}>{duration}</ThemedText>
                    </Pressable>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyState}>
                   <ThemedText style={{ color: theme.textSecondary }}>No outlet filters available</ThemedText>
                </View>
              )}
            </View>
          </View>

          <View style={[styles.footer, { borderTopColor: theme.border + '15' }]}>
            <PrimaryButton 
              title="Apply" 
              onPress={() => {
                onApply({ duration: selectedDuration });
                onClose();
              }}
              style={{ height: 54, borderRadius: 12 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    height: height * 0.75,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  closeBtn: {
    padding: 4,
  },
  closeIconBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 120,
    height: '100%',
  },
  sidebarItem: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    position: 'relative',
    justifyContent: 'center',
  },
  activeSidebarItem: {
    backgroundColor: '#FFF',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    width: 4,
    height: '70%',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  sidebarText: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  mainContent: {
    flex: 1,
    padding: 12,
  },
  optionsList: {
    gap: 16,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 12,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  radioLabel: {
    fontSize: 17,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
});

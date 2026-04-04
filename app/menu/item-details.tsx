import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, SafeAreaView, TextInput, Switch, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretLeft, Check, Camera, Plus, Leaf, Trash, Clock } from 'phosphor-react-native';

import { ThemedText } from '@/components/themed-text';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { createItem, updateItem, deleteItem } from '@/store/slices/menuSlice';
import { ItemCreateRequest, MenuVariant } from '@/api/types';

export default function ItemDetailsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams<{ 
    categoryName: string; 
    subCategoryName: string; 
    categoryId: string;
    subCategoryId: string;
    itemId?: string 
  }>();
  
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  
  const { items, addonGroups, loading } = useAppSelector((state: RootState) => state.menu);
  const [form, setForm] = useState({
    name: '',
    description: '',
    foodType: 'VEG' as 'VEG' | 'NON_VEG' | 'EGG',
    prepTime: '15',
    basePrice: '',
    tags: [] as string[],
    image: null as string | null,
    variants: [] as MenuVariant[],
    addonGroupIds: [] as string[],
    isLive: false,
    status: 'AVAILABLE' as 'AVAILABLE' | 'SOLD_OUT' | 'HIDDEN',
  });

  useEffect(() => {
    if (params.itemId) {
      const item = items.find(i => i.id === params.itemId);
      if (item) {
        setForm({
          name: item.name,
          description: item.description || '',
          foodType: item.foodType,
          prepTime: item.prepTime?.toString() || '15',
          basePrice: item.variants?.[0]?.price?.toString() || '',
          tags: item.tags || [],
          image: item.imageUrl || null,
          variants: item.variants || [],
          addonGroupIds: item.addonGroupIds || [],
          isLive: item.isLive,
          status: item.status,
        });
      }
    }
  }, [params.itemId, items]);

  const availableTags = ['Spicy', 'Vegan', 'Bestseller', 'Gluten Free'];

  const toggleTag = (tag: string) => {
    setForm(prev => {
      const isSelected = prev.tags.includes(tag);
      return {
        ...prev,
        tags: isSelected ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
      };
    });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setForm(prev => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  const removeImage = () => {
    setForm(prev => ({ ...prev, image: null }));
  };

  const handleSave = async () => {
    if (!form.name || !form.basePrice) {
      Alert.alert('Error', 'Name and Base Price are required');
      return;
    }

    const itemData: ItemCreateRequest = {
      categoryId: params.subCategoryId || params.categoryId,
      name: form.name,
      description: form.description,
      foodType: form.foodType,
      prepTime: parseInt(form.prepTime) || 15,
      imageUrl: form.image || undefined,
      variants: form.variants.length > 0 ? form.variants : [
        { name: 'Regular', price: parseFloat(form.basePrice), isDefault: true }
      ],
      tags: form.tags,
      addonGroupIds: form.addonGroupIds,
    };

    try {
      if (params.itemId) {
        await dispatch(updateItem({ id: params.itemId, details: itemData })).unwrap();
      } else {
        await dispatch(createItem(itemData)).unwrap();
      }
      router.dismiss(3); // Go back through the selection flow
    } catch (err: any) {
      Alert.alert('Error', err || 'Failed to save item');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              if (params.itemId) {
                await dispatch(deleteItem(params.itemId)).unwrap();
                router.dismiss(3);
              }
            } catch (err: any) {
              Alert.alert('Error', err || 'Failed to delete item');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <CaretLeft size={24} color={theme.text} />
        </Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <ThemedText style={[styles.headerTitle, { color: theme.text }]}>{params.itemId ? 'Edit Item' : 'Add New Item'}</ThemedText>
          {form.isLive && (
            <View style={[styles.liveBadge, { backgroundColor: theme.success + '20' }]}>
              <ThemedText style={[styles.liveBadgeText, { color: theme.success }]}>LIVE</ThemedText>
            </View>
          )}
        </View>
        <Pressable onPress={handleSave} style={styles.saveBtn} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color={theme.primary} />
          ) : (
            <ThemedText style={[styles.saveText, { color: theme.primary }]}>Save</ThemedText>
          )}
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}>
        <View style={styles.categoryBreadcrumbs}>
          <ThemedText style={[styles.breadcrumbText, { color: theme.textSecondary }]}>
            {params.categoryName} <ThemedText style={{ color: theme.textSecondary, fontSize: 12 }}>{'>'}</ThemedText> {params.subCategoryName}
          </ThemedText>
        </View>

        <View style={styles.photoSection}>
          <Pressable 
            onPress={pickImage}
            style={[
              styles.photoUpload, 
              { 
                backgroundColor: theme.surfaceSecondary, 
                borderColor: theme.border, 
                borderStyle: form.image ? 'solid' : 'dashed', 
                borderWidth: 1,
                overflow: 'hidden'
              }
            ]}
          >
            {form.image ? (
              <>
                <Image source={{ uri: form.image }} style={styles.previewImage} />
                <View style={styles.imageOverlay}>
                  <Camera size={24} color="#fff" weight="fill" />
                  <ThemedText style={styles.changePhotoText}>Change Photo</ThemedText>
                </View>
              </>
            ) : (
              <>
                <Camera size={32} color={theme.textSecondary} />
                <ThemedText style={{ color: theme.textSecondary, marginTop: 8, ...Typography.BodyRegular }}>Add Item Photo</ThemedText>
              </>
            )}
          </Pressable>
          
          {form.image && (
            <TouchableOpacity 
              onPress={removeImage} 
              style={[styles.removeImageBtn, { backgroundColor: theme.error + '20' }]}
            >
              <Trash size={18} color={theme.error} />
              <ThemedText style={[styles.removeText, { color: theme.error }]}>Remove</ThemedText>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Basic Info</ThemedText>
          
          <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Item Name"
              placeholderTextColor={theme.textSecondary}
              value={form.name}
              onChangeText={(val) => setForm({...form, name: val})}
            />
          </View>
          {form.isLive && (
            <ThemedText style={[styles.draftNote, { color: theme.textSecondary }]}>
              * Changing the name of a live item requires admin approval.
            </ThemedText>
          )}

          <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border, height: 100 }]}>
            <TextInput
              style={[styles.input, { color: theme.text, height: '100%', textAlignVertical: 'top' }]}
              placeholder="Description"
              placeholderTextColor={theme.textSecondary}
              value={form.description}
              onChangeText={(val) => setForm({...form, description: val})}
              multiline
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Dish Type & Prep Time</ThemedText>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
            {['VEG', 'NON_VEG', 'EGG'].map(type => {
              const isSelected = form.foodType === type;
              return (
                <Pressable
                  key={type}
                  onPress={() => setForm({...form, foodType: type as any})}
                  style={[
                    styles.tagBubble,
                    {
                      backgroundColor: isSelected ? theme.primary + '20' : theme.surface,
                      borderColor: isSelected ? theme.primary : theme.border,
                      marginRight: 0
                    }
                  ]}
                >
                  <ThemedText style={{ color: isSelected ? theme.primary : theme.text, fontWeight: isSelected ? '700' : '500' }}>
                    {type.replace('_', ' ')}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
          {form.isLive && (
            <ThemedText style={[styles.draftNote, { color: theme.textSecondary, marginBottom: 12 }]}>
              * Changing food type requires admin approval.
            </ThemedText>
          )}
          
          <View style={[styles.inputGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.rowInput}>
              <Clock size={20} color={theme.textSecondary} />
              <TextInput
                style={[styles.input, { color: theme.text, flex: 1, paddingLeft: 12 }]}
                placeholder="Prep Time (mins)"
                placeholderTextColor={theme.textSecondary}
                value={form.prepTime}
                onChangeText={(val) => setForm({...form, prepTime: val})}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Pricing & Tax</ThemedText>
          <View style={[styles.inputGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.rowInput}>
              <ThemedText style={{ color: theme.textSecondary, fontSize: 16 }}>₹</ThemedText>
              <TextInput
                style={[styles.input, { color: theme.text, flex: 1, paddingLeft: 8 }]}
                placeholder="Base Price"
                placeholderTextColor={theme.textSecondary}
                value={form.basePrice}
                onChangeText={(val) => setForm({...form, basePrice: val})}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.taxRow}>
              <View>
                <ThemedText style={[styles.taxLabel, { color: theme.text }]}>Taxes & Charges (5% GST)</ThemedText>
                <ThemedText style={{ color: theme.textSecondary, fontSize: 13, marginTop: 4 }}>Auto-calculated from base price</ThemedText>
              </View>
              <ThemedText style={{ color: theme.text, fontSize: 16, fontWeight: '700' }}>
                ₹{(Number(form.basePrice || 0) * 0.05).toFixed(2)}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Tags</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsContainer}>
            {availableTags.map(tag => {
              const isSelected = form.tags.includes(tag);
              return (
                <Pressable 
                  key={tag}
                  style={[
                    styles.tagBubble, 
                    { 
                      backgroundColor: isSelected ? theme.primary + '20' : theme.surface,
                      borderColor: isSelected ? theme.primary : theme.border 
                    }
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <ThemedText style={{ color: isSelected ? theme.primary : theme.text, fontWeight: isSelected ? '700' : '500' }}>
                    {tag}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Add-on Groups</ThemedText>
          <View style={{ gap: 8 }}>
            {addonGroups.length > 0 ? (
              addonGroups.map(group => {
                const isSelected = form.addonGroupIds.includes(group.id);
                return (
                  <Pressable
                    key={group.id}
                    onPress={() => {
                      setForm(prev => ({
                        ...prev,
                        addonGroupIds: isSelected 
                          ? prev.addonGroupIds.filter(id => id !== group.id)
                          : [...prev.addonGroupIds, group.id]
                      }));
                    }}
                    style={[
                      styles.addonOption,
                      { 
                        backgroundColor: isSelected ? theme.primary + '10' : theme.surface,
                        borderColor: isSelected ? theme.primary : theme.border
                      }
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <ThemedText style={[styles.addonOptionName, { color: theme.text }]}>{group.name}</ThemedText>
                      <ThemedText style={{ color: theme.textSecondary, fontSize: 12 }}>
                        {group.minSelect} - {group.maxSelect} selections
                      </ThemedText>
                    </View>
                    {isSelected && <Check size={20} color={theme.primary} weight="bold" />}
                  </Pressable>
                );
              })
            ) : (
              <ThemedText style={{ color: theme.textSecondary, fontStyle: 'italic', paddingVertical: 8 }}>
                No add-on groups available. Create some in the Add-ons tab.
              </ThemedText>
            )}
          </View>
        </View>

        {params.itemId && (
          <TouchableOpacity 
            onPress={handleDelete}
            style={[styles.deleteItemBtn, { borderColor: theme.error + '40' }]}
          >
            <Trash size={20} color={theme.error} />
            <ThemedText style={{ color: theme.error, fontWeight: '700' }}>Delete Item</ThemedText>
          </TouchableOpacity>
        )}

      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: theme.surface, borderTopColor: theme.border, paddingBottom: insets.bottom + 10 }]}>
        <Pressable 
          style={[styles.createBtn, { backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 }]} 
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.background} />
          ) : (
            <ThemedText style={styles.createBtnText}>{params.itemId ? 'Save Changes' : 'Create Item'}</ThemedText>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    ...Typography.H3,
    fontWeight: '700',
  },
  saveBtn: {
    padding: 8,
    paddingHorizontal: 16,
    minWidth: 60,
  },
  saveText: {
    fontWeight: '700',
    fontSize: 16,
  },
  scrollContent: {
    padding: 20,
  },
  categoryBreadcrumbs: {
    marginBottom: 20,
  },
  breadcrumbText: {
    ...Typography.BodyRegular,
    fontWeight: '600',
  },
  photoUpload: {
    height: 140,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...Typography.H3,
    fontWeight: '700',
    marginBottom: 12,
  },
  inputContainer: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  inputGroup: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  rowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  rowInputInner: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  divider: {
    height: 1,
  },
  vertDivider: {
    width: 1,
  },
  taxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  taxLabel: {
    ...Typography.BodyLarge,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  tagBubble: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 12,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  createBtn: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createBtnText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  photoSection: {
    marginBottom: 24,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  changePhotoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  removeImageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  removeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  addonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  addonOptionName: {
    fontSize: 16,
    fontWeight: '600',
  },
  deleteItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
    marginBottom: 40,
    gap: 10,
  },
  liveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  draftNote: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: -8,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
});

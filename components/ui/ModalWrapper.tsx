import { Colors, Fonts, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { setModalOpen } from '@/store/slices/uiSlice';
import { X } from 'phosphor-react-native';
import React, { useEffect } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_CLOSE_THRESHOLD = 150;

interface ModalWrapperProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  fullHeight?: boolean;
  isNonDismissible?: boolean;
  scrollEnabled?: boolean;
  variant?: 'bottom-sheet' | 'centered';
}

export const ModalWrapper = ({
  visible,
  onClose,
  title,
  children,
  footer,
  fullHeight = false,
  isNonDismissible = false,
  scrollEnabled = true,
  variant = 'bottom-sheet'
}: ModalWrapperProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const progress = useSharedValue(0);
  const translateY = useSharedValue(0);
  const [shouldRender, setShouldRender] = React.useState(visible);

  useEffect(() => {
    if (visible) {
      dispatch(setModalOpen(true));
      setShouldRender(true);
      progress.value = withTiming(1, { duration: 300 });
      translateY.value = 0;
    } else {
      progress.value = withTiming(0, { duration: 300 }, () => {
        runOnJS(setShouldRender)(false);
      });
      dispatch(setModalOpen(false));
    }
  }, [visible, dispatch, progress, translateY]);

  // Clean up on unmount just in case
  useEffect(() => {
    return () => {
      dispatch(setModalOpen(false));
    };
  }, [dispatch]);

  const handleClose = () => {
    onClose();
  };

  const gesture = Gesture.Pan()
    .enabled(!isNonDismissible)
    .activeOffsetY(10)
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > SWIPE_CLOSE_THRESHOLD || event.velocityY > 1000) {
        translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200 }, () => {
          runOnJS(handleClose)();
        });
      } else {
        translateY.value = withSpring(0);
      }
    });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
    pointerEvents: progress.value > 0.1 ? 'auto' : 'none'
  }));

  const contentStyle = useAnimatedStyle(() => {
    if (variant === 'centered') {
      return {
        transform: [
          { scale: interpolate(progress.value, [0, 1], [0.9, 1]) },
          { translateY: translateY.value }
        ],
        opacity: progress.value,
      };
    }
    return {
      transform: [
        { translateY: interpolate(progress.value, [0, 1], [SCREEN_HEIGHT, 0]) + translateY.value }
      ]
    };
  });

  if (!shouldRender) return null;

  return (
    <View style={[styles.rootContainer, variant === 'centered' && styles.centeredRoot]} pointerEvents="box-none">
      <Animated.View style={[styles.overlay, backdropStyle]}>
        <Pressable 
          style={styles.dismissArea} 
          onPress={isNonDismissible ? undefined : handleClose} 
        />
      </Animated.View>
      
      <GestureDetector gesture={gesture}>
        <Animated.View 
          style={[
            styles.content,
            { backgroundColor: theme.surface },
            variant === 'bottom-sheet' ? [styles.bottomSheetContent, { paddingBottom: insets.bottom + 20 }] : styles.centeredContent,
            fullHeight && variant === 'bottom-sheet' && { height: SCREEN_HEIGHT * 0.9 },
            contentStyle,
            { flexShrink: 1 } // Crucial for Android ScrollView inside centered modals
          ]}
        >
          <View style={[styles.contentBackground, StyleSheet.absoluteFill, variant === 'bottom-sheet' ? styles.bottomSheetContent : styles.centeredContent, { backgroundColor: theme.surface }]} />
          
          {variant === 'bottom-sheet' && !isNonDismissible && (
            <View style={styles.dragHandleContainer}>
              <View style={[styles.dragHandle, { backgroundColor: theme.textSecondary }]} />
            </View>
          )}

          {!isNonDismissible && (
            <Pressable 
              onPress={handleClose} 
              style={[
                styles.closeButton,
                variant === 'centered' && styles.centeredCloseButton
              ]}
            >
              <View style={[styles.closeIconCircle, { backgroundColor: theme.surfaceSecondary }]}>
                <X size={24} color={theme.text} />
              </View>
            </Pressable>
          )}

          {title && (
            <>
              <Text style={[styles.headerTitle, { color: theme.text, fontFamily: Fonts.rounded }]}>
                {title}
              </Text>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
            </>
          )}

          {scrollEnabled ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.scrollContent,
                variant === 'bottom-sheet' && { paddingBottom: 20 }
              ]}
              bounces={variant === 'bottom-sheet'}
            >
              {children}
            </ScrollView>
          ) : (
            <View style={styles.scrollContent}>
              {children}
            </View>
          )}

          {footer && (
            <View style={styles.footer}>
              {footer}
            </View>
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 3000,
    justifyContent: 'flex-end',
  },
  centeredRoot: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40, // Prevent modal from touching top/bottom on tight screens
  },
  overlay: {
    position: 'absolute',
    top: -SCREEN_HEIGHT - 10, // Extend far up to cover any parent padding/gaps
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  dismissArea: {
    flex: 1,
  },
  content: {
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
    width: '100%',
  },
  centeredContent: {
    borderRadius: 32,
    maxHeight: SCREEN_HEIGHT * 0.8,
    overflow: 'hidden',
  },
  bottomSheetContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  contentBackground: {
    overflow: 'hidden',
  },
  dragHandleContainer: {
    width: '100%',
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    opacity: 0.5,
  },
  closeButton: {
    position: 'absolute',
    top: -36,
    alignSelf: 'center',
    zIndex: 3000,
  },
  centeredCloseButton: {
    top: 12,
    right: 12,
    alignSelf: 'flex-end',
  },
  closeIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.H1,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 8,
    paddingHorizontal: 24,
  },
  divider: {
    height: 1,
    opacity: 0.1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  }
});

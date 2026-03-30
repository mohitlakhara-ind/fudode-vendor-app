import React, { useCallback, useRef, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Dimensions,
  Platform,
  ListRenderItem,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
  SharedValue,
} from 'react-native-reanimated';
import { Colors, Fonts } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface WheelPickerProps {
  items: string[];
  selectedIndex: number;
  onIndexChange: (index: number) => void;
  itemHeight?: number;
  containerHeight?: number;
}

interface WheelItemProps {
  item: string;
  index: number;
  bufferCount: number;
  scrollY: SharedValue<number>;
  itemHeight: number;
  selectedIndex: number;
  theme: any;
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const WheelItem = ({ 
  item, 
  index, 
  bufferCount, 
  scrollY, 
  itemHeight, 
  selectedIndex, 
  theme 
}: WheelItemProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    const position = (index - bufferCount) * itemHeight;
    const distance = Math.abs(scrollY.value - position);
    
    const scale = interpolate(
      distance,
      [0, itemHeight, itemHeight * 2],
      [1.3, 0.9, 0.7],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      distance,
      [0, itemHeight, itemHeight * 2],
      [1, 0.5, 0.15],
      Extrapolate.CLAMP
    );

    const rotateX = interpolate(
      distance,
      [0, itemHeight, itemHeight * 2],
      [0, 30, 45],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [
        { scale },
        { rotateX: `${rotateX}deg` },
      ],
    };
  });

  if (item === '') return <View style={{ height: itemHeight }} />;

  const realIndex = index - bufferCount;

  return (
    <View style={[styles.itemWrapper, { height: itemHeight }]}>
      <Animated.View style={[styles.itemInner, animatedStyle]}>
        <Text 
          style={[
            styles.itemText, 
            { 
              color: realIndex === selectedIndex ? theme.primary : theme.text,
              fontFamily: realIndex === selectedIndex ? Fonts.rounded : undefined,
              fontWeight: realIndex === selectedIndex ? '700' : '500',
            }
          ]}
        >
          {item}
        </Text>
      </Animated.View>
    </View>
  );
};

export const WheelPicker: React.FC<WheelPickerProps> = ({
  items,
  selectedIndex,
  onIndexChange,
  itemHeight = 60,
  containerHeight = 300,
}) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  
  const scrollY = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    isDragging.current = false;
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);
    if (index !== selectedIndex && index >= 0 && index < items.length) {
      onIndexChange(index);
      if (Platform.OS !== 'web') {
        Haptics.selectionAsync();
      }
    }
  };

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    handleScrollEnd(event);
  };

  const onScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    handleScrollEnd(event);
  };

  // Buffer items at top and bottom to allow scrolling last/first item to center
  const bufferCount = Math.floor(containerHeight / itemHeight / 2);
  const bufferedItems = useMemo(() => [
    ...Array(bufferCount).fill(''),
    ...items,
    ...Array(bufferCount).fill(''),
  ], [bufferCount, items]);

  const renderItem: ListRenderItem<string> = useCallback(({ item, index }) => (
    <WheelItem 
      item={item}
      index={index}
      bufferCount={bufferCount}
      scrollY={scrollY}
      itemHeight={itemHeight}
      selectedIndex={selectedIndex}
      theme={theme}
    />
  ), [bufferCount, itemHeight, scrollY, selectedIndex, theme]);

  const isDragging = useRef(false);

  useEffect(() => {
    if (flatListRef.current && selectedIndex >= 0 && !isDragging.current) {
      // Small timeout to ensure list is laid out
      const timeout = setTimeout(() => {
        flatListRef.current?.scrollToIndex({ 
          index: selectedIndex, 
          animated: true,
          viewPosition: 0
        });
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [selectedIndex]);

  return (
    <View style={[styles.container, { height: containerHeight }]}>
      {/* Selection Highlight */}
      <View 
        style={[
          styles.highlight, 
          { 
            height: itemHeight, 
            top: (containerHeight - itemHeight) / 2,
            borderColor: theme.primary + '30',
            backgroundColor: theme.primary + '08' 
          }
        ]} 
      />
      
      <AnimatedFlatList
        ref={flatListRef}
        data={bufferedItems}
        renderItem={renderItem as any}
        keyExtractor={(_, index) => index.toString()}
        onScroll={onScroll}
        scrollEventThrottle={16}
        snapToInterval={itemHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollEndDrag={onScrollEndDrag}
        onScrollBeginDrag={() => { isDragging.current = true; }}
        onMomentumScrollBegin={() => { isDragging.current = true; }}
        showsVerticalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: false, viewPosition: 0 });
          }, 100);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  highlight: {
    position: 'absolute',
    left: 10,
    right: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    zIndex: -1,
  },
  itemWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInner: {
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  itemText: {
    fontSize: 22,
    textAlign: 'center',
  },
});

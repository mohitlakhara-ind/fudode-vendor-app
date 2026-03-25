import { View, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { ChartDataPoint } from '@/constants/mockDashboard';
import { ThemedText } from '@/components/themed-text';

interface MiniBarChartProps {
  data: ChartDataPoint[];
  width?: number;
  height?: number;
  color?: string;
  showLabels?: boolean;
}

export const MiniBarChart = ({ 
  data, 
  width = 150, 
  height = 60, 
  color = '#FF6600',
  showLabels = false 
}: MiniBarChartProps) => {
  const max = Math.max(...data.map(d => d.value), 1);
  const barWidth = (width / data.length) - 4;

  return (
    <View style={{ width, height: height + (showLabels ? 20 : 0) }}>
      <Svg width={width} height={height}>
        {data.map((p, i) => {
          const barHeight = (p.value / max) * height;
          return (
            <Rect
              key={i}
              x={i * (barWidth + 4)}
              y={height - barHeight}
              width={barWidth}
              height={barHeight}
              fill={color}
              rx={2}
            />
          );
        })}
      </Svg>
      {showLabels && (
        <View style={styles.labels}>
          {data.map((p, i) => (
            <ThemedText key={i} style={styles.label}>{p.label}</ThemedText>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  label: {
    fontSize: 10,
    opacity: 0.5,
    fontWeight: '600',
  },
});

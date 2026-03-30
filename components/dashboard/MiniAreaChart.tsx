import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { ChartDataPoint } from '@/constants/mockDashboard';
import { ThemedText } from '@/components/themed-text';

interface MiniAreaChartProps {
  data: ChartDataPoint[];
  previousData?: ChartDataPoint[];
  width?: number;
  height?: number;
  color?: string;
  previousColor?: string;
  showXLabels?: boolean;
}

export const MiniAreaChart = ({ 
  data, 
  previousData, 
  width = 120, 
  height = 50, 
  color = '#FF6600',
  previousColor = '#999',
  showXLabels = false
}: MiniAreaChartProps) => {
  const max = Math.max(...data.map(d => d.value), ...(previousData?.map(d => d.value) || [0]), 1);
  
  const getPath = (points: ChartDataPoint[], isClosed: boolean = false) => {
    const step = width / (points.length - 1);
    let path = `M 0 ${height - (points[0].value / max) * height}`;
    
    points.forEach((p, i) => {
      if (i === 0) return;
      const x = i * step;
      const y = height - (p.value / max) * height;
      path += ` L ${x} ${y}`;
    });
    
    if (isClosed) {
      path += ` L ${width} ${height} L 0 ${height} Z`;
    }
    return path;
  };

  return (
    <View style={{ width, height: height + (showXLabels ? 20 : 0) }}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.4" />
            <Stop offset="1" stopColor={color} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Previous Period - Dashed Line */}
        {previousData && (
          <Path
            d={getPath(previousData)}
            fill="none"
            stroke={previousColor}
            strokeWidth="1"
            strokeDasharray="4,4"
            opacity={0.5}
          />
        )}

        {/* Current Period - Filled Area */}
        <Path
          d={getPath(data, true)}
          fill="url(#grad)"
        />

        {/* Current Period - Solid Line */}
        <Path
          d={getPath(data)}
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
      </Svg>
      {showXLabels && (
        <View style={styles.xLabels}>
          {data.map((p, i) => (
            <ThemedText key={i} style={styles.label}>{p.label}</ThemedText>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  xLabels: {
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

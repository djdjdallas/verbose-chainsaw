/**
 * Animated counter component
 * @module components/AnimatedCounter
 */

import { useEffect, useRef } from 'react';
import { Text, Animated, StyleSheet } from 'react-native';

export default function AnimatedCounter({
  end,
  duration = 2000,
  prefix = '$',
  suffix = '',
  decimals = 2,
  style,
  textStyle,
}) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const textRef = useRef();

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: end,
      duration,
      useNativeDriver: false,
    }).start();

    const listener = animatedValue.addListener(({ value }) => {
      if (textRef.current) {
        const formattedValue = decimals > 0
          ? value.toFixed(decimals)
          : Math.floor(value).toString();
        textRef.current.setNativeProps({
          text: `${prefix}${formattedValue}${suffix}`,
        });
      }
    });

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [end, duration, prefix, suffix, decimals]);

  return (
    <Text
      ref={textRef}
      style={[styles.text, textStyle, style]}
    >
      {prefix}0{decimals > 0 && `.${Array(decimals).fill('0').join('')}`}{suffix}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10B981',
  },
});

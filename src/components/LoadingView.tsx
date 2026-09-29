import React from 'react';
import {View, ActivityIndicator, Text, StyleSheet} from 'react-native';
import {AppColors} from '../theme/colors';

interface LoadingViewProps {
  text?: string;
}

const LoadingView: React.FC<LoadingViewProps> = ({text = 'Loading..'}) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={AppColors.themeColor} />
    <Text style={styles.text}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
    fontSize: 12,
    color: AppColors.themeColor,
  },
});

export default LoadingView;

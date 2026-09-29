import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {AppColors} from '../theme/colors';
import {VisitList} from '../api/visitApi';

interface VisitCardProps {
  item: VisitList;
  onImagePress?: () => void;
  onVisitImagePress?: () => void;
}

const VisitCard: React.FC<VisitCardProps> = ({
  item,
  onImagePress,
  onVisitImagePress,
}) => {
  const photoUrl = item.photo ?? '';
  const visitImageUrl = item.image ?? '';

  return (
    <View style={styles.card}>
      {/* User photo + name */}
      <View style={styles.row}>
        <TouchableOpacity onPress={onImagePress}>
          {photoUrl ? (
            <Image
              source={{uri: photoUrl}}
              style={styles.avatar}
              defaultSource={require('../../assets/images/image.png')}
            />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Text style={styles.name}>
            {item.frist_name} {item.last_name}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Contact + address */}
      <Text style={styles.detail}>Mobile : {item.mobile_number}</Text>
      {item.perfomed_by && (
        <Text style={styles.smallText}>Issue : {item.perfomed_by}</Text>
      )}

      <Text style={styles.sectionHeader}>Address Details</Text>
      <Text style={styles.smallText}>Mobile : {item.mobile_number}</Text>
      <Text style={styles.smallText}>House : {item.house_no}</Text>
      <Text style={styles.smallText}>
        {item.city}, {item.pincode}
      </Text>

      <View style={styles.divider} />
      <Text style={styles.sectionHeader}>Visiting Details</Text>

      {/* Visit image + officer */}
      <View style={styles.row}>
        <TouchableOpacity onPress={onVisitImagePress}>
          {visitImageUrl ? (
            <Image
              source={{uri: visitImageUrl}}
              style={styles.avatar}
              defaultSource={require('../../assets/images/image.png')}
            />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
        </TouchableOpacity>
        <View style={styles.userInfo}>
          {item.perfomed_by && (
            <Text style={styles.detail}>By {item.perfomed_by}</Text>
          )}
          <Text style={styles.detail}>{item.police_station_id}</Text>
        </View>
      </View>
      {item.description && (
        <Text style={styles.smallText}>Comment : {item.description}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 6,
    padding: 10,
    elevation: 3,
    shadowColor: AppColors.themeColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  row: {flexDirection: 'row', alignItems: 'center', marginBottom: 6},
  avatar: {width: 50, height: 50, borderRadius: 6, backgroundColor: '#eee'},
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: '#ccc',
  },
  userInfo: {marginLeft: 10, flex: 1},
  name: {fontWeight: '700', fontSize: 14},
  detail: {fontWeight: '700', fontSize: 12, color: '#333'},
  smallText: {fontSize: 12, color: '#444', marginVertical: 1},
  sectionHeader: {fontWeight: '700', fontSize: 12, marginTop: 4, marginBottom: 2},
  divider: {height: 0.5, backgroundColor: 'rgba(0,0,0,0.3)', marginVertical: 4},
});

export default VisitCard;

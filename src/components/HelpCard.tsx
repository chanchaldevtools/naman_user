import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {AppColors} from '../theme/colors';
import {PoliceHelpList} from '../api/helpApi';

interface HelpCardProps {
  item: PoliceHelpList;
  officerName: string;
  onAccept?: () => void;
  onReject?: () => void;
  onComplete?: () => void;
  onImagePress?: () => void;
  showActions?: boolean; // new help list
}

const HelpCard: React.FC<HelpCardProps> = ({
  item,
  officerName,
  onAccept,
  onReject,
  onComplete,
  onImagePress,
  showActions = false,
}) => {
  const photoUrl = item.photo ?? '';
  const isAccept = item.is_accept?.toString();

  const getStatusBadge = () => {
    if (isAccept === '0') {
      return <Text style={[styles.badge, {color: 'orange'}]}>⏰ Pending</Text>;
    } else if (isAccept === '1') {
      return (
        <Text style={[styles.badge, {color: '#29B6F6'}]}>
          ✔ Accepted (not solved)
        </Text>
      );
    } else if (isAccept === '2') {
      return (
        <Text style={[styles.badge, {color: '#F44336'}]}>✖ Rejected</Text>
      );
    } else if (isAccept === '3') {
      return (
        <Text style={[styles.badge, {color: '#4CAF50'}]}>✔ Solved</Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.card}>
      {/* Photo + Name */}
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
          <Text style={styles.detail}>Mobile : {item.mobile_number}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Problem / Address */}
      <Text style={styles.detail}>Problem : {item.help_type}</Text>
      <Text style={styles.smallText}>Address : {item.house_no}</Text>
      <Text style={styles.smallText}>City : {item.city}</Text>
      <Text style={styles.smallText}>West Bengal, India</Text>

      {/* Status or Actions */}
      {showActions ? (
        <View style={styles.actionRow}>
          {isAccept === '0' ? (
            <>
              <TouchableOpacity style={styles.acceptBtn} onPress={onAccept}>
                <Text style={styles.btnText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectBtn} onPress={onReject}>
                <Text style={styles.btnText}>Reject</Text>
              </TouchableOpacity>
            </>
          ) : item.perfomed_by === officerName ? (
            <>
              <TouchableOpacity style={styles.acceptBtn} onPress={onComplete}>
                <Text style={styles.btnText}>Completed Help</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectBtn} onPress={onReject}>
                <Text style={styles.btnText}>Reject</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.observationText}>
              Observation by : {item.perfomed_by}
            </Text>
          )}
        </View>
      ) : (
        <View style={styles.statusRow}>{getStatusBadge()}</View>
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
  smallText: {fontSize: 13, color: '#444', marginVertical: 1},
  divider: {height: 0.5, backgroundColor: 'rgba(0,0,0,0.3)', marginVertical: 4},
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 16,
  },
  statusRow: {marginTop: 8, paddingLeft: 10},
  acceptBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  rejectBtn: {
    backgroundColor: '#F44336',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnText: {color: '#fff', fontSize: 13},
  badge: {fontSize: 12, fontWeight: '700', marginVertical: 4},
  observationText: {fontSize: 13, color: '#E91E63', fontWeight: '700'},
});

export default HelpCard;

import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import {AppColors} from '../theme/colors';
import {UserListData} from '../api/userApi';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface UserCardProps {
  user: UserListData;
  onAccept?: () => void;
  onReject?: () => void;
  onVisit?: () => void;
  onImagePress?: () => void;
  showActions?: boolean; // for pending list
  showAcceptOnly?: boolean; // for rejected list
  showVisit?: boolean; // for total / search list
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onAccept,
  onReject,
  onVisit,
  onImagePress,
  showActions = false,
  showAcceptOnly = false,
  showVisit = false,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const photoUrl = user.photo ?? '';

  return (
    <View style={styles.card}>
      {/* Header Row */}
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
            {user.frist_name} {user.last_name}
          </Text>
          <Text style={styles.detail}>Gender : {user.gender}</Text>
          <Text style={styles.detail}>Age : {user.age}</Text>
        </View>
        {showVisit && (
          <TouchableOpacity style={styles.visitBtn} onPress={onVisit}>
            <Text style={styles.visitBtnIcon}>👁</Text>
            <Text style={styles.visitBtnText}>VISIT</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Action Buttons */}
      {(showActions || showAcceptOnly) && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.acceptBtn} onPress={onAccept}>
            <Text style={styles.btnText}>Accept</Text>
          </TouchableOpacity>
          {showActions && (
            <TouchableOpacity style={styles.rejectBtn} onPress={onReject}>
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Expandable toggle */}
      <TouchableOpacity onPress={toggle} style={styles.expandToggle}>
        <Text style={styles.expandText}>
          {expanded ? '▲ Hide details' : '▼ Tap to view details'}
        </Text>
      </TouchableOpacity>

      {/* Expanded Details */}
      {expanded && (
        <View style={styles.expandedContent}>
          {user.has_co === 'true' && (
            <>
              <Text style={styles.smallText}>C/O Name - {user.co_name}</Text>
              <Text style={styles.smallText}>
                C/O Number - {user.co_contact_number}
              </Text>
            </>
          )}
          <View style={styles.divider} />
          <Text style={styles.detail}>
            Mobile : {user.mobile_number},{'  '}Blood Group : {user.blood_group}
          </Text>
          {user.desis_desc && (
            <Text style={styles.smallText}>Issue : {user.desis_desc}</Text>
          )}
          {user.dob && user.dob !== 'Select DOB' && (
            <Text style={styles.smallText}>DOB : {user.dob}</Text>
          )}
          <Text style={styles.smallText}>
            {user.has_mediclaim === 'true'
              ? 'Have Mediclaim'
              : "Don't Have Mediclaim"}
          </Text>
          <View style={styles.divider} />
          <Text style={styles.sectionHeader}>Family Details</Text>
          {user.maritual_status === '1' ? (
            <Text style={styles.smallText}>Living Alone</Text>
          ) : (
            <View>
              <Text style={styles.smallText}>Living with Family</Text>
              <View style={styles.familyRow}>
                {user.has_son === 'true' && (
                  <Text style={styles.smallText}>Son, </Text>
                )}
                {user.has_daughter === 'true' && (
                  <Text style={styles.smallText}>Daughter, </Text>
                )}
                {user.has_son_law === 'true' && (
                  <Text style={styles.smallText}>Son-in-law, </Text>
                )}
                {user.has_daughter_law === 'true' && (
                  <Text style={styles.smallText}>Daughter-in-law</Text>
                )}
              </View>
            </View>
          )}
          <View style={styles.divider} />
          <Text style={styles.sectionHeader}>Address Details</Text>
          <Text style={styles.smallText}>
            {user.city}, {user.house_no}
          </Text>
          <Text style={styles.smallText}>
            {user.city}, {user.pincode}
          </Text>
          <Text style={styles.smallText}>P.S. - {user.police_station_id}</Text>
          <Text style={styles.smallText}>
            {user.state}, {user.country}
          </Text>
        </View>
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
    elevation: 4,
    shadowColor: AppColors.themeColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 60,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  avatarPlaceholder: {
    width: 50,
    height: 60,
    borderRadius: 6,
    backgroundColor: '#ccc',
  },
  userInfo: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontWeight: '700',
    fontSize: 13,
  },
  detail: {
    fontWeight: '700',
    fontSize: 12,
    color: '#333',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  acceptBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 6,
  },
  rejectBtn: {
    backgroundColor: '#F44336',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  expandToggle: {
    marginTop: 8,
    alignItems: 'center',
  },
  expandText: {
    fontSize: 10,
    color: '#555',
  },
  expandedContent: {
    marginTop: 8,
  },
  divider: {
    height: 0.5,
    backgroundColor: 'rgba(0,0,0,0.3)',
    marginVertical: 4,
  },
  sectionHeader: {
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 2,
  },
  smallText: {
    fontSize: 12,
    color: '#444',
    marginVertical: 1,
  },
  familyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  visitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    alignSelf: 'center',
  },
  visitBtnIcon: {
    fontSize: 16,
    color: '#7C4DFF',
    marginRight: 4,
  },
  visitBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7C4DFF',
  },
});

export default UserCard;

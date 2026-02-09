// import React, { useState } from 'react';
// import {
//   View, Text, TextInput, Image, 
//   TouchableOpacity, StyleSheet, Alert, 
//   ActivityIndicator, ScrollView, FlatList
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import * as ImagePicker from 'react-native-image-picker';
// import axios from 'axios';
// import {API_ROUTE} from '../api_routing/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import colors from '../theme/colors';

// const GroupCreateScreen = ({ navigation, route }) => {
//   const { selectedUsers = [] } = route.params;
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [image, setImage] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const pickImage = () => {
//     ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
//       if (response.assets && response.assets.length > 0) {
//         setImage(response.assets[0]);
//       }
//     });
//   };

//   const handleCreateGroup = async () => {
//     if (!name || !description || !image) {
//       Alert.alert('Required', 'Please fill all fields and select an image');
//       return;
//     }

//     setLoading(true);
//     const formData = new FormData();
//     formData.append('name', name);
//     formData.append('description', description);
    
//     selectedUsers.forEach(user => {
//       formData.append('members', user.id);
//     });

//     formData.append('image', {
//       uri: image.uri,
//       name: image.fileName || 'group.jpg',
//       type: image.type || 'image/jpeg',
//     });

//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.post(`${API_ROUTE}/groups/create/`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const groupSlug = name.toLowerCase().replace(/\s+/g, '-');
      
//       Alert.alert('Success', 'Group created successfully!');
//       navigation.navigate('BusinessGroupChat', {
//         receiverId: response.data.id,
//         name: name,
//         groupSlug: groupSlug, 
//         profile_image: image.uri,
//         chatType: 'group',
//       });
    
//     } catch (err) {
//       //console.error(err);
//       Alert.alert('Error', err.response?.data?.message || 'Failed to create group');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderMemberItem = ({ item }) => (
//     <View style={styles.memberItem}>
//       {item.profile_picture ? (
//         <Image source={{ uri: item.profile_picture }} style={styles.memberAvatar} />
//       ) : (
//         <View style={[styles.memberAvatar, styles.avatarPlaceholder]}>
//           <Icon name="person" size={20} color="#fff" />
//         </View>
//       )}
//       <Text style={styles.memberName}>{item.name || item.username}</Text>
//     </View>
//   );

//   return (
//     <SafeAreaView style={{flex:1}}>

//       <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.header}>Create New Group</Text>
      
//       {/* Selected Members Preview */}
//       <Text style={styles.sectionTitle}>Group Members ({selectedUsers.length})</Text>
//       <FlatList
//         horizontal
//         data={selectedUsers}
//         renderItem={renderMemberItem}
//         keyExtractor={item => item.id.toString()}
//         contentContainerStyle={styles.membersList}
//         showsHorizontalScrollIndicator={false}
//       />

//       {/* Group Info Form */}
//       <Text style={styles.sectionTitle}>Group Info</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Group Name"
//         value={name}
//         placeholderTextColor='#777'
//         onChangeText={setName}
//       />

//       <TextInput
//         style={[styles.input, styles.descriptionInput]}
//         placeholder="Group Description"
//         multiline
//         placeholderTextColor='#777'
//         value={description}
//         onChangeText={setDescription}
//       />

//       <Text style={styles.sectionTitle}>Group Image</Text>
//       <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
//         {image ? (
//           <Image source={{ uri: image.uri }} style={styles.image} />
//         ) : (
//           <View style={styles.imagePlaceholder}>
//             <Icon name="add-a-photo" size={30} color={colors.primary} />
//             <Text style={styles.imagePlaceholderText}>Add Group Image</Text>
//           </View>
//         )}
//       </TouchableOpacity>

//       <TouchableOpacity 
//         style={styles.button}
//         onPress={handleCreateGroup}
//         disabled={loading}
//       >
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>Create Group</Text>
//         )}
//       </TouchableOpacity>
//     </ScrollView>

//     </SafeAreaView>
    
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#444',
//     marginBottom: 10,
//     marginTop: 15,
//   },
//   membersList: {
//     paddingVertical: 10,
//   },
//   memberItem: {
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   memberAvatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginBottom: 5,
//   },
//   memberName: {
//     fontSize: 12,
//     color: '#666',
//     maxWidth: 60,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 12,
//     color:'#777',
//     fontSize: 16,
//     marginBottom: 15,
//     backgroundColor: '#fff',
//   },
//   descriptionInput: {
//     height: 100,
//     textAlignVertical: 'top',
//     color:'#555',
//   },
//   imagePicker: {
//     height: 150,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//     backgroundColor: '#f9f9f9',
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 8,
//   },
//   imagePlaceholder: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   imagePlaceholderText: {
//     color: '#666',
//     marginTop: 10,
//   },
//   button: {
//     backgroundColor: colors.primary,
//     borderRadius: 8,
//     padding: 15,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   avatarPlaceholder: {
//     backgroundColor: '#9CA3AF',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default GroupCreateScreen;
import React, { useState } from 'react';
import {
  View, Text, TextInput, Image, 
  TouchableOpacity, StyleSheet, Alert, 
  ActivityIndicator, ScrollView, FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import { API_ROUTE } from '../api_routing/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../src/context/ThemeContext';

const GroupCreateScreen = ({ navigation, route }) => {
  const { colors, isDark } = useTheme();
  const { selectedUsers = [] } = route.params;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);
      }
    });
  };

  const handleCreateGroup = async () => {
    if (!name || !description || !image) {
      Alert.alert('Required', 'Please fill all fields and select an image');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    
    selectedUsers.forEach(user => {
      formData.append('members', user.id);
    });

    formData.append('image', {
      uri: image.uri,
      name: image.fileName || 'group.jpg',
      type: image.type || 'image/jpeg',
    });

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(`${API_ROUTE}/groups/create/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      const groupSlug = name.toLowerCase().replace(/\s+/g, '-');
      
      Alert.alert('Success', 'Group created successfully!');
      navigation.navigate('BusinessGroupChat', {
        receiverId: response.data.id,
        name: name,
        groupSlug: groupSlug, 
        profile_image: image.uri,
        chatType: 'group',
      });
    
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const renderMemberItem = ({ item }) => (
    <View style={styles.memberItem}>
      {item.profile_picture ? (
        <Image source={{ uri: item.profile_picture }} style={styles.memberAvatar} />
      ) : (
        <View style={[styles.memberAvatar, styles.avatarPlaceholder, { backgroundColor: colors.textSecondary }]}>
          <Icon name="person" size={20} color={isDark ? colors.text : '#fff'} />
        </View>
      )}
      <Text style={[styles.memberName, { color: colors.textSecondary }]}>
        {item.name || item.username}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView 
        contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.header, { color: colors.text }]}>Create New Group</Text>
        
        {/* Selected Members Preview */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Group Members ({selectedUsers.length})
        </Text>
        <FlatList
          horizontal
          data={selectedUsers}
          renderItem={renderMemberItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.membersList}
          showsHorizontalScrollIndicator={false}
        />

        {/* Group Info Form */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Group Info</Text>
        <TextInput
          style={[styles.input, { 
            borderColor: colors.border,
            color: colors.text,
            backgroundColor: colors.card
          }]}
          placeholder="Group Name"
          placeholderTextColor={colors.textSecondary}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={[styles.input, styles.descriptionInput, { 
            borderColor: colors.border,
            color: colors.text,
            backgroundColor: colors.card
          }]}
          placeholder="Group Description"
          placeholderTextColor={colors.textSecondary}
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Group Image</Text>
        <TouchableOpacity 
          onPress={pickImage} 
          style={[styles.imagePicker, { 
            borderColor: colors.border,
            backgroundColor: colors.card
          }]}
        >
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Icon name="add-a-photo" size={30} color={colors.primary} />
              <Text style={[styles.imagePlaceholderText, { color: colors.textSecondary }]}>
                Add Group Image
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleCreateGroup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Group</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 15,
  },
  membersList: {
    paddingVertical: 10,
  },
  memberItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  memberName: {
    fontSize: 12,
    maxWidth: 60,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePicker: {
    height: 150,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    marginTop: 10,
  },
  button: {
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GroupCreateScreen;
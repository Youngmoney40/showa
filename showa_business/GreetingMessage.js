// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   StatusBar,
//   Alert,
//   Modal,
//   Switch,
//   Platform,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_ROUTE } from '../api_routing/api';
// import { useTheme } from '../src/context/ThemeContext'; 

// export default function GreetingMessageScreen({ navigation }) {
//   const { colors, isDark } = useTheme(); 
//   const [showExample, setShowExample] = useState(false);
//   const [text, setText] = useState({
//     greeting_text: '',
//     away_text: '',
//     is_away_enabled: false,
//     auto_greeting_enabled: true,
//   });

//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   const fetchSettings = async () => {
//     const token = await AsyncStorage.getItem('userToken');
//     if (token) {
//       try {
//         const res = await axios.get(`${API_ROUTE}/messaging-settings/`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (res.data) {
//           setText(res.data);
//         } else {
//           setText({
//             greeting_text: '',
//             away_text: '',
//             is_away_enabled: false,
//             auto_greeting_enabled: true,
//           });
//         }
//       } catch (error) {
//         setText({
//           greeting_text: '',
//           away_text: '',
//           is_away_enabled: false,
//           auto_greeting_enabled: true,
//         });
//       }
//     }
//   };

//   const saveSettings = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) {
//         return Alert.alert('You must be logged in to save settings.');
//       }
//       const res = await axios.post(`${API_ROUTE}/messaging-settings/`, text, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (res.status === 200) {
//         Alert.alert('Greeting Message saved successfully!');
//         navigation.goBack();
//       } 
//     } catch (error) {
//       console.error('Error saving settings:', error);
//     }
//   };

//   return (
//     <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
//       <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.primary} />
//       <View style={[styles.container, { backgroundColor: colors.background }]}>
        
//         <View style={[styles.header, { backgroundColor: colors.primary }]}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Icon name="close" size={24} color="#fff" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Greeting Message</Text>
//           <TouchableOpacity onPress={saveSettings}>
//             <Text style={styles.saveText}>Save</Text>
//           </TouchableOpacity>
//         </View>

//         <ScrollView contentContainerStyle={styles.content}>
//           <Text style={[styles.label, { color: colors.text }]}>Message</Text>

//           <TextInput
//             multiline
//             value={text.greeting_text}
//             placeholderTextColor={colors.textSecondary}
//             onChangeText={text => setText({ ...text, greeting_text: text })}
//             placeholder="Enter your message..."
//             style={[styles.textArea, { 
//               borderColor: colors.border,
//               color: colors.text,
//               backgroundColor: colors.card 
//             }]}
//             maxLength={200}
//           />
          
//           <View style={styles.row}>
//             <TouchableOpacity>
//               <Icon name="emoji-emotions" size={24} color={colors.textSecondary} />
//             </TouchableOpacity>
//             <Text style={[styles.charCount, { color: colors.textSecondary }]}>
//               {text.greeting_text.length}/200
//             </Text>
//           </View>

//           <View style={styles.toggleRow}>
//             <Text style={{ color: colors.text }}>Enable Greeting</Text>
//             <Switch
//               value={text.auto_greeting_enabled}
//               onValueChange={val => setText({ ...text, auto_greeting_enabled: val })}
//               trackColor={{ false: colors.border, true: colors.primary }}
//               thumbColor={Platform.OS === 'ios' ? colors.text : text.auto_greeting_enabled ? colors.primary : colors.textSecondary}
//               ios_backgroundColor={colors.border}
//             />
//           </View>

//           <TouchableOpacity 
//             style={styles.exampleButton} 
//             onPress={() => setShowExample(true)}
//           >
//             <Text style={[styles.exampleText, { color: colors.primary }]}>See example</Text>
//           </TouchableOpacity>
          
//           {showExample && (
//             <Modal
//               transparent={true}
//               visible={showExample}
//               onRequestClose={() => setShowExample(false)}
//               animationType="fade"
//             >
//               <View style={styles.modalOverlay}>
//                 <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
//                   <Text style={[styles.modalTitle, { color: colors.text }]}>Greeting Message Example</Text>
//                   <View style={[styles.chatBubble, { 
//                     backgroundColor: isDark ? '#2d5a27' : '#dcf8c6' 
//                   }]}>
//                     <Text style={[styles.chatText, { 
//                       color: isDark ? '#e0f2d2' : '#222' 
//                     }]}>{text.greeting_text || 'Hello! How can I help you today?'}</Text>
//                   </View>
//                   <TouchableOpacity 
//                     onPress={() => setShowExample(false)} 
//                     style={[styles.closeModalBtn, { backgroundColor: colors.primary }]}
//                   >
//                     <Text style={styles.closeModalText}>Close</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </Modal>
//           )}

//         </ScrollView>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
   
//   },
//   header: {
//     backgroundColor: '#0d64dd',
//     paddingTop: Platform.OS === 'ios' ? 25 : 35,
//     paddingBottom: 25,
//     paddingHorizontal: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   headerTitle: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   saveText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   content: {
//     padding: 16,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '500',
   
//     marginBottom: 8,
//   },
//   textArea: {
//     height: 120,
//     borderWidth: 1,
   
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 15,
    
//     textAlignVertical: 'top',
//     marginBottom: 8,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   charCount: {
//     fontSize: 12,
    
//   },
//   exampleButton: {
//     marginTop: 20,
//     alignSelf: 'flex-start',
//   },
//   exampleText: {
//     fontSize: 14,
   
//     fontWeight: '500',
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     paddingHorizontal: 20,
//   },
//   modalContent: {
//     // backgroundColor handled inline
//     padding: 20,
//     borderRadius: 10,
//     width: '100%',
//     maxWidth: 320,
//     alignItems: 'center',
//     elevation: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//   },
//   modalTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 10,
    
//   },
//   chatBubble: {
//     padding: 12,
//     borderRadius: 10,
//     alignSelf: 'stretch',
//     marginBottom: 20,
//   },
//   chatText: {
//     fontSize: 14,
//     lineHeight: 20,
//   },
//   closeModalBtn: {
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     borderRadius: 6,
//   },
//   closeModalText: {
//     color: '#fff',
//     fontWeight: '500',
//     fontSize: 14,
//   },
//   toggleRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 10,
//   },
// });

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Modal,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE } from '../api_routing/api';
import { useTheme } from '../src/context/ThemeContext';

export default function GreetingMessageScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const [showExample, setShowExample] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [text, setText] = useState({
    greeting_text: '',
    away_text: '',
    is_away_enabled: false,
    auto_greeting_enabled: false, // OFF by default
    business_start: null,
    business_end: null,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      try {
        const res = await axios.get(`${API_ROUTE}/messaging-settings/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data) {
          setText({
            greeting_text: res.data.greeting_text || '',
            away_text: res.data.away_text || '',
            is_away_enabled: res.data.is_away_enabled || false,
            auto_greeting_enabled: res.data.auto_greeting_enabled || false, // Will be false if not set
            business_start: res.data.business_start || null,
            business_end: res.data.business_end || null,
          });
        }
      } catch (error) {
        // Keep defaults if error
        console.log('Using default settings');
      }
    }
  };

  const saveSettings = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        return Alert.alert('You must be logged in to save settings.');
      }
      
      const saveData = {
        greeting_text: text.greeting_text,
        away_text: text.away_text,
        is_away_enabled: text.is_away_enabled,
        auto_greeting_enabled: text.auto_greeting_enabled,
        business_start: text.business_start,
        business_end: text.business_end,
      };

      const res = await axios.post(`${API_ROUTE}/messaging-settings/`, saveData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        Alert.alert('Success', 'Settings saved successfully!');
        navigation.goBack();
      } 
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const onStartTimeChange = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) {
      const timeString = selectedDate.toTimeString().split(' ')[0];
      setText({ ...text, business_start: timeString });
    }
  };

  const onEndTimeChange = (event, selectedDate) => {
    setShowEndPicker(false);
    if (selectedDate) {
      const timeString = selectedDate.toTimeString().split(' ')[0];
      setText({ ...text, business_end: timeString });
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not set';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.primary} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Auto Reply Settings</Text>
          <TouchableOpacity onPress={saveSettings}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          
          {/* Auto Greeting Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="chat" size={24} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Auto Greeting</Text>
            </View>
            
            <View style={styles.toggleContainer}>
              <Text style={[styles.toggleLabel, { color: colors.text }]}>
                Send automatic greeting when someone messages you
              </Text>
              <View style={styles.toggleRow}>
                <Text style={[styles.toggleStatus, { color: text.auto_greeting_enabled ? '#4CAF50' : '#FF6B6B' }]}>
                  {text.auto_greeting_enabled ? 'ON' : 'OFF'}
                </Text>
                <Switch
                  value={text.auto_greeting_enabled}
                  onValueChange={val => setText({ ...text, auto_greeting_enabled: val })}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={Platform.OS === 'ios' ? colors.text : text.auto_greeting_enabled ? colors.primary : colors.textSecondary}
                  ios_backgroundColor={colors.border}
                />
              </View>
            </View>

            {text.auto_greeting_enabled && (
              <>
                <Text style={[styles.label, { color: colors.text }]}>Greeting Message</Text>
                <TextInput
                  multiline
                  value={text.greeting_text}
                  placeholderTextColor={colors.textSecondary}
                  onChangeText={val => setText({ ...text, greeting_text: val })}
                  placeholder="e.g. Hi there! Thanks for reaching out. How can I help you today?"
                  style={[styles.textArea, { 
                    borderColor: colors.border,
                    color: colors.text,
                    backgroundColor: colors.card 
                  }]}
                  maxLength={200}
                />
                
                <View style={styles.row}>
                  <TouchableOpacity>
                    <Icon name="emoji-emotions" size={24} color={colors.textSecondary} />
                  </TouchableOpacity>
                  <Text style={[styles.charCount, { color: colors.textSecondary }]}>
                    {text.greeting_text.length}/200
                  </Text>
                </View>

                <View style={styles.infoBox}>
                  <Icon name="info" size={16} color={colors.primary} />
                  <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                    This message will be sent automatically when someone messages you for the first time.
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Away Mode Section */}
          <View style={styles.section}>
            {/* <View style={styles.sectionHeader}>
              <Icon name="access-time" size={24} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Away Mode</Text>
            </View>
            
            <View style={styles.toggleContainer}>
              <Text style={[styles.toggleLabel, { color: colors.text }]}>
                Automatically reply when you're away
              </Text>
              <View style={styles.toggleRow}>
                <Text style={[styles.toggleStatus, { color: text.is_away_enabled ? '#4CAF50' : '#FF6B6B' }]}>
                  {text.is_away_enabled ? 'ON' : 'OFF'}
                </Text>
                <Switch
                  value={text.is_away_enabled}
                  onValueChange={val => setText({ ...text, is_away_enabled: val })}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={Platform.OS === 'ios' ? colors.text : text.is_away_enabled ? colors.primary : colors.textSecondary}
                  ios_backgroundColor={colors.border}
                />
              </View>
            </View> */}

          {text.is_away_enabled && ( 
              <>
                {/* <Text style={[styles.label, { color: colors.text }]}>Away Message</Text> */}
                {/* <TextInput
                  multiline
                  value={text.away_text}
                  placeholderTextColor={colors.textSecondary}
                  onChangeText={val => setText({ ...text, away_text: val })}
                  placeholder="e.g. I'm currently away. I'll get back to you as soon as possible."
                  style={[styles.textArea, { 
                    borderColor: colors.border,
                    color: colors.text,
                    backgroundColor: colors.card 
                  }]}
                  maxLength={200}
                /> */}

                {/* <Text style={[styles.subSectionTitle, { color: colors.text }]}>Business Hours (Optional)</Text>
                <Text style={[styles.hintText, { color: colors.textSecondary }]}>
                  Set your business hours. Away message will only be sent outside these hours.
                </Text> */}

                {/* <View style={styles.timeContainer}>
                  <View style={styles.timeInput}>
                    <Text style={[styles.timeLabel, { color: colors.text }]}>Start Time</Text>
                    <TouchableOpacity 
                      style={[styles.timeButton, { borderColor: colors.border, backgroundColor: colors.card }]}
                      onPress={() => setShowStartPicker(true)}
                    >
                      <Text style={{ color: colors.text }}>
                        {text.business_start ? formatTime(text.business_start) : 'Set start time'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.timeInput}>
                    <Text style={[styles.timeLabel, { color: colors.text }]}>End Time</Text>
                    <TouchableOpacity 
                      style={[styles.timeButton, { borderColor: colors.border, backgroundColor: colors.card }]}
                      onPress={() => setShowEndPicker(true)}
                    >
                      <Text style={{ color: colors.text }}>
                        {text.business_end ? formatTime(text.business_end) : 'Set end time'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View> */}

                {/* {showStartPicker && (
                  <DateTimePicker
                    value={new Date()}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={onStartTimeChange}
                  />
                )} */}

                {/* {showEndPicker && (
                  <DateTimePicker
                    value={new Date()}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={onEndTimeChange}
                  />
                )} */}

                {/* <View style={styles.infoBox}>
                  <Icon name="info" size={16} color={colors.primary} />
                  <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                    {text.away_text ? '✓ Away message is set' : '⚠️ No away message set'}
                  </Text>
                </View> */}
              </>
            )}
          </View>

          {/* Preview Button - Only show if any feature is enabled */}
          {/* {(text.auto_greeting_enabled || text.is_away_enabled) && (
            <TouchableOpacity 
              style={[styles.previewButton, { backgroundColor: colors.card, borderColor: colors.primary }]} 
              onPress={() => setShowExample(true)}
            >
              <Icon name="visibility" size={20} color={colors.primary} />
              <Text style={[styles.previewText, { color: colors.primary }]}>Preview Auto Reply</Text>
            </TouchableOpacity>
          )}
           */}
          {/* Example Modal */}
          {/* {showExample && (
            <Modal
              transparent={true}
              visible={showExample}
              onRequestClose={() => setShowExample(false)}
              animationType="fade"
            >
              <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                  <Icon name="chat" size={40} color={colors.primary} />
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    {text.is_away_enabled && text.away_text ? 'Away Message' : 'Greeting Message'}
                  </Text>
                  
                  <View style={[styles.chatBubble, { 
                    backgroundColor: isDark ? '#2d5a27' : '#dcf8c6' 
                  }]}>
                    <Text style={[styles.chatText, { 
                      color: isDark ? '#e0f2d2' : '#222' 
                    }]}>
                      {text.is_away_enabled && text.away_text ? text.away_text : 
                       text.greeting_text || 'Hello! How can I help you today?'}
                    </Text>
                  </View>
                  
                  <Text style={[styles.modalHint, { color: colors.textSecondary }]}>
                    This is how your message will appear to customers
                  </Text>
                  
                  <TouchableOpacity 
                    onPress={() => setShowExample(false)} 
                    style={[styles.closeModalBtn, { backgroundColor: colors.primary }]}
                  >
                    <Text style={styles.closeModalText}>Close Preview</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )} */}

          {/* Summary Card */}
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Current Settings</Text>
            
            <View style={styles.summaryItem}>
              <Icon name="chat" size={18} color={text.auto_greeting_enabled ? '#4CAF50' : '#999'} />
              <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
                Auto Greeting: <Text style={{ fontWeight: '600', color: text.auto_greeting_enabled ? '#4CAF50' : '#FF6B6B' }}>
                  {text.auto_greeting_enabled ? 'ON' : 'OFF'}
                </Text>
              </Text>
            </View>
            
            {text.auto_greeting_enabled && text.greeting_text ? (
              <Text style={[styles.summaryDetail, { color: colors.textSecondary }]}>
                "{text.greeting_text.substring(0, 40)}{text.greeting_text.length > 40 ? '...' : ''}"
              </Text>
            ) : null}
            
            {/* <View style={styles.summaryItem}>
              <Icon name="access-time" size={18} color={text.is_away_enabled ? '#4CAF50' : '#999'} />
              <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
                Away Mode: <Text style={{ fontWeight: '600', color: text.is_away_enabled ? '#4CAF50' : '#FF6B6B' }}>
                  {text.is_away_enabled ? 'ON' : 'OFF'}
                </Text>
              </Text>
            </View> */}
            
            {/* {text.is_away_enabled && text.away_text ? (
              <Text style={[styles.summaryDetail, { color: colors.textSecondary }]}>
                "{text.away_text.substring(0, 40)}{text.away_text.length > 40 ? '...' : ''}"
              </Text>
            ) : null} */}
            
            {/* {text.business_start && text.business_end && (
              <View style={styles.summaryItem}>
                <Icon name="schedule" size={18} color="#999" />
                <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
                  Hours: {formatTime(text.business_start)} - {formatTime(text.business_end)}
                </Text>
              </View>
            )} */}
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#0d64dd',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  toggleContainer: {
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 8,
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  charCount: {
    fontSize: 12,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 4,
  },
  hintText: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 16,
  },
  timeInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  timeLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  timeButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginVertical: 20,
  },
  previewText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
  },
  modalContent: {
    padding: 24,
    borderRadius: 16,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 16,
  },
  chatBubble: {
    padding: 16,
    borderRadius: 12,
    alignSelf: 'stretch',
    marginBottom: 12,
  },
  chatText: {
    fontSize: 15,
    lineHeight: 22,
  },
  modalHint: {
    fontSize: 12,
    marginBottom: 20,
  },
  closeModalBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  closeModalText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  summaryCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    marginLeft: 8,
  },
  summaryDetail: {
    fontSize: 13,
    marginLeft: 26,
    marginBottom: 8,
    fontStyle: 'italic',
  },
});
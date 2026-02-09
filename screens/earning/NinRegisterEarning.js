// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   Animated,
//   StatusBar,
//   Keyboard,
//   TouchableWithoutFeedback,
//   Platform
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { ScrollView } from 'react-native-gesture-handler';

// export default function IdentityVerificationPlatform({navigation}) {
  
//   const [step, setStep] = useState(1); 
//   const [nin, setNin] = useState('');
//   const [answers, setAnswers] = useState({ q1: '', q2: '' });
//   const [loading, setLoading] = useState(false);
//   const [userBalance, setUserBalance] = useState(0);
//   const [isVerified, setIsVerified] = useState(false);
//   const [verificationAttempts, setVerificationAttempts] = useState(0);
//   const [fadeAnim] = useState(new Animated.Value(0));
//   const inputRef = useRef(null);

//   // --- Animation Effects ---
//   useEffect(() => {
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 500,
//       useNativeDriver: true,
//     }).start();
//   }, [step]);


//   useEffect(() => {
//     if (step === 1) {
//       const timer = setTimeout(() => {
//         if (inputRef.current) {
//           inputRef.current.focus();
//         }
//       }, 300);
//       return () => clearTimeout(timer);
//     }
//   }, [step]);


//   const verifyNIN = async (ninNumber) => {
//     setLoading(true);
    
 
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         const isValid = /^\d{11}$/.test(ninNumber); // Basic 11-digit validation
//         const isNotFraudulent = verificationAttempts < 3;
        
//         if (isValid && isNotFraudulent) {
//           resolve({
//             success: true,
//             verified: true,
//             data: {
//               firstName: 'John',
//               lastName: 'Doe',
//               dateOfBirth: '1990-01-01',
//               verificationId: `VER-${Date.now()}`
//             }
//           });
//         } else {
//           resolve({
//             success: false,
//             error: verificationAttempts >= 3 
//               ? 'Maximum verification attempts reached. Please contact support.' 
//               : 'Invalid NIN format. Please enter 11 digits.',
//             code: verificationAttempts >= 3 ? 'MAX_ATTEMPTS' : 'INVALID_NIN'
//           });
//         }
//       }, 1500);
//     });
//   };

//   const awardReward = async (userId, amount) => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({
//           success: true,
//           transactionId: `TX-${Date.now()}`,
//           amount,
//           timestamp: new Date().toISOString()
//         });
//       }, 800);
//     });
//   };

//   const submitSurvey = async (surveyData) => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({
//           success: true,
//           reward: 50, 
//           surveyId: `SUR-${Date.now()}`
//         });
//       }, 1000);
//     });
//   };

//   // --- Handlers ---
//   const handleVerifyNin = async () => {
//     // Dismiss keyboard first
//     Keyboard.dismiss();
    
//     if (!nin.trim()) {
//       Alert.alert('Input Required', 'Please enter your NIN');
//       return;
//     }

//     setLoading(true);
//     setVerificationAttempts(prev => prev + 1);

//     try {
//       const verification = await verifyNIN(nin.trim());
      
//       if (verification.success && verification.verified) {
//         // Award reward
//         const rewardResult = await awardReward('user-id', 100);
        
//         if (rewardResult.success) {
//           setIsVerified(true);
//           setUserBalance(prev => prev + 100);
          
//           Alert.alert(
//             '🎉 Verification Successful!',
//             `Your identity has been verified.\n\n🎁 700 coins have been credited to your account!\nTransaction ID: ${rewardResult.transactionId}`,
//             [
//               {
//                 text: 'Continue to Survey',
//                 onPress: () => {
//                   setStep(2);
//                   setLoading(false);
//                 }
//               }
//             ]
//           );
//         }
//       } else {
//         Alert.alert(
//           'Verification Failed',
//           verification.error || 'Unable to verify NIN. Please try again.',
//           [{ 
//             text: 'OK', 
//             onPress: () => {
//               setLoading(false);
//               // Refocus input after alert
//               setTimeout(() => {
//                 if (inputRef.current) {
//                   inputRef.current.focus();
//                 }
//               }, 100);
//             }
//           }]
//         );
//       }
//     } catch (error) {
//       Alert.alert('Network Error', 'Please check your connection and try again.');
//       setLoading(false);
//     }
//   };

//   const handleSurveySubmit = async () => {
//     if (!answers.q1 || !answers.q2) {
//       Alert.alert('Incomplete Survey', 'Please answer all questions');
//       return;
//     }

//     setLoading(true);
    
//     try {
//       const surveyResult = await submitSurvey(answers);
      
//       if (surveyResult.success) {
//         setUserBalance(prev => prev + surveyResult.reward);
        
//         Alert.alert(
//           '✅ Survey Completed!',
//           `Thank you for your feedback!\n\n🎁 ${surveyResult.reward} bonus coins awarded!\nCheckout your wallet to confirm `,
//           [
//             {
//               text: 'Finish',
//               onPress: () => {
                
//                 setNin('');
//                 setAnswers({ q1: '', q2: '' });
//                 setIsVerified(false);
//                 setLoading(false);
//                 navigation.navigate('EarningDashbord');
//               }
//             }
//           ]
//         );
//       }
//     } catch (error) {
//       Alert.alert('Submission Failed', 'Unable to submit survey. Please try again.');
//       setLoading(false);
//     }
//   };

//   const handleAnswer = (question, value) => {
//     setAnswers({ ...answers, [question]: value });
//   };

//   const Header = () => (
//     <View style={styles.header}>
//       <View style={styles.headerTop}>
//         <View style={{display:'flex', flexDirection:'column', paddingHorizontal:10, marginTop:10}}>
//           <View style={{display:'flex', flexDirection:'row', alignContent:'center'}}>
//             <TouchableOpacity onPress={()=>navigation.goBack()}>
//               <Icon name='arrow-back' size={30} color='black' />
//             </TouchableOpacity>
//             <View style={{marginLeft:10}}>
//               <Text style={styles.logo}>{'Verify your account to earn \n 700 coins $1.40'}</Text>
//               <Text style={styles.sublogo}>{'Verify your identity to earn rewards and unlock \ntrusted-user benefits'}</Text>
//             </View>
//             </View>
          
//         </View>
//       </View>
//       <View style={styles.progressBar}>
//         <View style={[styles.progressStep, step >= 1 && styles.progressStepActive]}>
//           <Text style={styles.progressText}>1</Text>
//         </View>
//         <View style={[styles.progressLine, step >= 2 && styles.progressLineActive]} />
//         <View style={[styles.progressStep, step >= 2 && styles.progressStepActive]}>
//           <Text style={styles.progressText}>2</Text>
//         </View>
//       </View>
//       <Text style={styles.progressLabel}>
//         {step === 1 ? 'Identity Verification' : 'User Survey'}
//       </Text>
//     </View>
//   );

//   const Button = ({ title, onPress, icon, variant = 'primary', disabled }) => (
//     <TouchableOpacity
//       style={[
//         styles.button,
//         variant === 'secondary' && styles.buttonSecondary,
//         disabled && styles.buttonDisabled
//       ]}
//       onPress={onPress}
//       disabled={disabled || loading}
//       activeOpacity={0.7}
//     >
//       {icon && <Icon name={icon} size={22} color="#fff" style={{ marginRight: 8 }} />}
//       {loading ? (
//         <ActivityIndicator color="#fff" />
//       ) : (
//         <Text style={styles.buttonText}>{title}</Text>
//       )}
//     </TouchableOpacity>
//   );

//   const InfoCard = ({ icon, title, description }) => (
//     <View style={styles.infoCard}>
//       <Icon name={icon} size={28} color="#0d64dd" />
//       <View style={styles.infoContent}>
//         <Text style={styles.infoTitle}>{title}</Text>
//         <Text style={styles.infoDescription}>{description}</Text>
//       </View>
//     </View>
//   );

//   return (
//     <TouchableWithoutFeedback 
//       onPress={() => Keyboard.dismiss()}
//       style={{ flex: 1 }}
//     >
//       <SafeAreaView style={styles.safeArea}>
//         <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
        
//         <View style={styles.container}>
//           <Header />
          
//           <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
//             {step === 1 ? (
//               <ScrollView>
//                     <View style={styles.stepContainer}>
//                     <Text style={styles.stepTitle}>Verify Your Identity</Text>
//                     <Text style={styles.stepSubtitle}>
//                       Enter your National Identification Number for verification
//                     </Text>
                    
//                     <View style={styles.formContainer}>
//                       {/* Custom Input Field with proper focus handling */}
//                       <TouchableWithoutFeedback 
//                         onPress={() => inputRef.current?.focus()}
//                         accessible={false}
//                       >
//                         <View style={styles.inputContainer}>
//                           <Icon name="fingerprint" size={24} color="#0d64dd" style={styles.inputIcon} />
//                           <TextInput
//                             ref={inputRef}
//                             style={styles.input}
//                             placeholder="Enter 11-digit NIN"
//                             placeholderTextColor="#999"
//                             value={nin}
//                             onChangeText={setNin}
//                             keyboardType="number-pad"
//                             maxLength={11}
//                             editable={!loading}
//                             autoFocus={true}
//                             blurOnSubmit={false}
//                             returnKeyType="done"
//                             onSubmitEditing={handleVerifyNin}
//                             contextMenuHidden={false}
//                             showSoftInputOnFocus={true}
//                           />
//                           {nin.length > 0 && (
//                             <TouchableOpacity 
//                               onPress={() => {
//                                 setNin('');
//                                 inputRef.current?.focus();
//                               }}
//                               style={styles.clearButton}
//                               hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//                             >
//                               <Icon name="close" size={20} color="#999" />
//                             </TouchableOpacity>
//                           )}
//                         </View>
//                       </TouchableWithoutFeedback>
                      
//                       <Button
//                         title="Verify & Get 700 Coins"
//                         onPress={handleVerifyNin}
//                         icon="verified"
//                         disabled={nin.length !== 11}
//                       />
                      
//                       {verificationAttempts > 0 && (
//                         <Text style={styles.attemptsText}>
//                           Attempts: {verificationAttempts}/3
//                         </Text>
//                       )}
//                     </View>
                    
//                     <View style={styles.featuresContainer}>
//                       <InfoCard
//                         icon="security"
//                         title="Secure Verification"
//                         description="Bank-level encryption protects your data"
//                       />
//                       <InfoCard
//                         icon="attach-money"
//                         title="Instant Reward"
//                         description="Receive 700 coins immediately upon successful verification"
//                       />
//                       <InfoCard
//                         icon="privacy-tip"
//                         title="Privacy First"
//                         description="Your data is never shared with third parties"
//                       />
//                     </View>
                    
                    
//                   </View>
//               </ScrollView>
              
//             ) : (
//               <ScrollView>
//                   <View style={styles.stepContainer}>
//                   <Text style={styles.stepTitle}>Help Us Improve</Text>
//                   <Text style={styles.stepSubtitle}>
//                     Complete this short survey to earn extra coins
//                   </Text>
                  
//                   <View style={styles.surveyContainer}>
//                     <Text style={styles.question}>
//                       1. Which type of content do you prefer on social platforms?
//                     </Text>
//                     <View style={styles.optionContainer}>
//                       {['Videos', 'Articles', 'Images', 'Audio/Podcasts'].map((option) => (
//                         <TouchableOpacity
//                           key={option}
//                           style={[
//                             styles.option,
//                             answers.q1 === option && styles.optionSelected
//                           ]}
//                           onPress={() => handleAnswer('q1', option)}
//                           activeOpacity={0.7}
//                         >
//                           <Icon
//                             name={answers.q1 === option ? 'radio-button-checked' : 'radio-button-unchecked'}
//                             size={24}
//                             color={answers.q1 === option ? '#0d64dd' : '#999'}
//                           />
//                           <Text style={styles.optionText}>{option}</Text>
//                         </TouchableOpacity>
//                       ))}
//                     </View>
                    
//                     <Text style={styles.question}>
//                       2. How often do you use social media apps?
//                     </Text>
//                     <View style={styles.optionContainer}>
//                       {['Hourly', 'Daily', 'Weekly', 'Occasionally'].map((option) => (
//                         <TouchableOpacity
//                           key={option}
//                           style={[
//                             styles.option,
//                             answers.q2 === option && styles.optionSelected
//                           ]}
//                           onPress={() => handleAnswer('q2', option)}
//                           activeOpacity={0.7}
//                         >
//                           <Icon
//                             name={answers.q2 === option ? 'radio-button-checked' : 'radio-button-unchecked'}
//                             size={24}
//                             color={answers.q2 === option ? '#0d64dd' : '#999'}
//                           />
//                           <Text style={styles.optionText}>{option}</Text>
//                         </TouchableOpacity>
//                       ))}
//                     </View>
                    
//                     <Button
//                       title={`Submit Survey & Get 50 Coins`}
//                       onPress={handleSurveySubmit}
//                       icon="send"
//                       disabled={!answers.q1 || !answers.q2}
//                     />
//                   </View>
                  
//                   <View style={styles.rewardNote}>
//                     <Icon name="info" size={20} color="#0d64dd" />
//                     <Text style={styles.rewardNoteText}>
//                       You'll receive 50 bonus coins upon survey completion
//                     </Text>
//                   </View>
//                 </View>
//               </ScrollView>
             
//             )}
//           </Animated.View>
//         </View>
//       </SafeAreaView>
//     </TouchableWithoutFeedback>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#F8F9FA',
//   },
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   header: {
//     marginBottom: 30,
//   },
//   headerTop: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   logo: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: '#0d64dd',
//     letterSpacing: -0.5,
//     lineHeight: 34,
//   },
//   sublogo: {
//     fontSize: 16,
//     color: '#2d2b2bff',
//     marginTop: 5,
//     lineHeight: 22,
//   },
//   progressBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 8,
//   },
//   progressStep: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: '#E0E0E0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   progressStepActive: {
//     backgroundColor: '#0d64dd',
//   },
//   progressText: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 16,
//   },
//   progressLine: {
//     width: 60,
//     height: 2,
//     backgroundColor: '#E0E0E0',
//     marginHorizontal: 10,
//   },
//   progressLineActive: {
//     backgroundColor: '#0d64dd',
//   },
//   progressLabel: {
//     textAlign: 'center',
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginTop: 10,
//   },
//   stepContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 24,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 5,
//     flex: 1,
//   },
//   stepTitle: {
//     fontSize: 26,
//     fontWeight: '700',
//     color: '#333',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   stepSubtitle: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 30,
//     lineHeight: 22,
//   },
//   formContainer: {
//     marginBottom: 30,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#E8E8E8',
//     backgroundColor: '#F8F9FA',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     marginBottom: 20,
//   },
//   inputIcon: {
//     marginRight: 12,
//   },
//   input: {
//     flex: 1,
//     fontSize: 18,
//     color: '#333',
//     fontWeight: '500',
//     padding: 0,
//     margin: 0,
//     height: 28,
//     includeFontPadding: false,
//     textAlignVertical: 'center',
//   },
//   clearButton: {
//     padding: 4,
//     marginLeft: 8,
//   },
//   button: {
//     backgroundColor: '#0d64dd',
//     paddingVertical: 18,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     shadowColor: '#0d64dd',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   buttonSecondary: {
//     backgroundColor: '#6C757D',
//   },
//   buttonDisabled: {
//     backgroundColor: '#CCCCCC',
//     shadowOpacity: 0,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 17,
//     fontWeight: '700',
//   },
//   attemptsText: {
//     textAlign: 'center',
//     color: '#666',
//     fontSize: 14,
//     marginTop: 12,
//     fontStyle: 'italic',
//   },
//   featuresContainer: {
//     marginBottom: 25,
//   },
//   infoCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F0F2FF',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//   },
//   infoContent: {
//     flex: 1,
//     marginLeft: 16,
//   },
//   infoTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 4,
//   },
//   infoDescription: {
//     fontSize: 14,
//     color: '#666',
//     lineHeight: 18,
//   },
//   termsContainer: {
//     borderTopWidth: 1,
//     borderTopColor: '#EEE',
//     paddingTop: 20,
//   },
//   termsText: {
//     fontSize: 13,
//     color: '#888',
//     textAlign: 'center',
//     lineHeight: 18,
//   },
//   link: {
//     color: '#0d64dd',
//     fontWeight: '600',
//   },
//   surveyContainer: {
//     marginBottom: 25,
//   },
//   question: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 16,
//     marginTop: 24,
//   },
//   optionContainer: {
//     marginBottom: 20,
//   },
//   option: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F8F9FA',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 10,
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },
//   optionSelected: {
//     backgroundColor: '#F0F2FF',
//     borderColor: '#0d64dd',
//   },
//   optionText: {
//     fontSize: 16,
//     color: '#333',
//     marginLeft: 12,
//     fontWeight: '500',
//   },
//   rewardNote: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#F0F2FF',
//     borderRadius: 12,
//     padding: 16,
//     marginTop: 20,
//   },
//   rewardNoteText: {
//     fontSize: 14,
//     color: '#0d64dd',
//     fontWeight: '600',
//     marginLeft: 10,
//   },
// });
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Animated,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme } from '../../src/context/ThemeContext'; 

export default function IdentityVerificationPlatform({navigation}) {

  const { theme, toggleTheme, isDark, isAuto, colors } = useTheme();
  
  const [step, setStep] = useState(1); 
  const [nin, setNin] = useState('');
  const [answers, setAnswers] = useState({ q1: '', q2: '' });
  const [loading, setLoading] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const inputRef = useRef(null);

  useEffect(() => {
    console.log('Theme state in IdentityVerification:', { theme, isDark, isAuto });
  }, [theme, isDark, isAuto]);

  // --- Animation Effects ---
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [step]);

  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const verifyNIN = async (ninNumber) => {
    setLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const isValid = /^\d{11}$/.test(ninNumber); // Basic 11-digit validation
        const isNotFraudulent = verificationAttempts < 3;
        
        if (isValid && isNotFraudulent) {
          resolve({
            success: true,
            verified: true,
            data: {
              firstName: 'John',
              lastName: 'Doe',
              dateOfBirth: '1990-01-01',
              verificationId: `VER-${Date.now()}`
            }
          });
        } else {
          resolve({
            success: false,
            error: verificationAttempts >= 3 
              ? 'Maximum verification attempts reached. Please contact support.' 
              : 'Invalid NIN format. Please enter 11 digits.',
            code: verificationAttempts >= 3 ? 'MAX_ATTEMPTS' : 'INVALID_NIN'
          });
        }
      }, 1500);
    });
  };

  const awardReward = async (userId, amount) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `TX-${Date.now()}`,
          amount,
          timestamp: new Date().toISOString()
        });
      }, 800);
    });
  };

  const submitSurvey = async (surveyData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          reward: 50, 
          surveyId: `SUR-${Date.now()}`
        });
      }, 1000);
    });
  };

  // --- Handlers ---
  const handleVerifyNin = async () => {
    // Dismiss keyboard first
    Keyboard.dismiss();
    
    if (!nin.trim()) {
      Alert.alert('Input Required', 'Please enter your NIN');
      return;
    }

    setLoading(true);
    setVerificationAttempts(prev => prev + 1);

    try {
      const verification = await verifyNIN(nin.trim());
      
      if (verification.success && verification.verified) {
        // Award reward
        const rewardResult = await awardReward('user-id', 100);
        
        if (rewardResult.success) {
          setIsVerified(true);
          setUserBalance(prev => prev + 100);
          
          Alert.alert(
            '🎉 Verification Successful!',
            `Your identity has been verified.\n\n🎁 700 coins have been credited to your account!\nTransaction ID: ${rewardResult.transactionId}`,
            [
              {
                text: 'Continue to Survey',
                onPress: () => {
                  setStep(2);
                  setLoading(false);
                }
              }
            ]
          );
        }
      } else {
        Alert.alert(
          'Verification Failed',
          verification.error || 'Unable to verify NIN. Please try again.',
          [{ 
            text: 'OK', 
            onPress: () => {
              setLoading(false);
              // Refocus input after alert
              setTimeout(() => {
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }, 100);
            }
          }]
        );
      }
    } catch (error) {
      Alert.alert('Network Error', 'Please check your connection and try again.');
      setLoading(false);
    }
  };

  const handleSurveySubmit = async () => {
    if (!answers.q1 || !answers.q2) {
      Alert.alert('Incomplete Survey', 'Please answer all questions');
      return;
    }

    setLoading(true);
    
    try {
      const surveyResult = await submitSurvey(answers);
      
      if (surveyResult.success) {
        setUserBalance(prev => prev + surveyResult.reward);
        
        Alert.alert(
          '✅ Survey Completed!',
          `Thank you for your feedback!\n\n🎁 ${surveyResult.reward} bonus coins awarded!\nCheckout your wallet to confirm `,
          [
            {
              text: 'Finish',
              onPress: () => {
                
                setNin('');
                setAnswers({ q1: '', q2: '' });
                setIsVerified(false);
                setLoading(false);
                navigation.navigate('EarningDashbord');
              }
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Submission Failed', 'Unable to submit survey. Please try again.');
      setLoading(false);
    }
  };

  const handleAnswer = (question, value) => {
    setAnswers({ ...answers, [question]: value });
  };

  // Create dynamic styles based on theme
  const dynamicStyles = {
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1, padding: 20, backgroundColor: colors.background },
    header: { marginBottom: 30 },
    logo: { 
      fontSize: 25, 
      fontWeight: '800', 
      color: colors.primary, 
      letterSpacing: -0.5, 
      lineHeight: 34 
    },
    sublogo: { 
      fontSize: 16, 
      color: colors.textSecondary || colors.text, 
      marginTop: 5, 
      lineHeight: 22 
    },
    progressStep: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.surface || '#E0E0E0',
      justifyContent: 'center',
      alignItems: 'center',
    },
    progressStepActive: {
      backgroundColor: colors.primary,
    },
    progressLine: {
      width: 60,
      height: 2,
      backgroundColor: colors.surface || '#E0E0E0',
      marginHorizontal: 10,
    },
    progressLineActive: {
      backgroundColor: colors.primary,
    },
    progressLabel: {
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginTop: 10,
    },
    stepContainer: {
      backgroundColor: colors.surface || '#fff',
      borderRadius: 20,
      padding: 24,
      shadowColor: colors.shadow || '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.2 : 0.1,
      shadowRadius: 12,
      elevation: 5,
      flex: 1,
    },
    stepTitle: {
      fontSize: 26,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    stepSubtitle: {
      fontSize: 16,
      color: colors.textSecondary || colors.text,
      textAlign: 'center',
      marginBottom: 30,
      lineHeight: 22,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.border || '#E8E8E8',
      backgroundColor: colors.inputBackground || '#F8F9FA',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      marginBottom: 20,
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 18,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.2 : 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    buttonSecondary: {
      backgroundColor: colors.secondary || '#6C757D',
    },
    buttonDisabled: {
      backgroundColor: colors.disabled || '#CCCCCC',
      shadowOpacity: 0,
    },
    input: {
      flex: 1,
      fontSize: 18,
      color: colors.text,
      fontWeight: '500',
      padding: 0,
      margin: 0,
      height: 28,
      includeFontPadding: false,
      textAlignVertical: 'center',
    },
    infoCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card || '#F0F2FF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    infoTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    infoDescription: {
      fontSize: 14,
      color: colors.textSecondary || colors.text,
      lineHeight: 18,
    },
    question: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
      marginTop: 24,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.inputBackground || '#F8F9FA',
      borderRadius: 12,
      padding: 16,
      marginBottom: 10,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    optionSelected: {
      backgroundColor: colors.card || '#F0F2FF',
      borderColor: colors.primary,
    },
    optionText: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 12,
      fontWeight: '500',
    },
    rewardNote: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.card || '#F0F2FF',
      borderRadius: 12,
      padding: 16,
      marginTop: 20,
    },
    rewardNoteText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '600',
      marginLeft: 10,
    },
    attemptsText: {
      textAlign: 'center',
      color: colors.textSecondary || colors.text,
      fontSize: 14,
      marginTop: 12,
      fontStyle: 'italic',
    },
    termsText: {
      fontSize: 13,
      color: colors.textSecondary || colors.text,
      textAlign: 'center',
      lineHeight: 18,
    },
  };

  const Header = () => (
    <View style={dynamicStyles.header}>
      <View style={styles.headerTop}>
        <View style={{display:'flex', flexDirection:'column', paddingHorizontal:10, marginTop:10}}>
          <View style={{display:'flex', flexDirection:'row', alignContent:'center'}}>
            <TouchableOpacity onPress={()=>navigation.goBack()}>
              <Icon name='arrow-back' size={30} color={colors.text} />
            </TouchableOpacity>
            <View style={{marginLeft:10}}>
              <Text style={dynamicStyles.logo}>{'Verify & earn \n 700 coins $1.40'}</Text>
              <Text style={dynamicStyles.sublogo}>{'Verify your identity to earn rewards and unlock \ntrusted-user benefits'}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.progressBar}>
        <View style={[dynamicStyles.progressStep, step >= 1 && dynamicStyles.progressStepActive]}>
          <Text style={styles.progressText}>1</Text>
        </View>
        <View style={[dynamicStyles.progressLine, step >= 2 && dynamicStyles.progressLineActive]} />
        <View style={[dynamicStyles.progressStep, step >= 2 && dynamicStyles.progressStepActive]}>
          <Text style={styles.progressText}>2</Text>
        </View>
      </View>
      <Text style={dynamicStyles.progressLabel}>
        {step === 1 ? 'Identity Verification' : 'User Survey'}
      </Text>
    </View>
  );

  const Button = ({ title, onPress, icon, variant = 'primary', disabled }) => (
    <TouchableOpacity
      style={[
        dynamicStyles.button,
        variant === 'secondary' && dynamicStyles.buttonSecondary,
        disabled && dynamicStyles.buttonDisabled
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {icon && <Icon name={icon} size={22} color="#fff" style={{ marginRight: 8 }} />}
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );

  const InfoCard = ({ icon, title, description }) => (
    <View style={dynamicStyles.infoCard}>
      <Icon name={icon} size={28} color={colors.primary} />
      <View style={styles.infoContent}>
        <Text style={dynamicStyles.infoTitle}>{title}</Text>
        <Text style={dynamicStyles.infoDescription}>{description}</Text>
      </View>
    </View>
  );

  return (
    <TouchableWithoutFeedback 
      onPress={() => Keyboard.dismiss()}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={dynamicStyles.safeArea}>
        <StatusBar 
          barStyle={isDark ? 'light-content' : 'dark-content'} 
          backgroundColor={colors.primary} 
        />
        
        <View style={dynamicStyles.container}>
          <Header />
          
          <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
            {step === 1 ? (
              <ScrollView>
                <View style={dynamicStyles.stepContainer}>
                  <Text style={dynamicStyles.stepTitle}>Verify Your Identity</Text>
                  <Text style={dynamicStyles.stepSubtitle}>
                    Enter your National Identification Number for verification
                  </Text>
                  
                  <View style={styles.formContainer}>
                    {/* Custom Input Field with proper focus handling */}
                    <TouchableWithoutFeedback 
                      onPress={() => inputRef.current?.focus()}
                      accessible={false}
                    >
                      <View style={dynamicStyles.inputContainer}>
                        <Icon name="fingerprint" size={24} color={colors.primary} style={styles.inputIcon} />
                        <TextInput
                          ref={inputRef}
                          style={dynamicStyles.input}
                          placeholder="Enter 11-digit NIN"
                          placeholderTextColor={colors.placeholder || '#999'}
                          value={nin}
                          onChangeText={setNin}
                          keyboardType="number-pad"
                          maxLength={11}
                          editable={!loading}
                          autoFocus={true}
                          blurOnSubmit={false}
                          returnKeyType="done"
                          onSubmitEditing={handleVerifyNin}
                          contextMenuHidden={false}
                          showSoftInputOnFocus={true}
                        />
                        {nin.length > 0 && (
                          <TouchableOpacity 
                            onPress={() => {
                              setNin('');
                              inputRef.current?.focus();
                            }}
                            style={styles.clearButton}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                          >
                            <Icon name="close" size={20} color={colors.textSecondary || colors.text} />
                          </TouchableOpacity>
                        )}
                      </View>
                    </TouchableWithoutFeedback>
                    
                    <Button
                      title="Verify & Get 700 Coins"
                      onPress={handleVerifyNin}
                      icon="verified"
                      disabled={nin.length !== 11}
                    />
                    
                    {verificationAttempts > 0 && (
                      <Text style={dynamicStyles.attemptsText}>
                        Attempts: {verificationAttempts}/3
                      </Text>
                    )}
                  </View>
                  
                  <View style={styles.featuresContainer}>
                    <InfoCard
                      icon="security"
                      title="Secure Verification"
                      description="Bank-level encryption protects your data"
                    />
                    <InfoCard
                      icon="attach-money"
                      title="Instant Reward"
                      description="Receive 700 coins immediately upon successful verification"
                    />
                    <InfoCard
                      icon="privacy-tip"
                      title="Privacy First"
                      description="Your data is never shared with third parties"
                    />
                  </View>
                  
                  <View style={styles.termsContainer}>
                    <Text style={dynamicStyles.termsText}>
                      By verifying, you agree to our{' '}
                      <Text style={[styles.link, { color: colors.primary }]}>Privacy Policy</Text>{' '}
                      and{' '}
                      <Text style={[styles.link, { color: colors.primary }]}>Terms of Service</Text>
                    </Text>
                  </View>
                </View>
              </ScrollView>
            ) : (
              <ScrollView>
                <View style={dynamicStyles.stepContainer}>
                  <Text style={dynamicStyles.stepTitle}>Help Us Improve</Text>
                  <Text style={dynamicStyles.stepSubtitle}>
                    Complete this short survey to earn extra coins
                  </Text>
                  
                  <View style={styles.surveyContainer}>
                    <Text style={dynamicStyles.question}>
                      1. Which type of content do you prefer on social platforms?
                    </Text>
                    <View style={styles.optionContainer}>
                      {['Videos', 'Articles', 'Images', 'Audio/Podcasts'].map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={[
                            dynamicStyles.option,
                            answers.q1 === option && dynamicStyles.optionSelected
                          ]}
                          onPress={() => handleAnswer('q1', option)}
                          activeOpacity={0.7}
                        >
                          <Icon
                            name={answers.q1 === option ? 'radio-button-checked' : 'radio-button-unchecked'}
                            size={24}
                            color={answers.q1 === option ? colors.primary : colors.textSecondary}
                          />
                          <Text style={dynamicStyles.optionText}>{option}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    
                    <Text style={dynamicStyles.question}>
                      2. How often do you use social media apps?
                    </Text>
                    <View style={styles.optionContainer}>
                      {['Hourly', 'Daily', 'Weekly', 'Occasionally'].map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={[
                            dynamicStyles.option,
                            answers.q2 === option && dynamicStyles.optionSelected
                          ]}
                          onPress={() => handleAnswer('q2', option)}
                          activeOpacity={0.7}
                        >
                          <Icon
                            name={answers.q2 === option ? 'radio-button-checked' : 'radio-button-unchecked'}
                            size={24}
                            color={answers.q2 === option ? colors.primary : colors.textSecondary}
                          />
                          <Text style={dynamicStyles.optionText}>{option}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    
                    <Button
                      title={`Submit Survey & Get 50 Coins`}
                      onPress={handleSurveySubmit}
                      icon="send"
                      disabled={!answers.q1 || !answers.q2}
                    />
                  </View>
                  
                  <View style={dynamicStyles.rewardNote}>
                    <Icon name="info" size={20} color={colors.primary} />
                    <Text style={dynamicStyles.rewardNoteText}>
                      You'll receive 50 bonus coins upon survey completion
                    </Text>
                  </View>
                </View>
              </ScrollView>
            )}
          </Animated.View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  progressText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  formContainer: {
    marginBottom: 30,
  },
  inputIcon: {
    marginRight: 12,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  featuresContainer: {
    marginBottom: 25,
  },
  infoContent: {
    flex: 1,
    marginLeft: 16,
  },
  termsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 20,
  },
  link: {
    fontWeight: '600',
  },
  surveyContainer: {
    marginBottom: 25,
  },
  optionContainer: {
    marginBottom: 20,
  },
});
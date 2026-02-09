// // DeepLinkHandler.js
// import { useEffect } from 'react';
// import { Linking } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// const useDeepLinkHandler = () => {
//   const navigation = useNavigation();

//   useEffect(() => {
//     const handleDeepLink = (url) => {
//       console.log('Deep link received:', url);
      
//       if (url) {
//         // Parse the URL
//         const parsedUrl = new URL(url);
        
//         // Handle reset password deep link
//         if (parsedUrl.host === 'reset-password') {
//           const uid = parsedUrl.searchParams.get('uid');
//           const token = parsedUrl.searchParams.get('token');
          
//           if (uid && token) {
//             // Navigate to reset password screen with parameters
//             navigation.navigate('AiResetPassword', { 
//               uid, 
//               token,
//               fromDeepLink: true 
//             });
//           }
//         }
//       }
//     };

//     // Get initial URL if app was opened from deep link
//     Linking.getInitialURL().then((url) => {
//       if (url) {
//         handleDeepLink(url);
//       }
//     });

//     // Listen for deep links when app is already open
//     const subscription = Linking.addEventListener('url', ({ url }) => {
//       handleDeepLink(url);
//     });

//     return () => {
//       subscription?.remove();
//     };
//   }, [navigation]);
// };

// export default useDeepLinkHandler;
// screens/useDeepLinkHandler.js
import { useEffect } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const useDeepLinkHandler = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const handleDeepLink = (url) => {
      console.log('Deep link received:', url);
      
      if (url) {
        try {
          const scheme = 'lordbetai://';
          if (url.startsWith(scheme)) {
            const pathWithParams = url.replace(scheme, '');
            const [path, queryString] = pathWithParams.split('?');
            
            if (path === 'reset-password' && queryString) {
              const params = new URLSearchParams(queryString);
              const uid = params.get('uid');
              const token = params.get('token');
              
              if (uid && token) {
                navigation.navigate('AiResetPassword', { 
                  uid, 
                  token,
                  fromDeepLink: true 
                });
              }
            }
          }
        } catch (error) {
          console.error('Error parsing deep link:', error);
        }
      }
    };

    // Get initial URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // Listen for URL events
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => {
      subscription?.remove();
    };
  }, [navigation]);
};

export default useDeepLinkHandler;
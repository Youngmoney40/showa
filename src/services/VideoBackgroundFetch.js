// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { API_ROUTE } from '../../api_routing/api';
// import RNFS from 'react-native-fs'; 
// import BackgroundFetch from 'react-native-background-fetch';

// // Cache keys
// const VIDEOS_CACHE_KEY = 'prefetched_videos_v2';
// const VIDEOS_METADATA_KEY = 'videos_metadata';
// const LAST_FETCH_KEY = 'last_video_fetch_time';

// class VideoPrefetchService {
//   constructor() {
//     this.isInitialized = false;
//     this.prefetchQueue = [];
//     this.maxVideosToCache = 10; 
//     this.cacheExpiry = 60 * 60 * 1000; 
//   }

//   async init(userId) {
//     if (this.isInitialized) return;
    
//     console.log('VideoPrefetchService: Initializing...');
//     this.isInitialized = true;
//     this.userId = userId;

//     await this.setupBackgroundFetch();
    
   
//     this.prefetchVideos();
//   }

//   async setupBackgroundFetch() {
//     try {
//       await BackgroundFetch.configure(
//         {
//           minimumFetchInterval: 15, 
//           stopOnTerminate: false,
//           startOnBoot: true,
//           enableHeadless: true,
//         },
//         async (taskId) => {
//           console.log('BackgroundFetch: Starting video prefetch');
//           await this.prefetchVideos(true);
//           BackgroundFetch.finish(taskId);
//         },
//         (error) => {
//           console.error('BackgroundFetch error:', error);
//         }
//       );
//     } catch (error) {
//       console.error('Error setting up background fetch:', error);
//     }
//   }

//   async prefetchVideos(isBackground = false) {
//     try {
//       console.log(`${isBackground ? 'Background' : 'Initial'} video prefetch started`);
      
      
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) {
//         console.log('No token, skipping prefetch');
//         return;
//       }

      
//       const headers = { Authorization: `Bearer ${token}` };
//       const metadataResponse = await axios.get(`${API_ROUTE}/shorts/?page_size=10`, { headers });
      
//       if (metadataResponse.status !== 200) return;

//       // Process videos
//       let videos = [];
//       if (Array.isArray(metadataResponse.data)) {
//         videos = metadataResponse.data;
//       } else if (metadataResponse.data.results) {
//         videos = metadataResponse.data.results;
//       }

//       if (videos.length === 0) return;

    
//       const processedVideos = videos.map(video => ({
//         ...video,
//         video_thumbnail: this.generateThumbnailUrl(video.video),
//         prefetched_at: new Date().toISOString(),
//       }));

//       await AsyncStorage.setItem(VIDEOS_METADATA_KEY, JSON.stringify(processedVideos));
//       await AsyncStorage.setItem(LAST_FETCH_KEY, Date.now().toString());

    
//       if (!isBackground) {
        
//         this.prefetchVideoFiles(processedVideos.slice(0, 3));
//       }

//       console.log('Video prefetch completed');
//       return processedVideos;

//     } catch (error) {
//       console.error('Prefetch error:', error);
//     }
//   }

//   generateThumbnailUrl(videoUrl) {
//     if (!videoUrl || !videoUrl.includes('cloudinary')) return null;
    
//     try {
//       const [base, path] = videoUrl.split('/upload/');
//       if (!path) return null;
      
//       const versionMatch = path.match(/^(v\d+)/);
//       if (!versionMatch) return null;
      
//       const version = versionMatch[1];
//       const afterVersion = path.substring(version.length + 1);
//       const lastSlashIndex = afterVersion.lastIndexOf('/');
      
//       let folder = '';
//       let filename = afterVersion;
      
//       if (lastSlashIndex !== -1) {
//         folder = afterVersion.substring(0, lastSlashIndex);
//         filename = afterVersion.substring(lastSlashIndex + 1);
//       }
      
//       const publicId = filename.replace('.mp4', '');
      
//       return `${base}/image/upload/${version}/w_300,h_500,c_fill,f_jpg,q_auto${folder ? '/' + folder : ''}/${publicId}.jpg`;
//     } catch (error) {
//       return null;
//     }
//   }


//   async prefetchVideoFiles(videos) {
//     try {
//       for (const video of videos) {
//         if (!video.video) continue;
        
//         const videoUrl = video.video;
//         const videoId = video.id;
        
//         const cachedPath = await this.getCachedVideoPath(videoId);
//         if (cachedPath) {
//           console.log(`Video ${videoId} already cached`);
//           continue;
//         }

//         const fileName = `video_${videoId}.mp4`;
//         const cacheDir = RNFS.CachesDirectoryPath;
//         const filePath = `${cacheDir}/${fileName}`;

//         const download = RNFS.downloadFile({
//           fromUrl: videoUrl,
//           toFile: filePath,
//           background: true,
//           discretionary: true, // Allow system to optimize download
//           cacheable: true,
//         });

//         const result = await download.promise;
//         if (result.statusCode === 200) {
//           console.log(`Video ${videoId} cached successfully`);
          
//           await this.saveCachedVideoInfo(videoId, filePath);
//         }
//       }
//     } catch (error) {
//       console.error('Error prefetching videos:', error);
//     }
//   }

//   async getCachedVideoPath(videoId) {
//     try {
//       const cacheInfo = await AsyncStorage.getItem(`video_cache_${videoId}`);
//       if (cacheInfo) {
//         const { path, timestamp } = JSON.parse(cacheInfo);
       
//         if (Date.now() - timestamp < this.cacheExpiry) {
          
//           const exists = await RNFS.exists(path);
//           if (exists) return path;
//         }
//       }
//       return null;
//     } catch {
//       return null;
//     }
//   }

//   async saveCachedVideoInfo(videoId, path) {
//     await AsyncStorage.setItem(`video_cache_${videoId}`, JSON.stringify({
//       path,
//       timestamp: Date.now(),
//     }));
//   }

//   async getCachedVideos() {
//     try {
//       const cached = await AsyncStorage.getItem(VIDEOS_METADATA_KEY);
//       const lastFetch = await AsyncStorage.getItem(LAST_FETCH_KEY);
      
//       if (cached) {
//         const videos = JSON.parse(cached);
        
//         // Check if cache is expired
//         if (lastFetch && Date.now() - parseInt(lastFetch) < this.cacheExpiry) {
//           return videos;
//         }
        
//         // Trigger background refresh ======================
//         this.prefetchVideos(true);
//         return videos; 
//       }
//       return null;
//     } catch {
//       return null;
//     }
//   }


//   async getOptimizedVideoUrl(videoId, originalUrl) {
//     const cachedPath = await this.getCachedVideoPath(videoId);
//     if (cachedPath) {
//       return `file://${cachedPath}`; 
//     }
//     return originalUrl; 
//   }
//   async forceRefresh() {
//     await this.prefetchVideos(false);
//   }
// }

// export default new VideoPrefetchService();
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE } from '../../api_routing/api';
import RNFS from 'react-native-fs';
import { AppState } from 'react-native'; 

// Cache keys
const VIDEOS_CACHE_KEY = 'prefetched_videos_v2';
const VIDEOS_METADATA_KEY = 'videos_metadata';
const LAST_FETCH_KEY = 'last_video_fetch_time';
const THUMBNAIL_CACHE_PREFIX = 'thumbnail_';
const VIDEO_CACHE_PREFIX = 'video_';

class VideoPrefetchService {
  constructor() {
    this.isInitialized = false;
    this.prefetchQueue = [];
    this.maxVideosToCache = 10;
    this.cacheExpiry = 60 * 60 * 1000; // 1 hour
    this.appState = AppState.currentState;
  }

  async init(userId) {
    if (this.isInitialized) return;
    
    console.log('🎥 VideoPrefetchService: Initializing...');
    this.isInitialized = true;
    this.userId = userId;

    // Listen to app state changes (when app comes to foreground)
    this.setupAppStateListener();
    
    // Immediate prefetch on app start
    this.prefetchVideos();
    
    // Clear old cache on init
    this.clearOldCache();
  }

  // NEW: Listen to app state changes
  setupAppStateListener() {
    AppState.addEventListener('change', (nextAppState) => {
      if (this.appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('🎥 App came to foreground, checking cache...');
        this.checkAndRefreshCache();
      }
      this.appState = nextAppState;
    });
  }

  // NEW: Check if cache needs refresh
  async checkAndRefreshCache() {
    try {
      const lastFetch = await AsyncStorage.getItem(LAST_FETCH_KEY);
      if (lastFetch) {
        const timeSinceLastFetch = Date.now() - parseInt(lastFetch);
        // Refresh if cache is older than 30 minutes
        if (timeSinceLastFetch > 30 * 60 * 1000) {
          console.log('🎥 Cache is old, refreshing in background...');
          this.prefetchVideos(true);
        } else {
          console.log('🎥 Cache is still fresh');
        }
      }
    } catch (error) {
      console.error('Error checking cache:', error);
    }
  }

  // UPDATED: Main prefetch function
  async prefetchVideos(isBackground = false) {
    try {
      console.log(`🎥 ${isBackground ? 'Background' : 'Initial'} video prefetch started`);
      
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.log('🎥 No token, skipping prefetch');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const metadataResponse = await axios.get(`${API_ROUTE}/shorts/?page_size=10`, { headers });
      
      if (metadataResponse.status !== 200) return;

      let videos = [];
      if (Array.isArray(metadataResponse.data)) {
        videos = metadataResponse.data;
      } else if (metadataResponse.data.results) {
        videos = metadataResponse.data.results;
      }

      if (videos.length === 0) return;

      // Save metadata
      const processedVideos = videos.map(video => ({
        ...video,
        video_thumbnail: this.generateThumbnailUrl(video.video),
        prefetched_at: new Date().toISOString(),
      }));

      await AsyncStorage.setItem(VIDEOS_METADATA_KEY, JSON.stringify(processedVideos));
      await AsyncStorage.setItem(LAST_FETCH_KEY, Date.now().toString());

      // Prefetch thumbnails first (lightweight)
      if (!isBackground) {
        await this.prefetchThumbnails(processedVideos.slice(0, 5));
        
        // Then prefetch first 3 videos
        setTimeout(() => {
          this.prefetchVideoFiles(processedVideos.slice(0, 3));
        }, 2000);
      }

      console.log('🎥 Video prefetch completed');
      return processedVideos;

    } catch (error) {
      console.error('🎥 Prefetch error:', error);
    }
  }

  // NEW: Prefetch thumbnails separately
  async prefetchThumbnails(videos) {
    console.log('🖼️ Prefetching thumbnails for', videos.length, 'videos');
    
    const thumbnailPromises = videos.map(async (video) => {
      if (!video?.video) return;
      
      const thumbnailUrl = this.generateThumbnailUrl(video.video);
      if (!thumbnailUrl) return;
      
      const videoId = video.id;
      const cacheKey = `${THUMBNAIL_CACHE_PREFIX}${videoId}`;
      
      // Check if already cached
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        const { timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < this.cacheExpiry) {
          const exists = await RNFS.exists(JSON.parse(cached).path);
          if (exists) {
            console.log(`📦 Thumbnail for video ${videoId} already cached`);
            return;
          }
        }
      }

      // Download thumbnail to cache
      try {
        const fileName = `thumb_${videoId}.jpg`;
        const cacheDir = RNFS.CachesDirectoryPath;
        const filePath = `${cacheDir}/${fileName}`;

        const download = RNFS.downloadFile({
          fromUrl: thumbnailUrl,
          toFile: filePath,
          background: true,
          cacheable: true,
        });

        await download.promise;
        
        // Save cache info
        await AsyncStorage.setItem(cacheKey, JSON.stringify({
          path: filePath,
          timestamp: Date.now()
        }));
        
        console.log(`✅ Thumbnail cached for video ${videoId}`);
      } catch (error) {
        console.log(`❌ Failed to cache thumbnail for ${videoId}:`, error);
      }
    });

    await Promise.all(thumbnailPromises);
    console.log('🎉 Thumbnail prefetching complete');
  }

  // UPDATED: Prefetch video files with better error handling
  async prefetchVideoFiles(videos) {
    console.log('🎥 Prefetching', videos.length, 'videos');
    
    const videoPromises = videos.map(async (video) => {
      if (!video?.video) return;
      
      const videoId = video.id;
      const cacheKey = `${VIDEO_CACHE_PREFIX}${videoId}`;
      
      // Check if already cached
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        const { timestamp, path } = JSON.parse(cached);
        if (Date.now() - timestamp < this.cacheExpiry) {
          const exists = await RNFS.exists(path);
          if (exists) {
            console.log(`📦 Video ${videoId} already cached`);
            return;
          }
        }
      }

      // Download video to cache
      try {
        const fileName = `video_${videoId}.mp4`;
        const cacheDir = RNFS.CachesDirectoryPath;
        const filePath = `${cacheDir}/${fileName}`;

        const download = RNFS.downloadFile({
          fromUrl: video.video,
          toFile: filePath,
          background: true,
          discretionary: true,
          cacheable: true,
        });

        const result = await download.promise;
        
        if (result.statusCode === 200) {
          await AsyncStorage.setItem(cacheKey, JSON.stringify({
            path: filePath,
            timestamp: Date.now()
          }));
          console.log(`✅ Video ${videoId} cached successfully`);
        } else {
          console.log(`❌ Failed to cache video ${videoId}: Status ${result.statusCode}`);
        }
      } catch (error) {
        console.log(`❌ Failed to cache video ${videoId}:`, error);
      }
    });

    await Promise.all(videoPromises);
    console.log('🎉 Video prefetching complete');
  }

  generateThumbnailUrl(videoUrl) {
    if (!videoUrl || !videoUrl.includes('cloudinary')) return null;
    
    try {
      const [base, path] = videoUrl.split('/upload/');
      if (!path) return null;
      
      const versionMatch = path.match(/^(v\d+)/);
      if (!versionMatch) return null;
      
      const version = versionMatch[1];
      const afterVersion = path.substring(version.length + 1);
      const lastSlashIndex = afterVersion.lastIndexOf('/');
      
      let folder = '';
      let filename = afterVersion;
      
      if (lastSlashIndex !== -1) {
        folder = afterVersion.substring(0, lastSlashIndex);
        filename = afterVersion.substring(lastSlashIndex + 1);
      }
      
      const publicId = filename.replace('.mp4', '');
      
      return `${base}/image/upload/${version}/w_300,h_500,c_fill,f_jpg,q_auto${folder ? '/' + folder : ''}/${publicId}.jpg`;
    } catch (error) {
      return null;
    }
  }

  // NEW: Get cached thumbnail path
  async getCachedThumbnailPath(videoId) {
    try {
      const cacheInfo = await AsyncStorage.getItem(`${THUMBNAIL_CACHE_PREFIX}${videoId}`);
      if (cacheInfo) {
        const { path, timestamp } = JSON.parse(cacheInfo);
        if (Date.now() - timestamp < this.cacheExpiry) {
          const exists = await RNFS.exists(path);
          if (exists) return path;
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  async getCachedVideoPath(videoId) {
    try {
      const cacheInfo = await AsyncStorage.getItem(`${VIDEO_CACHE_PREFIX}${videoId}`);
      if (cacheInfo) {
        const { path, timestamp } = JSON.parse(cacheInfo);
        if (Date.now() - timestamp < this.cacheExpiry) {
          const exists = await RNFS.exists(path);
          if (exists) return path;
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  async saveCachedVideoInfo(videoId, path) {
    await AsyncStorage.setItem(`${VIDEO_CACHE_PREFIX}${videoId}`, JSON.stringify({
      path,
      timestamp: Date.now(),
    }));
  }

  async getCachedVideos() {
    try {
      const cached = await AsyncStorage.getItem(VIDEOS_METADATA_KEY);
      const lastFetch = await AsyncStorage.getItem(LAST_FETCH_KEY);
      
      if (cached) {
        const videos = JSON.parse(cached);
        
        // Check if cache is expired
        if (lastFetch && Date.now() - parseInt(lastFetch) < this.cacheExpiry) {
          return videos;
        }
        
        // Trigger background refresh if cache is old
        setTimeout(() => {
          this.prefetchVideos(true);
        }, 1000);
        
        return videos; // Return stale data while refreshing
      }
      return null;
    } catch {
      return null;
    }
  }

  async getOptimizedVideoUrl(videoId, originalUrl) {
    const cachedPath = await this.getCachedVideoPath(videoId);
    if (cachedPath) {
      return `file://${cachedPath}`;
    }
    return originalUrl;
  }

  // NEW: Get optimized thumbnail URL
  async getOptimizedThumbnailUrl(videoId, originalVideoUrl) {
    const cachedPath = await this.getCachedThumbnailPath(videoId);
    if (cachedPath) {
      return `file://${cachedPath}`;
    }
    return this.generateThumbnailUrl(originalVideoUrl);
  }

  async forceRefresh() {
    await this.prefetchVideos(false);
  }

  // NEW: Clear old cache files
  async clearOldCache() {
    try {
      const files = await RNFS.readDir(RNFS.CachesDirectoryPath);
      const now = Date.now();
      let deletedCount = 0;
      
      for (const file of files) {
        if (file.name.startsWith('thumb_') || file.name.startsWith('video_')) {
          const stat = await RNFS.stat(file.path);
          if (now - stat.ctime > this.cacheExpiry) {
            await RNFS.unlink(file.path);
            deletedCount++;
          }
        }
      }
      
      if (deletedCount > 0) {
        console.log(`🗑️ Cleared ${deletedCount} old cache files`);
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}

export default new VideoPrefetchService();
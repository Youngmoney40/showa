import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE } from '../../api_routing/api';
import RNFS from 'react-native-fs'; 
import BackgroundFetch from 'react-native-background-fetch';

// Cache keys
const VIDEOS_CACHE_KEY = 'prefetched_videos_v2';
const VIDEOS_METADATA_KEY = 'videos_metadata';
const LAST_FETCH_KEY = 'last_video_fetch_time';

class VideoPrefetchService {
  constructor() {
    this.isInitialized = false;
    this.prefetchQueue = [];
    this.maxVideosToCache = 10; 
    this.cacheExpiry = 60 * 60 * 1000; 
  }

  async init(userId) {
    if (this.isInitialized) return;
    
    console.log('VideoPrefetchService: Initializing...');
    this.isInitialized = true;
    this.userId = userId;

    await this.setupBackgroundFetch();
    
   
    this.prefetchVideos();
  }

  async setupBackgroundFetch() {
    try {
      await BackgroundFetch.configure(
        {
          minimumFetchInterval: 15, 
          stopOnTerminate: false,
          startOnBoot: true,
          enableHeadless: true,
        },
        async (taskId) => {
          console.log('BackgroundFetch: Starting video prefetch');
          await this.prefetchVideos(true);
          BackgroundFetch.finish(taskId);
        },
        (error) => {
          console.error('BackgroundFetch error:', error);
        }
      );
    } catch (error) {
      console.error('Error setting up background fetch:', error);
    }
  }

  async prefetchVideos(isBackground = false) {
    try {
      console.log(`${isBackground ? 'Background' : 'Initial'} video prefetch started`);
      
      
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.log('No token, skipping prefetch');
        return;
      }

      
      const headers = { Authorization: `Bearer ${token}` };
      const metadataResponse = await axios.get(`${API_ROUTE}/shorts/?page_size=10`, { headers });
      
      if (metadataResponse.status !== 200) return;

      // Process videos
      let videos = [];
      if (Array.isArray(metadataResponse.data)) {
        videos = metadataResponse.data;
      } else if (metadataResponse.data.results) {
        videos = metadataResponse.data.results;
      }

      if (videos.length === 0) return;

    
      const processedVideos = videos.map(video => ({
        ...video,
        video_thumbnail: this.generateThumbnailUrl(video.video),
        prefetched_at: new Date().toISOString(),
      }));

      await AsyncStorage.setItem(VIDEOS_METADATA_KEY, JSON.stringify(processedVideos));
      await AsyncStorage.setItem(LAST_FETCH_KEY, Date.now().toString());

    
      if (!isBackground) {
        
        this.prefetchVideoFiles(processedVideos.slice(0, 3));
      }

      console.log('Video prefetch completed');
      return processedVideos;

    } catch (error) {
      console.error('Prefetch error:', error);
    }
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


  async prefetchVideoFiles(videos) {
    try {
      for (const video of videos) {
        if (!video.video) continue;
        
        const videoUrl = video.video;
        const videoId = video.id;
        
        const cachedPath = await this.getCachedVideoPath(videoId);
        if (cachedPath) {
          console.log(`Video ${videoId} already cached`);
          continue;
        }

        const fileName = `video_${videoId}.mp4`;
        const cacheDir = RNFS.CachesDirectoryPath;
        const filePath = `${cacheDir}/${fileName}`;

        const download = RNFS.downloadFile({
          fromUrl: videoUrl,
          toFile: filePath,
          background: true,
          discretionary: true, // Allow system to optimize download
          cacheable: true,
        });

        const result = await download.promise;
        if (result.statusCode === 200) {
          console.log(`Video ${videoId} cached successfully`);
          
          await this.saveCachedVideoInfo(videoId, filePath);
        }
      }
    } catch (error) {
      console.error('Error prefetching videos:', error);
    }
  }

  async getCachedVideoPath(videoId) {
    try {
      const cacheInfo = await AsyncStorage.getItem(`video_cache_${videoId}`);
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
    await AsyncStorage.setItem(`video_cache_${videoId}`, JSON.stringify({
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
        
        // Trigger background refresh ======================
        this.prefetchVideos(true);
        return videos; 
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
  async forceRefresh() {
    await this.prefetchVideos(false);
  }
}

export default new VideoPrefetchService();
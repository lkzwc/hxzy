// 位置服务
export interface LocationInfo {
  province: string;
}

// 高德地图API密钥 - 应该从环境变量获取
const AMAP_API_KEY = process.env.NEXT_PUBLIC_AMAP_API_KEY || 'your-amap-api-key';

/**
 * 获取用户位置信息
 * 优先使用GPS定位，失败时使用IP定位
 */
export async function getUserLocation(): Promise<LocationInfo | null> {
  try {
    // 首先尝试GPS定位
    const gpsLocation = await getGPSLocation();
    if (gpsLocation) {
      return gpsLocation;
    }
  } catch (error) {
    console.warn('GPS定位失败:', error);
  }

  try {
    // GPS失败时使用IP定位
    const ipLocation = await getIPLocation();
    if (ipLocation) {
      return ipLocation;
    }
  } catch (error) {
    console.warn('IP定位失败:', error);
  }

  return null;
}

/**
 * 使用GPS获取位置信息
 */
function getGPSLocation(): Promise<LocationInfo | null> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('浏览器不支持地理定位'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // 调用高德地图逆地理编码API
          const response = await fetch(
            `https://restapi.amap.com/v5/geocode/regeo?key=${AMAP_API_KEY}&location=${longitude},${latitude}&extensions=base&output=json`
          );
          
          if (!response.ok) {
            throw new Error('高德API请求失败');
          }
          
          const data = await response.json();
          
          if (data.status === '1' && data.regeocode) {
            const addressComponent = data.regeocode.addressComponent;
            resolve({
              province: addressComponent.province || '未知省份',
            });
          } else {
            throw new Error('高德API返回错误');
          }
        } catch (error) {
          console.error('解析GPS位置失败:', error);
          reject(error);
        }
      },
      (error) => {
        console.error('GPS定位失败:', error);
        reject(error);
      },
      {
        timeout: 10000, // 10秒超时
        enableHighAccuracy: true,
        maximumAge: 300000, // 5分钟缓存
      }
    );
  });
}

/**
 * 使用IP获取位置信息
 */
async function getIPLocation(): Promise<LocationInfo | null> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    
    if (!response.ok) {
      throw new Error('IP定位API请求失败');
    }
    
    const data = await response.json();
    
    if (data.region) {
      return {
        province: data.region,
      };
    }
    
    throw new Error('IP定位返回数据不完整');
  } catch (error) {
    console.error('IP定位失败:', error);
    throw error;
  }
}

/**
 * 格式化位置显示文本
 */
export function formatLocationText(location: LocationInfo): string {
  return location.province || '';
}

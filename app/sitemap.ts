import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.huaxiazhongyi.com'
  
  // 主要页面路由
  const mainRoutes = [
    '',
    '/tools',
    '/doctors',
    '/yang-sheng-zhi-dao',
    '/zhongyidb',
    '/zhen-jiu-jing-luo',
    '/about',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // 医生详情页面
  const doctorPages = [
    // 这里应该从数据库获取所有医生的 ID
    { id: 1 },
    { id: 2 },
    // ...更多医生
  ].map(doctor => ({
    url: `${baseUrl}/doctors/${doctor.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...mainRoutes, ...doctorPages]
} 
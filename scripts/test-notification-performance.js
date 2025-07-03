// 通知 API 性能测试脚本
const { performance } = require('perf_hooks');

async function testNotificationAPI() {
  const baseUrl = 'http://localhost:3000';
  
  // 这里需要替换为实际的认证 cookie 或 token
  const headers = {
    'Content-Type': 'application/json',
    // 'Cookie': 'your-session-cookie-here'
  };

  console.log('🚀 开始通知 API 性能测试...\n');

  // 测试多次请求的平均响应时间
  const testRounds = 5;
  const times = [];

  for (let i = 0; i < testRounds; i++) {
    const start = performance.now();
    
    try {
      const response = await fetch(`${baseUrl}/api/users/notifications`, {
        method: 'GET',
        headers
      });
      
      const end = performance.now();
      const duration = end - start;
      times.push(duration);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ 第 ${i + 1} 次请求: ${duration.toFixed(2)}ms (通知数: ${data.notifications?.length || 0}, 未读: ${data.unreadCount || 0})`);
      } else {
        console.log(`❌ 第 ${i + 1} 次请求失败: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`❌ 第 ${i + 1} 次请求错误:`, error.message);
    }
    
    // 等待一秒再进行下次测试
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // 计算统计数据
  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);

  console.log('\n📊 性能统计:');
  console.log(`平均响应时间: ${avgTime.toFixed(2)}ms`);
  console.log(`最快响应时间: ${minTime.toFixed(2)}ms`);
  console.log(`最慢响应时间: ${maxTime.toFixed(2)}ms`);
  
  // 性能评估
  if (avgTime < 100) {
    console.log('🎉 性能优秀！');
  } else if (avgTime < 500) {
    console.log('✅ 性能良好');
  } else if (avgTime < 1000) {
    console.log('⚠️  性能一般，建议优化');
  } else {
    console.log('🚨 性能较差，需要优化');
  }
}

// 运行测试
testNotificationAPI().catch(console.error);

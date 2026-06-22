/**
 * 共享的微信登录状态管理
 * 供 wechat/route.ts 和 auth.ts 共同使用
 *
 * 注意：当前使用内存存储，生产环境建议迁移到 Redis
 */

interface LoginState {
  type: "qr" | "code";
  loginToken?: string;
  timestamp: number;
  status: "pending" | "authorized" | "expired";
  openid?: string;
}

// 登录状态存储
const loginStateMap = new Map<string, LoginState>();

// 过期时间：5 分钟
const EXPIRY_MS = 5 * 60 * 1000;

// 定期清理过期条目，防止内存泄漏
const CLEANUP_INTERVAL = 60 * 1000;
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function startCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of loginStateMap.entries()) {
      if (now - value.timestamp > EXPIRY_MS) {
        loginStateMap.delete(key);
      }
    }
  }, CLEANUP_INTERVAL);

  // 允许 Node.js 在没有其他任务时退出
  if (cleanupTimer && typeof cleanupTimer === "object" && "unref" in cleanupTimer) {
    cleanupTimer.unref();
  }
}

/**
 * 设置登录状态
 */
export function setLoginState(key: string, state: LoginState): void {
  startCleanup();
  loginStateMap.set(key, state);
}

/**
 * 获取登录状态
 */
export function getLoginState(key: string): LoginState | undefined {
  return loginStateMap.get(key);
}

/**
 * 更新登录状态
 */
export function updateLoginState(key: string, update: Partial<LoginState>): boolean {
  const existing = loginStateMap.get(key);
  if (!existing) return false;
  loginStateMap.set(key, { ...existing, ...update });
  return true;
}

/**
 * 验证登录令牌并返回 openid
 * 供 auth.ts 的 authorize 函数使用
 *
 * 验证逻辑：
 * 1. 查找对应的登录状态
 * 2. 确认状态为 authorized（即微信已回调确认）
 * 3. 确认未过期
 * 4. 验证成功后标记为已消费（删除条目），防止重复使用
 */
export function verifyLoginAndGetOpenid(loginToken: string): string | null {
  if (!loginToken) return null;

  // 遍历所有条目，查找匹配的 loginToken
  for (const [key, state] of loginStateMap.entries()) {
    if (state.loginToken === loginToken) {
      // 检查是否已授权
      if (state.status !== "authorized") {
        return null;
      }

      // 检查是否过期
      if (Date.now() - state.timestamp > EXPIRY_MS) {
        loginStateMap.delete(key);
        return null;
      }

      // 验证成功，消费该令牌（防止重复使用）
      const openid = state.openid;
      loginStateMap.delete(key);
      return openid || null;
    }
  }

  return null;
}

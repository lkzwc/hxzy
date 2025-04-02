# 登录流程说明

## 微信扫码登录流程

GitHub 登录流程 ：

1. 用户点击 GitHub 登录
2. GitHub OAuth 验证
3. 验证成功后进入 signIn 回调
4. 写入/更新用户数据
5. 生成 JWT token
6. 创建 session
微信登录流程 ：

1. 用户通过微信认证获取 openid
2. 调用 CredentialsProvider 的 authorize
3. 进入 signIn 回调
4. 写入/更新用户数据
5. 生成 JWT token
6. 创建 session

### 1. 获取登录二维码
前端页面加载时，调用 `/api/wechat` 接口获取登录二维码：
- 服务端生成唯一的场景值 `sceneStr`
- 调用微信接口创建临时二维码（有效期5分钟）
- 创建初始 JWT token，状态为 `pending`
- 返回二维码链接和 `loginToken` 给前端

### 2. 用户扫码
当用户扫描二维码时：
- 微信服务器向我们的服务器推送扫码事件
- 服务器根据场景值 `sceneStr` 找到对应的登录请求
- 更新 JWT token 状态为 `scanned`，并记录用户的 `openid`
- 创建或更新用户信息
- 最后将 JWT token 状态更新为 `authorized`

### 3. 状态轮询
前端使用 `useSWR` 每2秒轮询一次登录状态：
```typescript
const { data: loginStatus } = useSWR(
  qrCode?.loginToken ? ['loginStatus', qrCode.loginToken] : null,
  () => loginStatusFetcher(qrCode.loginToken),
  {
    refreshInterval: 2000,
    revalidateOnFocus: true,
  }
);
```

### 4. 登录状态判断
- 服务端通过验证 JWT token 来判断登录状态
- token 中包含三个关键信息：
  - `status`: 登录状态 (pending/scanned/authorized)
  - `sceneStr`: 场景值，用于关联扫码事件
  - `openid`: 用户的微信标识

当 token 状态为 `authorized` 且包含 `openid` 时，表示登录成功。

### 5. 登录成功处理
- 前端检测到登录成功后，自动跳转到社区页面
- 用户信息已经在扫码时保存到数据库中

## 技术实现细节

### JWT Token 管理
使用 JWT 实现无状态的登录状态管理，主要包含三个函数：

1. `createLoginToken`: 创建初始登录令牌
```typescript
function createLoginToken(sceneStr: string): string {
  const loginState = {
    status: 'pending',
    sceneStr,
  };
  return jwt.sign(loginState, JWT_SECRET, { expiresIn: '5m' });
}
```

2. `updateLoginToken`: 更新登录状态
```typescript
function updateLoginToken(token: string, updates: Partial<LoginState>): string {
  const loginState = jwt.verify(token, JWT_SECRET) as LoginState;
  const updatedState = { ...loginState, ...updates };
  return jwt.sign(updatedState, JWT_SECRET, { expiresIn: '5m' });
}
```

3. `verifyLoginToken`: 验证登录令牌
```typescript
function verifyLoginToken(token: string): LoginState {
  return jwt.verify(token, JWT_SECRET) as LoginState;
}
```

### 安全性考虑
1. JWT token 有效期为5分钟，与微信临时二维码的有效期一致
2. 使用环境变量 `JWT_SECRET` 保护 token 的安全性
3. 所有的状态更新都通过 JWT token 验证，确保请求的合法性

### 优势
1. 无状态设计，不需要在服务器端存储会话信息
2. 支持分布式部署，多实例之间无需同步状态
3. 自动过期机制，避免无效的登录请求
4. 安全可靠，所有状态更新都经过签名验证 
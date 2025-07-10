import jwt from 'jsonwebtoken';

export interface LoginState {
  status: 'pending' | 'scanned' | 'authorized';
  sceneStr: string;
  openid?: string;
  iat?: number;
  exp?: number;
}

export function createLoginToken(sceneStr: string): string {
  const loginState: LoginState = {
    status: 'pending',
    sceneStr,
  };
  
  return jwt.sign(loginState, sceneStr, { expiresIn: '5m' });
}

export function updateLoginToken(token: string, sceneStr: string, updates: Partial<LoginState>): string {
  try {
    // 1. 验证当前token
    const loginState = jwt.verify(token, sceneStr) as LoginState;
    // 2. 清理JWT内部字段并更新状态
    const { iat, exp, ...cleanLoginState } = loginState;
    const updatedState = { ...cleanLoginState, ...updates };
    
    // 3. 生成新token
    return  jwt.sign(updatedState, sceneStr, { expiresIn: '5m' });
  } catch (error) {
    console.error('updateLoginToken 失败:', error);
    throw error; // 确保错误被抛出
  }
}

export function verifyLoginToken(token: string="", sceneStr: string): LoginState {
  try {
    const loginState = jwt.verify(token, sceneStr) as LoginState;
    console.log("verifyLoginToken", token, sceneStr,loginState);
    return loginState;
  } catch (error) {
    console.error('verifyLoginToken 失败:', error);
    throw error;
  }
} 
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
    const loginState = jwt.verify(token, sceneStr) as LoginState;
    const { iat, exp, ...cleanLoginState } = loginState;
    const updatedState = { ...cleanLoginState, ...updates };
    return jwt.sign(updatedState, sceneStr, { expiresIn: '5m' });
  } catch (signError) {
    console.error('updateLoginToken 签名失败:', {
      error: signError,
      sceneStr
    });
    throw new Error('updateLoginToken 失败');
  }
}

export function verifyLoginToken(token: string, sceneStr: string): LoginState {
  try {
    const loginState = jwt.verify(token, sceneStr) as LoginState;
    return loginState;
  } catch (error) {
    throw new Error('verifyLoginToken 失败');
  }
} 
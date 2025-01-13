// 登录状态类型定义
export interface LoginState {
  status: "pending" | "scanned" | "authorized";
  openid?: string;
  accessToken: string;
  createdAt: number;
}

class LoginStateManager {
  private static instance: LoginStateManager;
  private loginStates: Map<string, LoginState>;

  private constructor() {
    this.loginStates = new Map();
  }

  public static getInstance(): LoginStateManager {
    if (!LoginStateManager.instance) {
      LoginStateManager.instance = new LoginStateManager();
    }
    return LoginStateManager.instance;
  }

  // 设置登录状态
  public setLoginState(sceneStr: string, state: Partial<Omit<LoginState, 'createdAt'>>): void {
    const currentState = this.loginStates.get(sceneStr);
    const newState: LoginState = {
      ...currentState,
      ...state,
      createdAt: currentState?.createdAt || Date.now(),
    } as LoginState;
    
    this.loginStates.set(sceneStr, newState);

    // 设置5分钟后自动过期
    setTimeout(() => {
      this.loginStates.delete(sceneStr);
    }, 300 * 1000);
  }

  // 获取登录状态
  public getLoginState(sceneStr: string): LoginState | null {
    const state = this.loginStates.get(sceneStr);
    if (!state) return null;

    // 检查是否过期（5分钟）
    if (Date.now() - state.createdAt > 300 * 1000) {
      this.loginStates.delete(sceneStr);
      return null;
    }

    return state;
  }

  // 删除登录状态
  public deleteLoginState(sceneStr: string): void {
    this.loginStates.delete(sceneStr);
  }

  // 获取所有登录状态（用于调试）
  public getAllLoginStates(): Map<string, LoginState> {
    return new Map(this.loginStates);
  }
}

// 导出单例实例
export const loginStateManager = LoginStateManager.getInstance(); 
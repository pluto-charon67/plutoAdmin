export interface UserInfo {
    avatar: string;
    username: string;
    nickname: string;
    roles: Array<string>; // 登录账号的角色
    permissions: Array<string>; // 按钮权限
    accessToken: string; // 登录token
    refreshToken: string; // 刷新token
    expires: string; // 登录token的过期时间,年月日时分秒
}

export interface LoginParams {
    account: string;
    password: string;
}

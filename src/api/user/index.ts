import http from '@/utils/http/index.ts';
import { LoginParams, UserInfo } from './types';

export const login = (data: LoginParams) => http.post<UserInfo>('/login', { data });

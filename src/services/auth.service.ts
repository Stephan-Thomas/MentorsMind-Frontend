import { request } from "./request";

export default class AuthService {
  async login(email: string, password: string) {
    return request<{ accessToken: string; refreshToken: string }>({
      method: "POST",
      url: "/auth/login",
      data: { email, password },
    });
  }

  async signup(email: string, password: string) {
    return request<{ accessToken: string; refreshToken: string }>({
      method: "POST",
      url: "/auth/signup",
      data: { email, password },
    });
  }

  async me() {
    return request<{ id: string; email: string }>(
      {
        method: "GET",
        url: "/auth/me",
      },
      true,
    );
  }
}

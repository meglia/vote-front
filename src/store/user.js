import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: null,
    userInfo: {
      username: null,
      password: null,
      email: null,
      pubKey: null,
    },
  }),
  getters: {
    getUserInfo: (state) => state.userInfo,
    getToken: (state) => state.token,
  },
  actions: {
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
    },
    setToken(token) {
      this.token = token;
    },
    logout() {
      this.token = null;
      this.userInfo = {
        username: null,
        password: null,
        email: null,
        pubKey: null,
      };
    },
  },
  persist: {
    enabled: true,
  },
});

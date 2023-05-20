import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "@/views/Login/LoginPage.vue";
import RegisterPage from "@/views/Login/RegisterPage.vue";
import Layout from "@/views/Layout/index.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store/user.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: LoginPage,
    },
    {
      path: "/register",
      name: "Register",
      component: RegisterPage,
    },
    {
      path: "/",
      name: "Layout",
      component: Layout,
      redirect: "/home",
      children: [
        {
          path: "home",
          name: "Home",
          component: () => import("@/views/Page/HomePage.vue"),
        },
        {
          path: "create",
          name: "Create",
          component: () => import("@/views/Page/CreateVotePage.vue"),
        },
        {
          path: "join",
          name: "Join",
          component: () => import("@/views/Page/JoinVotePage.vue"),
        },
        {
          path: "check",
          name: "Check",
          component: () => import("@/views/Page/CheckVotePage.vue"),
        },
        {
          path: "myinfo",
          name: "MyInfo",
          component: () => import("@/views/Page/MyInfoPage.vue"),
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../views/404.vue"),
    },
  ],
});
router.beforeEach((to, from, next) => {
  const whiteList = ["/login", "/register"]; // 白名单
  const store = useUserStore();
  let { token } = storeToRefs(store);
  if (token.value!=null) {
    next();
  } else {
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next("/login");
    }
  }
});
export default router;

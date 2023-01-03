import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    name: 'publicphotolist',
    path: '/publicphotolist/:id',
    component: () => import('@/views/publicPhotoList'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/photoalbum',
    // children: [
    //   {
    //     path: 'dashboard',
    //     component: () => import('@/views/dashboard/index'),
    //     name: 'Dashboard',
    //     meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
    //   }
    // ]
  },
]
export const asyncRoutes = [
  {
    path: '/photoalbum',
    component: Layout,
    redirect: '/photoalbum/list',
    meta: { title: '相册管理', icon: 'el-icon-video-camera', roles: ['admin'] },
    children: [
      {
        name: 'photoalbum',
        path: '/photoalbum/list',
        component: () => import('@/views/photoalbum/list'),
        meta: {
          title: '相册列表',
          icon: 'el-icon-video-camera',
          roles: ['admin'],
          noCache: true
        }
      },
      {
        name: 'photolist',
        path: '/photoalbum/photolist/:id',
        hidden: true,
        component: () => import('@/views/photoalbum/photolist'),
        meta: {
          title: '照片列表',
          icon: 'el-icon-video-camera',
          roles: ['admin'],
          noCache: true
        }
      },
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

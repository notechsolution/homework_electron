import { RouteRecordRaw } from 'vue-router';

/**
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      isLink：        是否超链接菜单，开启外链条件，`1、isLink:true 2、链接地址不为空`
 *      isHide：        是否隐藏此路由
 *      isKeepAlive：   是否缓存组件状态
 *      isAffix：       是否固定在 tagsView 栏上
 *      isIframe：      是否内嵌窗口，，开启条件，`1、isIframe:true 2、链接地址不为空`
 *      roles：         当前路由权限标识，取角色管理。控制路由显示、隐藏。超级管理员：admin 普通角色：common
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

/**
 * 定义动态路由
 * @description 未开启 isRequestRoutes 为 true 时使用（前端控制路由），开启时第一个顶级 children 的路由将被替换成接口请求回来的路由数据
 * @description 各字段请查看 `/@/views/system/menu/component/addMenu.vue 下的 ruleForm`
 * @returns 返回路由菜单数据
 */
export const dynamicRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: '/',
    component: () => import('/@/layout/index.vue'),
    redirect: '/home',
    meta: {
      isKeepAlive: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('/@/views/home/index.vue'),
        meta: {
          title: 'message.router.home',
          isLink: '',
          isHide: false,
          isKeepAlive: true,
          isAffix: true,
          isIframe: false,
          roles: ['admin', 'common'],
          icon: 'iconfont icon-shouye'
        }
      },
      {
        path: '/troubleshooter',
        name: 'troubleshooter',
        component: () => import('/@/layout/routerView/parent.vue'),
        meta: {
          title: 'message.router.troubleshooter',
          isLink: '',
          isHide: false,
          isKeepAlive: true,
          isAffix: false,
          isIframe: false,
          roles: ['admin'],
          icon: 'iconfont icon-xianshimima'
        },
        children: [
          {
            path: '/troubleshooter/transaction',
            name: 'transaction',
            component: () => import('/@/views/troubleshooter/transaction/index.vue'),
            meta: {
              title: 'message.router.transaction',
              isLink: '',
              isHide: false,
              isKeepAlive: true,
              isAffix: false,
              isIframe: false,
              roles: ['admin', 'common'],
              icon: 'ele-Cherry'
            }
          },
          {
            path: '/troubleshooter/dockerImage',
            name: 'dockerImage',
            component: () => import('/@/views/troubleshooter/dockerImage/index.vue'),
            meta: {
              title: 'message.router.dockerImage',
              isLink: '',
              isHide: false,
              isKeepAlive: true,
              isAffix: false,
              isIframe: false,
              roles: ['admin', 'common'],
              icon: 'ele-Wallet'
            }
          }
        ]
      },
      {
        path: '/devTools',
        name: 'devTools',
        component: () => import('/@/layout/routerView/parent.vue'),
        meta: {
          title: 'message.router.devTools',
          isLink: '',
          isHide: false,
          isKeepAlive: true,
          isAffix: false,
          isIframe: false,
          roles: ['admin'],
          icon: 'iconfont icon-xitongshezhi'
        },
        children: [
          {
            path: '/jwt',
            name: 'jwt',
            component: () => import('/@/views/devTools/jwt/index.vue'),
            meta: {
              title: 'message.router.jwt',
              isLink: '',
              isHide: false,
              isKeepAlive: true,
              isAffix: false,
              isIframe: false,
              roles: ['admin', 'common'],
              icon: 'ele-Cherry'
            }
          },
          {
            path: '/swagger-editor',
            name: 'swagger-editor',
            component: () => import('/@/views/devTools/swaggerEditor/index.vue'),
            meta: {
              title: 'message.router.swaggerEditor',
              isLink: '',
              isHide: false,
              isKeepAlive: true,
              isAffix: false,
              isIframe: false,
              roles: ['admin', 'common'],
              icon: 'ele-Cherry'
            }
          },
          {
            path: '/base64',
            name: 'base64',
            component: () => import('/@/views/devTools/base64/index.vue'),
            meta: {
              title: 'message.router.base64',
              isLink: '',
              isHide: false,
              isKeepAlive: true,
              isAffix: false,
              isIframe: false,
              roles: ['admin', 'common'],
              icon: 'ele-Cherry'
            }
          },
          {
            path: '/url',
            name: 'url',
            component: () => import('/@/views/devTools/url/index.vue'),
            meta: {
              title: 'message.router.url',
              isLink: '',
              isHide: false,
              isKeepAlive: true,
              isAffix: false,
              isIframe: false,
              roles: ['admin', 'common'],
              icon: 'ele-Cherry'
            }
          }]
      }, {
        path: '/markdown',
        name: 'markdown',
        component: () => import('/@/views/markdown/index.vue'),
        meta: {
          title: 'message.router.markdown',
          isLink: '',
          isHide: false,
          isKeepAlive: true,
          isAffix: false,
          isIframe: false,
          roles: ['admin', 'common'],
          icon: 'fa fa-maxcdn'
        }
      },
      {
        path: '/dictation',
        name: 'dictation',
        component: () => import('/@/layout/routerView/parent.vue'),
        meta: {
          title: '听写',
          isLink: '',
          isHide: false,
          isKeepAlive: true,
          isAffix: false,
          isIframe: false,
          roles: ['admin','common'],
          icon: 'ele-Service'
        },
        children: [
          {
            path: '/words',
            name: 'words',
            component: () => import('/@/views/dictation/words.vue'),
            meta: {
              title: '单词听写',
              isLink: '',
              isHide: false,
              isKeepAlive: true,
              isAffix: false,
              isIframe: false,
              roles: ['admin', 'common'],
              icon: 'ele-Cloudy'
            }
          },
          {
            path: '/sentences',
            name: 'sentences',
            component: () => import('/@/views/dictation/sentences.vue'),
            meta: {
              title: '句子听写',
              isLink: '',
              isHide: false,
              isKeepAlive: true,
              isAffix: false,
              isIframe: false,
              roles: ['admin', 'common'],
              icon: 'ele-Pouring'
            }
          }]
      }
    ]
  }
];

/**
 * 定义静态路由
 * @description 前端控制直接改 dynamicRoutes 中的路由，后端控制不需要修改，请求接口路由数据时，会覆盖 dynamicRoutes 第一个顶级 children 的内容（全屏，不包含 layout 中的路由出口）
 * @returns 返回路由菜单数据
 */
export const staticRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('/@/views/login/index.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/404',
    name: 'notFound',
    component: () => import('/@/views/error/404.vue'),
    meta: {
      title: 'message.staticRoutes.notFound'
    }
  },
  {
    path: '/401',
    name: 'noPower',
    component: () => import('/@/views/error/401.vue'),
    meta: {
      title: 'message.staticRoutes.noPower'
    }
  },
  /**
   * 提示：写在这里的为全屏界面，不建议写在这里
   * 请写在 `dynamicRoutes` 路由数组中
   */
  {
    path: '/visualizingDemo1',
    name: 'visualizingDemo1',
    component: () => import('/@/views/visualizing/demo1.vue'),
    meta: {
      title: 'message.router.visualizingLinkDemo1'
    }
  },
  {
    path: '/visualizingDemo2',
    name: 'visualizingDemo2',
    component: () => import('/@/views/visualizing/demo2.vue'),
    meta: {
      title: 'message.router.visualizingLinkDemo2'
    }
  }
];

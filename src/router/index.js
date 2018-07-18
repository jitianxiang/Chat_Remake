import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const ChatHistoryPage = () => import('@/components/chatHistory/page')
const ContactsPage = () => import('@/components/contacts/page')
const Container = () => import('@/components/container')
const ChatPage = () => import('@/components/chatPage/page')

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/container/chatHistoryPage'
    },
    {
      path: '/container',
      name: 'Container',
      component: Container,
      children: [
        {
          path: 'chatHistoryPage',
          name: 'ChatHistoryPage',
          component: ChatHistoryPage
        },
        {
          path: 'contactsPage',
          name: 'ContactsPage',
          component: ContactsPage
        }
      ]
    },
    {
      path: '/chatPage',
      name: 'ChatPage',
      component: ChatPage
    }
  ]
})

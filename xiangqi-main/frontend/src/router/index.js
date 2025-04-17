import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Home from '../components/Home.vue'
import Profile from '../components/Profile.vue'
import Rankings from '../components/Rankings.vue'
import Settings from '../components/Settings.vue'
import Game from '../components/Game.vue'
import GameLobby from '../components/GameLobby.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/rankings',
    name: 'Rankings',
    component: Rankings
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/game',
    name: 'Game',
    component: Game
  },
  {
    path: '/game-lobby',
    name: 'GameLobby',
    component: GameLobby
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 
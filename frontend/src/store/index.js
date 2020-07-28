import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import accountStore from '@/store/modules/accountStore'
import clubStore from '@/store/modules/clubStore'
import meetupStore from '@/store/modules/meetupStore'
import postStore from '@/store/modules/postStore'
import profileStore from '@/store/modules/profileStore'

import axios from 'axios'
import cookies from 'vue-cookies'
import SERVER from '@/api/api'

export default new Vuex.Store({
  state: {
    authToken: cookies.get('auth-token'),
    genres: null,
    myaccount: null,
    books: null,
  },
  getters: {
    config: state => ({ headers: { jwt : state.authToken}}),
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.authToken = token
      cookies.set('auth-token', token)
    },
    SET_GENRES(state, genres) {
      state.genres = genres
    },
    SET_MY_ACCOUNT(state, user) {
      state.myaccount = user
    },
    SET_BOOKS(state, books) {
      state.books = books
    }
  },
  actions: {
    fetchGenres({ commit }) {
      axios.get(SERVER.URL + SERVER.ROUTES.genres)
        .then(res => {
          commit('SET_GENRES', res.data)
        })
        .catch(err => {
          console.log(err.response.data)
        })
    },
    findMyAccount({ rootGetters, commit}) {
      axios.post(SERVER.URL + SERVER.ROUTES.myaccount, null, rootGetters.config)
        .then(res => {
            commit('SET_MY_ACCOUNT', res.data)
        })
        .catch(err => console.log(err.response.data))
    },
    fetchBooks({ commit }) {
      axios.get(SERVER.URL + SERVER.ROUTES.books)
        .then(res => {
          commit('SET_BOOKS', res.data)
        })
        .catch(err => console.log(err.response.books))
    },
      
  },

  modules: {
    accountStore: accountStore,
    clubStore: clubStore,
    meetupStore: meetupStore,
    postStore: postStore,
    profileStore: profileStore
  }
})
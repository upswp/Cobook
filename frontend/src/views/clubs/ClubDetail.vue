<template>
  <div class="custom-container mt-3 mb-5">

    <!-- club-detail-header -->
    <div class="row pl-2">

      <!-- club-detail-clubImg -->
      <img
        class="club-image col-4"
        :src="selectedClub.clubImg"
        :alt="selectedClub.name"
        v-if="selectedClub && selectedClub.clubImg">
      <img
        class="club-image col-4"
        :src="'http://placehold.jp/300x200.png?text=' + selectedClub.name"
        :alt="selectedClub.name"
        v-else>

      <div class="col-8 py-2 d-flex flex-column justify-content-between">
        <div>
          <div class="d-flex justify-content-between mb-2">
            <div class="d-flex justify-content-start align-items-center">
              <!-- club-detail-name -->
              <h3 class="mb-0 font-weight-bold">{{ selectedClub.name }}</h3>
              <!-- club-detail-recruit -->
              <span class="badge mb-0 ml-2 club-recruit" v-if="selectedClub.recruit">모집중</span>
            </div>
            <!-- <div class="d-flex align-items-center">
              <p class="mb-0">{{ selectedClub.followerCnt }} FOLLOW</p>
              <button class="btn btn-green ml-2">팔로우</button>
            </div> -->
          </div>
          <!-- club-detail-onelineDescription -->
          <p class="text-left">{{ selectedClub.onelineDescription }}</p>
        </div>
        
        <div>
          <!-- club-detail-residence -->
          <p class="color-black text-left">주로 <span class="color-black font-weight-bold">{{ selectedClub.residence }}</span>에서 만남 :)</p>
          <div class="d-flex justify-content-between">
            <!-- club-detail-genres -->
            <div>
              <button 
                class="btn btn-genre mr-2" 
                @click="searchGenre(genre.name)"
                v-for="genre in selectedClub.genres" 
                :key="genre.id">
                #{{ genre.name }}
              </button>
            </div>
            <!-- club-detail-buttons -->
            <div>
              <button
                class="btn btn-secondary dropdown-toggle"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                v-if="isLeader"
              >
                북클럽 설정
              </button>
              <div class="dropdown-menu py-0">
                <button 
                  class="dropdown-item setting-btn text-center"
                  type="button"
                  @click="toClubEventCreate">
                  북클럽 이벤트 생성
                </button>
                <button 
                  class="dropdown-item setting-btn text-center"
                  type="button"
                  @click="clickUpdateRecruit(selectedClub.id)"
                  v-if="!selectedClub.recruit">
                  모집 활성화
                </button>
                <button 
                  class="dropdown-item setting-btn text-center"
                  type="button"
                  @click="clickUpdateRecruit(selectedClub.id)"
                  v-if="selectedClub.recruit">
                  모집 비활성화
                </button>
                <button 
                  class="dropdown-item setting-btn text-center"
                  type="button"
                  @click="toClubCandidates(selectedClub.id)"
                  v-if="selectedClub.recruit">
                  모집 현황
                </button>
                <div class="dropdown-divider my-1"></div>
                <button 
                  class="dropdown-item setting-btn text-center"
                  type="button"
                  @click="toClubUpdate(selectedClub.id)">
                  북클럽 정보 수정
                </button>
                <button 
                  class="dropdown-item setting-btn text-center"
                  type="button"
                  @click="clickClubDelete(selectedClub.id)">
                  북클럽 삭제
                </button>
              </div>
              <button
                class="btn btn-warning"
                v-if="selectedClub.recruit && !isMember && !isLeader &&!isCandidate"
                @click="clickApplyClub('apply', selectedClub.id)">
                가입 신청
              </button>
              <button
                class="btn btn-gray"
                v-if="selectedClub.recruit && isCandidate"
                @click="clickApplyClub('cancel', selectedClub.id)">
                가입 취소
              </button>
              <button
                class="btn btn-gray"
                v-if="!isLeader && isMember"
                @click="clickClubSecede(selectedClub.id)">
                북클럽 탈퇴
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <hr>

    <!-- club-detail-members -->
    <div class="my-4">
      <h4 class="text-left font-weight-bold mb-4">북클럽 멤버({{ selectedClub.memberCnt }})</h4>
      <carousel
        :loop="true"
        :navigationEnabled="true"
        navigationNextLabel="<h3><i class='fas fa-angle-right'></i></h3>"
        navigationPrevLabel="<h3><i class='fas fa-angle-left'></i></h3>"
        :perPageCustom="[[1, 1], [600, 2], [900, 3], [1200, 4], [1400, 5]]"
        paginationActiveColor="#3c756a"
        paginationColor="#88A498"
        :paginationPadding="4"
        :paginationSize="10"
        easing="linear"
        :speed="300">
        <slide>
          <div class="profile-container pointer" @click="selectUser(selectedClub.leader.id)">
            <img
              class="rounded-circle profile-image mx-auto"
              :src="selectedClub.leader.profileImg"
              :alt="selectedClub.leader.nickName"
              v-if="selectedClub.leader.profileImg">
            <img
              class="rounded-circle profile-image mx-auto"
              src="http://bit.do/anonymouseuser"
              :alt="selectedClub.leader.nickName"
              v-else>
            <div class="overlay rounded-circle mx-auto">
              <div class="text"><i class="fas fa-book-reader mr-2"></i>북클럽장<br>{{ selectedClub.leader.nickName }}</div>
            </div>
          </div>
        </slide>
        
        <slide v-for="member in selectedClub.members" :key="member.id">
          <div
            class="profile-container pointer"
            @click="selectUser(member.id)">
            <img
              class="rounded-circle profile-image mx-auto"
              :src="member.profileImg"
              :alt="member.nickName"
              v-if="member.profileImg">
            <img
              class="rounded-circle profile-image mx-auto"
              src="http://bit.do/anonymouseuser"
              :alt="member.nickName"
              v-else>
            <div class="overlay rounded-circle mx-auto">
              <div class="text">{{ member.nickName }}</div>
            </div>
          </div>
        </slide>
      </carousel>
    </div>


    <!-- <div>
      <h4 class="text-left font-weight-bold mb-3">북클럽 멤버({{ selectedClub.memberCnt }})</h4>
      <div class="d-flex justify-content-start">
        <div class="profile-container pointer mr-3" @click="selectUser(selectedClub.leader.id)">
          <img
            class="rounded-circle image"
            :src="selectedClub.leader.profileImg"
            :alt="selectedClub.leader.nickName"
            v-if="selectedClub.leader.profileImg">
          <img
            class="rounded-circle image"
            src="http://bit.do/anonymouseuser"
            :alt="selectedClub.leader.nickName"
            v-else>
          <div class="overlay rounded-circle">
            <div class="text">{{ selectedClub.leader.nickName }}</div>
          </div>
        </div>

        <div
          class="profile-container pointer mr-3"
          v-for="member in selectedClub.members"
          :key="member.id"
          @click="selectUser(member.id)">
          <img
            class="rounded-circle image"
            :src="member.profileImg"
            :alt="member.nickName"
            v-if="member.profileImg">
          <img
            class="rounded-circle image"
            src="http://bit.do/anonymouseuser"
            :alt="member.nickName"
            v-else>
          <div class="overlay rounded-circle">
            <div class="text">{{ member.nickName }}</div>
          </div>
        </div>
      </div>
    </div> -->

    <hr>

    <!-- club-description -->
    <div class="my-4">
      <h4 class="text-left font-weight-bold mb-3">북클럽 설명</h4>
      <p class="text-left px-2 description">{{ selectedClub.description }}</p>
    </div>

    <hr>

    <!-- club-clubEvents -->

    <div class="my-4">
      <h4 class="text-left font-weight-bold mb-5">{{ selectedClub.name }}에서 진행한 북클럽 이벤트</h4>
      <carousel
        :loop="true"
        :navigationEnabled="true"
        navigationNextLabel="<h3><i class='fas fa-angle-right'></i></h3>"
        navigationPrevLabel="<h3><i class='fas fa-angle-left'></i></h3>"
        :perPageCustom="[[1, 1], [1000, 2], [1500, 3]]"
        paginationActiveColor="#3c756a"
        paginationColor="#88A498"
        :paginationPadding="4"
        :paginationSize="10"
        easing="linear"
        :speed="300"
        v-if="selectedClub.clubEvents.length">
      
        <slide
          v-for="clubEvent in selectedClub.clubEvents"
          :key="clubEvent.id">
          <div class="card pointer mx-auto my-auto" @click="selectClubEvent(clubEvent.id)" style="width: 315px">
            <div class="row no-gutters">
              <div class="col-6 clubEvent-left">
                <img class="bg-image" :src="clubEvent.book.bookImg" width="100%">
                <span class="badge mb-0 clubEvent-closed-true" v-if="clubEvent.closed">종료</span>
                <span class="badge mb-0 clubEvent-closed-false" v-else>예정</span>
              </div>
              <div class="col-6 text-left d-flex flex-column align-items-start p-2">
                <p class="clubEvent-name font-weight-bold" lt="book">{{ clubEvent.name }}</p>
                <span class="badge badge-genre">{{ clubEvent.book.genre }}</span>
                <div class="mt-auto">
                  <p class="mb-0"><small><i class="fas fa-users"></i> {{ clubEvent.participantCnt}}</small></p>
                  <p class="mb-0"><small><i class="fas fa-map-marker-alt"></i> {{ clubEvent.place }}</small></p>
                  <p class="clubEvent-date mb-0"><small>{{ clubEvent.datetime | moment('YYYY-MM-DD HH:mm') }}</small></p>
                </div>
              </div>
            </div>
          </div>
        </slide>
      </carousel>

      <div class="no-content d-flex justify-content-center align-items-center" v-else>
        <p class="mb-0">아직 {{ selectedClub.name }}의 북클럽 이벤트가 없습니다 ㄴ(°0°)ㄱ</p>
      </div>
    </div>
    
    <!-- <div>
      <h4 class="text-left font-weight-bold mb-3">{{ selectedClub.name }}에서 진행한 북클럽 이벤트</h4>
      <div class="d-flex scroll-sect" id="scroll-area-event" v-if="selectedClub.clubEvents.length">
        <div
          class="px-3 pointer pb-3"
          v-for="clubEvent in selectedClub.clubEvents"
          :key="clubEvent.id"
          @click="selectClubEvent(clubEvent.id)"
          style="min-width: 345.59px; max-width: 345.59px;">
          <div class="card m-0">
            <div class="row no-gutters">
              <div class="col-6 clubEvent-left">
                <img class="bg-image" :src="clubEvent.book.bookImg" width="100%">
                <span class="badge mb-0 clubEvent-closed-true" v-if="clubEvent.closed">종료</span>
                <span class="badge mb-0 clubEvent-closed-false" v-else>예정</span>
              </div>
              <div class="col-6 text-left d-flex flex-column align-items-start p-2">
                <p class="clubEvent-name font-weight-bold" lt="book">{{ clubEvent.name }}</p>
                <span class="badge badge-genre">{{ clubEvent.book.genre }}</span>
                <div class="mt-auto">
                  <p class="mb-0"><small><i class="fas fa-users"></i> {{ clubEvent.participantCnt}}</small></p>
                  <p class="mb-0"><small><i class="fas fa-map-marker-alt"></i> {{ clubEvent.place }}</small></p>
                  <p class="clubEvent-date mb-0"><small>{{ clubEvent.datetime | moment('YYYY-MM-DD HH:mm') }}</small></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="no-content d-flex justify-content-center align-items-center" v-else>
        <p class="mb-0">아직 {{ selectedClub.name }}의 북클럽 이벤트가 없습니다 ㄴ(°0°)ㄱ</p>
      </div>
    </div>   -->
    
    <!-- <hr> -->

    <!-- club-posts -->
    <!-- <div>
      <h4 class="text-left font-weight-bold mb-3">{{ selectedClub.name }}의 게시물</h4>
      <div class="no-content d-flex justify-content-center align-items-center" v-if="!selectedClub.posts">
        < class="mb-0">아직 {{ selectedClub.name }}의 게시물이 없습니다 ㄴ(°0°)ㄱ</p>
      </div>
    </div> -->
  </div>
</template>

<script>
import { Carousel, Slide } from 'vue-carousel'
import Swal from 'sweetalert2'
const swal = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success mr-2',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})

import router from '@/router'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'ClubDetail',
  components: {
    Carousel,
    Slide
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState(['myaccount']),
    ...mapState('clubStore', ['selectedClub']),
    isLeader() {
      if (this.myaccount.id === this.selectedClub.leader.id) {
        return true
      } else {
        return false
      }
    },
    isMember() {
      let result = false
      this.selectedClub.members.forEach(member => {
        if (this.myaccount.id === member.id) {
          result = true
        }
      });
      return result
    },
    isCandidate() {
      if (this.selectedClub.candidates.includes(this.myaccount.id)) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    ...mapActions(['createNoti']),
    ...mapActions('clubStore', ['findClub', 'updateRecruit', 'applyClub', 'secedeClub', 'deleteClub']),
    selectClubEvent(clubEventId) {
      if (this.isMember || this.isLeader) {
        router.push({ name: 'ClubEventDetail', params: { clubId: this.$route.params.clubId, clubEventId: clubEventId }})
      } else {
        Swal.fire({
          icon: 'error',
          text: '아쉽지만 북클럽 멤버만 접근 가능합니다.',
        })
      }
    },
    selectUser(userId) {
      router.push({ name: 'Profile', params: { userId: userId }})
    },
    clickUpdateRecruit(clubId) {
      this.updateRecruit(clubId)
      this.selectedClub.recruit = !this.selectedClub.recruit
    },
    clickApplyClub(type, clubId) {
      let notiData = new Object()
      notiData = {
        to: this.selectedClub.leader.id,
        dataId: this.selectedClub.id,
        isRead: false,
        type: "club"
      }
      this.createNoti(notiData)
      
      if (type === 'apply') {
        Swal.fire({
          icon: 'success',
          html: '<p>가입 신청이 완료 되었습니다.<br>설레는 마음으로 기다려주세요 :)</p>',
        })
        this.applyClub(clubId)
      } else if (type === 'cancel') {
        Swal.fire({
          icon: 'success',
          html: '<p>가입 신청이 취소 되었습니다 :)</p>',
        })
        this.applyClub(clubId)
      }
    },
    toClubCandidates(clubId) {
      router.push({ name: 'ClubCandidates', params: { clubId: clubId }})
    },
    clickClubSecede(clubId) {
       swal.fire({
        // title: "Are you sure?",
          text: "북클럽을 탈퇴하시겠습니까?",
          showCancelButton: true,
          confirmButtonText: '네',
          cancelButtonText: '아니요',
          icon: "warning",
        })
        .then((result) => {
          if (result.value) {
            this.secedeClub(clubId)
          } 
        });
    },
    toClubEventCreate() {
      router.push({ name: 'ClubEventCreate' })
    },
    toClubUpdate(clubId) {
      router.push({ name: 'ClubUpdate', params: { clubId: clubId } })
    },
    clickClubDelete(clubId) {
      swal.fire({
          text: "북클럽을 삭제하시겠습니까?",
          showCancelButton: true,
          confirmButtonText: '네',
          cancelButtonText: '아니요',
          // reverseButtons: true,
          icon: "warning",
        })
        .then((result) => {
          if (result.value) {
            this.deleteClub(clubId)
          } 
        });
    },
    searchGenre(content) {
      router.push({ name: 'SearchClub', params: { content: content }})
    }
  },
  created() {
    this.findClub(this.$route.params.clubId)
  },
  updated() {
    function stopWheel(e){
      if(!e){ e = window.event; } /* IE7, IE8, Chrome, Safari */
      if(e.preventDefault) { e.preventDefault(); } /* Chrome, Safari, Firefox */
      e.returnValue = false; /* IE7, IE8 */
    }

    if (this.selectedClub.clubEvents.length >= 3) {
      const scrollAreaEvent = document.querySelector('#scroll-area-event')
      scrollAreaEvent.addEventListener('wheel', (e) => {
        scrollAreaEvent.scrollLeft += e.deltaY;
        stopWheel()
      })
    }
  }
}
</script>

<style scoped>
  .profile-container {
    position: relative;
  }

  .overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
    opacity: 0;
    transition: .5s ease;
    background-color: #3e3f3f;
  }

  .profile-container .overlay {
    height: 150px;
    width: 150px;
  }

  .profile-container:hover .overlay {
    opacity: 0.8;
  }

  .profile-image {
    display: block;
    width: 150px;
    height: 150px;
  }

  .text {
    color: white;
    font-size: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    text-align: center;
    width: 80%;
    font-weight: bold;
  }
  
  .card {
    background-color: #fff;
    background: linear-gradient(#f8f8f8, #fff);
    box-shadow: 0 8px 16px -8px rgba(0,0,0,0.4);
    border-radius: 6px;
    overflow: hidden;
  }

  .card:hover {
    background-color: #fff;
    background: linear-gradient(#f8f8f8, #fff);
    box-shadow: 0 8px 16px -8px rgba(0,0,0,0.8);
    border-radius: 6px;
    overflow: hidden;
  }

  .clubEvent-left {
    position: relative;
  }

  .clubEvent-closed-false {
    background-color: rgba(221, 118, 0, 0.8); 
    color: #F8F8F8;
    text-align: center;
    position: absolute;
    top: 3%;
    left: 5%;
    padding: 6px;
  }

  .clubEvent-closed-true {
    background-color: #707070; 
    color: #F8F8F8;
    text-align: center;
    position: absolute;
    top: 3%;
    left: 5%;
    padding: 6px;
  }

  .no-content {
    height: 8rem;
  }

  .club-image {
    padding: 0;
    max-height: 200px;
    box-shadow: 0 8px 16px -8px rgba(0,0,0,0.4);
    border-radius: 6px;
    overflow: hidden;
  }

  .clubEvent-name {
    word-break: keep-all;
  }

  .club-recruit {
    /* background-color: #b68145; */
    /* background-color: #907a62; */
    background-color: rgba(221, 118, 0, 0.8); 
    color: #F8F8F8;
    text-align: center;
    padding: 6px;
  }

  .description {
    white-space: pre-line;
  }

  .btn-genre {
    background-color: #88A498;
    color: #F8F8F8;
    opacity: 1;
  }

  .setting-btn:focus {
    background-color: #707070 !important;
    outline: none;
  }

  .badge-genre {
    background-color: #88A498;
    color: #F8F8F8;
    padding: 6px;
  }

  .scroll-sect {
    overflow: hidden;
  }

  .scroll-sect::-webkit-scrollbar {
    width: 8px; height: 8px; border: 3px solid white; 
  } 

  .scroll-sect::-webkit-scrollbar-button,.scroll-sect::-webkit-scrollbar-button:END {
    background-color: white;
  }

  .scroll-sect::-webkit-scrollbar-button:start:decrement{
  }

  .scroll-sect::-webkit-scrollbar-track {
    background: white; 
    -webkit-border-radius: 10px white; 
    border-radius:10px white;
    /* -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,.2) */
  }

  .scroll-sect::-webkit-scrollbar-thumb {
    height: 10px; 
    width: 50px; 
    background: #88A498; 
    -webkit-border-radius: 15px; border-radius: 15px; 
    /* -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,.1) */
  }

  .scroll-sect:hover{
    overflow-x: scroll;
  }
</style>
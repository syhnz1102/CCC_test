<template>
   <div class="wrapper">
      <Popup
       v-if="popup.on"
       v-bind:type="popup.type"
       v-bind:title="popup.title"
       v-bind:contents="popup.contents"
       v-bind:option="popup.option"
       v-bind:ok="handlePopupOkBtnClick"
       v-bind:cancel="handlePopupCancelBtnClick"
      />
      <app-modal v-if="appModal" v-bind:close="handleAppModalClose" />
      <header class="header">
         <div class="container">
            <h1>
               <a href="/" class="logo">COCOcall</a>
            </h1>
            <div class="menu">
               <a href="#information">
                  <span data-menu="information">information</span>
               </a>
               <a href="#function">
                  <span data-menu="function">function</span>
               </a>
               <a href="#guide">
                  <span data-menu="guide">guide</span>
               </a>
               <a href="#download">
                  <span data-menu="download">download</span>
               </a>
               <button @click="onChangeLanguage" class="lang">
                 <span>{{ this.$i18n.locale === 'ko' ? 'ENG' : 'KOR' }}</span>
               </button>
            </div>
         </div>
      </header>
      <div class="toast wow animate__animated animate__fadeOut" data-wow-duration="1.5s" v-if="toast">
        <p>{{ toast }}</p>
      </div>
      <div class="main">
         <section class="visual">
            <div class="bg">
               <img src="../assets/images/bg.jpg">
            </div>
           <div class="container">
             <div class="content">
               <div class="title">
                 <p class="wow animate__animated animate__fadeInUp" data-wow-delay=".4s">{{ $t('main-title-description') }}</p>
                 <strong class="wow animate__animated animate__fadeInUp" data-wow-delay=".6s">
                   <span><i>CO</i>nvenient</span>
                   <span><i>CO</i>nference</span>
                   <span @dblclick="changeDeveloperMode"><i>call</i></span>
                 </strong>
               </div>
               <div class="button wow animate__animated animate__fadeInUp" data-wow-delay=".8s">
                 <div class="make">
                   <button @click="handleMakeBtnClick">{{ $t('main-button-start') }}</button>
                 </div>
                 <div class="enter" v-bind:class="{ open: isCollapsedJoinBtn }">
                   <input v-model="url" type="text" v-bind:placeholder="this.$t('main-button-join-placeholder')" v-on:keyup.enter="handleJoinBtnClick">
                   <button v-on:mouseover="handleMouseoverJoinBtn" @click="handleJoinBtnClick">{{ $t('main-button-join') }}</button>
                 </div>
               </div>
             </div>
             <button class="scroll"></button>
           </div>
         </section>
         <section id="information" class="information">
            <div class="container">
               <h2><div class="logo">COCOcall</div></h2>
               <ul>
                  <li>
                     <div class="wow box animate__animated animate__zoomIn">
                        <div class="tit"><strong>CO</strong>nvenient</div>
                        <div class="content">
                           <p>프로그램 설치와 회원가입이 필요 없어<br /> 편하게 사용할 수 있습니다.</p>
                        </div>
                     </div>
                  </li>
                  <li>
                     <div class="wow box animate__animated animate__zoomIn">
                        <div class="tit"><strong>CO</strong>nference</div>
                        <div class="content">
                           <p>회의실이 아니어도<br /> 화상으로 회의를 진행할 수 있습니다.</p>
                        </div>
                     </div>
                  </li>
                  <li>
                     <div class="wow box animate__animated animate__zoomIn">
                        <div class="tit"><strong>call</strong></div>
                        <div class="content">
                           <p>누구나 무료로<br /> 화상회의를 즐길 수 있습니다.</p>
                        </div>
                     </div>
                  </li>
               </ul>
            </div>
         </section>
         <section id="function" class="function">
            <div class="container">
               <ul>
                  <li class="wow animate__animated animate__fadeInUp">
                     <strong>비회원</strong>
                     <p>복잡한 회원가입 절차가<br /> 필요 없습니다.</p>
                  </li>
                  <li class="wow animate__animated animate__fadeInUp" data-wow-delay=".2s">
                     <strong>프로그램 설치 없이</strong>
                     <p>별도의 프로그램 설치가<br /> 필요 없습니다.</p>
                  </li>
                  <li class="wow animate__animated animate__fadeInUp" data-wow-delay=".4s">
                     <strong>인터넷 브라우저</strong>
                     <p>인터넷 브라우저만으로<br /> 화상회의를 할 수 있습니다. <span>*Chrome browser 권장</span></p>
                  </li>
                  <li class="wow animate__animated animate__fadeInUp" data-wow-delay=".6s">
                     <strong>최대 16명까지</strong>
                     <p>최대 16명까지<br /> 화상회의를 할 수 있습니다.</p>
                  </li>
               </ul>
            </div>
         </section>
         <section id="guide" class="guide">
            <div class="container">
               <ul>
                  <li>
                     <div class="img">
                        <img src="../assets/images/img_guide_01.jpg" alt="STEP 1">
                     </div>
                     <strong class="wow animate__animated animate__fadeInUp">STEP 1</strong>
                     <p class="wow animate__animated animate__fadeInUp"  data-wow-delay=".2s">메인화면에서 '회의시작' 버튼을 클릭하면 화상회의가 시작됩니다.</p>
                  </li>
                  <li>
                     <div class="img">
                        <img src="../assets/images/img_guide_02.jpg" alt="STEP 2">
                     </div>
                     <strong class="wow animate__animated animate__fadeInUp"  data-wow-delay=".2s">STEP 2</strong>
                     <p class="wow animate__animated animate__fadeInUp"  data-wow-delay=".3s">화상회의에 필요한 카메라, 마이크, 스피커 디바이스를 확인 할 수 있습니다.</p>
                  </li>
                  <li>
                     <div class="img">
                        <img src="../assets/images/img_guide_03.jpg" alt="STEP 3">
                     </div>
                     <strong class="wow animate__animated animate__fadeInUp"  data-wow-delay=".2s">STEP 3</strong>
                     <p class="wow animate__animated animate__fadeInUp"  data-wow-delay=".3s">화면 하단에 마우스를 가져가면 메뉴를 확인하실 수 있습니다.</p>
                  </li>
                  <li>
                     <div class="img">
                        <img src="../assets/images/img_guide_04.jpg" alt="STEP 4">
                     </div>
                     <strong class="wow animate__animated animate__fadeInUp"  data-wow-delay=".2s">STEP 4</strong>
                     <p class="wow animate__animated animate__fadeInUp"  data-wow-delay=".3s">메뉴에서 '초대하기' 버튼을 클릭 후 URL을 공유하여 사용자를 초대할 수 있습니다.</p>
                  </li>
                  <li>
                     <div class="img">
                        <img src="../assets/images/img_guide_05-1.jpg" alt="STEP 5-1">
                     </div>
                     <strong class="wow animate__animated animate__fadeInUp">STEP 5-1</strong>
                     <p class="wow animate__animated animate__fadeInUp"  data-wow-delay=".2s">초대받은 사용자는 인터넷 브라우저에 바로 URL을 입력하거나 COCOcall 메인에서 '회의참여'에 URL을 입력하면 회의에 참석됩니다.</p>
                  </li>
                  <li>
                     <div class="img">
                        <img src="../assets/images/img_guide_05-2.jpg" alt="STEP 5-2">
                     </div>
                     <strong class="wow animate__animated animate__fadeInUp">STEP 5-2</strong>
                     <p class="wow animate__animated animate__fadeInUp"  data-wow-delay=".2s">COCOcall을 실행 중이라면 메뉴에서 참여하기 버튼을 클릭 후 URL을 입력하면 회의에 참석됩니다.</p>
                  </li>
                  <li>
                     <div class="img">
                        <img src="../assets/images/img_guide_06.jpg" alt="STEP 6">
                     </div>
                     <strong class="wow animate__animated animate__fadeInUp">STEP 6</strong>
                     <p class="wow animate__animated animate__fadeInUp"  data-wow-delay=".2s">최대 16명까지 화상회의가 가능합니다.</p>
                  </li>
                  <li>
                     <div class="img">
                        <img src="../assets/images/img_guide_07.jpg" alt="STEP 7">
                     </div>
                     <strong class="wow animate__animated animate__fadeInUp"  data-wow-delay=".2s">STEP 7</strong>
                     <p class="wow animate__animated animate__fadeInUp"  data-wow-delay=".3s">메뉴에서 카메라, 오디오를 On/Off 할 수 있습니다.</p>
                  </li>
                  <li>
                     <div class="img">
                        <img src="../assets/images/img_guide_08.jpg" alt="STEP 8">
                     </div>
                     <strong class="wow animate__animated animate__fadeInUp">STEP 8</strong>
                     <p class="wow animate__animated animate__fadeInUp"  data-wow-delay=".2s">내 이름을 원하는 대로 수정할 수 있습니다. <span>*최초에는 '익명'으로 표시됩니다.</span></p>
                  </li>
                  <li>
                     <div class="img">
                        <img src="../assets/images/img_guide_09.jpg" alt="STEP 9">
                     </div>
                     <strong class="wow animate__animated animate__fadeInUp"  data-wow-delay=".2s">STEP 9</strong>
                     <p class="wow animate__animated animate__fadeInUp"  data-wow-delay=".3s">메뉴에서 '화면공유' 버튼을 클릭하면 본인의 화면을 공유할 수 있습니다. <span>*PC에서만 제공됩니다.</span></p>
                  </li>
               </ul>
            </div>
         </section>
         <section id="download" class="download">
            <div class="container">
               <div class="content">
                  <div class="logo">COCOcall</div>
                  <div class="text">
                     <p>COCOcall을 APP으로 만나보세요!</p>
                     <span>*안드로이드에서만 제공됩니다.</span>
                  </div>
                  <a href="https://play.google.com/store/apps/details?id=kr.co.knowledgepoint.knowledgetalkccc" target="_blank">
                     <img src="../assets/images/img_app_download.png" alt="GET IT ON Google Play">
                  </a>
               </div>
            </div>
         </section>
      </div>
      <footer class="footer">
         <div class="container">
            <div class="link">
               <a href="https://knowledgepoint.co.kr/" target="_blank">{{ $t('main-footer-menu-1') }}</a>
               <a href="https://knowledgepoint.co.kr/developer/qna/list" target="_blank">{{ $t('main-footer-menu-2') }}</a>
               <a href="https://knowledgepoint.co.kr/developer/update/list" target="_blank">{{ $t('main-footer-menu-3') }}</a>
               <a href="https://play.google.com/store/apps/details?id=kr.co.knowledgepoint.knowledgetalkccc" target="_blank">{{ $t('main-footer-menu-4') }}</a>
            </div>
            <div class="company">
               <strong>COCOcall <span>[{{ getVersion }}]</span></strong>
               <p>
                  <span>{{ $t('main-footer-company-name') }}</span>
                  <span>{{ $t('main-footer-company-address') }}</span>
                  <span>{{ $t('main-footer-company-phone') }}<a href="tel:070-4325-4033">070-4325-4033</a></span>
                  <span>{{ $t('main-footer-company-mail') }}<a href="mailto:maverick@knowledgepoint.co.kr">maverick@knowledgepoint.co.kr</a></span>
               </p>
            </div>
            <div class="copyright">Copyright All rights reserved. Knowledgepoint Co., Ltd.</div>
         </div>
      </footer>
   </div>
</template>

<script>
import Session from '../commons/session';
import { sendMessage } from '../commons/message';
import config from '../config';
import Popup from '@/components/Popup';
import AppModal from '@/components/AppModal';
import mobile from '../commons/mobile';
import router from "../router";
import utils from '../commons/utils';

export default {
  components: { Popup, AppModal },
  data () {
    return {
      url: '',
      isCollapsedJoinBtn: false,
      popup: {
        on: false,
        type: '',
        title: '',
        contents: '',
        option: {},
        ok: null,
        cancel: null
      },
      toast: '',
      appModal: false
    }
  },
  mounted() {
    // 200826 ivypark, v1.1.1. 모바일 웹브라우저 동작 팝업 추가
    // 200721 ivypark, v1.0.8. 메인페이지 deeplink 추가
    if (mobile.isMobile && !mobile.isWebView) {
      this.appModal = true;
    }

    // 200812 ivypark, v1.1.0a. 영문화 적용. initialize
    this.$i18n.locale = (mobile.isMobile ? this.$store.state.language : window.localStorage.getItem('locale')) || 'ko';
    this.$store.commit('setLanguage', this.$i18n.locale);

    // 200810 ivypark, v1.1.0b. 비즈니스 버전 (ip, cp 체크)
    utils.setPrivateInfo(this.$route.params.cp);
  },
  methods: {
    async handleMakeBtnClick() {
      new Session();
      sendMessage('CreateRoom', { cp: this.$route.params.cp });
    },
    handleMouseoverJoinBtn() {
      if (!mobile.isMobile && !this.isCollapsedJoinBtn) {
        this.isCollapsedJoinBtn = !this.isCollapsedJoinBtn;
        return false;
      }
    },
    handleJoinBtnClick() {
      if (mobile.isMobile && !this.isCollapsedJoinBtn) {
        this.isCollapsedJoinBtn = !this.isCollapsedJoinBtn;
        return false;
      }

      // 200709 ivypark, v1.0.5. 회의 참여 버튼 추가
      if (!this.url) {
        this.onPopup(this.$t('popup-join-failed-contents-1'));
        return false;
      } else {
        let addUrl = '';
        if (this.$store.state.userInfo.cp) addUrl = `/${this.$store.state.userInfo.cp}`;

        if (this.url.indexOf('https://') === 0 && this.url.indexOf('/room/') > -1) {
          // URL을 입력 한 경우

          // 200813 ivypark, v1.1.0b. 라이센스 버전 url 변경으로 인해 url 체크 부분 변경
          let urlArr = this.url.split('/');
          let domain = urlArr[2];
          let roomId = urlArr[urlArr.findIndex(elem => elem === 'room') + 1];
          if (config.listOfDomains.some(c => domain.indexOf(c) > -1) && Number(roomId) && roomId.length === config.lengthOfRoomId) {
            if (mobile.isMobile && !mobile.isWebView && !mobile.isPlayBrowser) {
              mobile.onStartConference(roomId);
            } else {
              router.push({ path: `${addUrl}/room/${roomId}` });
            }
          } else {
            this.onPopup(this.$t('popup-join-failed-contents-2'));
          }
        } else {
          // Room 번호만 입력 한 경우
          if (Number(this.url) && this.url.length === config.lengthOfRoomId) {
            if (mobile.isMobile && !mobile.isWebView && !mobile.isPlayBrowser) {
              mobile.onStartConference(this.url);
            } else {
              router.push({ path: `${addUrl}/room/${this.url}` });
            }
          } else {
            this.onPopup(this.$t('popup-join-failed-contents-2'));
          }
        }
      }
    },
    onPopup(contents) {
      this.popup.on = true;
      this.popup.type = 'Alert';
      this.popup.title = this.$t('popup-join-failed-title');
      this.popup.contents = contents;
    },
    handlePopupOkBtnClick(param) {
      this.popup.on = false;
      if (this.popup.ok) this.popup.ok(param);
    },
    handlePopupCancelBtnClick(param) {
      this.popup.on = false;
      if (this.popup.cancel) this.popup.cancel(param);
    },
    handleAppModalClose() {
      this.appModal = false;
    },
    onChangeLanguage() {
      this.$i18n.locale = this.$i18n.locale === 'ko' ? 'en' : 'ko';
      if (!mobile.isMobile) window.localStorage.setItem('locale', this.$i18n.locale);
      this.$store.commit('setLanguage', this.$i18n.locale);
      // return this.$i18n.locale;
    },
    changeDeveloperMode() {
      config.developerMode = !config.developerMode;
      console.log('developer mode : ', config.developerMode);
      clearTimeout(this.timeout);
      this.toast = `developer mode ${config.developerMode ? 'on' : 'off'}`;
      this.timeout = setTimeout(() => {
        this.toast = '';
      }, 1500)
    }
  },
  computed: {
    getVersion() {
      return config.version;
    }
  }
}
</script>

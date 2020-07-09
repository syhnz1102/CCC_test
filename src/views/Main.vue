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
      <header class="header">
         <div class="container">
            <h1>
               <a href="#top" class="logo">COCOcall</a>
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
            </div>
         </div>
      </header>
      <div class="main">
         <section class="visual">
            <div class="bg">
               <img src="../assets/images/bg.jpg">
            </div>
           <div class="container">
             <div class="content">
               <div class="title">
                 <p class="wow animate__animated animate__fadeInUp" data-wow-delay=".4s">간편하게 즐기는 무료 화상 회의,</p>
                 <strong class="wow animate__animated animate__fadeInUp" data-wow-delay=".6s">
                   <span><i>CO</i>nvenient</span>
                   <span><i>CO</i>nference</span>
                   <span><i>call</i></span>
                 </strong>
               </div>
               <div class="button wow animate__animated animate__fadeInUp" data-wow-delay=".8s">
                 <div class="make">
                   <button @click="handleMakeBtnClick">회의시작</button>
                 </div>
                 <div class="enter">
                   <input v-model="url" type="text" placeholder="전달 받은 URL 또는 번호를 입력하세요.">
                   <button @click="handleJoinBtnClick">회의참여</button>
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
                     <p class="wow animate__animated animate__fadeInUp"  data-wow-delay=".2s">메인화면에서 '화상회의 시작하기' 버튼을 클릭하면 화상회의가 시작됩니다.</p>
                  </li>
                  <li>
                     <div class="img">
                        <img src="../assets/images/img_guide_02.jpg" alt="STEP 2">
                     </div>
                     <strong class="wow animate__animated animate__fadeInUp"  data-wow-delay=".2s">STEP 2</strong>
                     <p class="wow animate__animated animate__fadeInUp"  data-wow-delay=".3s">회의가 시작되기 전에 원하는 디바이스로 설정할 수 있습니다.</p>
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
                     <p class="wow animate__animated animate__fadeInUp"  data-wow-delay=".2s">초대받은 사용자는 인터넷 브라우저에 URL을 입력하면 바로 회의에 참석됩니다.</p>
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
                     <p class="wow animate__animated animate__fadeInUp"  data-wow-delay=".3s">메뉴에서 카메라/오디오를 On/Off 할 수 있습니다.</p>
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
               <a href="http://knowledgepoint.co.kr/" target="_blank">회사소개</a>
               <a href="http://knowledgepoint.co.kr/developer/qna/list" target="_blank">문의사항</a>
               <a href="https://play.google.com/store/apps/details?id=kr.co.knowledgepoint.knowledgetalkccc" target="_blank">APP다운로드</a>
            </div>
            <div class="company">
               <strong>COCOcall <span>[{{ getVersion }}]</span></strong>
               <p>
                  <span>(주)날리지포인트</span>
                  <span>주소 : 서울시 서초구 사임당로 8길 16 2층 (성재빌딩)</span>
                  <span>전화 : <a href="tel:070-4325-4033">070-4325-4033</a></span>
                  <span>메일주소 : <a href="mailto:maverick@knowledgepoint.co.kr">maverick@knowledgepoint.co.kr</a></span>
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
import mobile from '../commons/mobile';
import router from "../router";

export default {
  components: { Popup },
  data () {
    return {
      url: '',
      popup: {
        on: false,
        type: '',
        title: '',
        contents: '',
        option: {},
        ok: null,
        cancel: null
      },
    }
  },
  methods: {
    async handleMakeBtnClick() {
      new Session();
      sendMessage('CreateRoom', {});
    },
    handleJoinBtnClick() {
      // 200709 ivypark, v1.0.5. 회의 참여 버튼 추가
      if (!this.url) {
        this.onPopup(`참여 하실 URL 또는 번호를 입력하세요.`);
        return false;
      } else {
        if (this.url.indexOf('https://') === 0 && this.url.indexOf('/room/') > -1) {
          // URL을 입력 한 경우
          let domain = this.url.split('/')[2];
          let roomId = this.url.split('/')[4];
          if (config.listOfDomains.some(c => c === domain) && Number(roomId) && roomId.length === config.lengthOfRoomId) {
            if (mobile.isMobile) {
              mobile.onStartConference(roomId);
            } else {
              router.push({ path: `/room/${roomId}` });
            }
          } else {
            this.onPopup(`전달 받은 URL 또는 번호를 정확히 입력해주세요.`);
          }
        } else {
          // Room 번호만 입력 한 경우
          if (Number(this.url) && this.url.length === config.lengthOfRoomId) {
            if (mobile.isMobile) {
              mobile.onStartConference(this.url);
            } else {
              router.push({ path: `/room/${this.url}` });
            }
          } else {
            this.onPopup(`전달 받은 URL 또는 번호를 정확히 입력해주세요.`);
          }
        }
      }
    },
    onPopup(contents) {
      this.popup.on = true;
      this.popup.type = 'Alert';
      this.popup.title = '회의 참여 실패';
      this.popup.contents = contents;
    },
    handlePopupOkBtnClick(param) {
      this.popup.on = false;
      if (this.popup.ok) this.popup.ok(param);
    },
    handlePopupCancelBtnClick(param) {
      this.popup.on = false;
      if (this.popup.cancel) this.popup.cancel(param);
    }
  },
  computed: {
    getVersion() {
      return config.version;
    }
  }
}
</script>

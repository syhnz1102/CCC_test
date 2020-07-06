<template>
   <div class="wrapper">
      <header class="header">
         <div class="container">
            <h1>
               <a href="#top">KnowledgeTalk <span>CCC</span></a>
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
               <button>
                  <span data-menu-btn="화상회의 시작하기" @click="handleBtnClick">화상회의 시작하기</span>
               </button>
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
                  <strong class="wow animate__animated animate__fadeInUp">KnowledgeTalk</strong>
                  <p class="wow animate__animated animate__fadeInUp" data-wow-delay=".4s">
                     <span>Co</span>nvenient <span>Co</span>nference <span>Call</span>
                  </p>
                  <button class="wow animate__animated animate__fadeInUp" data-wow-delay=".8s" @click="handleBtnClick">화상회의 시작하기</button>
               </div>
               <button class="scroll"></button>
            </div>
         </section>
         <section id="information" class="information">
            <div class="container">
               <h2>KnowledgeTalk <span>CCC</span></h2>
               <ul>
                  <li>
                     <div class="wow box animate__animated animate__zoomIn">
                        <div class="tit"><strong>Co</strong>nvenient</div>
                        <div class="content">
                           <p>프로그램 설치와 회원가입이 필요 없어<br /> 편하게 사용할 수 있습니다.</p>
                        </div>
                     </div>
                  </li>
                  <li>
                     <div class="wow box animate__animated animate__zoomIn">
                        <div class="tit"><strong>Co</strong>nference</div>
                        <div class="content">
                           <p>회의실이 아니어도<br /> 화상으로 회의를 진행할 수 있습니다.</p>
                        </div>
                     </div>
                  </li>
                  <li>
                     <div class="wow box animate__animated animate__zoomIn">
                        <div class="tit"><strong>Call</strong></div>
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
                        <img src="../assets/images/img_guide_01.jpg" alt="">
                     </div>
                     <strong class="wow animate__animated animate__fadeInUp">STEP 1</strong>
                     <p class="wow animate__animated animate__fadeInUp"  data-wow-delay=".2s">메인에서 '화상회의 시작하기' 버튼을 클릭하면 화상회의가 바로 시작됩니다.</p>
                  </li>
                  <li>
                     <div class="img">
                        <img src="../assets/images/img_guide_02.jpg" alt="">
                     </div>
                     <strong class="wow animate__animated animate__fadeInUp"  data-wow-delay=".2s">STEP 2</strong>
                     <p class="wow animate__animated animate__fadeInUp"  data-wow-delay=".3s">하단에서 '초대하기' 버튼을 클릭하면 사용자를 초대할 수 있습니다.</p>
                  </li>
                  <li>
                     <div class="img">
                        <img src="../assets/images/img_guide_03.jpg" alt="">
                     </div>
                     <strong class="wow animate__animated animate__fadeInUp">STEP 3</strong>
                     <p class="wow animate__animated animate__fadeInUp"  data-wow-delay=".2s">초대받은 사용자는 인터넷 브라우저에 URL을 입력하면 바로 회의에 참석됩니다.</p>
                  </li>
                  <li>
                     <div class="img">
                        <img src="../assets/images/img_guide_04.jpg" alt="">
                     </div>
                     <strong class="wow animate__animated animate__fadeInUp"  data-wow-delay=".2s">STEP 4</strong>
                     <p class="wow animate__animated animate__fadeInUp"  data-wow-delay=".3s">최대 16명까지 화상회의를 할 수 있습니다.</p>
                  </li>
                  <li>
                     <div class="img">
                        <img src="../assets/images/img_guide_05.jpg" alt="">
                     </div>
                     <strong class="wow animate__animated animate__fadeInUp">STEP 5</strong>
                     <p class="wow animate__animated animate__fadeInUp"  data-wow-delay=".2s">내 이름을 원하는 대로 수정할 수 있습니다. <span>*최초에는 '익명'으로 표시됩니다.</span></p>
                  </li>
                  <li>
                     <div class="img">
                        <img src="../assets/images/img_guide_06.jpg" alt="">
                     </div>
                     <strong class="wow animate__animated animate__fadeInUp"  data-wow-delay=".2s">STEP 6</strong>
                     <p class="wow animate__animated animate__fadeInUp"  data-wow-delay=".3s">하단에서 '화면공유' 버튼을 클릭하면 본인의 컴퓨터 화면을 공유할 수 있습니다.</p>
                  </li>
               </ul>
            </div>
         </section>
         <section id="download" class="download">
            <div class="container">
               <div class="content">
                  <strong class="logo">KnowledgeTalk <span>CCC</span></strong>
                  <div class="text">
                     <strong>APP 다운로드</strong>
                     <p>날리지톡 CCC를 APP으로 만나보세요!</p>
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
               <strong>KnowledgeTalk CCC <span>[{{ getVersion }}]</span></strong>
               <p>
                  <span>(주)날리지포인트</span>
                  <span>주소 : 서울시 서초구 사임당로 8길 16 2층 (성재빌딩)</span>
                  <span>전화 : <a href="tel:070-4325-4033">070-4325-4033</a></span>
                  <span>메일주소 : <a href="mailto:kpointnotice@gmail.com">kpointnotice@gmail.com</a></span>
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

export default {
  data () {
    return {

    }
  },
  methods: {
    async handleBtnClick() {
      new Session();
      sendMessage('CreateRoom', {});
    }
  },
  computed: {
    getVersion() {
      return config.version;
    }
  }
}
</script>

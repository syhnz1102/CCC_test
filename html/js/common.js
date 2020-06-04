jQuery(document).ready(function($) {

   // wow
   wow = new WOW({
   	boxClass:     'wow',      // 기본값
   	animateClass: 'animated', // 기본값
   	offset:       0,          // 기본값
   	mobile:       true,       // 기본값
   	live:         true        // 기본값
   })
   wow.init();

   // materialize
   document.addEventListener('DOMContentLoaded', function() {
      var elems = document.querySelectorAll('.collapsible');
      var elems = document.querySelectorAll('.notice-modal');
      var elems = document.querySelectorAll('.datepicker');
      var elems = document.querySelectorAll('.timepicker');
      var instances = M.Collapsible.init(elems, options);
      var instances = M.Modal.init(elems, options);
      var instances = M.Datepicker.init(elems, options);
      var instance = M.Tabs.init(el, options);
   });
   $('.collapsible').collapsible();
   $('.notice-modal').modal();
   $('.datepicker').datepicker({
      format: 'yyyy-mm-dd',
      showMonthAfterYear: true,
      i18n: {
         months: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
         monthsShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
         weekdays: ["월요일","화요일", "수요일", "목요일", "금요일", "토요일", "일요일"],
         weekdaysShort: ["월요일","화요일", "수요일", "목요일", "금요일", "토요일", "일요일"],
         weekdaysAbbrev: ["월","화", "수", "목", "금", "토", "일"],
         done:'확인',
         cancel:'취소',
      },
      onSelect: {format: 'yyyy-mm-dd'},
   });
   $('.timepicker').timepicker();
   $('.tabs').tabs();
});

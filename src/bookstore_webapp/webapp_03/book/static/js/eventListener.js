// pagecontainer(data-role="page")가 변경되기 전에 호출되는 이벤트
// 컨텐츠 영역을 비워주고 HOME 버튼의 선택을 해제해준다.
$(document).on('pagecontainerbeforechange', (evt) => {
    $('div[data-role=content]').empty();
    $('div[data-role=header] a[data-icon=home]').removeClass('ui-btn-active').trigger('blur');
});

// 1차 카테고리가 변경될 때 마다 호출되는 이벤트
// 컨텐츠 영역을 새롭게 렌더링해준다.
$(document).on('pagecontainerchange', (evt, ui) => {
    const currentDataUrl = $(ui.toPage[0]).data('url');
    initNavbar(currentDataUrl);
    fetchBooks(category__2nd__list[currentDataUrl].first[1]);
});

// 페이지 로드 완료 후 호출되는 이벤트
$(window).on('load', () => {
    // 1차 카테고리(YES24, 교보문고, 알라딘) 클릭 시 호출되는 이벤트
    // 컨텐츠 영역을 비워준다.
    $('.category__1st ui-navbar ul a').on('click', () => {
        $('div[data-role=content]').empty();
    });
});
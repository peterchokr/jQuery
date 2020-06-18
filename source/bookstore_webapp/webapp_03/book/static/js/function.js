const category__2nd__list = {
    "page__yes24": {
        first: ['종합', '001'],
        second: ['소설', '001001046'],
        third: ['인문', '001001019'],
        fourth: ['어린이', '001001016']
    },
    "page__kyobo": {
        first: ['종합', 'A'],
        second: ['소설', 'B'],
        third: ['인문', 'I'],
        fourth: ['아동', 'G']
    },
    "page__aladin": {
        first: ['종합', '0'],
        second: ['문학', '1'],
        third: ['인문학', '656'],
        fourth: ['어린이', '1108']
    },

};
/*
@핵심 코드
1. fn.trigger('create')
jQuery Mobile 객체는 DOM Load 과정에서 렌더링 되기 때문에 동적으로 요소를 추가할 경우 정상적으로 렌더링되지 않는다.
이에 요소 추가 후 렌더링을 직접 해줄 필요성이 있는데, 이 메소드가 그러한 역할을 해준다.

2. 베스트 셀러 fetch Custom API 활용(type: 대상 도서 취급 몰, category: 대상 분류)
EX> http://ync.jupiterflow.com/jquery/bestSeller?type=yes24&category=001
@type
    1) yes24
    2) kyobo
    3) aladin
@category
    1) yes24=> ['001', '001001046', '001001019', '001001016']
    2) kyobo=> ['A', 'B', I, 'G']
    3) aladin=> ['0', '1', '656', '1108']

3. 도서 설명 fetch Custom API 활용(type: 대상 도서 취급 몰, uid: 도서 식별 번호)
EX> http://ync.jupiterflow.com/jquery/bookDetail?type=yes24&uid=89309569
@type
    1) yes24
    2) kyobo
    3) aladin
@uid
    yes24, kyobo, aladin에 대한 uid 표준이 다르다.(일부는 ISBN, 일부는 자체 넘버링)
    이에 bestSeller API에서 각 도서에 대한 uid를 반환해주고, 이를 활용하고 있다.
*/

// 2차메뉴 초기화 함수
// 1. API 이용을 위한 카테고리 고유 코드를 data-id로 지정한다
// 2. 카테고리 이름을 navbar 텍스트로 지정한다
const initNavbar = (currentDataUrl) => {
    const categoryObj = category__2nd__list[currentDataUrl];
    const activePageID = '#' + $($.mobile.activePage).first().attr('id');
    $(activePageID + ' .category__2nd').html(`
            <div data-role="navbar">
                <ul>
                    <li><a href="#" class="ui-btn-active ui-state-persist" data-id="${categoryObj.first[1]}">${categoryObj.first[0]}</a></li>
                    <li><a href="#" data-id="${categoryObj.second[1]}">${categoryObj.second[0]}</a></li>
                    <li><a href="#" data-id="${categoryObj.third[1]}">${categoryObj.third[0]}</a></li>
                    <li><a href="#" data-id="${categoryObj.fourth[1]}">${categoryObj.fourth[0]}</a></li>
                </ul>
            </div>
    `).trigger('create');
    // jQuery Mobile 객체는 DOM Load 과정에서 렌더링 되기 때문에 동적으로 요소를 추가할 경우 정상적으로 렌더링되지 않는다.
    // 이에 요소 추가 후 렌더링을 직접 해줄 필요성이 있다.
    // .trigger('create')는 jQuery Mobile을 다시 렌더링 해주는 메소드이다.

    // 2차 카테고리를 선택하면 컨텐츠를 비우고 fetchBooks 함수를 호출한다.
    $(activePageID + ' .category__2nd > div[data-role=navbar] > ul a').on('click', (evt) => {
        $('div[data-role=content]').empty();
        fetchBooks($(evt.target).data('id'));
    });
};

// 선택된 1차, 2차 카테고리에 따라 API에서 값을 가져오는 함수
const fetchBooks = (category) => {
    const activePageID = '#' + $($.mobile.activePage).first().attr('id');
    const category__1st = $(activePageID + ' .category__1st > ul > li > a.ui-btn-active').first().attr('href').split('__')[1];

    // bestSeller API를 이용해 YES24, 교보문고, 알라딘에서 각 카테고리의 베스트 셀러 10개를 가져온다.
    $.ajax({
        url: 'http://ync.jupiterflow.com/jquery/bestSeller?type=' + category__1st + '&category=' + category
    }).then(result => {
        $('div[data-role=content]').html('<ul data-role="listview"></ul>');
        $('div[data-role=content] > ul').append(`
            <li data-role="listdivider">${result.desc}</li>
        `);
        // 가져온 베스트셀러 목록 전체를 순환하면서 각 요소를 추출한다
        $(result.items).each((idx, elm) => {
            const listItem = document.createElement('li');
            // 각 리스트 아이템 클릭시 uid를 바탕으로 세부 정보 Fetch
            // uid: 각 사이트에서 사용되는 도서 고유 식별 번호(GoodName, ISBN 등 사이트마다 다름)
            $(listItem).on('click', () => {
                $.ajax({
                    url: `http://ync.jupiterflow.com/jquery/bookDetail?type=${category__1st}&uid=${elm.uid}`
                }).then(detailresult => {
                    // 도서 세부정보 엘리먼트 생성
                    const detail__contents = `
                        <div class="detail__imgWrap">
                            <div class="blur_imgWrap">
                                <div class="blur_img" style="background-image: url(${elm.image})"></div>
                            </div>
                            <img src="${elm.image}" alt="${elm.title}">
                        </div>
                        <div class="detail__info">
                            <h3 class="info__title">${elm.title}</h3>
                            <p class="info__author">${elm.author}</p>
                            <p class="info__publish">${elm.publishCompany} | ${elm.publishDate}</p>
                        </div>
                        <div data-role="tabs" style="padding: 0">
                            <div data-role="navbar">
                                <ul>
                                    <li><a href="#tab1" data-theme="b" class="ui-btn-active ui-state-persist">도서정보</a></li>
                                    <li><a href="#tab2" data-theme="b">자세히 보기</a></li>
                                </ul>
                            </div>
                            <div id="tab1">                                
                                <div class="info__detail">${detailresult.desc}</div>
                            </div>
                            <div id="tab2">                                
                                <a href="${elm.url}" data-role="button" target="_blank">${result.vendor} 바로가기</a>
                            </div>
                        </div>
                    `;

                    // 도서 세부정보에서는 컨텐츠의 padding을 0으로해서 꽉 차게 만든다.
                    $('div[data-role=content]').html(detail__contents).css("padding", "0");

                    // iframe(YES24에서는 도서 정보에 유튜브 영상이 포함되어 있다.)이 있을 경우 높이를 동적으로 변환
                    const ifm = $('.info__detail iframe');
                    if (ifm.length)
                        ifm.css('height', ifm.css('width').replace('px', '') / 16 * 9);
                    // 컨텐츠 재렌더링
                    $('div[data-role=content]').trigger('create');
                });
            });
            // listview Item 생성
            // thumbnail listview로 순위에 따라 SVG가 변경된다.
            $(listItem).html(`
                    <a href="#">
                        <img src="static/images/number_${idx + 1}.svg" style="padding: 15px; box-sizing: border-box;">
                        <h3>${elm.title}</h3>
                        <p>${elm.author} | ${elm.publishCompany} | ${elm.publishDate}</p>
                    </a>
            `);

            // listview Item 추가
            $('div[data-role=content] > ul').append(listItem);
            // 베스트셀러 목록에서는 컨텐츠의 padding을 1em으로해서 여유를 준다.
            $('div[data-role=content]').css("padding", "1em");
        });
        // 컨텐츠 재렌더링
        $('div[data-role=content]').trigger('create');
    });
};
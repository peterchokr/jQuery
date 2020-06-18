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
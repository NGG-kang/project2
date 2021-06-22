# React, django 간단한 프로젝트

front로 React, back으로 django를 사용하여 api 활용하여 프로젝트 진행했습니다.

django로 프로젝트를 진행한 후 React로 비동기 처리를 해보고싶은 마음에 시작한 프로젝트입니다.

2주 정도의 개발기간을 목표로 한 간단한 게시판 프로젝트로 그다지 많은 기능은 들어있지 않습니다.

*** 개인적인 변덕으로 없었던 기능들(CRUD나 테스트 기능들)을 추가하고 있습니다.

<br/>

## 목차

1. [사용 기술 스택](#사용-기술-스택)
2. [사용 프레임워크](#사용-프레임워크)
3. [설치 및 진행](#설치-및-실행)
4. [CRUD](#crud)
5. [캡처 이미지](#캡처-이미지)
6. [회고록](#회고록)
   - [전체적인 부분](#-전체적인-부분)
   - [react](#-react)
   - [api](#-api)
   - [보안 측면?](#-보안-측면)
   - [git](#-git)
   - [OAuth](#oauth)
7. [미해결 부분](#미해결-부분)
8. [참고 목록](#참고-목록)



<br/>

## 사용 기술 스택
<img src="https://img.shields.io/badge/Python-3.9-3776AB?style=flat-square&logo=python" /> <img src="https://img.shields.io/badge/Javascript-es8-F7DF1E?style=flat-square&logo=javascript" />

<br/>

## 사용 프레임워크

<img src="https://img.shields.io/badge/Django-3.2-092E20?style=flat-square&logo=django" /> <img src="https://img.shields.io/badge/React-17.0.2-61DAFB?style=flat-square&logo=react" />

<br/>

## 설치 및 실행

**Need To**

<img src="https://img.shields.io/badge/Python-^3.9-3776AB?style=flat-square&logo=python" /> <img src="https://img.shields.io/badge/Django-^3.2-092E20?style=flat-square&logo=django" /> 

<img src="https://img.shields.io/badge/Node.js-^14.15.5-339933?style=flat-square&logo=node.js" /> <img src="https://img.shields.io/badge/Yarn-^1.22.10-2C8EBB?style=flat-square&logo=yarn" /> <img src="https://img.shields.io/badge/React-^17.0.2-61DAFB?style=flat-square&logo=react" />

<br/>

**node.js 설치 후**

`npm install --global yarn`

<br/>

**django**

`pip install -r requirements.txt`

`python manage.py runserver`

<br/>

**React**

`yarn start`

<br/>

## CRUD

**READ**

post list

detail view

profile view (유저가 올린 게시글 목록)

subscribe_list(본인이 구독한 목록)

postsearch(검색기능)

<br/>

**CREATE**

Post Create

Comment Create

signup(회원가입)

<br/>

**UPDATE**

Comment Update

<br/>

**DELETE**

post delete ( profile page에서 가능 )

Comment Delete

<br/>

**기타**

Subscribe, unSubscribe ( Many to Many 필드로 add, remove, create 사용)

google oauth2 login ...?

<br/>

## 캡처 이미지

<br/>

### 메인 이미지
![main](https://user-images.githubusercontent.com/77260277/117383362-985ad700-af1b-11eb-8d0a-6ce2b067e487.PNG)
![main_login](https://user-images.githubusercontent.com/77260277/117383363-98f36d80-af1b-11eb-8f82-a4695b1e57c9.PNG)
### 로그인
![login](https://user-images.githubusercontent.com/77260277/117383359-97c24080-af1b-11eb-90c1-f828dfa4bef9.PNG)
### 회원가입
![signup](https://user-images.githubusercontent.com/77260277/117383368-9abd3100-af1b-11eb-92b4-f035c807ddd1.PNG)
### profile view(url에 따라 유저의 포스팅 목록 불러움)
![profile2](https://user-images.githubusercontent.com/77260277/117383365-998c0400-af1b-11eb-8370-7d9d7f0a4dbd.PNG)
### 디테일 뷰
![detailview](https://user-images.githubusercontent.com/77260277/117383356-95f87d00-af1b-11eb-8539-583fd86a23d1.PNG)
### 새 포스팅
![postnew](https://user-images.githubusercontent.com/77260277/117383364-998c0400-af1b-11eb-9054-8a7cf6fbc729.PNG)
### 검색기능
![search](https://user-images.githubusercontent.com/77260277/117383366-9a249a80-af1b-11eb-91f8-c989c94f61d2.PNG)
![search2](https://user-images.githubusercontent.com/77260277/117383367-9abd3100-af1b-11eb-9452-0c31b1467e8f.PNG)
### 구독자 목록
![subscribe](https://user-images.githubusercontent.com/77260277/117383369-9b55c780-af1b-11eb-8d8a-dd8c943a4a17.PNG)


<br/>

## 회고록

### \# 전체적인 부분

react에 api를 적용하면서 최대한 api의 호출을 줄인다는 생각으로 만들어가는데 그게 쉽지 않다는걸 느꼈다

비동기로 이루어지다보니 실시간으로 반영해야 하므로 그때마다 api콜은 당연한거고....

또 매 페이지마다 api콜을 달리 하는것보다 값을 넘겨주는게 좋긴 한데 그 방법을 몰라서 각 페이지마다 api를 부르는 방식으로 짰다



### \# react

educast의 영상 강의를 보고 react를 배우고 새로 만들어본 react 프로젝트인데 이제 useEffect, useState정도는 어떻게 돌아가는지 알 것같다

그래도 React로 만드니까 django의 템플릿으로 만드는것보다 비동기로 돌아가는 모습을 보니(물론 django에서는 일부러 비동기를 안하긴 했지만) 그래도 멋있게 보인다 

<br/>

django rest-framework 기반으로 한 api 개발과 react를 연결하여 frontend와 backend를 나눠서 개발해봤다

애초에 계획했던건 yotube 처럼 동영상 게시글 사이트를 빠르게 개발해보려는 목적이었지만...

React에 api를 적용하는데 잘 모르다보니 너무 오래 걸려서 반복되는 내용들(댓글, 좋아요)은 하지 않았다

<br/>

그리고 react 컴포넌트들을 사용하는데 api를 사용하다보니 각 페이지마다 불러와야할 api들이 존재하는데

굳이 또 부르지 않아도 되는 api들을 다시 불러오는 부분을 해결 해야 하는데... 

기본적인 부분은 각 컴포넌트마다 값들을 넘기면서 상호작용하는 방법이 있고

뭐 reducer를 사용해서 데이터를 꺼내와서 쓰는 방식이 있다는데 아직 제대로 이해를 못했다(useEffect랑 useState만 겨우 이해했음)

<br/>

그래서 로그인 부분에서 JWT 토큰을 사용하여 로그인 하는 방법, 로컬 저장소에 토큰을 저장하여 인증하는 방식은 강의에서 가져왔다. 

그러나 JWT는 업데이트가 안된다는 말들이 있길래 simple jwt로 변경하였다

<br/>

### \# api

그리고 api를 react에 하나하나 적용하면서 점점 늘어나는 뷰와 url들을 보니 과연 Restful한 api가 뭘까라는 생각이 들었다 

검색해본 결과로는 Restful한 api는 형태가 정해져있지 않다고들 하는데...

예를들어 user A의 post 목록의 1번을 가져오려고 할 때

user/A/post/1이 아닌  user/A의 post/1 이렇게 2번을 나눠서 사용하는게 더 적합하다고는 한다

솔직히 혼자서 개발하려고 하니 형태도 마구잡이고 과연 뭐가 효율적인지에 대한 확신이 들지가 않는다

<br/>

뭐 axios와 async await는 계속 구글로 검색하면서 했지만 중간정도는 이해는 했다

잠깐 생각나는건 적자면 axios.create를 하여 base url, header를 넣어서 만들어 놓고(또는 header를 나중에 넣음)

get방식은 data를 보낼수 없다 / post, delete, put, patch중 post와 delete만 써봤지만 일단 data를 담아 보낼수 있음

그러나 post를 제외한 나머지는 api에서 detailview, 그러니까 예를들어 post/1/ 처럼 한개의 목록에 대해서만 사용이 가능하더라...(django에서 사용한 결과)

<br/>

### \# 보안 측면?

jwt를 적용하는 과정에서 보안적인 측면에 대하여 블로그 글을 읽었다

> jwt를 어디에 저장해야 하는가? 

[링크](https://velog.io/@mokyoungg/JWT-%ED%86%A0%ED%81%B0%EC%9D%84-%EC%96%B4%EB%94%94%EC%97%90-%EC%A0%80%EC%9E%A5%ED%95%B4%EC%95%BC-%ED%95%98%EB%8A%94%EA%B0%80)

읽어보면 로컬스토리지, 세션, 쿠기 전부 다 자바스크립트로 접근이 가능하다는 것이다...

그래서 결론은? 명확한 정답이 없다...

여기 글에서 가장 좋은 방법은 쿠키기반 인증과 CSRF 토큰을 사용하여 POST, PUT, DELETE 요청을 하는것이다

<br/>

### \# git

저번 프로젝트에는 꼬박꼬박 커밋을 하다보니 가끔은 아무것도 안하는 날도 커밋을 지키기 위해서 의미없는 커밋을 했는데

이번엔 의미없는 커밋은 보여주기식이라 생각해서 커밋을 하지 않고 그냥 해봤다...

그런데 다 마무리 하고 올리는데 한번에 커밋하고 기타 모듈 파일들이 들어간거를 지우다가 다른것도 지우는 불상사가 발생했다...

그래서 다시 실행해보니 실행이 안된다!

결국 커밋한거 다시 돌려서 해봤는데 왠지모르게 하루 전의 파일이 업로드가 되어있다

하루 전은 많은 수정사항이 없어서 다행이지 (물론 이것만 해도 하루종일 걸림) 진짜 정말로 위험한 상황이었다...

**결론 : 커밋 꼬박꼬박하는게 최고다!** 

<br/>

### OAuth

만들던 도중에 갑자기 소셜 로그인을 넣고 싶어서 진행했던 기능...

django의 dj-rest-auth,  django-restframework, allauth를 활용하여(검색해서 코드를 가져와서) 어떻게든 해냈다

react 딴에서는 그냥 라이브러리 깔고 api콜, response만 받으면 되니까 간단한 문제였다

django 딴에서 계속 400 bad request가 뜨길래 거의 이틀간 고민했던 문제

알고보니 call back을 구현했어야 헀는데 안해서 그런거였다...

당연히 라이브러리가 알아서 처리하는줄 알았는데 그건 아니었다 ㅎㅎ;;

찾다 찾다가 call back 함수를 구현한 블로그에서 혹시 몰라서 가져와서 넣어봤더니 성공했다

물론 딱 테스트용으로 내 아이디만 가능하도록 했다

<br />

## 미해결 부분

### react render, api call 범위지정 부분

react 부분에서 api 콜시 render를 하는데 범위지정 문제

예를들어 post를 20개씩 가져오려고 할 때 0-20 , 20-40 , 40-60 이렇게 가져와봤는데

react에서 render를 할때 post가 아래에 이어붇지 않고 새로고침하듯 목록이 바뀐다

그래서 0~20, 0~40, 0~60 이렇게 가져왔더니 render가 성공

pagination으로 해보려고 했지만 post 목록이 전부 불러와져서 바로 스킵한 문제...

다른 사이트들을 보면 리스트에 넣어서 렌더링 하는거를 똑같이 따라 해본건데 나는 왜 re rendering 하는거니!!!

아무튼 그래서 api콜 점점 늘어나는거로 합의를 봤다...


### css!!!!

css에서 가운데 정렬은 어떻게든 알았는데

width 크기를 퍼센트로 정해둬도 화면 크기에따라 고정되어있는게 있다...

아직도 css는 나에게 너무 어렵다 물론 많이 안해서 그런거지만...

화면 크기에 따른 css 조절까지는 나에겐 아직 무리다...

이렇게 조절 하려면 css를 직접 적용해야겠지?

아직은 멀고도 험한 길로 보인다


<br />

## 참고 목록

1. 전체적인 부분 (강의)

   https://educast.com/course/web-dev/ZU53

   물론 돈을 내고 산 강의이지만 react와 django의 전체적인 부분에 있어서 많은 도움을 받았다

2. google auth

   https://medium.com/chanjongs-programming-diary/django-rest-framework%EB%A1%9C-%EC%86%8C%EC%85%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-api-%EA%B5%AC%ED%98%84%ED%95%B4%EB%B3%B4%EA%B8%B0-google-kakao-github-2ccc4d49a781#

   당연히 api쪽으로 토큰값을 보내면 인증이 될줄 알았지만... 알고보니 아니었다

   위의 페이지를 보고 callback 함수가 필요하다는 점, 사용자가 없을시 사용자 생성과 인증을 해 줘야 한다는 점을 알았다


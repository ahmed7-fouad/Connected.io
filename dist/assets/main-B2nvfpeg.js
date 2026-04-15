/* empty css              */(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=document.getElementById(`createPostBtn`),t=1,n=1,r=window.localStorage.getItem(`token`);async function i(e,t=!0){let r=await e,i=r.data.data;n=r.data.meta.last_page,t&&(postsSec.innerHTML=``);for(let e of i){let t=`
    <!-- ===== Card===== -->
    <section id=${e.id} class="card bg-paragraph p-4 rounded-sm  shadow-[0_10px_35px_-12px_rgba(100,255,218,0.25)]">
    <!-- Card Header -->
    <header class="flex items-center gap-3 border-b-2 pb-3 border-black/20 mb-4">
    <button  class="profilePageInfo flex items-center gap-3  w-full cursor-pointer">
        <section class="userImage size-10 rounded-full bg-white overflow-hidden border-1 border-primary">
        <img class="w-full h-full "src="${e.author.profile_image}" alt="">
        </section>
        <p class="userName font-semibold text-lg">${e.author.username}</p>
    </button>

    </header>
     <!-- Card Image -->
      <section class="overflow-hidden rounded-lg">
      <img class="w-full h-[700px]" src="${e.image}" alt="card-img">
      </section>
      <!-- Releasing Time -->
      <span class="relasing-time capitalize text-[#595656] inline-block text-sm mt-2">${e.created_at}</span>
      <!-- Card Content -->
      <a href="postPage.html?id=${e.id}" class="post-details block">
      <section class="space-y-2 cursor-pointer inline-block">
        <h2 class="card-heading text-2xl capitalize font-semibold">${e.title}</h2>
        <p class="card-paragraph  font-light">${e.body}</p>
      </section>
      <!-- Comment Part -->
      <hr class="my-4 opacity-20">
      <section class="flex items-center gap-3 flex-wrap">
      <p class="capitalize cursor-pointer"><i class="fa-regular fa-comment"></i><span class="comments-number mx-1">(${e.comments_count})</span>comments</p>
      <section id="tag-${e.id}" class="flex items-center gap-1 text-sm capitalize flex-wrap">  </section>
     </a> 
     </section>
    
    <!--// ===== Card===== //-->
    `;postsSec.innerHTML+=t,addTags(e.tags,document.getElementById(`tag-${e.id}`))}}i(makeRequest(`https://tarmeezacademy.com/api/v1/posts?page=${t}&limit=5`,`get`)),window.onscroll=()=>{window.innerHeight+window.scrollY>=document.body.offsetHeight-10&&t<=n&&(++t,i(makeRequest(`https://tarmeezacademy.com/api/v1/posts?page=${t}&limit=5`,`get`),!1))},changeUi(),window.addEventListener(`scroll`,()=>{scrollY>=800?document.querySelector(`.scroll-up-btn`).style.cssText=`visibility:visible;opacity:1`:document.querySelector(`.scroll-up-btn`).style.cssText=`opacity:0;visibility:hidden`}),document.querySelector(`.scroll-up-btn`).addEventListener(`click`,()=>{window.scrollTo({top:0,behavior:`smooth`})}),document.addEventListener(`click`,e=>{if(e.target.classList[0]===`post-details`){let t=e.target.parentElement.id;window.location.assign(`../postPage.html?id=${t}`)}}),e.addEventListener(`click`,async()=>{let e=createPostForm.querySelector(`input[type ='file'`).files[0],n=createPostForm.querySelector(`input[type ='text'`).value,a=createPostForm.querySelector(`textarea`).value;try{let o=new FormData;o.append(`image`,e),o.append(`title`,n),o.append(`body`,a),await axios.post(`https://tarmeezacademy.com/api/v1/posts`,o,{headers:{"content-type":`multipart-form-data`,Authorization:`Bearer ${r}`}}),appearMsg(`Post Has Been Created Successfully`),createPostForm.classList.remove(`form-visibility`),i(makeRequest(`https://tarmeezacademy.com/api/v1/posts?page=${t}&limit=5`,`get`))}catch(e){appearMsg(e.response.data.message,!1)}}),window.addEventListener(`thisIsPost`,()=>{console.log(`i am user mr Ahmed`,userId)});
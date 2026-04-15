import "./style.css";

// Variables
let createPostBtn=document.getElementById("createPostBtn");
let pageNumber = 1;
let lastPage = 1;
let token=window.localStorage.getItem("token");

// Set ALL Posts
async function setAllPosts(response, reload = true) {
  let allData = await response;
  let allPosts = allData.data.data;
  lastPage = allData.data.meta.last_page;
  if (reload) {
    postsSec.innerHTML = "";
  }

  for (let post of allPosts) {
    let card = `
    <!-- ===== Card===== -->
    <section id=${post.id} class="card bg-paragraph p-4 rounded-sm  shadow-[0_10px_35px_-12px_rgba(100,255,218,0.25)]">
    <!-- Card Header -->
    <header class="flex items-center gap-3 border-b-2 pb-3 border-black/20 mb-4">
    <button  class="profilePageInfo flex items-center gap-3  w-full cursor-pointer">
        <section class="userImage size-10 rounded-full bg-white overflow-hidden border-1 border-primary">
        <img class="w-full h-full "src="${post.author.profile_image}" alt="">
        </section>
        <p class="userName font-semibold text-lg">${post.author.username}</p>
    </button>

    </header>
     <!-- Card Image -->
      <section class="overflow-hidden rounded-lg">
      <img class="w-full h-[700px]" src="${post.image}" alt="card-img">
      </section>
      <!-- Releasing Time -->
      <span class="relasing-time capitalize text-[#595656] inline-block text-sm mt-2">${post.created_at}</span>
      <!-- Card Content -->
      <a href="postPage.html?id=${post.id}" class="post-details block">
      <section class="space-y-2 cursor-pointer inline-block">
        <h2 class="card-heading text-2xl capitalize font-semibold">${post.title}</h2>
        <p class="card-paragraph  font-light">${post.body}</p>
      </section>
      <!-- Comment Part -->
      <hr class="my-4 opacity-20">
      <section class="flex items-center gap-3 flex-wrap">
      <p class="capitalize cursor-pointer"><i class="fa-regular fa-comment"></i><span class="comments-number mx-1">(${post.comments_count})</span>comments</p>
      <section id="tag-${post.id}" class="flex items-center gap-1 text-sm capitalize flex-wrap">  </section>
     </a> 
     </section>
    
    <!--// ===== Card===== //-->
    `;
    postsSec.innerHTML += card;
    addTags(post.tags, document.getElementById(`tag-${post.id}`));
  }
}
//<<==================Functions Part ===================>>



setAllPosts(
  makeRequest(
    `https://tarmeezacademy.com/api/v1/posts?page=${pageNumber}&limit=5`,
    "get",
  ),
);

// ===>>> Infinite Scrolling <<<===
window.onscroll = () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 10 &&
    pageNumber <= lastPage
  ) {
    ++pageNumber;
    setAllPosts(
      makeRequest(
        `https://tarmeezacademy.com/api/v1/posts?page=${pageNumber}&limit=5`,
        "get",
      ),
      false,
    );
  }
};

// ===>>>// Infinite Scrolling //<<<===


// Work ChangeUI Function
changeUi();


// Scroll Btn Appearnce Event
window.addEventListener("scroll", () => {
  if (scrollY >= 800) {
    document.querySelector(".scroll-up-btn").style.cssText =
      "visibility:visible;opacity:1";
  } else {
    document.querySelector(".scroll-up-btn").style.cssText =
      "opacity:0;visibility:hidden";
  }
});

document.querySelector(".scroll-up-btn").addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});


document.addEventListener("click",e=>{
  if(e.target.classList[0]==="post-details"){
    let postId=e.target.parentElement.id;
     window.location.assign(`../postPage.html?id=${postId}`)
  }
})


createPostBtn.addEventListener("click",async ()=>{
  let postImage=createPostForm.querySelector("input[type ='file'").files[0]
  let postTitle=createPostForm.querySelector("input[type ='text'").value;
  let postBody=createPostForm.querySelector("textarea").value;

  try{
    let allData=new FormData();
    allData.append("image",postImage);
    allData.append("title",postTitle);
    allData.append("body",postBody);
    await axios.post("https://tarmeezacademy.com/api/v1/posts",allData,{
      headers:{
        "content-type":"multipart-form-data",
        "Authorization":`Bearer ${token}`,
      }
    })
    appearMsg("Post Has Been Created Successfully");
    createPostForm.classList.remove("form-visibility");
    setAllPosts(
      makeRequest(
        `https://tarmeezacademy.com/api/v1/posts?page=${pageNumber}&limit=5`,
        "get",
      ),
    );

  }catch(error){
    appearMsg(error.response.data.message,false);
  }
  
})





window.addEventListener("thisIsPost", () => {
  console.log("i am user mr Ahmed", userId);
});

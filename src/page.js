

// let postDetails = document.getElementById("postDetails");
let postAuthor = document.getElementById("postAuthor");
let commentsParent = document.getElementById("commentsSec");
let mainCard = document.getElementById("postsContainer");

function changePostPageData(
  PorfileImageAddress,
  userName,
  postImageAddress,
  postTitle,
  PostBody,
  CommentsCount,
  CommentsList,
) {
  postDetails.querySelector("h1:first-of-type").textContent = userName;
}

const idIdx = window.location.search;
let allSearchParams = new URLSearchParams(idIdx);
const postId = allSearchParams.get("id");

async function updatePostDetails(id) {
  let response = await makeRequest(
    `https://tarmeezacademy.com/api/v1/posts/${id}`,
    "GET",
  );
  let cardData = response.data.data;
  postAuthor.textContent = cardData.author.name;
  let authenticationChecker = window.localStorage.getItem("token")?true: false;

  let newCommentsSec = `
                <section id="NewCommentSec" class="flex items-center  overflow-hidden rounded-xl border-2 border-mutedpar mt-5 ">
                    <input id="newCommentTextField" type="text" placeholder="Type Your Comment" class="flex-1 border-none placeholder:text-mutedpar">
                    <button id="createNewCommentBtn" type="button" class="btn-style border-0 rounded-tl-none rounded-none">create</button>
                </section>
        `;
  // Comments Input Field Part
  let cardElement = ` 
                  <section id="${postId}" class="card bg-paragraph p-4 rounded-sm shadow-[0_10px_35px_-12px_rgba(100,255,218,0.25)]">
                      <!-- Card Header -->
                      <header class="flex items-center gap-3 border-b-2 pb-3 border-black/20 mb-4">
                      <button  class="profilePageInfo flex items-center gap-3  w-full cursor-pointer">
                        <section class="userImage size-10 rounded-full  overflow-hidden border-1 border-primary">
                          <img class="w-full h-full "src="${cardData.author.profile_image}" alt="">
                        </section>
                        <p class="userName font-semibold text-lg">${cardData.author.name}</p>
                      </button>
                      </header>
                      <!-- Card Image -->
                      <section class="overflow-hidden rounded-lg">
                          <img class="w-full h-[700px]"src="${cardData.image}" alt="card-img">
                      </section>
                      <!-- Releasing Time -->
                      <span class="relasing-time capitalize text-paragraph mt-2">${cardData.created_at}</span>
                      <!-- Card Content -->
                      <section class="space-y-2">
                        <h2 class="card-heading text-2xl capitalize font-semibold">${cardData.title}</h2>
                        <p class="card-paragraph font-light">${cardData.body}</p>
                      </section>
                        <!-- Comments Part -->
                        <hr class="my-4 opacity-20">
                        <p class="capitalize cursor-pointer"><i class="fa-regular fa-comment"></i><span class="comments-number mx-1">(${cardData.comments_count})</span>comments</p>
                        <section id="commentsSec" class="mt-3 space-y-3">
                            
                        </section>
                        ${authenticationChecker ? newCommentsSec : ""}
                    `;

  mainCard.innerHTML = cardElement;
  if (cardData.comments_count !== 0) {
    for (let comment of cardData.comments) {
      document.getElementById("commentsSec").innerHTML += `
            <section class="space-y-3">
                <section class="flex items-center gap-3">
                   <img class="rounded-full size-11" src="${comment.author.profile_image}" alt="">
                   <p class="capitalize font-bold">${comment.author.name}</p>
                </section>
             <p class="text-mutedpar font-medium">${comment.body}</p>
            </section>
        `;
    }
  }
}



updatePostDetails(postId).then(() => {
  let commentTextField = document.getElementById("newCommentTextField");
  let createNewCommentBtn = document.getElementById("createNewCommentBtn");
  if(createNewCommentBtn){
     createNewCommentBtn.addEventListener("click", async (_) => {
       const commentData = {
         body: commentTextField.value,
       };
       try {
         await axios.post(
           `https://tarmeezacademy.com/api/v1/posts/${postId}/comments`,
           commentData,
           {
             headers: {
               Authorization: `Bearer ${window.localStorage.getItem("token")}`,
             },
           },
         );
         appearMsg("Comment Has Been Created Successfully");
         updatePostDetails(postId);
         commentTextField.value = "";
       } catch (error) {
         if (window.localStorage.getItem("token") === null) {
           appearMsg(
             `${error.response.data.message} , Register on the site to be able to leave comments`,
             false,
           );
         } else {
           appearMsg(error.response.data.message, false);
         }
       }
     });
  }
});

window.addEventListener("changeUi",_=>{
   updatePostDetails(postId).then(() => {
     let commentTextField = document.getElementById("newCommentTextField");
     let createNewCommentBtn = document.getElementById("createNewCommentBtn");
     if (createNewCommentBtn){
         createNewCommentBtn.addEventListener("click", async (_) => {
           const commentData = {
             body: commentTextField.value,
           };
           try {
             await axios.post(
               `https://tarmeezacademy.com/api/v1/posts/${postId}/comments`,
               commentData,
               {
                 headers: {
                   Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                 },
               },
             );
             appearMsg("Comment Has Been Created Successfully");
             updatePostDetails(postId);
             commentTextField.value = "";
           } catch (error) {
             if (window.localStorage.getItem("token") === null) {
               appearMsg(
                 `${error.response.data.message} , Register on the site to be able to leave comments`,
                 false,
               );
             } else {
               appearMsg(error.response.data.message, false);
             }
           }
         });
     }   
   }); 
})
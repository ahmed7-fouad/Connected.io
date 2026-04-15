
let urlParams=window.location.search
let selfProfileId = null;


let allParams=new URLSearchParams(urlParams)
let userImage="";
let userName="";
let userState=""
userId = allParams.get("id"); 

// Return User State Function 
function returnState(){
   if (parseInt(userId) === selfProfileId) {
      return [true, userId];
    } else {
      return [false, userId];
    }  
}

async function getUserRule() {
  // Check Local Storage Items
  
  if (window.localStorage.getItem("user")) {
    selfProfileId = JSON.parse(window.localStorage.getItem("user")).id;
  }else{
    selfProfileId=null;
  }

  let profileState = window.localStorage.getItem("profileState") ?? null;
  if (profileState === "userId") {
    return returnState();
  }else{
     try{
          let response = await makeRequest(`https://tarmeezacademy.com/api/v1/posts/${userId}`,"GET");
          userId = response.data.data.author.id;
          return returnState();
      }catch(error){
          console.log("Response Error");
      }
  }
}
 

async function getUserState(){
    let response = await getUserRule();
    return response;
}


// containers
let userMainDataSec = document.getElementById("userMainData");
let cardsParent = document.getElementById("allCards");
let headingUserName = document.getElementById("mainUserName");

let currentPageNum=1;


async function getUserData(){
    try{   
    let userDataInfo = await getUserState();
    userState = userDataInfo[0];
    userId = userDataInfo[1]; 
    console.log("The Profile State Is => ",window.localStorage.getItem("profileState"))
    console.log(userState,userId);
    let userDataResponse = await makeRequest(`https://tarmeezacademy.com/api/v1/users/${userId}`,"GET");
    // User Info
    let name = userDataResponse.data.data.name;
    userName=userDataResponse.data.data.username;
    let email=userDataResponse.data.data.email;
    let postsCount=userDataResponse.data.data.posts_count;
    let commentsCount=userDataResponse.data.data.comments_count;
    userImage=userDataResponse.data.data.profile_image;

    headingUserName.innerHTML=name;

    let userInfo = `
      <!-- Profile Self Information -->
          <section class="info flex items-center gap-7">
            <!-- Profile Image -->
            <section class="rounded-full size-25 border-3 overflow-hidden">
              <img class="w-full h-full" src="${userImage}" alt="profileImage">
            </section>
            <!--// Profile Image //-->

            <!-- Profile Info -->
            <section class="space-y-2">
              <p class="font-semibold text-lg">${name}</p>
              <p class="font-semibold text-lg">${userName}</p>
              <p class="font-semibold text-lg">${email}</p>
            </section>
            <!--// Profile Info //-->
          </section>
          <!--// Profile Self Information //-->

          <!-- user posts and comments -->
          <section class="space-y-2">
            <p class="capitalize font-medium text-5xl flex items-end">${postsCount}<span class="capitalize text-sm text-mutedpar h-fit">posts</span></p>
            <p class="capitalize font-medium text-5xl flex items-end">${commentsCount}<span class="capitalize text-sm text-mutedpar">comments</span></p>
          </section>
          <!--// user posts and comments //-->`;
    userMainDataSec.innerHTML=userInfo;
    
    }catch(error){
        console.log(error);
    }
}

async function getUserPosts(){
    let userPostsData = await makeRequest(`https://tarmeezacademy.com/api/v1/users/${userId}/posts`,"GET");
    let allPosts = userPostsData.data.data;
    cardsParent.innerHTML="";

    for (let post of allPosts) {
       let postId=post.id
       let title=post.title;
       let body=post.body;
       let postImage=post.image;
       let commentsCount=post.comments_count; 


  let clientSec = `
      <section class="userImage size-10 rounded-full overflow-hidden border-1 border-primary">
         <img class="widt-full h-full "src="${userImage}" alt="">
      </section>
      <p class="userName font-semibold text-lg">${userName}</p>
  `;

  let profileSec = `
         <section class="w-full  flex justify-between items-center flex-wrap">
            <section class="flex items-center gap-3">
            <section class="userImage size-10 rounded-full overflow-hidden border-1 border-primary">
                <img class="widt-full h-full "src="${userImage}" alt="">
            </section>
            <p class="userName font-semibold text-lg">${userName}</p>
            </section>
            
            <section class="postSettingSec flex items-center gap-5">
                <button type="button" class="deletePostBtn flex gap-3 cursor-pointer items-end">
                    <i class="text-primary text-3xl fa-solid fa-trash-can"></i>
                    <p class="text-mutedpar  h-fit font-semibold capitalize">delete</p>
                </button>
                <button type="button" class="editPostBtn flex gap-3 cursor-pointer items-end">
                <i class="text-primary  text-3xl fa-solid items-center fa-pen-to-square"></i>
                <p class="text-mutedpar  h-fit font-semibold capitalize">edit</p>
                </button>
            </section>
        </section>
  `;
    
       let card = `
            <!-- ===== Card===== -->
            <section id="${postId} "class="card bg-paragraph p-4 rounded-sm shadow-[0_10px_35px_-12px_rgba(100,255,218,0.25)]">
                <!-- Card Header -->
                <header class="flex items-center gap-3 border-b-2 pb-3 border-black/20 mb-4">
                    ${userState ? profileSec : clientSec}
                </header>
                <!-- Card Image -->
                <section class="overflow-hidden rounded-lg">
                    <img src="${postImage}" alt="card-img" class="w-full h-[700px]">
                </section>
                <!-- Releasing Time -->
                <span class="relasing-time capitalize text-paragraph mt-2">2 min ago</span>
                <!-- Card Content -->
                <a href="postPage.html?id=${postId}" class="post-details block">
                    <section class="space-y-2">
                    <h2 class="card-heading text-2xl capitalize font-semibold">${title}</h2>
                    <p class="card-paragraph font-light">${body}</p>
                    </section>
                    <!-- Comment Part -->
                    <hr class="my-4 opacity-20">
                    <p class="capitalize cursor-pointer"><i class="fa-regular fa-comment"></i><span class="comments-number mx-1">(${commentsCount})</span>comments</p>
                </a>
            </section>
            <!--// ===== Card===== //-->
       `;
      cardsParent.innerHTML+=card;
    }
}


let selectedPostId="";

async function getProfileData(){
    await getUserData();
    await getUserPosts();
     let editPostBtns = document.querySelectorAll(".editPostBtn");
     let deletePostBtns = document.querySelectorAll(".deletePostBtn");
     
    editPostBtns.forEach(el=>{
        el.addEventListener("click",()=>{
            selectedPostId = el.parentElement.parentElement.parentElement.parentElement.id;
            document.getElementById("editPostForm").classList.add("form-visibility");
        })
    })
    deletePostBtns.forEach(el=>{
        el.addEventListener("click",_=>{
            selectedPostId =el.parentElement.parentElement.parentElement.parentElement.id;
            document.getElementById("deletePostForm").classList.add("form-visibility");
        })
    })
}


// Edit Post Request
document.addEventListener("click",async (e)=>{
      if (e.target.id == "mainEditPostBtn") {
        let postImage =editPostForm.querySelector("input[type ='file'").files[0];
        let postTitle =editPostForm.querySelector("input[type ='text'").value;
        let postBody = editPostForm.querySelector("textarea").value;
        
        let headersContent={
            "content-type":"multipart/form-data",
            "Authorization":`Bearer ${window.localStorage.getItem("token")}`,
        }
        let postBodyContent = new FormData()

      
        if (postImage) {
            postBodyContent.append("image", postImage);
        }
        postBodyContent.append("title",postTitle);
        postBodyContent.append("_method", "put");
        
        
          if (!postBody) {
            appearMsg("The Post Body Is Required",false);

          }else{
            postBodyContent.append("body", postBody);
            try {
                  await axios.post(`https://tarmeezacademy.com/api/v1/posts/${selectedPostId}`,postBodyContent,
                {
                  headers: headersContent,
                },
              );
              appearMsg("Post Had Edited Successfully");
              document.getElementById("editPostForm").classList.remove("form-visibility");
              getProfileData();

            } catch (error) {
              appearMsg(error.response.data.message, false);
            }
          }
      }
})
  
// Remove Post Request
document.addEventListener("click",async (e)=>{
    if (e.target.id === "deletePostFormBtn") {
      let token = window.localStorage.getItem("token");
      let headersContent = {
        Authorization: `Bearer ${token}`,
      };
      try{
      let response = await axios.delete(`https://tarmeezacademy.com/api/v1/posts/${selectedPostId}`,{
        headers:headersContent,
      });
      appearMsg("Post Has Been Deleted Successfully");
      document.getElementById("deletePostForm").classList.remove("form-visibility");
      getProfileData();
      }catch(error){
        appearMsg(error.response.data.message,false);
      }
    }
})

getProfileData();


window.addEventListener("changeUi", async () => {
    await getProfileData();
});

let token = "";
let postsSec = document.getElementById("postsParent");
let registerForm = document.getElementById("registerForm");
let loginForm = document.getElementById("loginForm");
let createPostForm = document.getElementById("createPostForm");
let navRegisterBtn = document.getElementById("registerBtn");
let navloginBtn = document.getElementById("loginBtn");

let errorBanner = document.getElementById("errorBanner");

let navLogoutBtn = document.getElementById("logoutBtn");
let addNewPostBtn = document.getElementById("addNewPostBtn");





// Main Btns Click Events

// Nav Register Btn  Manipulation
navRegisterBtn.addEventListener("click", (_) => {
  registerForm.classList.add("form-visibility");
});
// Nav Login Btn Manipulation
navloginBtn.addEventListener("click", (_) => {
  loginForm.classList.add("form-visibility");
});
// Add New Post Btn Manipulation
if(addNewPostBtn !== null){
  addNewPostBtn.addEventListener("click", () => {
    createPostForm.classList.add("form-visibility");
  });
}

// Close Register Or Login Pages With Close Btns
document.addEventListener("click", (e) => {
  if (
    e.target.id === "closeRegisterFormBtn" ||
    e.target.id === "closeLoginFormBtn" ||
    e.target.id === "closeCreatePostFormBtn" ||
    e.target.id === "closeEditPostFormBtn" ||
    e.target.id === "closeDeletePostFormBtn"
  ) {
    e.target.parentElement.parentElement.parentElement.classList.remove(
      "form-visibility",
    );
  }
});

// Register Request
document.addEventListener("click", async (e) => {
  if (e.target.id === "mainRegisterBtn") {
    let registerPage = e.target.parentElement.parentElement;
    let registerPageImage =
      registerPage.querySelector(`input[type="file"]`).files[0];
    let registerPageName =
      registerPage.querySelector(`input[type="text"]`).value;
    let registerPageEmail =
      registerPage.querySelector(`input[type="email"]`).value;
    let registerPagePass = registerPage.querySelector(
      `input[type="password"]`,
    ).value;

    let registerFormData = new FormData();
    registerFormData.append("name", registerPageName.toUpperCase());
    registerFormData.append("username", registerPageName);
    registerFormData.append("email", registerPageEmail);
    registerFormData.append("password", registerPagePass);
    registerFormData.append("image", registerPageImage);

    try {
      let response = await axios.post(
        "https://tarmeezacademy.com/api/v1/register",
        registerFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      token = response.data.token;
      const user = response.data.user;

      window.localStorage.setItem("token", token);
      window.localStorage.setItem("user", JSON.stringify(user));

      appearMsg("Your Are Registered Now");
      registerForm.classList.remove("form-visibility");
      changeUi();
    } catch (error) {
      if (error.response) {
        appearMsg(error.response.data.message, false);
      }
    }
  }
});

// Logout Action
navLogoutBtn.addEventListener("click", (_) => {
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("user");
  changeUi();
  appearMsg("Logout Successfully");
});

// Login Request
document.addEventListener("click", async (e) => {
  if (e.target.id === "mainLoginBtn") {
    let loginUserNameField =  loginForm.querySelector("input[type='text']").value;
    let loginPasswordField = loginForm.querySelector("input[type='password']").value;
    const body = {
      username : loginUserNameField,
      password : loginPasswordField,
    };
    try {
      let response = await axios.post(
        "https://tarmeezacademy.com/api/v1/login",
        body
      );
      token = response.data.token;
      window.localStorage.setItem("token", token);
      window.localStorage.setItem("user", JSON.stringify(response.data.user));
      appearMsg("welcome back");
      loginForm.classList.remove("form-visibility");
      changeUi();
    } catch (error) {
      appearMsg(error.response.data.message, false);
    }
  }
});




// All Functions 
// Make Request Function
async function makeRequest(reqUrl, reqType) {
  try {
    let response = await axios({
      method: `${reqType}`,
      url: `${reqUrl}`,
    });
    return response;
  } catch (error) {
    console.error("Invalid Request");
  }
}

// Add Tags
function addTags(tagsList, tagsParentEl) {
  if (tagsList.length !== 0) {
      console.log(true)
      console.log(tagsList)
    for (let tag of tagsList) {
      tagsParentEl.innerHTML+=`<section class="bg-[#010101] text-paragraph rounded-4xl py-2 px-3 w-fit">${tag.name}</section>`;
    }
  }
}

// check user register or login state function
function checkUserRule() {
  if (window.localStorage.getItem("token") !== null) {
    return true;
  }
  return false;
}



// change ui function when depending on the user state

const profileEditMsg=new CustomEvent("changeUi");
function changeUi() {
  let authEl = document.getElementById("AuthenticatedElements");
  let unAuthEl = document.getElementById("unAuthenticatedElements");
  const user = JSON.parse(window.localStorage.getItem("user"));
  if (checkUserRule()) {
    unAuthEl.classList.remove("content-appearance");
    if(addNewPostBtn!==null){
      addNewPostBtn.classList.add("add-new-post-appearance");
    }
    authEl.children[0].children[0].children[0].src = user.profile_image;
    authEl.children[0].children[1].textContent = user.username;
    authEl.classList.add("content-appearance");
    document.querySelector(".links .profileLink").style.cssText="display:block";
    window.dispatchEvent(profileEditMsg);
  } else {
    unAuthEl.classList.add("content-appearance");
    if(addNewPostBtn!==null){
      addNewPostBtn.classList.remove("add-new-post-appearance");
    }
    authEl.classList.remove("content-appearance");

    document.querySelector(".links .profileLink").style.cssText="display:none";
    window.dispatchEvent(profileEditMsg);
  }
}
// Error Handling Banner Function
function appearMsg(msg, state = true) {
  errorBanner.children[0].textContent = msg;
  if (state === true) {
    errorBanner.classList.add("error-banner-style");
  } else {
    errorBanner.classList.remove("error-banner-style");
  }
  errorBanner.classList.add("error-banner-appear");
  document.getElementById("progressBar").classList.add("porgressBarAnimate");
  window.setTimeout(() => {
    errorBanner.classList.remove("error-banner-appear");
    document
      .getElementById("progressBar")
      .classList.remove("porgressBarAnimate");
  }, 2000);
}






// Go To Profile Info

document.addEventListener("click",e=>{
  if(e.target.classList[0]==="profilePageInfo"){
    let cardId=e.target.parentElement.parentElement.id;
    window.location.assign(`profile.html?id=${cardId}`);
    window.localStorage.setItem("profileState","postId")
  }
})



// Make Profile Link 
Array.from(document.querySelectorAll(".profileLink")).forEach((el)=>{
  el.addEventListener("click",(e)=>{
    e.preventDefault();
    if(window.localStorage.getItem("token") !== null){
      let user=JSON.parse(window.localStorage.getItem("user"));
      window.localStorage.setItem("profileState", "userId");
      window.location.assign(`profile.html?id=${user.id}`);
    }
  })
})



changeUi();


// if(window.location.pathname==="/profile.html"){
//   console.log("Yes We Are In Profile.html")
// }
// new Promise((resolve , reject)=>{
//   getUserRule();
//   resolve();
// }).then((response)=>{
//   console.log(response);
// });



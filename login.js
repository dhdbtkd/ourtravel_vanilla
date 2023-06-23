
import TourPlan from './tourPlan';

class Login {
  constructor() {
    this.name;
  }
  async loginValidCheck() {
    const result = await fetch("http://localhost:3000/users/payload", {
      withCredentials: true,
      credentials: "include"
    })
      .then((response) => response.json())
      .then((result) => {
        if (!result) return false
        if (!result.code) return false
        if (result.code == 200) {
          this.name = result.data.name;
          return true;
        } else {
          return false;
        }
      });
    return result;
  }
  //로그인
  login(name) {
    fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
      }),
      withCredentials: true,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        this.loginSuccess(result.name);
        new TourPlan().loadTourPlan(name);
      });
  }
  loginSuccess(name) {
    document.querySelectorAll(".intro").forEach((item) => {
      item.classList.add("hidden");
    })
    document.querySelector(".map").classList.remove("hidden");
    document.querySelector("#planHeader>div:first-child").innerHTML = `${name}의 여행계획`;
    viewer.useDefaultRenderLoop = true;
    
  }
}
export default Login;
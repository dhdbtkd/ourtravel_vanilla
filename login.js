
import TourPlan from './tourPlan';
import config from './config.js';
class Login {
  constructor() {
    this.name;
  }
  async loginValidCheck() {
    const result = await fetch(`${config.remoteUrl}/users/payload`, {
      withCredentials: true,
      credentials: "include"
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("🚀 ~ file: login.js:15 ~ Login ~ .then ~ result:", result)
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
    fetch(`${config.remoteUrl}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
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
      })
      .catch((e)=>{
        console.log(e);
      });
  }
  loginSuccess(name) {
    document.querySelectorAll(".intro").forEach((item) => {
      item.classList.add("hidden");
    })
    document.querySelector(".map").classList.remove("hidden");
    document.querySelector("#planHeader>div:first-child").innerHTML = `${name}의 여행계획`;
    viewer.useDefaultRenderLoop = true;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 400),
      orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-15.0),
      }
    });

  }
}
export default Login;
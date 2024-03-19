import viewer from './map.js';
import TourPlan from './tourPlan';
import Login from './login';
import config from './config.js';

class Intro {
    constructor(loginValid, userName) {
        this.userName = userName;
        this.loginValid = loginValid
        if (loginValid) {
            const tourPlan = this.loginSuccess(this.userName);
            this.TourPlan = tourPlan;
        }
        this.addEventToNextPage(1);
        this.addEventToNextPage(2);
        this.addEventCreateId();
        this.addEventLoadId();
    }
    addEventToNextPage(targetPage) {
        const button = document.querySelector(`.intro .button div:nth-of-type(${targetPage})`);
        button.addEventListener("click", (e) => {
            const hiddenDom = document.querySelector(".intro");
            const targetDom = document.querySelectorAll(".intro")[targetPage];

            hiddenDom.classList.add("hidden");
            targetDom.classList.remove("hidden");
        })
    }
    addEventCreateId() {
        const parentDom = document.querySelectorAll("body .intro")[1];
        const button = parentDom.querySelector("button");
        const input = parentDom.querySelector("input");
        this.addInputEvent(input);
        button.addEventListener("click", (e) => {
            if (input.value.length === 0) return
            this.FetchCreateId(input.value);
        })
    }
    addEventLoadId() {
        const parentDom = document.querySelectorAll("body .intro")[2];
        const button = parentDom.querySelector("button");
        const input = parentDom.querySelector("input");
        this.addInputEvent(input);
        button.addEventListener("click", async (e) => {
            const loginResult = await this.login(input.value);
            if (loginResult) {
                console.log("🚀 ~ file: intro.js:46 ~ Intro ~ button.addEventListener ~ loginResult:", loginResult)
                this.loginSuccess(input.value);
            }
        })
    }
    /**
     * 입력받은 Input Dom에 특수문자 필터 이벤트를 추가한다.
     * @param {DOM} inputDom Input Dom 객체
     */
    addInputEvent(inputDom) {
        inputDom.addEventListener("keydown", (e) => {
            if (this.isSpecialCharactor(e)) {
                e.preventDefault();
            }
        })
    }
    isSpecialCharactor(e) {
        if (!e.key.match(/^[a-zA-Z0-9]*$/)) {
            return true;
        }
        return false;
    }
    FetchCreateId(name) {
        fetch(`${config.remoteUrl}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
            }),
        })
            .then((response) => response.json())
            .then(async (result) => {
                if (result.result) {
                    new TourPlan().createTourPlan(name);
                    //생성 완료
                    const loginResult = await this.login(name);
                    if (loginResult) {
                        this.loginSuccess(name);
                    }
                    console.log(result);
                } else {
                    alert(result.message);
                }
            });
    }
    //로그인
    async login(name) {
        const loginResult = await fetch(`${config.remoteUrl}/users/login`, {
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
                if (!result) return;
                if (!result.code) return;
                if (result.code === 200) {
                    return true
                } else {
                    alert("닉네임을 다시 한번 확인해주세요");
                    return false;
                }

            });
        return loginResult;
    }
    loginSuccess(name) {
        document.querySelectorAll(".intro").forEach((item) => {
            item.classList.add("hidden");
        })
        document.querySelector(".map").classList.remove("hidden");
        document.querySelector("#planHeader>div:first-child").innerHTML = `${name}의 여행계획`;
        viewer.useDefaultRenderLoop = true;
        this.userName = name;
        if (this.tourPlan) {
            this.tourPlan.loadTourPlan(name);
        } else {
            const tourPlan = new TourPlan();
            tourPlan.loadTourPlan(name);
            return tourPlan;
        }
    }

}
export default Intro
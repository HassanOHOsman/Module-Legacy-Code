import {renderEach, renderOne, destroy} from "../lib/render.mjs";
import { apiService } from "../lib/api.mjs";
import {
  state,
  getLogoutContainer,
  getLoginContainer,
  getProfileContainer,
  getTimelineContainer,
  getBloomFormContainer,
} from "../index.mjs";
import {createLogin, handleLogin} from "../components/login.mjs";
import {createLogout, handleLogout} from "../components/logout.mjs";
import {createProfile} from "../components/profile.mjs";
import {
  createBloomForm,
  handleBloomSubmit,
  handleTyping,
} from "../components/bloom-form.mjs";
import {createBloom} from "../components/bloom.mjs";

// Home view - logged in or not
function homeView() {
  destroy();

  if (state.isLoggedIn) {
    renderOne(
      {
        profileData: state.profiles.find((p) => p.username === state.currentUser),
        whoToFollow: state.whoToFollow,
        isLoggedIn: state.isLoggedIn,
      },
      getProfileContainer(),
      "profile-template",
      createProfile
    );
    renderEach(
      state.timelineBlooms,
      getTimelineContainer(),
      "bloom-template",
      createBloom
    );

    document.querySelectorAll("[data-action='rebloom']").forEach((button) => {
      button.addEventListener("click", async () => {
        const bloomArticle = button.closest("[data-bloom]");
        const bloomId = bloomArticle.getAttribute("data-bloom-id");

        try {
          const data = await apiService.rebloom(bloomId);
          console.log("REBLOOM RESPONSE:", data);
          const counter = button.querySelector("[data-rebloom-count]");
          let count = parseInt(counter.textContent) || 0;
          counter.textContent = data.rebloom_count ?? count + 1;
        } catch (error) {
          console.error("Unable to rebloom:", error);
        }

      });

    });

    renderOne(
      state.isLoggedIn,
      getBloomFormContainer(),
      "bloom-form-template",
      createBloomForm
    );
    renderOne(
      state.isLoggedIn,
      getLogoutContainer(),
      "logout-template",
      createLogout
    );
    document
      .querySelector("[data-action='logout']")
      ?.addEventListener("click", handleLogout);
    document
      .querySelector("[data-form='bloom']")
      ?.addEventListener("submit", handleBloomSubmit);
    document.querySelector("textarea")?.addEventListener("input", handleTyping);
  } else {
    renderOne(
      state.isLoggedIn,
      getLoginContainer(),
      "login-template",
      createLogin
    );
    document
      .querySelector("[data-form='login']")
      ?.addEventListener("submit", handleLogin);
  }
}
export {homeView};

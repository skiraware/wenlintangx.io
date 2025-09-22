document.fonts.ready.then(() => {
  document.body.classList.add("font-loaded");
});
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // Check for query parameter with Base64-encoded key
  const urlParams = new URLSearchParams(window.location.search);
  const key = urlParams.get("key");
  const accessDenied = document.getElementById("access-denied");
  const surveySection = document.querySelector(".survey-section");
  const expectedKey = atob("c2VjcmV0");

  if (key !== expectedKey) {
    accessDenied.style.display = "block";
    surveySection.style.display = "none";
    return; // Stop further execution
  }

  const tnc = document.getElementById("tnc");
  const form = document.getElementById("iamForm");
  const agreeBtn = document.getElementById("agreeBtn");
  const questions = document.querySelectorAll(".question");
  let currentIndex = 0;
  let isUser = null;
  let isLowFrequency = null;

  // Detect language from HTML tag
  const isEnglish = document.documentElement.lang === "en";

  // Language-specific text
  const text = {
    maxSelection: isEnglish
      ? "Please select up to 3 items!"
      : "請最多選擇3項！",
    next: isEnglish ? "Next" : "下一步",
    submit: isEnglish ? "Submit Survey" : "提交問卷",
    emptyError: isEnglish ? "Please answer this question!" : "請填寫此問題！",
    ratingError: isEnglish
      ? "Please complete all ratings!"
      : "請填寫所有評價！",
  };

  // Show T&C initially
  gsap.set(tnc, { opacity: 1, display: "block" });
  gsap.set(form, { opacity: 0, display: "none" });

  // Handle T&C agreement
  agreeBtn.addEventListener("click", () => {
    gsap.to(tnc, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        tnc.style.display = "none";
        gsap.set(form, { display: "block" });
        gsap.to(form, {
          opacity: 1,
          duration: 0.5,
          onComplete: () => {
            showQuestion(0);
          },
        });
      },
    });
  });

  // Add event listeners for option and rating buttons
  // Limit checkbox selection to 3
  questions.forEach((question) => {
    const optionBtns = question.querySelectorAll(".option-btn, .rating-btn");
    const checkboxGroup = question.querySelector(".checkbox-group");

    optionBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        let selectGroup, hidden;
        if (btn.classList.contains("rating-btn")) {
          selectGroup = btn.closest(".rating-group");
          hidden = selectGroup.previousElementSibling;
        } else {
          selectGroup = btn.closest(".option-group");
          hidden = selectGroup.previousElementSibling;
        }
        selectGroup
          .querySelectorAll(".rating-btn, .option-btn")
          .forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        if (hidden) hidden.value = btn.dataset.value;

        // Clear answers for questions 5, 6 (functions), and 7 (reasons) based on question 4's answer
        if (question.dataset.question === "4") {
          const newValue = btn.dataset.value;
          const isNowUser = newValue === "有，使用過（請繼續回答第 6-8 題）";

          // Clear question 5 (frequency) if switching to non-user
          const q5HiddenInput = questions[4].querySelector(
            'input[type="hidden"]'
          );
          if (!isNowUser && q5HiddenInput) {
            q5HiddenInput.value = "";
            questions[4]
              .querySelectorAll(".option-btn")
              .forEach((b) => b.classList.remove("selected"));
            questions[4].classList.remove("invalid-input");
            const q5Alert = questions[4].querySelector(".alert-message");
            if (q5Alert) q5Alert.classList.remove("active");
          }

          // Clear question 6 (functions) if switching to non-user
          const q6CheckboxGroup = questions[5].querySelector(".checkbox-group");
          if (!isNowUser && q6CheckboxGroup) {
            q6CheckboxGroup
              .querySelectorAll('input[type="checkbox"]')
              .forEach((cb) => {
                cb.checked = false;
              });
            q6CheckboxGroup.querySelector('input[type="text"]').value = "";
            q6CheckboxGroup.classList.remove("invalid-input");
            const q6Alert = questions[5].querySelector(".alert-message");
            if (q6Alert) q6Alert.classList.remove("active");
          }

          // Clear question 7 (reasons) if switching to user
          const q7CheckboxGroup = questions[6].querySelector(".checkbox-group");
          if (isNowUser && q7CheckboxGroup) {
            q7CheckboxGroup
              .querySelectorAll('input[type="checkbox"]')
              .forEach((cb) => {
                cb.checked = false;
              });
            q7CheckboxGroup.querySelector('input[type="text"]').value = "";
            q7CheckboxGroup.classList.remove("invalid-input");
            const q7Alert = questions[6].querySelector(".alert-message");
            if (q7Alert) q7Alert.classList.remove("active");
          }
        }

        if (btn.classList.contains("rating-btn")) {
          const sub = btn.closest(".sub-rating");
          sub.classList.add("completed");
          const allSubs = Array.from(question.querySelectorAll(".sub-rating"));
          const currentSubIdx = allSubs.indexOf(sub);
          let nextSub =
            allSubs
              .slice(currentSubIdx + 1)
              .find((s) => !s.classList.contains("completed")) ||
            allSubs.find((s) => !s.classList.contains("completed"));
          if (nextSub) {
            form.scrollTo({
              top: nextSub.offsetTop - 20,
              behavior: "smooth",
            });
          }
        }

        if (!btn.classList.contains("no-auto")) {
          setTimeout(handleNext, 300);
        }
      });
    });

    if (checkboxGroup) {
      const checkboxes = checkboxGroup.querySelectorAll(
        'input[type="checkbox"]:not([value="__other_option__"])'
      );
      const alertMessage = question.querySelector(".alert-message");
      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
          const checkedBoxes = checkboxGroup.querySelectorAll(
            'input[type="checkbox"]:not([value="__other_option__"]):checked'
          );
          if (checkedBoxes.length > 3) {
            this.checked = false;
            checkboxGroup.classList.add("invalid-input");
            if (alertMessage) {
              alertMessage.textContent = text.maxSelection;
              alertMessage.classList.add("active");
            }
          } else {
            checkboxGroup.classList.remove("invalid-input");
            if (
              alertMessage &&
              alertMessage.textContent === text.maxSelection
            ) {
              alertMessage.classList.remove("active");
            }
          }
        });
      });
    }

    const prevBtn = question.querySelector(".prev-btn");
    const nextBtn = question.querySelector(".next-btn");

    if (prevBtn) {
      prevBtn.addEventListener("click", handlePrev);
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", handleNext);
    }
  });

  // Handle form submission
  function handleSubmit(event) {
    event.preventDefault();
    const form = document.getElementById("iamForm");
    const iframe = document.createElement("iframe");
    iframe.name = "hidden_iframe";
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    form.target = "hidden_iframe";
    form.submit();
    setTimeout(() => {
      window.location.href = isEnglish ? "finish_en.html" : "finish.html";
    }, 1000);
  }
  form.addEventListener("submit", handleSubmit);

  function showQuestion(index) {
    const current = questions[currentIndex];
    const next = questions[index];

    gsap.to(current, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        current.style.display = "none";
        current.classList.remove("active");

        gsap.set(next, { display: "block" });
        gsap.to(next, {
          opacity: 1,
          duration: 0.5,
          onComplete: () => {
            next.classList.add("active");
            form.scrollTop = 0;
          },
        });
      },
    });

    currentIndex = index;
    updateNavButtons();
    updateProgress();
  }

  function handleNext() {
    const currentQ = questions[currentIndex];
    if (!validateQuestion(currentQ)) {
      return; // Stop if validation fails
    }

    const nextIndex = getNextIndex(currentIndex);
    if (nextIndex === undefined) {
      handleSubmit(new Event("submit")); // Call handleSubmit with a synthetic event
    } else {
      if (currentIndex === 3) {
        const value = currentQ.querySelector('input[type="hidden"]').value;
        isUser = value === "有，使用過（請繼續回答第 6-8 題）";
      }
      if (currentIndex === 4) {
        const value = currentQ.querySelector('input[type="hidden"]').value;
        isLowFrequency =
          value === "每月數次" || value === "很少（少於每月一次）";
      }
      showQuestion(nextIndex);
    }
  }

  function handlePrev() {
    const prevIndex = getPrevIndex(currentIndex);
    if (prevIndex !== undefined) {
      showQuestion(prevIndex);
    }
  }

  function getNextIndex(curr) {
    let next = curr + 1;
    if (curr === 3) {
      const value = questions[curr].querySelector('input[type="hidden"]').value;
      isUser = value === "有，使用過（請繼續回答第 6-8 題）";
      next = isUser ? 4 : 6; // If user, go to Q5 (frequency); else go to Q7 (reasons)
    }
    if (curr === 4) {
      next = 5; // From frequency (Q5), go to Q6 (functions)
    }
    if (curr === 5) {
      const q5Value = questions[4].querySelector('input[type="hidden"]').value;
      isLowFrequency =
        q5Value === "每月數次" || q5Value === "很少（少於每月一次）";
      next = isLowFrequency ? 6 : 7; // If low frequency, go to Q7 (reasons); else go to Q8 (ratings)
    }
    if (curr === 6) {
      next = 7; // From reasons (Q7), go to Q8 (ratings)
    }
    return next < questions.length ? next : undefined;
  }

  function getPrevIndex(curr) {
    let prev = curr - 1;
    if (curr === 6) {
      prev = isUser ? 5 : 3; // From reasons (Q7), go back to functions (Q6) if user, else to Q4
    }
    if (curr === 5) {
      prev = 4; // From functions (Q6), go back to frequency (Q5)
    }
    if (curr === 7) {
      prev = isUser && isLowFrequency ? 6 : isUser ? 5 : 6; // From ratings (Q8), go back to reasons (Q7) if user and low frequency, else to functions (Q6) or reasons (Q7)
    }
    return prev >= 0 ? prev : undefined;
  }

  function updateNavButtons() {
    const currentQ = questions[currentIndex];
    const prevBtn = currentQ.querySelector(".prev-btn");
    const nextBtn = currentQ.querySelector(".next-btn");

    if (getPrevIndex(currentIndex) === undefined) {
      if (prevBtn) prevBtn.style.display = "none";
    } else {
      if (prevBtn) prevBtn.style.display = "block";
    }

    if (getNextIndex(currentIndex) === undefined) {
      nextBtn.textContent = text.submit;
    } else {
      nextBtn.textContent = text.next;
    }
  }

  function numSkippedBefore(idx) {
    let skipped = 0;
    if (isUser !== null) {
      if (!isUser) {
        if (idx > 3) skipped++; // Skip frequency (Q5)
        if (idx > 5) skipped++; // Skip functions (Q6)
      } else if (isLowFrequency !== null) {
        if (!isLowFrequency) {
          if (idx > 5) skipped++; // Skip reasons (Q7)
        }
      }
    }
    return skipped;
  }

  function updateProgress() {
    const step = currentIndex + 1 - numSkippedBefore(currentIndex);
    let total = questions.length;
    if (isUser !== null) {
      if (!isUser) total -= 2;
      else if (isLowFrequency !== null && !isLowFrequency) total -= 1;
    }
    const progressFill = document.querySelector(".progress-fill");
    progressFill.style.width = `${(step / total) * 100}%`;
  }

  function validateQuestion(question) {
    const hiddenInputs = question.querySelectorAll('input[type="hidden"]');
    const textarea = question.querySelector("textarea");
    const checkboxGroup = question.querySelector(".checkbox-group");
    const alertMessage = question.querySelector(".alert-message");

    // Reset highlights
    hiddenInputs.forEach((inp) => inp.classList.remove("invalid-input"));
    if (textarea) textarea.classList.remove("invalid-input");
    if (checkboxGroup) checkboxGroup.classList.remove("invalid-input");
    if (alertMessage) alertMessage.classList.remove("active");

    let valid = true;

    // Validate hidden inputs (for ratings/options)
    hiddenInputs.forEach((inp) => {
      if (inp.value === "") {
        inp.classList.add("invalid-input");
        const group = inp.nextElementSibling; // Assumes group follows hidden input
        if (
          group &&
          (group.classList.contains("rating-group") ||
            group.classList.contains("option-group"))
        ) {
          group.classList.add("invalid-input");
        }
        valid = false;
      }
    });

    // Validate textarea
    if (textarea && textarea.value.trim() === "") {
      textarea.classList.add("invalid-input");
      valid = false;
    }

    // Validate checkboxes
    if (checkboxGroup) {
      const checked = checkboxGroup.querySelectorAll(
        'input[type="checkbox"]:checked'
      );
      if (checked.length === 0) {
        checkboxGroup.classList.add("invalid-input");
        valid = false;
      }
    }

    if (!valid && alertMessage) {
      alertMessage.classList.add("active");
    }

    return valid;
  }
});

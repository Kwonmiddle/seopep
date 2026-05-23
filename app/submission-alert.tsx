"use client";

import { useEffect } from "react";

export function SubmissionAlert() {
  useEffect(() => {
    const url = new URL(window.location.href);

    if (url.searchParams.get("submitted") === "1") {
      window.alert("정책을 제안해주셔서 고맙습니다.");
      window.history.replaceState(null, "", url.pathname);
    }

    const form = document.querySelector<HTMLFormElement>("[data-policy-form]");
    const nameInput = form?.elements.namedItem("name") as HTMLInputElement | null;
    const phoneInput = form?.elements.namedItem("phone") as HTMLInputElement | null;
    const submitButton = form?.querySelector<HTMLButtonElement>(
      "[data-submit-button]",
    );
    const submitLabel = submitButton?.querySelector("[data-submit-label]");

    if (!form || !nameInput || !phoneInput || !submitButton || !submitLabel) {
      return;
    }

    const requiredMessages = new Map<HTMLInputElement, string>([
      [nameInput, "이름을 입력해주세요."],
      [phoneInput, "연락처를 입력해주세요."],
    ]);

    const updateValidityMessage = (input: HTMLInputElement) => {
      const message = requiredMessages.get(input) ?? "";
      input.setCustomValidity(input.validity.valueMissing ? message : "");
    };

    requiredMessages.forEach((_, input) => updateValidityMessage(input));

    const handleInput = (event: Event) => {
      updateValidityMessage(event.currentTarget as HTMLInputElement);
    };

    const handleInvalid = (event: Event) => {
      updateValidityMessage(event.target as HTMLInputElement);
    };

    const handleSubmit = () => {
      requiredMessages.forEach((_, input) => updateValidityMessage(input));

      if (!form.checkValidity()) {
        return;
      }

      submitButton.dataset.loading = "true";
      submitButton.disabled = true;
      submitLabel.textContent = "제출 중입니다...";
    };

    nameInput.addEventListener("input", handleInput);
    phoneInput.addEventListener("input", handleInput);
    form.addEventListener("invalid", handleInvalid, true);
    form.addEventListener("submit", handleSubmit);

    return () => {
      nameInput.removeEventListener("input", handleInput);
      phoneInput.removeEventListener("input", handleInput);
      form.removeEventListener("invalid", handleInvalid, true);
      form.removeEventListener("submit", handleSubmit);
    };
  }, []);

  return null;
}

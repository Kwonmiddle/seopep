"use client";

import { useEffect } from "react";

const DRAFT_STORAGE_KEY = "policy-vote-draft";

type PolicyVoteDraft = {
  name: string;
  phone: string;
  address: string;
  email: string;
  talk: boolean;
  firstAssembly: boolean;
  secondAssembly: boolean;
  memo: string;
  customPolicy: string;
  policies: string[];
  savedAt: string;
};

function getFormInput(form: HTMLFormElement, name: string) {
  return form.elements.namedItem(name) as
    | HTMLInputElement
    | HTMLTextAreaElement
    | null;
}

function saveDraft(form: HTMLFormElement) {
  const formData = new FormData(form);
  const draft: PolicyVoteDraft = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    address: String(formData.get("address") ?? ""),
    email: String(formData.get("email") ?? ""),
    talk: formData.get("talk") === "1",
    firstAssembly: formData.get("firstAssembly") === "1",
    secondAssembly: formData.get("secondAssembly") === "1",
    memo: String(formData.get("memo") ?? ""),
    customPolicy: String(formData.get("customPolicy") ?? ""),
    policies: formData
      .getAll("policies")
      .filter((value): value is string => typeof value === "string"),
    savedAt: new Date().toISOString(),
  };

  localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

function clearDraft() {
  localStorage.removeItem(DRAFT_STORAGE_KEY);
}

function restoreDraft(form: HTMLFormElement) {
  const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);

  if (!savedDraft) {
    return false;
  }

  try {
    const draft = JSON.parse(savedDraft) as PolicyVoteDraft;
    const textFields = [
      "name",
      "phone",
      "address",
      "email",
      "memo",
      "customPolicy",
    ] as const;

    textFields.forEach((field) => {
      const input = getFormInput(form, field);

      if (input) {
        input.value = draft[field] ?? "";
      }
    });

    const talkInput = form.elements.namedItem("talk") as HTMLInputElement | null;
    const firstAssemblyInput = form.elements.namedItem(
      "firstAssembly",
    ) as HTMLInputElement | null;
    const secondAssemblyInput = form.elements.namedItem(
      "secondAssembly",
    ) as HTMLInputElement | null;

    if (talkInput) {
      talkInput.checked = Boolean(draft.talk);
    }

    if (firstAssemblyInput) {
      firstAssemblyInput.checked = Boolean(draft.firstAssembly);
    }

    if (secondAssemblyInput) {
      secondAssemblyInput.checked = Boolean(draft.secondAssembly);
    }

    const selectedPolicies = new Set(draft.policies ?? []);
    form
      .querySelectorAll<HTMLInputElement>('input[name="policies"]')
      .forEach((input) => {
        input.checked = selectedPolicies.has(input.value);
      });

    return true;
  } catch {
    clearDraft();
    return false;
  }
}

export function SubmissionAlert() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const isSubmitted = url.searchParams.get("submitted") === "1";
    const isSubmitError = url.searchParams.get("error") === "submit";

    if (isSubmitted) {
      clearDraft();
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

    if (isSubmitError) {
      const code = url.searchParams.get("code");
      const isRestored = restoreDraft(form);
      const errorMessages: Record<string, string> = {
        config:
          "서버 설정이 완료되지 않았습니다. Vercel 환경변수를 확인해주세요.",
        auth: "구글 인증키 형식에 문제가 있습니다. GOOGLE_PRIVATE_KEY 값을 확인해주세요.",
        sheet:
          "구글 시트를 찾을 수 없습니다. GOOGLE_SHEET_ID와 GOOGLE_SHEET_TAB_NAME을 확인해주세요.",
        permission:
          "구글 시트 편집 권한이 없습니다. 서비스 계정 이메일에 편집자 권한을 부여해주세요.",
      };
      const restoreMessage = isRestored
        ? "\n\n입력하신 내용은 임시 저장되어 다시 채워두었습니다."
        : "";

      window.alert(
        (errorMessages[code ?? ""] ??
          "제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.") +
          restoreMessage,
      );
      window.history.replaceState(null, "", url.pathname);
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

      saveDraft(form);
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

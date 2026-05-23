"use client";

import { useEffect } from "react";

export function SubmissionAlert() {
  useEffect(() => {
    const url = new URL(window.location.href);

    if (url.searchParams.get("submitted") !== "1") {
      return;
    }

    window.alert("정책을 제안해주셔서 고맙습니다.");
    window.history.replaceState(null, "", url.pathname);
  }, []);

  return null;
}

"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/client-events";
import { en } from "@/lib/i18n/en";
import { zh } from "@/lib/i18n/zh";

export function ReadingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialLang = searchParams.get("lang") === "zh" ? "zh" : "en";
  const [language, setLanguage] = useState<"en" | "zh">(initialLang);
  const [birthTimeUnknown, setBirthTimeUnknown] = useState(false);
  const [trueSolarTime, setTrueSolarTime] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const copy = useMemo(() => (language === "zh" ? zh : en), [language]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    trackEvent("form_submitted", { language });
    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") || ""),
      gender: String(formData.get("gender") || "unspecified"),
      birthDate: String(formData.get("birthDate") || ""),
      birthTime: birthTimeUnknown ? undefined : String(formData.get("birthTime") || ""),
      birthTimeUnknown,
      birthPlace: String(formData.get("birthPlace") || ""),
      timezone: String(formData.get("timezone") || "auto"),
      trueSolarTime,
      userQuestion: String(formData.get("userQuestion") || ""),
      language
    };

    const response = await fetch("/api/readings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Unable to create reading.");
      return;
    }

    router.push(`/reading/${data.reading.id}`);
  }

  return (
    <form
      className="formPanel"
      onSubmit={submit}
      onFocusCapture={() => {
        if (!started) {
          setStarted(true);
          trackEvent("form_started", { language });
        }
      }}
    >
      <h1>{copy.form.title}</h1>
      <label>
        {copy.form.name}
        <input name="name" placeholder={copy.form.namePlaceholder} maxLength={80} />
      </label>
      <label>
        {copy.form.birthDate}
        <input name="birthDate" type="date" required />
      </label>
      <label>
        {copy.form.birthTime}
        <input name="birthTime" type="time" disabled={birthTimeUnknown} required={!birthTimeUnknown} />
      </label>
      <label className="checkRow">
        <input type="checkbox" checked={birthTimeUnknown} onChange={(event) => setBirthTimeUnknown(event.target.checked)} />
        <span>{copy.form.unknownTime}</span>
      </label>
      {birthTimeUnknown ? <p className="fieldHelp">{copy.form.unknownTimeHelp}</p> : null}
      <label>
        {copy.form.gender}
        <select name="gender" defaultValue="unspecified">
          <option value="unspecified">{copy.form.genderOptional}</option>
          <option value="female">{copy.form.female}</option>
          <option value="male">{copy.form.male}</option>
          <option value="unspecified">{copy.form.other}</option>
        </select>
      </label>
      <label>
        {copy.form.birthPlace}
        <input name="birthPlace" placeholder={copy.form.birthPlacePlaceholder} maxLength={120} />
      </label>
      <label>
        {copy.form.timezone}
        <select name="timezone" defaultValue="auto">
          <option value="auto">{copy.form.timezoneAuto}</option>
          <option value="America/New_York">America/New_York</option>
          <option value="America/Los_Angeles">America/Los_Angeles</option>
          <option value="Europe/London">Europe/London</option>
          <option value="Europe/Paris">Europe/Paris</option>
          <option value="Asia/Tokyo">Asia/Tokyo</option>
          <option value="Asia/Shanghai">Asia/Shanghai</option>
          <option value="Asia/Singapore">Asia/Singapore</option>
          <option value="Australia/Sydney">Australia/Sydney</option>
        </select>
      </label>
      <label className="checkRow">
        <input type="checkbox" checked={trueSolarTime} onChange={(event) => setTrueSolarTime(event.target.checked)} />
        <span>{copy.form.trueSolarTime}</span>
      </label>
      <p className="fieldHelp">{copy.form.trueSolarTimeHelp}</p>
      <label>
        {copy.form.userQuestion}
        <textarea name="userQuestion" placeholder={copy.form.userQuestionPlaceholder} maxLength={500} />
      </label>
      <label>
        {copy.form.language}
        <select value={language} onChange={(event) => setLanguage(event.target.value as "en" | "zh")}>
          <option value="en">English</option>
          <option value="zh">中文</option>
        </select>
      </label>
      <p className="finePrint">{copy.form.note}</p>
      {error ? <p className="errorText">{error}</p> : null}
      <button className="primaryButton" type="submit" disabled={loading}>
        {loading ? "..." : copy.form.submit}
      </button>
    </form>
  );
}

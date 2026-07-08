"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PublicReading, ReadingStatus } from "@/lib/bazi/types";
import { trackEvent } from "@/lib/client-events";
import { FreeReport } from "./FreeReport";
import { FullReport } from "./FullReport";

type StatusResponse = {
  reading: PublicReading;
  status: ReadingStatus;
};

type FullReportStatusProps = {
  initialReading: PublicReading;
  initialStatus: ReadingStatus;
  sessionId?: string;
};

function progressFor(status: ReadingStatus, elapsedSeconds: number) {
  if (status.reportState === "confirming") {
    return Math.min(25, 8 + elapsedSeconds * 2);
  }
  if (status.reportState === "generating") {
    return Math.min(95, 35 + elapsedSeconds * 1.25);
  }
  if (status.fullReportReady) {
    return 100;
  }
  return 0;
}

function stepCopy(language: PublicReading["language"]) {
  if (language === "zh") {
    return {
      title: "正在生成你的完整八字报告...",
      delay: "你的报告仍在准备中。请保持此页面打开，或稍后刷新查看。",
      error: "准备报告时出现了一点问题。",
      retry: "重试",
      support: "请联系 support@fountersaying.com，我们会帮你恢复访问或处理退款。",
      fallback: "AI 解析暂时不可用，当前展示的是结构化备用报告。",
      steps: ["确认付款", "准备八字命盘", "撰写完整报告", "解锁结果"]
    };
  }
  return {
    title: "Generating your full Bazi report...",
    delay: "Your report is still being prepared. Please keep this page open or refresh later.",
    error: "Something went wrong while preparing your report.",
    retry: "Retry",
    support: "Contact support@fountersaying.com and we will help restore access or review a refund.",
    fallback: "AI writing was temporarily unavailable, so this structured fallback report is ready instead.",
    steps: ["Confirming payment", "Preparing your Bazi chart", "Writing your full report", "Unlocking your result"]
  };
}

export function FullReportStatus({ initialReading, initialStatus, sessionId }: FullReportStatusProps) {
  const [reading, setReading] = useState(initialReading);
  const [status, setStatus] = useState(initialStatus);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState("");
  const trackedReturn = useRef(false);
  const trackedPayment = useRef(false);
  const trackedGenerating = useRef(false);
  const copy = stepCopy(reading.language);
  const shouldPoll = status.reportState === "confirming" || status.reportState === "generating";

  const progress = useMemo(() => {
    return progressFor(status, elapsedSeconds);
  }, [elapsedSeconds, status]);

  const refreshStatus = useCallback(async () => {
    const params = new URLSearchParams();
    if (sessionId) {
      params.set("session_id", sessionId);
    }
    params.set("ensure_full", "1");
    const suffix = params.toString() ? `?${params.toString()}` : "";
    const response = await fetch(`/api/readings/${reading.id}${suffix}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Unable to refresh report status.");
    }
    const data = (await response.json()) as StatusResponse;
    setReading(data.reading);
    setStatus(data.status);
    setError("");
  }, [reading.id, sessionId]);

  useEffect(() => {
    if (sessionId && !trackedReturn.current) {
      trackedReturn.current = true;
      trackEvent("checkout_returned", { reportState: status.reportState }, reading.id);
    }
  }, [reading.id, sessionId, status.reportState]);

  useEffect(() => {
    if (status.paymentStatus === "paid" && !trackedPayment.current) {
      trackedPayment.current = true;
      trackEvent("payment_confirmed", { reportState: status.reportState }, reading.id);
    }
    if (status.reportState === "generating" && !trackedGenerating.current) {
      trackedGenerating.current = true;
      trackEvent("full_report_generating", {}, reading.id);
    }
  }, [reading.id, status.paymentStatus, status.reportState]);

  useEffect(() => {
    if (!shouldPoll) {
      return undefined;
    }

    void refreshStatus().catch(() => {
      setError(copy.error);
    });
    const interval = window.setInterval(() => {
      void refreshStatus().catch(() => {
        setError(copy.error);
      });
    }, 2500);
    return () => window.clearInterval(interval);
  }, [copy.error, refreshStatus, shouldPoll]);

  useEffect(() => {
    if (!shouldPoll) {
      return undefined;
    }
    const timer = window.setInterval(() => {
      setElapsedSeconds((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [shouldPoll]);

  if ((status.reportState === "ready" || status.reportState === "fallback_ready") && reading.fullReport) {
    return (
      <>
        {status.reportState === "fallback_ready" ? <p className="statusNote">{copy.fallback}</p> : null}
        <FullReport reading={reading} report={reading.fullReport} />
      </>
    );
  }

  if (status.reportState === "locked") {
    return <FreeReport reading={reading} />;
  }

  return (
    <section className="reportShell waitingReport" aria-live="polite">
      <p className="eyebrow">{reading.language === "zh" ? "正在解锁" : "Unlocking report"}</p>
      <h1>{copy.title}</h1>

      <div className="progressTrack" aria-label={copy.title}>
        <span style={{ width: `${progress}%` }} />
      </div>
      <p className="progressText">{Math.round(progress)}%</p>

      <ol className="generationSteps">
        {copy.steps.map((step, index) => {
          const threshold = [1, 26, 51, 86][index];
          return (
            <li key={step} className={progress >= threshold ? "active" : ""}>
              <span>{index + 1}</span>
              {step}
            </li>
          );
        })}
      </ol>

      {elapsedSeconds >= 60 ? <p className="finePrint">{copy.delay}</p> : null}

      {error ? (
        <div className="retryBox">
          <p>{error}</p>
          <p className="finePrint">{copy.support}</p>
          <button
            type="button"
            onClick={() => {
              setError("");
              void refreshStatus().catch(() => setError(copy.error));
            }}
          >
            {copy.retry}
          </button>
        </div>
      ) : null}
    </section>
  );
}

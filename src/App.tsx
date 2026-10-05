import { useEffect } from "react";
import { Hero } from "./components/Hero";
import { CvSnapshot } from "./components/CvSnapshot";
import { HowItWorks } from "./components/HowItWorks";
import { ContactSection } from "./components/ContactSection";
import { Companion } from "./components/Companion";
import { ChatProvider } from "./chat/ChatProvider";
import { ChatDock } from "./chat/ChatDock";

/** Fade-up any `.reveal` element the first time it scrolls into view. */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function App() {
  useReveal();
  return (
    <ChatProvider>
      <Hero />
      <CvSnapshot />
      <HowItWorks />
      <ContactSection />
      <Companion />
      <ChatDock />
    </ChatProvider>
  );
}

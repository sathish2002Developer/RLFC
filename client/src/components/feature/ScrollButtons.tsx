import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

const ScrollButtons = () => {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(true);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.body.scrollHeight;
    const clientHeight = window.innerHeight;

    if (scrollTop + clientHeight >= scrollHeight - 50) {
      // At bottom
      setShowTop(true);
      setShowBottom(false);
    } else if (scrollTop <= 50) {
      // At top
      setShowTop(false);
      setShowBottom(true);
    } else {
      // In the middle
      setShowTop(true);
      setShowBottom(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-3 z-50">
      {showTop && (
        <button
          onClick={scrollToTop}
          className="bg-[#2879b6] text-white p-3 rounded-full shadow-lg hover:bg-[#1f5f90] transition-opacity duration-300"
          title="Scroll to Top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {showBottom && (
        <button
          onClick={scrollToBottom}
          className="bg-[#7dc244] text-white p-3 rounded-full shadow-lg hover:bg-[#65a333] transition-opacity duration-300"
          title="Scroll to Bottom"
        >
          <ArrowDown className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default ScrollButtons;

import { useEffect, useState } from "react";

export const useLockScroll = ({ isOpen }) => {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const scrollWidth = window.innerWidth - document.body.clientWidth;

      // locks scroll for content behind the modal
      document.body.style.overflowY = "hidden";
      // prevents layout shift when locking scroll
      document.body.style.marginRight = `${scrollWidth}px`;
    } else {
      document.body.style.overflowY = "auto";
      document.body.style.marginRight = "0";
    }
  }, [isOpen]);

  useEffect(() => {
    setMount(true);

    return () => {
      // always unlock scroll on unmount
      document.body.style.overflowY = "auto";
      document.body.style.marginRight = "0";
    };
  }, []);

  return [mount];
};

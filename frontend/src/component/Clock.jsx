import { useEffect, useState } from "react";

export default function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id); // cleanup on unmount
  }, []);

  return <span>{now.toLocaleTimeString("en-IE")}</span>;
}

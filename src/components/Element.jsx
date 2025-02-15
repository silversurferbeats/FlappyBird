import { motion, useCycle } from "framer-motion";

export default function Element() {
  const [animate, cycle] = useCycle(
    { top: "25rem", rotate: 0 },
    { top: "5rem", rotate: 180 }
  );
  return (
    <motion.div
      style={{
        position: "absolute",
        width: 150,
        height: 150,
        borderRadius: 20,
        backgroundColor: "#aaa",
        cursor: "pointer",
      }}
      animate={animate}
      onTap={cycle}
    />
  );
}

import { useEffect, useState } from "react";

const AvailabilityIndicator = () => {
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    setIsNight(hour >= 18 || hour < 8);
  }, []);

  return (
    <div className={isNight ? "available available-night" : "available available-day"}>
      <div className={isNight ? "dot dot-night" : "dot dot-day"}></div>
      <span>{isNight ? "Actuellement indisponible" : "Actuellement disponible"}</span>
    </div>
  );
};

export default AvailabilityIndicator;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowRight,
  faLocationDot,
  faEnvelope,
  faCircleCheck,
  faBuilding,
  faGraduationCap,
  faBars,
  faChevronDown,
  faXmark,
  faCommentDots,
  faArrowUpRightFromSquare,
  faBrain,
  faDatabase,
  faRobot,
  faCode,
  faMobileScreen,
  faDiagramProject,
  faChartLine,
  faCloud,
  faShieldHalved,
  faCoins,
  faBullhorn,
  faLightbulb,
  faRocket,
  faGaugeHigh,
  faChevronLeft,
  faStar,
  faBriefcase,
  faCertificate,
  faLaptopCode,
  faPenRuler,
  faUserGraduate,
  faPhone,
  faAward,
  faPlus,
  faMinus,
  faClock,
  faGlobe,
  faUsers,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faLinkedinIn,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

/**
 * Single icon surface for the app. Icon family matches the main branch:
 * FontAwesome (solid + brands). Keeps sizing/color consistent everywhere.
 */
export const icons = {
  "arrow-right": faArrowRight,
  "arrow-out": faArrowUpRightFromSquare,
  "map-pin": faLocationDot,
  mail: faEnvelope,
  check: faCircleCheck,
  building: faBuilding,
  graduation: faGraduationCap,
  menu: faBars,
  "chevron-down": faChevronDown,
  close: faXmark,
  chat: faCommentDots,
  brain: faBrain,
  database: faDatabase,
  robot: faRobot,
  code: faCode,
  mobile: faMobileScreen,
  pipeline: faDiagramProject,
  chart: faChartLine,
  cloud: faCloud,
  shield: faShieldHalved,
  coins: faCoins,
  bullhorn: faBullhorn,
  idea: faLightbulb,
  rocket: faRocket,
  gauge: faGaugeHigh,
  "chevron-left": faChevronLeft,
  star: faStar,
  briefcase: faBriefcase,
  certificate: faCertificate,
  "laptop-code": faLaptopCode,
  "pen-ruler": faPenRuler,
  graduate: faUserGraduate,
  phone: faPhone,
  award: faAward,
  plus: faPlus,
  minus: faMinus,
  clock: faClock,
  globe: faGlobe,
  users: faUsers,
  eye: faEye,
  "eye-slash": faEyeSlash,
  instagram: faInstagram,
  linkedin: faLinkedinIn,
  whatsapp: faWhatsapp,
} satisfies Record<string, IconDefinition>;

export type IconName = keyof typeof icons;

export function Icon({
  name,
  size = 18,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <FontAwesomeIcon
      icon={icons[name]}
      className={className}
      style={{ width: size, height: size }}
      aria-hidden
    />
  );
}

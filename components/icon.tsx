import {
  Aperture,
  ArrowUpLeft,
  Box,
  Check,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Heart,
  Menu,
  MessageCircle,
  Phone,
  SlidersHorizontal,
  Smile,
  Sparkles,
  UserRound,
  Video,
  X,
  Camera,
  ArrowUp,
  Download,
  Send,
  MoveHorizontal,
} from "lucide-react";
const icons = {
  aperture: Aperture,
  arrow: ArrowUpLeft,
  box: Box,
  check: Check,
  left: ChevronLeft,
  right: ChevronRight,
  graduation: GraduationCap,
  heart: Heart,
  menu: Menu,
  chat: MessageCircle,
  phone: Phone,
  sliders: SlidersHorizontal,
  smile: Smile,
  sparkles: Sparkles,
  user: UserRound,
  video: Video,
  close: X,
  instagram: Camera,
  up: ArrowUp,
  download: Download,
  send: Send,
  compare: MoveHorizontal,
};
export function Icon({
  name,
  size = 20,
  ...props
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const C = icons[name as keyof typeof icons] || Aperture;
  return <C size={size} strokeWidth={1.5} aria-hidden="true" {...props} />;
}

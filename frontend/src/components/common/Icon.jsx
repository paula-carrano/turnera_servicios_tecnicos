import {
  ArrowRight, CalendarDays, CircleCheck, Clock, ExternalLink,
  Inbox, MapPin, Plus, RefreshCw, UserRound, Wrench, X,
} from 'lucide-react';

const icons = {
  arrow: ArrowRight,
  calendar: CalendarDays,
  check: CircleCheck,
  clock: Clock,
  close: X,
  external: ExternalLink,
  inbox: Inbox,
  pin: MapPin,
  plus: Plus,
  refresh: RefreshCw,
  tool: Wrench,
  user: UserRound,
};

const Icon = ({ name, size = 20, ...props }) => {
  const LucideIcon = icons[name] || CalendarDays;
  return <LucideIcon size={size} strokeWidth={1.7} {...props} aria-hidden="true" />;
};

export default Icon;

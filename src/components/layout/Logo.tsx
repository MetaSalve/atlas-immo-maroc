
import { NavLink } from 'react-router-dom';

export const Logo = () => {
  return (
    <NavLink to="/" className="flex items-center gap-2">
      <img
        src="/lovable-uploads/ba556c6a-9c08-49fd-8bec-9255f57322dc.png"
        alt="AlertImmo - logo"
        className="w-8 h-8 rounded-md object-cover border border-skyblue"
        draggable={false}
      />
      <span className="font-bold text-xl text-navy font-playfair">
        Alert<span className="text-skyblue">Immo</span>
      </span>
    </NavLink>
  );
};

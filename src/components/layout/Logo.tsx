
import React from 'react';
import { Link } from 'react-router-dom';

export function Logo() {
  return (
    <Link to="/" className="flex items-center">
      <span className="font-bold text-xl">AlertImmo</span>
    </Link>
  );
}

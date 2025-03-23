import React from 'react';

const Logo = ({ width = '200', height = '200', color = '#A35C7A' }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="100" cy="100" r="100" fill="#FBF5E5" />
      <path
        d="M100 40
        C 80 40, 60 50, 50 70
        C 40 90, 40 110, 50 130
        L 100 100
        L 150 130
        C 160 110, 160 90, 150 70
        C 140 50, 120 40, 100 40
        Z"
        fill={color}
      />
      <path
        d="M100 100
        L 50 130
        L 100 160
        L 150 130
        Z"
        fill={color}
      />
    </svg>
  );
};

export default Logo; 
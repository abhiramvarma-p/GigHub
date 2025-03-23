import React from 'react';

const GigHubLogo = ({ width = "300", height = "300" }) => {
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
        C 60 40, 30 70, 50 120
        L 100 100
        L 150 120
        C 170 70, 140 40, 100 40
        Z"
        fill="#A35C7A"
      />
      <path
        d="M50 120
        L 100 100
        L 150 120
        L 100 160
        Z"
        fill="#A35C7A"
      />
    </svg>
  );
};

export default GigHubLogo; 
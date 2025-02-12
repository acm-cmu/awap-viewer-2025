import React from 'react';

import InfoDisplay from './InfoDisplay';

export type MapInfoBoxProps = {
  redStats: [number, number, number, number];
  blueStats: [number, number, number, number];
};

export default function MapInfoBox(props: MapInfoBoxProps) {
  const { redStats, blueStats } = props;

  return (
    <div className="map-info-box">
      <InfoDisplay side="Blue" playerStats={blueStats} />
      <InfoDisplay side="Red" playerStats={redStats} />
    </div>
  );
}

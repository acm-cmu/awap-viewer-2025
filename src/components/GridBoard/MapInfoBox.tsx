import React from 'react';

import InfoDisplay from './InfoDisplay';

export type MapInfoBoxProps = {
  redStats: [];
  blueStats: [];
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

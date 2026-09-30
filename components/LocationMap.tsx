'use client';

import {useState} from 'react';
import {site} from '@/content/site';

const streets = [
  {number:42,y:70}, {number:40,y:150}, {number:39,y:190},
  {number:38,y:230}, {number:37,y:270}, {number:35,y:350},
  {number:34,y:390}, {number:33,y:430}, {number:32,y:470}, {number:31,y:510},
];

export default function LocationMap(){
  const [interactive,setInteractive] = useState(false);

  return <div className="map-frame">
    <div className="map-toolbar">
      <span className="map-district">MIDTOWN, NYC</span>
      <div className="map-switch" role="group" aria-label="Map view">
        <button type="button" aria-pressed={!interactive} aria-controls="location-map-view" onClick={()=>setInteractive(false)}>STREET GUIDE</button>
        <button type="button" aria-pressed={interactive} aria-controls="location-map-view" onClick={()=>setInteractive(true)}>LIVE MAP</button>
      </div>
    </div>
    <div className="map-canvas" id="location-map-view">
      {interactive ? <iframe src={site.map} title="Zen Ramen and Sushi at 150 West 36th Street, New York" referrerPolicy="no-referrer-when-downgrade"/> :
        <div className="map-guide">
          <svg viewBox="0 0 640 540" preserveAspectRatio="none" role="img" aria-labelledby="map-guide-title" aria-describedby="map-guide-description">
            <title id="map-guide-title">Midtown street guide to Zen Ramen &amp; Sushi</title>
            <desc id="map-guide-description">150 West 36th Street, on the south side between Seventh Avenue and Broadway. Bryant Park is to the northeast, Penn Station to the southwest, and Herald Square to the southeast. Illustrative guide, not to scale.</desc>
            <rect className="map-blocks" width="640" height="540"/>
            <g className="map-streets">
              {streets.map(street=><path key={street.number} d={`M0 ${street.y}H640`}/>)}
              <path d="M0 110H450M620 110H640M70 0V540M240 0V540M450 0V540M620 0V540M194 0L548 540"/>
            </g>
            <path className="map-36th-street" d="M0 310H640"/>
            <path className="map-36th-center" d="M0 310H640"/>
            <rect className="map-park" x="463" y="79" width="144" height="62" rx="2"/>
            <path className="map-park-path" d="M472 89H598V131H472ZM479 89L590 131M590 89L479 131"/>
            <path className="map-park" d="M458 403L470 424H458Z"/>
            <rect className="map-station" x="83" y="442" width="144" height="57" rx="2"/>
            <g className="map-street-labels">
              {streets.filter(street=>[42,40,38,34].includes(street.number)).map(street=><text key={street.number} x="101" y={street.y+5}>W {street.number}{street.number===42 ? 'ND' : 'TH'} ST</text>)}
              <text className="map-street-highlight" x="100" y="316">W 36TH ST</text>
              <text transform="translate(75 236) rotate(-90)">8TH AVE</text>
              <text transform="translate(245 228) rotate(-90)">7TH AVE</text>
              <text transform="translate(455 232) rotate(-90)">6TH AVE</text>
              <text transform="translate(625 234) rotate(-90)">5TH AVE</text>
              <text transform="translate(329 165) rotate(57)">BROADWAY</text>
            </g>
            <g className="map-landmarks">
              <text x="535" y="117" textAnchor="middle">Bryant Park</text>
              <text x="155" y="477" textAnchor="middle">Penn Station</text>
              <path className="map-landmark-leader" d="M465 414H487"/>
              <text x="494" y="410"><tspan x="494">Herald</tspan><tspan x="494" dy="22">Square</tspan></text>
            </g>
            {/* The pin tip marks the south side of W 36th, between 7th and Broadway. */}
            <g className="map-restaurant">
              <circle className="map-pin-halo" cx="329" cy="319" r="10"/>
              <path className="map-pin" d="M329 267c-11 0-19.5 8.5-19.5 19 0 14 19.5 32.5 19.5 32.5s19.5-18.5 19.5-32.5c0-10.5-8.5-19-19.5-19Z"/>
              <circle className="map-pin-center" cx="329" cy="286" r="6.5"/>
              <rect className="map-label-paper" x="355" y="254" width="252" height="47" rx="2"/>
              <text className="map-brand-label" x="365" y="273">ZEN RAMEN &amp; SUSHI</text>
              <text className="map-address-label" x="365" y="294">150 W 36TH ST</text>
            </g>
          </svg>
          <span className="map-guide-caption">AREA GUIDE · NOT TO SCALE</span>
        </div>}
    </div>
    <a href={site.directions} className="map-note" target="_blank" rel="noopener noreferrer">SEE YOU ON 36TH STREET <span aria-hidden="true">↗</span></a>
  </div>;
}

import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Data and credits' };

export default function About() {
  return (
    <main className="wrap" style={{ paddingTop: 40, maxWidth: 760 }}>
      <h1>Where our data comes from</h1>
      <p>Explore Pune lists places from open sources. Names, locations and categories can be imported in bulk. Opening hours and ticket prices cannot, so every place shows how much has been checked.</p>
      <h2>Reliability labels</h2>
      <p><span className="tier verified">Verified</span> Hours and fees were checked against an official source on the date shown.</p>
      <p><span className="tier enriched">Details from public sources</span> A description or photo from Wikipedia or Wikimedia Commons, with credit. Hours and fees are not confirmed.</p>
      <p><span className="tier">Hours and fees not verified</span> Listed from map data only. Please check with the venue before you travel.</p>
      <h2>Credits</h2>
      <ul>
        <li>Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, available under the Open Database Licence (ODbL).</li>
        <li>Text from Wikipedia is available under CC BY-SA, and each page links to its source.</li>
        <li>Photos from Wikimedia Commons show their author and licence on the photo.</li>
      </ul>
      <h2>Trip planner</h2>
      <p>Travel times are estimates based on straight-line distance, not live traffic. Treat plans as a starting point.</p>
      <h2>Privacy</h2>
      <p>The planner uses the start point you choose for that request only. Chat questions are sent to an AI service together with matching place records, never your name or account details.</p>
    </main>
  );
}

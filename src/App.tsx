import { useState } from 'react'
import './App.css'
import { Song, TabType } from './types'
import { MetadataInput } from './components/MetadataInput';
import MapEditor from './components/MapEditor';
import devSong from '../public/song.json';

export default function App() {
  const [song, setSong] = useState<Song>(devSong);
  const [tab, setTab] = useState<TabType>("Mapping");
  const [ogg, setOgg] = useState<File>();
  // if (!song) {
  //   return ogg ? <MetadataInput ogg={ogg} setSong={setSong} /> :
  //     <div>
  //       <h1>Upload an OGG File</h1>
  //       <h2>For starting a project</h2>
  //       <input
  //         type="file"
  //         accept=".ogg"
  //         onChange={({ target: { files } }) => setOgg(files?.[0])}
  //       />
  //       <h1>Upload a Project JSON</h1>
  //       <h2>For continuing an existing project</h2>
  //       <input
  //         type="file"
  //         accept=".json"
  //         onChange={async ({ target: { files } }) => files && setSong(JSON.parse(await files?.[0].text()) as Song)}
  //       />
  //     </div>
  // }
  return <>
    <div>
      {["Mapping", "Metadata"].map((tabOption) =>
        <button
          key={tabOption}
          onClick={() => setTab(tabOption as TabType)}
          disabled={tab == tabOption}
          className={tab == tabOption ? "bold" : ""}
        >{tabOption}
        </button>
      )}
    </div>
    {(() => {
      switch (tab) {
        case "Mapping":
          return <MapEditor song={song} />
        case "Metadata":
          return <p>idk what to put here</p>
      }
    })()}
  </>
}
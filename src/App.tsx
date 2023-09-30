import { useState } from 'react'
import './App.css'
import { Song, TabType, tabTypes } from './types'
import MapEditor from './components/MapEditor';
import devSong from './song.json'
// import { MetadataInput } from './components/MetadataInput';

export default function App() {
  const [song, setSong] = useState<Song | undefined>();
  const [tab, setTab] = useState<TabType>("Mapping");
  const [ogg, setOgg] = useState<File>();
  if (!song) {
    // return ogg ? <MetadataInput ogg={ogg} setSong={setSong} /> :
    return <div>
        <h1>Upload an OGG File</h1>
        <h2>For starting a project</h2>
        <input
          type="file"
          accept=".ogg"
          onChange={({ target: { files } }) => {
            setOgg(files?.[0])
            setSong(devSong)
          }}
        />
        <h1>Upload a Project JSON</h1>
        <h2>For continuing an existing project</h2>
        <input
          type="file"
          accept=".json"
          onChange={async ({ target: { files } }) => files && setSong(JSON.parse(await files?.[0].text()) as Song)}
        />
      </div>
  }
  if (!ogg) return <h1>kys</h1>
  return <>
    <div>
      {tabTypes.map((tabOption) =>
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
          return <MapEditor song={song} ogg={ogg} />
        case "Metadata":
          return <p>idk what to put here</p>
      }
    })()}
  </>
}
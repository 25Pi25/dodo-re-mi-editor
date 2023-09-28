import { useState } from 'react'
import './App.css'
import { Song } from './types'
import { MetadataInput } from './MetadataInput';

export default function App() {
  const [song, setSong] = useState<Song>();
  const [ogg, setOgg] = useState<File>();
  if (!song && !ogg) return <>
    <div>
      <h1>Upload an OGG File</h1>
      <input
        type="file"
        accept=".ogg"
        onChange={({ target: { files } }) => setOgg(files?.[0])}
      />
    </div>
  </>
  if (!song && ogg) return <MetadataInput ogg={ogg} setSong={setSong}/>
  return <>hi</>
}
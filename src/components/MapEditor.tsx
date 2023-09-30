import { Component } from 'react';
import "./MapEditor.css"
import { Stage, Layer, Rect, Circle } from 'react-konva';
import { EditorBeatNote, Song } from '../types';
import { KonvaEventObject } from 'konva/lib/Node';
import BeatMarkers from './BeatMarkers';

interface Props {
  song: Song
  ogg: File
}
interface State {
  scroll: number
  precision: number
  beatGap: number
  bpm: number
  notes: EditorBeatNote[]
  hover?: [number, number]
  playbackMs?: number
}

export default class MapEditor extends Component<Props, State> {
  public song: Song;
  public ogg: File;
  public LINES_BORDER = 200;
  public WIDTH = 800;
  public HEIGHT = 600;
  state: State = {
    scroll: 600,
    precision: 4,
    beatGap: 200,
    bpm: 91,
    notes: []
  }
  holding = {
    alt: false
  }

  constructor(props: Props) {
    super(props);
    const { song, ogg } = props;
    this.song = song;
    this.ogg = ogg;
  }

  handleAltKey(e: KeyboardEvent, changeAltTo: boolean) {
    if (e.key == " " && changeAltTo) {
      this.playtestSong()
      return;
    }
    if (e.key != "Alt") return;
    this.holding.alt = changeAltTo;
    e.preventDefault();
  }

  // TODO: reorganize this because event listeners are a bitch
  func1 = (e: KeyboardEvent) => this.handleAltKey(e, true);
  func2 = () => this.holding.alt = false;
  func3 = (e: KeyboardEvent) => this.handleAltKey(e, false);
  componentDidMount() {
    document.addEventListener("keydown", this.func1)
    document.addEventListener("blur", this.func2)
    document.addEventListener("keyup", this.func3)
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.func1)
    document.removeEventListener("blur", this.func2)
    document.removeEventListener("keyup", this.func3)
  }

  handleWheel({ evt: { deltaY } }: KonvaEventObject<WheelEvent>) {
    if (this.holding.alt) {
      const isNegative = deltaY < 0;
      const beats = (this.state.scroll - (this.HEIGHT / 2)) / this.state.beatGap
      const newBeatGap = Math.min(Math.max(1, this.state.beatGap * (isNegative ? 2 : 0.5)), this.HEIGHT / 2)
      this.setState(() => ({
        beatGap: newBeatGap,
        scroll: beats * newBeatGap + (this.HEIGHT / 2)
      }))
      return;
    }
    this.setState(({ scroll }) => ({
      scroll: Math.min(Math.max(0, scroll - deltaY), this.getTotalBeats() * this.state.beatGap + 500)
    }))
  }

  getYFromBeats = (beats: number) => -this.state.beatGap * beats + this.state.scroll;

  getTotalBeats = (ms = this.song.duration) => ms * this.state.bpm / 60_000;

  getDurationMs = (beats: number) => beats / this.state.bpm * 60_000;

  addNote(beat: number, lane: number) {
    const sameBeatSameLane = this.state.notes.findIndex(note => note.beat == beat && note.lane == lane);
    if (sameBeatSameLane != -1) {
      this.setState(({ notes }) => ({ notes: notes.filter((_, i) => i != sameBeatSameLane) }));
      return;
    }
    const newBeat: EditorBeatNote = {
      beat,
      lane,
      duration: 135,
      note: 37,
    }
    this.setState(({ notes }) => ({ notes: [...notes, newBeat] }))
  }

  playtestSong() {
    if (this.state.playbackMs) {
      this.setState({ playbackMs: undefined });
      return;
    }
    const fr = new FileReader();
    fr.onload = e => {
      if (!e.target?.result) return;
      this.setState(({ scroll }) => ({ playbackMs: Math.max(scroll - 800, 0) }));
      const audioBlob = new Blob([e.target.result], { type: this.ogg.type });
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audio.play()
      requestAnimationFrame(delta => this.playbackFrame(delta, delta, audio))
    }
    fr.readAsArrayBuffer(this.ogg);
  }

  playbackFrame(delta: number, offset: number, audio: HTMLAudioElement, prevDelta = 0) {
    if (this.state.playbackMs == undefined) {
      audio.pause();
      return;
    }
    this.setState({ playbackMs: delta - offset })
    requestAnimationFrame(newDelta => this.playbackFrame(newDelta, offset, audio, delta))
    this.state.notes
      .filter(note => prevDelta - offset < this.getDurationMs(note.beat) && delta - offset >= this.getDurationMs(note.beat))
      .forEach(({ beat }, i) => console.log({ noteNum: i, beat }))
  }

  render() {
    return <div className='map'>
      <Stage width={this.WIDTH} height={this.HEIGHT} onWheel={e => this.handleWheel(e)}>
        <Layer>
          {...Array.from({ length: 5 }, (_, i) =>
            <Rect
              key={i}
              x={this.LINES_BORDER + (this.WIDTH - this.LINES_BORDER * 2) / 4 * i}
              width={3}
              height={this.HEIGHT}
              offset={{ x: 1.5, y: 0 }}
              fill="white"
            />
          )}
        </Layer>
        <Layer>
          <BeatMarkers editor={this} />
          {...this.state.notes.map(({ beat, lane }, i) => {
            return <Circle
              key={i}
              x={this.LINES_BORDER + (this.WIDTH - this.LINES_BORDER * 2) * lane / 4}
              y={this.getYFromBeats(beat)}
              width={(this.WIDTH - this.LINES_BORDER) / 6}
              height={this.state.beatGap / 4}
              fill="red"
              listening={false}
            />
          })}
        </Layer>
      </Stage>
    </div>
  }
}
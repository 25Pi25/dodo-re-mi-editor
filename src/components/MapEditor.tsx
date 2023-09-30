import { Component } from 'react';
import "./MapEditor.css"
import { Stage, Layer, Rect, Circle } from 'react-konva';
import { EditorBeatNote, Song } from '../types';
import { KonvaEventObject } from 'konva/lib/Node';
import BeatMarkers from './BeatMarkers';

interface Props {
  song: Song
}
interface State {
  scroll: number
  precision: number
  beatGap: number
  bpm: number
  notes: EditorBeatNote[]
  hover?: [number, number]
}
export default class MapEditor extends Component<Props, State> {
  public song: Song;
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
    const { song } = props;
    this.song = song;
  }

  handleAltKey(e: KeyboardEvent, changeAltTo: boolean) {
    if (e.key != "Alt") return;
    this.holding.alt = changeAltTo;
    e.preventDefault();
  }

  componentDidMount() {
    document.addEventListener("keydown", e => this.handleAltKey(e, true))
    document.addEventListener("keyup", e => this.handleAltKey(e, false))
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", e => this.handleAltKey(e, true))
    document.removeEventListener("keyup", e => this.handleAltKey(e, false))
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

  getTotalBeats = (ms = this.song.duration) => ms * this.state.bpm / 60_000;

  getDurationMs = (beats: number) => beats / this.state.bpm * 60_000;

  addNote(beat: number, lane: number) {
    console.log(this.state.notes)
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
              y={-this.state.beatGap * beat + this.state.scroll}
              width={(this.WIDTH - this.LINES_BORDER) / 6}
              height={this.state.beatGap / 4}
              fill="red"
              listening={false}
            />
          })

          }
        </Layer>
      </Stage>
    </div>
  }
}
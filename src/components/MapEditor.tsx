import { Component } from 'react';
import "./MapEditor.css"
import { Stage, Layer, Rect, Circle } from 'react-konva';
import { Song } from '../types';
import { KonvaEventObject } from 'konva/lib/Node';

interface Props {
    song: Song
}
interface State {
    scroll: number
}
export default class MapEditor extends Component<Props, State> {
    public song: Song;
    public LINES_BORDER = 200;
    public WIDTH = 800;
    public HEIGHT = 600;
    state: State = {
        scroll: 0
    }

    constructor(props: Props) {
        super(props);
        const { song } = props;
        this.song = song;
    }
    render() {
        return <div className='map'>
            <Stage width={this.WIDTH} height={this.HEIGHT} onWheel={e => this.handleWheel(e)}>
                <Layer>
                    {...Array.from({ length: 5 }, (_, i) => {
                        return <Rect
                            key={i}
                            x={this.LINES_BORDER + (this.WIDTH - this.LINES_BORDER * 2) / 4 * i}
                            width={3}
                            height={this.HEIGHT}
                            offset={{ x: 1.5, y: 0 }}
                            fill="white"
                        />
                    })}
                </Layer>
                <Layer>
                    <Circle
                        x={200}
                        y={this.state.scroll}
                        width={50}
                        height={50}
                        fill="red"
                    />
                    <Circle
                        x={400}
                        y={this.state.scroll + 200}
                        width={50}
                        height={50}
                        fill="red"
                    />
                </Layer>
            </Stage>
        </div>
    }
    handleWheel({ evt: { deltaY } }: KonvaEventObject<WheelEvent>) {
        this.setState(({ scroll }) => ({ scroll: scroll - deltaY }))
    }
}
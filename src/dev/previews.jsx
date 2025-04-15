import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import RoomResult from "../Component/common/RoomResult";
import Homepage from "../Component/Home/homepage";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/RoomResult">
                <RoomResult/>
            </ComponentPreview>
            <ComponentPreview path="/Homepage">
                <Homepage/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews
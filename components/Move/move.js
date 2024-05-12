import store from "@/app/store";
import { updateElement } from "../ElementManipulation/Element";
import { GlobalProps } from "../Redux/GlobalProps";
import { setElement } from "../Redux/features/elementSlice";

export const move = (event, elements) => {
    const selectedElement = store.getState().selectedElement.value;
    if (!selectedElement) {
        return;
    }

    const { id, x1, x2, y1, y2, type, offSetX, offSetY, rectCoordinatesOffsetX, rectCoordinatesOffsetY, text, points } = selectedElement;

    if (type === 'image') {
        const width = x2 - x1;
        const height = y2 - y1;

        const tempNewArray = [...elements];
        const newId = parseInt(id.split("#")[1]);

        tempNewArray[newId] = {
            ...tempNewArray[newId],
            x1: event.clientX - offSetX,
            y1: event.clientY - offSetY,
            x2: event.clientX - offSetX + width,
            y2: event.clientY - offSetY + height
        };

        store.dispatch(setElement([tempNewArray, true, id.split("#")[0]]));

        const roomId = GlobalProps.room;
        if (roomId) {
            const updatedElement = tempNewArray[newId];
            const key = id.split("#")[0];
            GlobalProps.socket.emit("render-elements", { updatedElement, roomId, key });
        }
    } else {
        if (type !== 'pencil') {
            const width = x2 - x1;
            const height = y2 - y1;
            updateElement(id, event.clientX - offSetX, event.clientY - offSetY, event.clientX - offSetX + width, event.clientY - offSetY + height, type, { text: text });
        } else {
            const newPoints = points.map((point, index) => ({
                x: event.clientX - offSetX[index],
                y: event.clientY - offSetY[index]
            }));

            const tempNewArray = [...elements];
            const width = x2 - x1;
            const height = y2 - y1;
            const newId = parseInt(id.split("#")[1]);

            tempNewArray[newId] = {
                ...tempNewArray[newId],
                points: newPoints,
                x1: event.clientX - rectCoordinatesOffsetX,
                y1: event.clientY - rectCoordinatesOffsetY,
                x2: event.clientX - rectCoordinatesOffsetX + width,
                y2: event.clientY - rectCoordinatesOffsetY + height
            };

            store.dispatch(setElement([tempNewArray, true, id.split("#")[0]]));

            const roomId = GlobalProps.room;
            if (roomId) {
                const updatedElement = tempNewArray[newId];
                const key = id.split("#")[0];
                GlobalProps.socket.emit("render-elements", { updatedElement, roomId, key });
            }
        }
    }
}

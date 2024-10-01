export default function RenderRoom({
    params,
}: {
    params: { roomcode: string };
}) {
    return (
        <div>
            <h1>Room Number: {params.roomcode}</h1>
        </div>
    );
}

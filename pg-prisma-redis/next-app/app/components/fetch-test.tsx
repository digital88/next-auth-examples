import FetchApi from "./fetch-api"

export default function () {
    return <>
        <FetchApi route="/api/public-data"></FetchApi>
        <FetchApi route="/api/private-data"></FetchApi>
    </>
}
import * as React from "react";
import { makeProvider } from "../../components/provider";

const init = async () => {
    makeProvider()
}
const PackInit: React.FC = () => {
    React.useEffect(() => {
        init()
    }, [])
    return (
        <>

        </>
    );
};

export default PackInit;

import { Helmet } from "react-helmet";

const Title = ({ title }: { title: string }) => (
    <Helmet>
        <title>{title} - OpenMusic</title>
    </Helmet>
)

export default Title
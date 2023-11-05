import { metadata } from "@/app/layout";
import Home from "@/pages/Home";

export default function page() {

    metadata.title = 'Home';
    metadata.description = 'Home page';

    return (
        <Home />
    );
}

import { Link } from "react-router-dom";

export default function NotFound () {
    return (
        <div className="w-[60%] py-20 mx-auto">
            <h2 className="text-5xl mb-2 font-bold">Page Not Found</h2>
            <p className="text-sm text-gray-500">Are you lost? Do you wish to return to the homepage?</p>
            <Link to="/" className="py-2 px-5 bg-blue-500 text-white inline-block my-2"> Go to Home Page
            </Link>
        </div>
    )
}

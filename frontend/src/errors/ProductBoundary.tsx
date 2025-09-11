import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export default function ProductBoundary() {
    const error = useRouteError();
    if (isRouteErrorResponse(error)) {
        switch (error.status) {
            case 404:
                return (
                    <section className="size-full flex justify-center items-center">
                        <div className="text-center space-y-4 p-2">
                            <h2 className="text-6xl lg:text-8xl text-indigo-500">
                                404
                            </h2>
                            <p className="text-white text-md lg:text-4xl">
                                Oops! Product not Found
                            </p>
                            <p className="text-white text-xs lg:text-md ">
                                {error.data}
                            </p>
                        </div>
                    </section>
                );
            default:
                return (
                    <section className="size-full flex justify-center items-center">
                        <div className="text-center space-y-4 p-2">
                            <h2 className="text-6xl lg:text-8xl text-indigo-500">
                                500
                            </h2>
                            <p className="text-white text-md lg:text-4xl">
                                Internal server error
                            </p>
                        </div>
                    </section>
                );
        }
    }
}

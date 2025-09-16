import Page404 from '../pages/Page404';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
export default function ErrorBoundary() {
    const error = useRouteError();
    if (isRouteErrorResponse(error)) {
        switch (error.status) {
            case 404:
                return (
                    <Page404
                        message="Oops! Page not Found"
                        error={error.data}
                    />
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

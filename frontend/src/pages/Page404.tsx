export default function Page404({
    message,
    error,
}: {
    message: string;
    error: string;
}) {
    return (
        <section className="size-full flex justify-center items-center">
            <div className="text-center space-y-4 p-2">
                <h2 className="text-6xl lg:text-8xl text-indigo-500">404</h2>
                <p className="text-white text-md lg:text-4xl">{message}</p>
                <p className="text-white text-xs lg:text-md ">{error}</p>
            </div>
        </section>
    );
}

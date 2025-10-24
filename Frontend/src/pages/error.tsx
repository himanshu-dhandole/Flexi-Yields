import DefaultLayout from "@/layouts/default";

type ErrorPageProps = {
    statusCode?: number;
    title?: string;
    message?: string;
};

export default function ErrorPage({
    statusCode = 404,
    title = "Page Not Found",
    message = "The page you are looking for does not exist. Please check the URL or go back to the home page.",
}: ErrorPageProps): JSX.Element {
    return (
        <DefaultLayout>
        <main className="pt-30 flex items-center justify-center px-6">
            <div className="max-w-xl w-full bg-white dark:bg-gray-950 rounded-2xl p-8 shadow-lg ring-1 ring-gray-900/5 dark:ring-white/5">
                <div className="flex items-center gap-6">
                    <div className="flex-none">
                        <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                            <svg
                                className="w-10 h-10 text-indigo-600 dark:text-indigo-300"
                                xmlns="http://www.w3.org/1000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                                {statusCode}
                            </span>
                            <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                                {title}
                            </h1>
                        </div>

                        <p
                            role="status"
                            className="mt-3 text-sm text-gray-600 dark:text-gray-300"
                        >
                            {message}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <a
                                href="/"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white text-sm font-medium transition"
                            >
                                Go to Home
                            </a>

                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            >
                                Go Back
                            </button>

                            <a
                                href="/"
                                onClick={(e) => {
                                    // Example: preserve for extension to open support or report page
                                }}
                                className="ml-auto text-xs text-gray-500 dark:text-gray-400"
                            >
                                Need help? Contact support
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-xs text-gray-400 dark:text-gray-500">
                    Tip: Try refreshing the page or clearing your browser cache.
                </div>
            </div>
        </main>
        </DefaultLayout>
    );
}
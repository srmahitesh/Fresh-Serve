function NotFound() {
  
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6 py-24 ">
      <div className="text-center">
        <p className="text-lg font-semibold text-indigo-600">404</p>
        <h1 className="mt-4 text-4xl font-bold text-gray-900 sm:text-6xl">Page Not Found</h1>
        <p className="mt-6 text-lg text-gray-600">
          Sorry, the page you are looking for does not exist.
        </p>
        <div className="mt-8 flex justify-center gap-x-4">
          <a
            href="/"
            className="rounded-md bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:bg-indigo-500"
          >
            Go Home
          </a>
          <a href="/contact" className="text-sm font-medium text-indigo-600 hover:underline">
            Contact Support
          </a>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
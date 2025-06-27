function NotFound() {
  
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6 py-24 ">
      <div className="text-center">
        <div className="mt-8 flex justify-center gap-x-4">
          <a
            href="/"
            className="rounded-md bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:bg-indigo-500"
          >
            Go Home
          </a>
            You are viewing the error because Backend Server is turnedoff due to non usage to save carbon footprints. Please contact <a href="mailto:kashyaphitesh456@gmail.com">kashyaphitesh456@gmail.com</a> or <a href="tel:+919816567367">+91-9816567367</a> to inform & turnon the MySql server. Thank You.
        </div>
      </div>
    </main>
  );
}

export default NotFound;
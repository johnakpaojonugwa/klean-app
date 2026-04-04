import React from "react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
        <p className="mt-2 text-gray-600">You do not have access to this page.</p>
        <div className="mt-4">
          <Link to="/" className="text-indigo-600">Go home</Link>
        </div>
      </div>
    </div>
  );
}

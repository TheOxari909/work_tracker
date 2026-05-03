import { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const provider = new GoogleAuthProvider();

export const LogIn = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

  const logInWithGoogle = () => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // @ts-expect-error
        const token = credential.accessToken;
        // The signed-in user info.
        // @ts-expect-error
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        // @ts-expect-error
        const errorCode = error.code;
        // @ts-expect-error
        const errorMessage = error.message;
        // The email of the user's account used.
        // @ts-expect-error
        const email = error.customData.email;
        // The AuthCredential type that was used.
        // @ts-expect-error
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <>
      <button
        onClick={toggleModal}
        className="text-xs font-bold text-white hover:bg-blue-600 bg-blue-500 px-4 py-3 rounded transition-colors"
      >
        Kirajudu
      </button>{' '}
      <div
        className={`${
          isOpen ? 'flex' : 'hidden'
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal h-full bg-black/20`}
      >
        <div
          className="relative p-4 w-full max-w-2xl max-h-full bg-white rounded-lg shadow"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 text-center">
            <button
              onClick={logInWithGoogle}
              className="mt-4 text-white bg-blue-500 hover:bg-blue-700 px-5 py-2.5 rounded-lg"
            >
              Kiraudu
            </button>
            <button
              onClick={toggleModal}
              className="mt-4 text-white bg-red-600 hover:bg-red-800 px-5 py-2.5 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

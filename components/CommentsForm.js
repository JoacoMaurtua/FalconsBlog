import React, { useRef, useState, useEffect } from 'react';

import { submitComment } from '../services/index';

const CommentsForm = ({ slug }) => {
  const [error, setError] = useState(false);
  const [localStorage, setLocalStorage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  //Uso de useRef: No necesitamos mantener estos valores en el estado porque simplemente
  // queremos leer el valor del campo de entrada y luego enviarlo a Graphql CMS
  const commentEl = useRef();
  const nameEl = useRef();
  const emailEl = useRef();
  const storeDataEl = useRef();

  //limpiar el local storage:
  useEffect(()=>{
    nameEl.current.value = window.localStorage.getItem('name');
    emailEl.current.value = window.localStorage.getItem('email');
  },[])

  const handleCommentSubmit =()=>{
    setError(false);

    const { value:comment } = commentEl.current;
    const { value:name } = nameEl.current;
    const { value:email } = emailEl.current;
    const { checked:storeData } = storeDataEl.current;

    if(!comment || !name || !email){
      setError(true);
      return;
    }

    const commentObject = { name,email,comment,slug};

    //Almacenar o no los datos en local storage:
    if(storeData){
      window.localStorage.setItem('name', name);
      window.localStorage.setItem('email',email);
    }else{
      window.localStorage.removeItem('name',name);
      window.localStorage.removeItem('email',email)
    }

    submitComment(commentObject)
        .then((res)=>{
          setShowSuccessMessage(true);

          setTimeout(()=>{
            setShowSuccessMessage(false);
          })
        },3000)
        
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
      <h3 className="text-xl mb-8 font-semibold border-b pb-4">¡Déjanos un comentario!</h3>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <textarea 
          ref={commentEl} 
          className="p-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700"
          placeholder="Comentario"
          name="comment"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          ref={nameEl}
          className="p-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700"
          placeholder="Nombre"
          name="name"
        />
        <input
          type="text"
          ref={emailEl}
          className="p-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700"
          placeholder="Email"
          name="email"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <input ref={storeDataEl} type="checkbox" id="storeData" name="storeData" value="true"/>
          <label className="text-gray-500 cursor-pointer ml-2" htmlFor="storeData">Guarda mi correo electrónico y mi nombre para la próxima vez que comente</label>
        </div>
      </div>
      {error && <p className="text-xs text-red-500">Todos los campos son requeridos!</p>}
      <div className="mt-8">
        <button 
          type="button" 
          onClick={handleCommentSubmit}
          className="transition duration-500 ease hover:bg-indigo-900 inline-block bg-pink-600 text-lg rounded-full text-white px-8 py-3 cursor-pointer"
          >
          Enviar Comentario
        </button>
        {showSuccessMessage && <span className="text-xl float-right font-semibold mt-3 text-green-500">Comentario Enviado!</span>}
      </div>
    </div>
  );
};

export default CommentsForm;

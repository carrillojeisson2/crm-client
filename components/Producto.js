import React from "react";
import Swal from 'sweetalert2'
import {gql, useMutation} from '@apollo/client';
import Router from 'next/router';

const ELIMINAR_PRODUCTO = gql`
    mutation eliminarProducto($id: ID!) {
        eliminarProducto(id: $id)
    }
`

const OBTENER_PRODUCTOS = gql`
    query obtenerProductos {
      obtenerProductos {
        id
        nombre
        precio
        existencia
        creado
      }
    }
`


const Producto = ({ producto }) => {
  const { nombre, precio, existencia, id } = producto;

//   mutation para elimiar productos
const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
    update(cache) {
        const {obtenerProductos} = cache.readQuery({
            query: OBTENER_PRODUCTOS,
        });

        cache.writeQuery({
            query: OBTENER_PRODUCTOS,
            data: {
                obtenerProductos: obtenerProductos.filter(productoActual => productoActual.id !== id) 
            }
        })
    }  
})

const confirmarEliminarProducto = () => {

    Swal.fire({
        title: '¿Desea elminar este producto?',
        text: "Esta acción no se puede deshacer!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Eliminar!',
        cancelButtonText: 'No, Cancelar'
      }).then( async(result) => {
        if (result.value) {

          try {
            // elimanr producto de db
            const {data} = await eliminarProducto({
                variables: {
                    id
                }
            })

            // console.log(data)
            Swal.fire(
                'Correcto',
                data.eliminarProducto,
                'success'
            )
          } catch (error) {
            console.log(error)
          }

        }
      })

}

const EditarProducto = () => {
        Router.push({
            pathname: '/editarproducto/[id]',
            query: {id}
        })
}

  return (
    <tr>
      <td className="border px-4 py-2">{nombre}</td>
      <td className="border px-4 py-2">{existencia}</td>
      <td className="border px-4 py-2">${precio}</td>

      <td className="border px-4 py-2">
        <button
          type="button"
          className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
          onClick={() => confirmarEliminarProducto()}
        >
          eliminar
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </button>
      </td>

      <td className="border px-4 py-2">
        <button
          type="button"
          className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
          onClick={() => EditarProducto()}
        >
          Editar
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            ></path>
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default Producto;

import React from 'react'
import Swal from 'sweetalert2'
import {gql, useMutation} from '@apollo/client';
import Router from 'next/router';

const ELIMINAR_CLIENTE = gql `
    mutation eliminarCliente($id: ID!) {
        eliminarCliente(id:$id)
    }
`;

const OBTENER_CLIENTES_USUARIO = gql `
  query obtenerClintesVendedor {
    obtenerClintesVendedor {
      id
      nombre
      apellido
      empresa
      email
    }
  }
`;

const Cliente = ({cliente}) => {



    // mutation para eliminar cliente
    const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE, {
        update(cache) {


            const {obtenerClintesVendedor} = cache.readQuery({query: OBTENER_CLIENTES_USUARIO });

            // reescribir el cache
            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data: {
                    obtenerClintesVendedor : obtenerClintesVendedor.filter(clienteActual => clienteActual.id !== id)
                }
            })
        }
    })


    const {nombre, apellido, empresa, email, id} = cliente

    const confirmarEliminarCliente = () => {
        Swal.fire({
            title: '¿Desea elminar este cliente?',
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
                    // eliminar por id
                    const {data} = await eliminarCliente({
                        variables: {
                            id
                        }
                    })
                    // console.log(data)
                    // mostrar una alerta
                    Swal.fire(
                      'Eliminado!',
                      data.eliminarCliente,
                      'success'
                    )
                } catch (error) {
                    console.log(error)
                }

            }
          })
    }

    const EditarCliente = () => {
        Router.push({
            pathname: "/editarcliente/[id]",
            query: {id}
        })
    }

    return (  
        <tr >
                    <td className='border px-4 py-2'>{nombre}  {apellido}</td>
                    <td className='border px-4 py-2'>{empresa} </td>
                    <td className='border px-4 py-2'>{email} </td>
                    <td className='border px-4 py-2'>
                        <button
                            type="button"
                            className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                            onClick={() => confirmarEliminarCliente()}
                        >
                            eliminar
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </button>
                    </td>

                    <td className='border px-4 py-2'>
                        <button
                            type="button"
                            className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                            onClick={() => EditarCliente()}
                        >
                            Editar
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        </button>
                    </td>
                  </tr>
    );
}
 
export default Cliente;
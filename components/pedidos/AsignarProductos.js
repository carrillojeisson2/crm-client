import React, {useState, useEffect, useContext} from 'react';
import PedidoContext from '../../context/pedidos/PedidoContext';

import Select from 'react-select'
import {gql, useQuery} from '@apollo/client';

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


const AsignarProductos = () => {

    // state local del componente
    const [productos, setProductos] = useState([])

    // context de pedidos
    const pedidoContext = useContext(PedidoContext)
    const {agregarProducto} = pedidoContext;

    // consulta a db
    const {data, loading, error} = useQuery(OBTENER_PRODUCTOS)

    // console.log(data)
    // console.log(loading)
    // console.log(error)

    useEffect(() => {
    //   console.log(productos)
    agregarProducto(productos)
    }, [productos])
    

    const seleccionarProducto = (producto) => {
        setProductos(producto)
    }

    if(loading) return null;
    const {obtenerProductos} = data;


    return (
        <>
        <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">2. - Asignar  Producto</p>
        <Select
          className="mt-3"
          options={obtenerProductos}
          isMulti={true}
          onChange={(opcion) => seleccionarProducto(opcion)}
          getOptionValue={(opciones) => opciones.id}
          getOptionLabel={(opciones) => `${opciones.nombre} - ${opciones.existencia} Unidades Disponibles`}
          placeholder="Seleccione  cliente"
          noOptionsMessage={() => "No hay resultados  "}
        />
      </>
    )
}

export default AsignarProductos;
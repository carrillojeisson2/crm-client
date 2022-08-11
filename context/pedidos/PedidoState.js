import React, {useReducer} from 'react'
import PedidoContext from './PedidoContext';
import PedidoReducer from './PedidoReducer'

import {
    SLECCIONAR_CLIENTE,
    SLECCIONAR_PRODUCTO,
    CANTIDAD_PRODUCTOS,
    ACTUALIZAR_TOTAL
} from '../../types'

const PedidoState = ({children}) => {

    // state de pedidos
    const initialState = {
        cliente: {},
        productos: [],
        total: 0
    }

    const [state, dispatch] = useReducer(PedidoReducer, initialState);

    // modifica el cliente
    const agregarCliente = cliente => {
        // console.log(cliente)

        dispatch({
            type: SLECCIONAR_CLIENTE,
            payload: cliente

        })
    }

    // modifica los productos
    const agregarProducto = productosSeleccionados => {
        // console.log(productos)

        let nuevoState;
        if(state.productos.length > 0){
            nuevoState = productosSeleccionados.map(producto => {
                const nuevoObjeto = state.productos.find(productoState => productoState.id === producto.id)
                return {...producto, nuevoObjeto}
            })
        }else{
            nuevoState= productosSeleccionados;
        }
        dispatch({
            type: SLECCIONAR_PRODUCTO,
            payload: nuevoState
        })
    }

    // modifica las cantidades de los productos
    const cantidadProductos = nuevoProducto => {
        dispatch({
            type: CANTIDAD_PRODUCTOS,
            payload: nuevoProducto

        })
    }

    const actualizarTotal = () => {
        dispatch({
            type: ACTUALIZAR_TOTAL
        })
    }

    return (
        <PedidoContext.Provider
            value={{
                productos: state.productos,
                agregarCliente,
                agregarProducto,
                cantidadProductos,
                actualizarTotal
            }}
        >
            {children}
        </PedidoContext.Provider>
    )
}

export default PedidoState;
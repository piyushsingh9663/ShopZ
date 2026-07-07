import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existingItem = state.cartItems.find((product) => product.productId === item.productId);
            if (existingItem) {
                if (item.qty !== undefined) {
                    existingItem.qty = item.qty;
                } else {
                    existingItem.qty = existingItem.qty + 1;
                }            } else {
                // Add new item with qty field
                state.cartItems = [...state.cartItems, { ...item, qty: item.qty || 1 }]
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeFromCart: (state, action) => {
            const productId = action.payload;
            state.cartItems = state.cartItems.filter((product) => product.productId !== productId);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        clearCart: (state) =>{
            state.cartItems = [];
            localStorage.removeItem('cartItems')
        }
    },
});

export const {addToCart, removeFromCart, clearCart} = cartSlice.actions;

export default cartSlice.reducer;